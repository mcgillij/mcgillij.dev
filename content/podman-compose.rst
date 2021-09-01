Switching to Podman as a Docker replacement (also docker-compose)
#################################################################

:author: mcgillij
:category: Linux
:date: 2021-08-31 22:49
:tags: Linux, Containers, Podman, Docker, docker-compose, #100DaysToOffload
:slug: podman-compose
:summary: How to switch over to Podman for all your Docker and `docker-compose` needs.
:cover_image: podman.png

.. contents::

Why switch?
***********

The current Docker eco-system is a flaming dumpsterfire. With all the current downtime, changes to `Dockerhub <https://hub.docker.com>`_ (clamping down on people doing CI / CD using images from their repositories) and limiting the amount of auth'd and un'authed pulls you can do definitely broke a bunch of companies builds for several days last year.

.. figure:: {static}/images/dumpsterfire.gif
   :align: right
   :alt: Current DockerHub status

   Current DockerHub status

Now with today's `NEWS <https://www.docker.com/blog/updating-product-subscriptions/>`_ that they are going to a subscription model for their "previously" free tool is likely the final straw for many folks.

I've been toying with `Podman <https://podman.io>`_ for a bit, and more recently I've migrated several of my self-hosted things to `podman-compose <https://github.com/containers/podman-compose>`_ which is a drop-in replacement for `docker-compose`.


Whats Podman?
*************

Well I'm sure if you're really interested you can read more about it on their site. However it's essentially an unprivileged docker replacement (that can run in user namespaces) aka rootless.

It can be used a drop in replacement for most `Dockerfiles` to build them. All the commands are similar to their `docker` counterparts. Even their documentation page recommends just to create an alias below.

.. code-block:: bash

   alias docker=podman

However I didn't go that far, just removed `docker` from my system and now I'm just using `podman` commands.

Whats `podman-compose`
**********************

If you've ever used **docker-compose** well it's the exact same thing as that, except it can use **podman** behind the scenes. Even capable of parsing **docker-compose.yml** files directly. Allowing you to stand up entire stacks of containers with just a single command.


Installation and configuration
******************************

So setting up podman requires a bit of configuration to get working as a **docker** replacement. However as long as your comfortable editing a couple configuration files, it's super easy.

First install **podman** with your distributions package manager. I was installing it on my server which is running `Debian <https://debian.org>`_ so I ran the following:

.. code-block:: bash

   apt-get update && apt-get install podman

This is all that's required to get **podman** installed. Onto the configuration.

Configuration
^^^^^^^^^^^^^

Now to get the same functionality (ie: pulling containers from dockerhub), you will need to edit a couple configurations.

In **/etc/containers/registries.conf** add the following line:

.. code-block:: bash 

   unqualified-search-registries=["docker.io"]

And also in **/etc/containers/registries.conf.d/shortnames.conf** you can add some of your favorite container shortnames.

I've added the containers below to the shortnames.conf, but you can add whichever you figure you'll be using.

.. code-block:: bash

   "postgres" = "docker.io/library/postgres"
   "pihole" = "docker.io/pihole/pihole"

That's it, now you should be able to use **podman run** with most of the containers on dockerhub. Now you are setup for running single containers, we'll cover running stacks below with **podman-compose**.

Installing podman-compose
*************************

Since **podman-compose** like `docker-compose` is written in `Python <https://python.org>`_ you'll need to install it with either pip, pipenv or poetry (whichever python package manager your using).

Example with pip:

.. code-block:: bash

   pip install podman-compose

Example with poetry:

.. code-block:: bash

   poetry add podman-compose

Etc...

Once you have it available you can try running the `podman-compose` command to make sure it's working as intended, you should see some similar output to the below:

