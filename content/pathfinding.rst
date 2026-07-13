Pathfinding Ten Million Stars
#############################

:author: mcgillij
:category: Games
:date: 2026-07-13 12:00
:tags: Godot, GDScript, GameDev, Pathfinding, Performance
:slug: pathfinding-ten-million-stars
:summary: How my galaxy map went from scanning every star, through beam search and a 29 GiB route cache, to routing across ten million systems with a compact spatial catalog.
:cover_image: pathfinding/galaxy1.png

.. contents::

My space game has a fairly ordinary navigation problem hiding inside a very large map: given a
ship's jump range, find a chain of stars that gets it to its destination.

The first version was tiny and obvious. It used A* and asked every star in the galaxy if it was
close enough for the next jump. That worked. Then the galaxy grew, and I started caching the
answers. That also worked, until the cache for about 1.13 million systems grew to **29 GiB**.

The funny part was that choosing a route was no longer the slow part. Loading, decoding and
assembling the giant road map was taking far longer than searching it.

The latest version takes the opposite approach. It stores compact information about the stars,
calculates nearby connections only when a route needs them, and uses a small high-level map to point
long searches in the right direction. That same design is now routing across **10,794,958 systems**
with a 336.8 MiB catalog on disk.

This is how it got there, including a few approaches that worked well for a while and then stopped
scaling.

The first version: ask every star
=================================

The original pathfinder landed with the first 3D galaxy map in February. It used A*, a common route
finding algorithm. In simple terms, A* keeps a list of possible next stops and prefers the one with
the best combination of distance already travelled and estimated distance still to go.

That part was fine. The expensive bit was finding the next stops:

.. code-block:: GDScript

    func _get_reachable_neighbors(coords: Vector3i, jump_range: float) -> Array[Vector3i]:
        var neighbors: Array[Vector3i] = []
        var all_systems := GalaxyNavigator.get_all_systems()

        for system in all_systems:
            if system.coordinates == coords:
                continue
            var distance := GalaxyNavigator.calculate_distance(coords, system.coordinates)
            if distance <= jump_range:
                neighbors.append(system.coordinates)

        return neighbors

Every time A* visited a star, this loop asked every system in the galaxy, “Are you close enough to
jump to?”

This is not a bad first implementation. It is short, readable and easy to verify. With a small
number of discovered systems it does exactly what is needed. It is also a useful correctness model:
if a more complicated index gives a different answer, the simple exhaustive scan is a good way to
check which one is wrong.

The trouble is that the work multiplies. More stars means more possible stops, and every new stop
may trigger another full scan. It is a bit like asking everyone in a city for directions again at
every intersection.

Remembering answers and meeting in the middle
=============================================

The next versions attacked both sides of that cost.

First, I built a spatial hash. Imagine dividing space into boxes and filing each star in its box.
To find a nearby star, the game only has to inspect the current box and its neighbours instead of
the entire galaxy. Those results could then be stored in a neighbour cache so later searches did
not repeat the same geometry.

The pathfinder also gained bidirectional A*. One search started at the ship, another started at the
destination, and the route was complete when the two searches met:

.. code-block:: GDScript

    while not open_heap_f.is_empty() and not open_heap_b.is_empty():
        var expand_forward: bool = open_heap_f.size() <= open_heap_b.size()
        var active_heap = open_heap_f if expand_forward else open_heap_b
        var other_closed = closed_b if expand_forward else closed_f

        var current := _heap_pop(active_heap)
        if other_closed.has(current.coords):
            return _reconstruct_bidirectional_path(...)

Meeting in the middle can greatly reduce how deep either search has to travel. Combined with cached
neighbours, it was a large improvement over repeatedly scanning every star.

It also changed where the difficulty lived. The game now had to build the cache, load it without
freezing the map, invalidate it when jump range changed, and cope with destinations outside the
currently loaded area. A full cache was expensive, so I added partial caches and later disk shards.
Search got faster, but “is the route impossible?” and “have I not loaded the right data yet?” became
surprisingly difficult questions to tell apart.

Beam search: keep only promising routes
=======================================

In March I tried beam search for long journeys. A normal graph search can keep a large number of
possible routes alive. Beam search deliberately throws most of them away. At each layer it scores
the candidates, keeps the best fixed number, and continues from those:

.. code-block:: GDScript

    for layer in range(max_frontier_layers):
        var next_frontier: Array[int] = []

        for pool_index in frontier:
            for neighbor in neighbors.get(current.coords, []):
                var score: float = g_cost + heuristic + penalty
                node_pool.append(BeamNode.new(neighbor, pool_index, g_cost, score, ...))
                next_frontier.append(node_pool.size() - 1)

        next_frontier = _prune_frontier(node_pool, next_frontier, beam_width)
        frontier = next_frontier

The name is a good description. Instead of lighting the entire room, it shines a narrow beam in the
direction that currently looks useful. I added penalties for backtracking, making little progress,
or wandering outside a coarse corridor between galaxy quadrants.

This is a sensible trade when responsiveness matters more than finding the mathematically shortest
route. It bounds how much work the search can do and can return a good-enough path quickly.

The weakness is also built into the idea: the search may throw away a necessary detour because it
does not look promising yet. When the partial cache was missing systems, or the coarse corridor was
not good enough, the beam could exhaust itself and report failure even though a route existed.

Beam search was eventually removed in May. I do not consider it wasted work. It established that I
wanted bounded, asynchronous searches, visible planning states, and coarse guidance for long
routes. Those ideas all survived. What did not survive was relying on a narrow frontier over a
partially loaded graph.

The 29 GiB road atlas
=====================

