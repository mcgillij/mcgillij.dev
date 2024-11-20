Godot Patterns: EventBus
########################

:author: mcgillij
:category: Games
:date: 2024-11-06 18:49
:tags: Linux, Python, GDScript, Godot, Patterns, EventBus
:slug: godot-patterns-event-bus
:summary: EventBus pattern in Godot
:cover_image: godot.png

.. contents::

Patterns
========

In this post I'll go over some of the patterns that emerged while I was developing Atiya's Quest, that are probably already established, but never really clearly indicated in Godot documentation.


Signals
-------

Signals are a powerful way to trigger functions in other Scenes / Scripts, and tie nicely to the Editor.

You should try to wire up the signals to always pass/bubble their signals "Up" to their parent scenes, the relation between objects emitting the signals.

In general the Scenes will have a script attached to one of the top level elements, so they can refer to the child nodes.

Bubbling up the signals:
------------------------

Passing a signal up from a button to the top most parent, which then can pass it to another scene, if your using nested scenes as part of a larger scene.

First we define the signal we want to emit:

.. code-block:: GDScript

    signal back_button

Then we can select our button (in this case the "back" button).

.. image:: {static}/images/godot/Pasted\ image\ 20241106131214.png
   :width: 100%
   :alt: setting back_button signal in editor


Double clicking the signal you want to hook into from your Button or UI object, will allow you to specify the function to call when a particular event is triggered.

.. image:: {static}/images/godot/Pasted\ image\ 20241106131348.png
   :width: 100%
   :alt: source code view of a signal

The green arrow indicates that it's hooked up via the editors "Node" menu. We fill out the rest of the function with the added functionality we need, and finally **emit** the signal that we created, which will be used by another scene entirely.

Similarly this will allow us to use the "Node" menu to wire up the signal that's emitted by the `emit_signal("back_button")`.

This allows us to create a Main scene with many instantiated sub-scenes and allows navigation between them using the signals.

.. image:: {static}/images/godot/Pasted\ image\ 20241106132706.png
   :width: 100%
   :alt: CharacterView scene tree

This allows managing all the signals from multiple sub-scenes from one script:

.. code-block:: GDScript

    extends Node2D

    func _ready() -> void:
        $character_menu.slide_in()

    func _on_character_menu_bio_pressed() -> void:
        $character_menu.slide_out()
        $bio_panel.slide_in()

    func _on_character_menu_stats_pressed() -> void:
        $stats_panel._ready()
        $character_menu.slide_out()
        $stats_panel.slide_in()

    func _on_character_menu_back_pressed() -> void:
        get_tree().change_scene_to_file("res://Scenes/game_menu2.tscn")

    func _on_bio_panel_back_button() -> void:
        $bio_panel.slide_out()
        $character_menu.slide_in()
    ...

I'd suggest using this pattern for everything that you can since it's tied into the editor, and allows for simple debugging when issues arise.

However this starts to fall apart when we start dynamically creating Nodes and Controls, as we can't hook them up via the UI since they aren't instantiated yet.

EventBus
********

Enter the EventBus, this is a global solution to a dynamic problem. In general we should try to use as little globals as possible as it's not a great practice and increases the surface area for bugs. But with **signals** it would be impossible to create more complex games / applications without it due to the nature of how scenes are processed in Godot.

So what happens when we want to create many different buttons in a dynamic fashion, but we want them to all trigger different functionality, without having to manually create X amount of distinct buttons.

This will touch a bit on the Prefab/Resource pattern that I'll cover later. But it fits nicely with the EventBus.

.. image:: {static}/images/godot/Pasted\ image\ 20241106165946.png
   :width: 100%
   :alt: EnvironmentPrefab view in the editor

In this case the goal is to create many click-able environmental effects, since we **can't pre-define** all the `_on_pressed()` for the button, this does not scale, having to wire all of these up through the editor is generally not possible since they would all need to be predefined and exist in a scene.  If we want to add more environmental effects we'd have to alter the scenes and the scripts, making this a huge pain of toggling visibility etc.