.. code-block:: bash

   usage: podman-compose [-h] [-f FILE] [-p PROJECT_NAME] [--podman-path PODMAN_PATH] [--no-ansi] [--no-cleanup] [--dry-run]
                         [-t {1pod,1podfw,hostnet,cntnet,publishall,identity}]
                         {pull,push,build,up,down,run,start,stop,restart} ...

   optional arguments:
     -h, --help            show this help message and exit
     -f FILE, --file FILE  Specify an alternate compose file (default: docker-compose.yml)
     -p PROJECT_NAME, --project-name PROJECT_NAME
                           Specify an alternate project name (default: directory name)
     --podman-path PODMAN_PATH
                           Specify an alternate path to podman (default: use location in $PATH variable)
     --no-ansi             Do not print ANSI control characters
     --no-cleanup          Do not stop and remove existing pod & containers
     --dry-run             No action; perform a simulation of commands
     -t {1pod,1podfw,hostnet,cntnet,publishall,identity}, --transform_policy {1pod,1podfw,hostnet,cntnet,publishall,identity}
                           how to translate docker compose to podman [1pod|hostnet|accurate]

   command:
     {pull,push,build,up,down,run,start,stop,restart}
       pull                pull stack images
       push                push stack images
       build               build stack images
       up                  Create and start the entire stack or some of its services
       down                tear down entire stack
       run                 create a container similar to a service to run a one-off command
       start               start specific services
       stop                stop specific services
       restart             restart specific services

The output looks very similar to the other command.

Running your service
********************

Now you may have a couple `docker-compose.yml` files for some of your applications running on your server kicking around (I know I do), and you want to migrate them over to using `podman-compose`.

We'll take a peek ag my `Plex <https://plex.tv>`_ file, and see about getting it up and running with podman.

.. code-block:: bash

   version: '3'
   services:
     plex:
       image: plexinc/pms-docker
       restart: unless-stopped
       environment:
         - TZ=AST
       network_mode: host
       volumes:
         - /home/j/plex/config:/config
         - /tmp:/transcode
         - /home/j/plex/library:/data

Nothing looking out of the ordinary, this YML file works in both docker-compose and podman-compose. You can even use the same parameters for the most part.

Running the following will bring up my Plex server.

.. code-block:: bash

   podman-compose up -d

You will get some output, keep an eye out to make sure everything working properly.

Checking on your containers
***************************

Now you should be able to check on your running containers with the **podman ps** command.

.. code-block:: bash

   $ podman ps
   CONTAINER ID  IMAGE                                COMMAND  CREATED         STATUS             PORTS   NAMES
   6933f433a0a3  ghcr.io/linuxserver/airsonic:latest           43 minutes ago  Up 43 minutes ago          airsonic_airsonic_1
   655586a457c3  docker.io/plexinc/pms-docker:latest           40 minutes ago  Up 40 minutes ago          plex_plex_1
   b7ca4551181c  ghcr.io/linuxserver/medusa:latest             38 minutes ago  Up 38 minutes ago          pymedusa_medusa_1

You can also use the **logs** parameter similar to with the docker command to inspect things further.

.. code-block::  bash

   podman logs 655586a457c3
   ...
   Plex Media Server first run setup complete
   [cont-init.d] 40-plex-first-run: exited 0.
   [cont-init.d] 45-plex-hw-transcode-and-connected-tuner: executing...
   [cont-init.d] 45-plex-hw-transcode-and-connected-tuner: exited 0.
   [cont-init.d] 50-plex-update: executing...
   [cont-init.d] 50-plex-update: exited 0.
   [cont-init.d] done.
   [services.d] starting services
   [services.d] done.
   Starting Plex Media Server.

Notes:
******

If you are used to running the following:

.. code-block:: bash

   docker-compose ps
   # OR
   docker-compose exec
   # OR
   docker-compose logs

You will need to use the regular `podman` command to inspect / run things or see the logs as it's not covered by **podman-compose**. Which is a really small price to pay. All the functionality is still accessible, but you just have to type less, so it's win win.

Also being **rootless** means, that you can't bind to ports under 1024 normally as your regular user. However if you **really** want to. You can issue the following command: 

.. code-block:: bash

   sudo sysctl -w net.ipv4.ip_unprivileged_port_start=<NUMBER>

Replace **NUMBER** with whatever the lowest port number you want unprivileged users to be able to use.

Conclusion
**********

With how terrible the docker eco-system is getting, it's nice to have a drop-in replacement, that's actually better and more secure. Even being compatible with the **.yml** files with compose is a nice cherry on top.
