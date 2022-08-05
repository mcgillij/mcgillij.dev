get_latest_proton_ge
####################

:author: mcgillij
:category: Games
:date: 2022-08-05 00:00
:tags: Linux, Games, Steam, Proton, SteamDeck, Python
:slug: get-latest-proton-ge
:summary: Quick script to nab the latest Proton GE version, can be run from your SteamDeck.
:cover_image: steamdeck.png

.. contents::

get_latest_proton_ge
====================

Just a quick script that I wrote to fetch the latest versions of Proton GE.

Can be found here on my github: `get_latest_proton_ge <https://github.com/mcgillij/get_latest_proton_ge>`_.

I also have this bash script to call this script loaded in my **PATH**.

.. code-block:: bash

   cd /home/j/gits/get_latest_proton_ge/
   poetry run python src/get_latest_proton_ge/get_latest_proton_ge.py

To use this just clone the repo, and then run a ``poetry install`` from inside the repository directory to populate the Python virtualenv.

Running **get_proton** anytime will fetch the latest version and install it.
This is handier than typing all that out on the SteamDeck.

I also use it on my desktop.