However as you will see this is how you would go about using a **Prefab** along with an EventBus.

Here's a snipet of the **EventBus.gd**:

.. code-block:: GDScript

    extends Node

    # global event bus that I'm going to use to pass programmatic events
    # the kind that generally can't be wired up ahead of time, like user selected abilities

    # environment
    signal environment_clicked(data: EnvironmentalEffect)
    signal monster_clicked
    signal player_clicked
    signal monster_ability_clicked(ability: Ability)

Once your **EventBus.gd** is created, you'll need to add it to the **global** scope.

You can do this from the **Project/Project Settings** / Globals:

.. image:: {static}/images/godot/Pasted\ image\ 20241106174502.png
   :width: 100%
   :alt: Globals in the Project Settings

So we have 2 pieces of the puzzle done now we have the **signal** defined, and we are emitting it from our Prefab. Now we just need to **connect** it to our *callable* from our Scene that will use the prefabs.

Below is the script attached to my Scene that will use the Prefab with the **environment_clicked** signal.

.. code-block:: GDScript

    extends Node2D

    var tooltip_out: bool = false

    @onready var environment_tooltip: Panel = %environment_tooltip
    @onready var environment_name: Label = %environment_name
    @onready var environment_description: Label = %environment_description
    @onready var environment_image: TextureRect = %environment_image

    @export var prefab:PackedScene

    func setup_environments() -> void:
        for e in GameDataManager.current_info.environmental_effects:
            var env = prefab.instantiate()
            env.setup(e)
            %environment_holder.add_child(env)

    func _ready() -> void:
        setup_environments()
        EventBus.environment_clicked.connect(show_tooltip)

    func show_tooltip(d: EnvironmentalEffect) -> void:
        if !tooltip_out:
            tooltip_out = true
            environment_name.text = d.name
            environment_description.text = d.description + "\n" + str(d.effects)
            environment_image.texture = d.texture
            %environment_tooltip.position = Vector2(100, 20)
        else:
            tooltip_out = false
            %environment_tooltip.position = Vector2(-525, -43)

The important portions here are the `@export var prefab:PackedScene` which will then let you select the **EnvironmentalEffectPrefab** in the editor, that will be used in the script.

.. image:: {static}/images/godot/Pasted\ image\ 20241106165946.png
   :width: 100%
   :alt: EnvironmentPrefab view in the editor

With the prefab variable loaded, we can then **instantiate()** it call it's `setup()` method passing in our `Resource` and then the button / signals will be automatically wired up due to what happens in our `_ready()` function.

.. image:: {static}/images/godot/Pasted\ image\ 20241106175909.png
   :width: 100%
   :alt: EnvironmentPrefab view in the editor

----

Once you **connect** the signal to a `callable` in this case:

.. image:: {static}/images/godot/Pasted\ image\ 20241106175714.png
   :width: 100%
   :alt: EnvironmentPrefab view in the editor

----

This function will be called whenever that button is pressed, with the **data** of the button that's pressed as it's parameter. This allows displaying different *textures*, text, or functionality. Outside of the prefab itself, allowing you more flexibility and the ability to dynamically create components.

This closes the loop on the EventBus functionality. I've use this sparingly where using the regular signal wiring was falling short.

Some other examples that I've used the EventBus pattern, would be for creating a **combat log**, to allow multiple places to emit the same signals to trigger writing log messages.

.. image:: {static}/images/godot/Pasted\ image\ 20241106180750.png
   :width: 100%
   :alt: CombatLog view in the editor

Buffs / Cooldowns and Status effects were also a good candidate for this.

.. image:: {static}/images/godot/Pasted\ image\ 20241106181117.png
   :width: 100%
   :alt: Buffs view in the editor

I've found that a pretty good guideline for when to use the EventBus or not, is when you aren't creating a static interface you will probably have to rely on the EventBus for most of the dynamic game programming. However when creating the Scenes and UI's for your game, wiring up all the signals within the interface does provide really quick debugging.

Next time I'll go over the Prefab pattern that I'm using for creating Resources that feed my Prefabs in Scenes for dynamic content.