The cache system kept growing after the beam-search experiment. By July, the route bake stored
precomputed outgoing connections in thousands of shard files. An audit of the surviving release
artifact found:

* 1,129,227 systems
* 13,823 route shards for the 128 LY tier
* about 1.59 billion directed connections
* about 1,409 stored outgoing connections per system
* 30,599,823,967 bytes, or 29 GiB as reported by ``du``

That was only the installed route data. Copying it into the player's cache could duplicate it, and
the game still had to audit, load, decode and turn parts of it into a searchable graph.

.. image:: {static}/images/pathfinding/latency-profiles.svg
   :width: 100%
   :alt: Logarithmic chart of recorded route latency profiles, separating search from loading and graph construction

In a sampled 100 LY benchmark, the weighted graph search itself took roughly 22–621 ms. End to end,
the same system took about 3.5–15.6 seconds because route graphs containing 3.87–15.96 million raw
edges first had to be loaded and materialized. Only two of the three sampled routes succeeded.

That measurement changed the question. I no longer needed a faster way to search billions of saved
roads. I needed to stop saving billions of roads.

.. note::

   These historical measurements came from different benchmark harnesses and route samples. They
   describe where each design spent time; they are not a controlled algorithm race.

Store addresses, calculate roads
================================

The replacement, which I call the spatial catalog v2 architecture, stores the information needed to
answer a neighbour question instead of storing every answer in advance.

.. image:: {static}/images/pathfinding/store-addresses-not-roads.svg
   :width: 100%
   :alt: Diagram comparing a giant stored edge graph with the compact spatial catalog and on-demand neighbour model

It has three main parts:

#. A packed catalog stores each star's coordinates, exact position and small amount of metadata. A
   world-bucket index says which small part of space to inspect.
#. A request-local neighbour oracle checks those nearby candidates against the ship's exact jump
   range. It ranks and caps the useful results, caching only the small answers needed by this route.
#. A tiny quadrant and portal graph gives long journeys broad directions. It says something like
   “cross from this district into that one near these border stars,” without storing every street.

The solver begins with tight guidance and a small work budget. If that does not find a path, later
stages widen the corridor and inspect more candidates. Unlike the old beam, it can relax bad coarse
guidance instead of being permanently trapped by it.

The hot path now asks for neighbours only when it expands a system:

.. code-block:: GDScript

    var neighbors: Dictionary = oracle.call(
        "get_ranked_neighbors",
        current_id,
        to_id,
        search_stage,
        allowed_zones,
        portal_system_ids,
        neighbor_cap
    )

    var neighbor_ids: PackedInt32Array = neighbors.get("system_ids", PackedInt32Array())
    var distances: PackedFloat32Array = neighbors.get("distances_ly", PackedFloat32Array())

This also removes the hard baked jump-range tiers. The catalog describes where stars are; a ship's
current range decides which connections exist when the route is planned.

On the original 1.13-million-system galaxy, the catalog was 35.75 MiB. The portal files added only
about 322 KiB. The production test corpus found 18 of 18 routes across jump ranges from 20 to 200
LY, with no old route-shard reads and no invalid hops. Warm p95 route time was about 173 ms, while a
catalog load plus route was about 764 ms.

Ten times the stars
===================

Once route data no longer grew with every stored connection, I could test the architecture at a
much larger scale. The new deterministic spiral galaxy contains 10,794,958 systems—about 9.6 times
the previous system count and 10.5 times the candidate cell volume.

.. image:: {static}/images/pathfinding/storage-comparison.svg
   :width: 100%
   :alt: Logarithmic chart comparing the old 29 GiB edge cache with spatial catalogs for 1.13 and 10.79 million systems

The production catalog is 336.8 MiB on disk. Its calculated packed route-core
residency is 398.6 MiB. That is not tiny, but it is comfortably below the 512 MiB contract I set for
this experiment—and it represents almost ten times as many stars as the 29 GiB edge cache did.

The correctness checks compared indexed neighbour queries with exhaustive scans at different jump
ranges and galaxy densities. All 36 cases matched with no false positives or negatives. The route
witness corpus again passed 18 of 18 journeys, all using portal guidance and none reading the old
route shards.

Warm route p95 landed between roughly 606 and 697 ms across the documented validation runs. Cold
catalog load plus route p95 ranged from about 9.1 to 11.45 seconds, inside the existing 12-second
contract. The cold result is much slower than the smaller catalog, as expected: there are now ten
times as many star records to load. The important difference is that storage grows roughly with the
number of stars, not with the enormous number of possible connections between them.

.. image:: {static}/images/pathfinding/galaxy-map-10m.png
   :width: 100%
   :alt: Debug benchmark capture of the 3D galaxy map backed by the ten-million-system catalog

.. image:: {static}/images/pathfinding/galaxy1.png
   :width: 100%
   :alt: Debug benchmark capture of the 3D galaxy map backed by the ten-million-system catalog

.. image:: {static}/images/pathfinding/galaxy2.png
   :width: 100%
   :alt: Debug benchmark capture of the 3D galaxy map backed by the ten-million-system catalog

On to the next bottleneck
=========================

This is a routing success, not a claim that every part of a ten-million-star map is now cheap.

The pathfinder is no longer asking every star about every jump, and
the game is no longer shipping a 29 GiB atlas of roads. Now the whole-map loading and rendering path
is visible as the larger cost.

That has probably been the most useful lesson from this work: performance problems move. Start with
the simplest thing that works, measure where it stops working, and be willing to change the shape of
the data instead of endlessly polishing the algorithm that consumes it. Then measure again.


