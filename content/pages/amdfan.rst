AmdFan
######
:author: mcgillij
:cover_image: amdfan.png


What is AmdFan?
***************

AMDFan is a fork of `amdgpu_fan <https://github.com/chestm007/amdgpu-fan>`_, with some security fixes, bug fixes and improvements that I made for myself, but I figure some other people may want to use it as well so here we are.

It's available as a PyPI package, Arch User Package and Debian package (still working on packaging this up).

It supports active monitoring of multiple AMD gpus, as well as applying a fan curve running as a systemd service.

Or you can use it to manually toggle fan speeds or revert to system controlled fan speeds.

Where to get it?
****************

- `github.com/mcgillij/amdfan <https://github.com/mcgillij/amdfan>`_
- on PyPi here **WIP**
- using **pip**, **pipenv** or **poetry** to install it. **WIP**
- from the AUR, or building your own Arch package (directions on github)
- Debian package **WIP**


Why make your own?
******************

- alternatives abandoned
- lacking required features
- security fixes not addressed
- basic functionality not working 

Amdgpu_fan abandoned
====================
As of a couple years ago, and isn't applying any security fixes to their project or improvements. There were also some bugs that bothered me with the project when I tried to get it up and running.

Features missing
================

There are a number of features that I wanted, but weren't available.

- Thresholds allow temperature range before changing fan speed
- Frequency setting to allow better control
- Monitoring to be able to see real-time fan speeds and temperature

Security Fixes
==============

There are some un-addressed pull requests for some recent YAML vulnerabilities that are still present in the old amdgpu_fan project, that I've addressed in this fork.

Basic functionality
===================

Setting the card to **system managed** using the amdgpu_fan pegs your GPU fan at 100%, instead of allowing the system to manage the fan settings. I fixed that bug as well in this release.

These are all addressed in Amdfan, and as long as I've still got some AMD cards I intend to at least maintain this for myself. And anyone's able to help out since this is open source. I would have liked to just contribute these fixes to the main project, but it's now inactive.

Documentation
*************

Usage:
======

Amdfan will generate a configuration file for you if it's not present on the very first run as a **daemon**.

The default configuration location is ``/etc/amdfan.yml``.

.. code-block:: bash

   Usage: amdfan.py [OPTIONS]

   Options:
     --daemon   Run as daemon applying the fan curve
     --monitor  Run as a monitor showing temp and fan speed
     --manual   Manually set the fan speed value of a card
     --help     Show this message and exit.

``--daemon`` with this option you can test your fan curve, but generally this is the option that will be called when running this as a **systemd service**

``--monitor`` will allow you to see the temperature and fan speed status of your **amdgpu** controlled cards

``--manual`` allows for setting your cards fan speeds manually without the need for the configuration file.

Configuration
*************

As mentioned above the configuration file will be created upon first run of the script as a deamon. And you can modify it's settings and they will be picked up the next time you run it.

.. code-block:: yaml

   # Fan Control Matrix.
   # [<Temp in C>,<Fanspeed in %>]
   speed_matrix:
   - [4, 4]
   - [30, 33]
   - [45, 50]
   - [60, 66]
   - [65, 69]
   - [70, 75]
   - [75, 89]
   - [80, 100]
   
   # Current Min supported value is 4 due to driver bug
   #
   # Optional configuration options
   #
   # Allows for some leeway +/- temp, as to not constantly change fan speed
   # threshold: 2
   #
   # Frequency will chance how often we probe for the temp
   # frequency: 5
   #
   # cards:
   # can be any card returned from `ls /sys/class/drm | grep "^card[[:digit:]]$"`
   # - card0

The ``speed_matrix`` is the only required parameter, and takes a fan curve. Specified as a yaml list.

Optional params
===============

``threshold`` allows for non-exact temperature matching, as to not spam your device with fan control requests.

``frequency`` allows you to control how often the card is probed for it's temperature readings.
