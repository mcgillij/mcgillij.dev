Getting started with Godot in Arch
##################################

:author: mcgillij
:category: Games
:date: 2024-11-03 12:49
:tags: Linux, Arch, Godot, Android
:slug: getting-started-with-godot-in-arch
:summary: Overview of the steps required to get up and running for Godot development in Arch Linux.
:cover_image: godot.png

.. contents::

DevLog Nov 3 / 2024
===================

Here's an introductory entry into a series I'm starting highlighting development work with `Godot <https://godotengine.org/>`_ with an `Arch <http://archlinux.org>`_ Linux tool-chain.

Over the years I've written many different games, engines and prototypes always in Linux, with a focus on mostly Python / OpenGL.

With lack of first class open source game engine's availability native on my dev platform of choice, was always a pain-point (however much I do enjoy writing out engine's functionality). It wasn't ever the place that I "wanted" to spend my time and effort.

This all changed with the release of Godot, there's now a full fledged engine capable of shipping multi-platform all the while being a first class citizen in the Linux / Open Source dev space (actually a great time to be alive).

Getting up and running.

Most of these directions will work on most distro's however these days I've been supporting folks at work using Manjaro / Arch since that's where bleeding edge development happens, so the directions will be generic enough that you can port them to whatever distribution you are using, just swap out the package manager commands to the ones you are using, and the packages should be readily available in your distro's repositories.

Installing godot itself:
************************

.. code-block:: bash

    yay -S godot

Installing android-sdk and jdk:
*******************************

This will get you the engine, however if you want to target Android devices you'll also need several other packages.

.. code-block:: bash

    yay -S android-sdk android-sdk-build-tools android-sdk-cmdline-tools-latest android-sdk-platform-tools

And you will also need the JDK

.. code-block:: bash

    yay -S jdk17-openjdk

With these dependencies installed you'll be able to target Linux as well as Android with your builds. However due to a large majority of the population you may also want to target Windows. For this I've found that godot can build for windows as long as you have Wine installed.

Installing wine:
****************

.. code-block:: bash

    yay -S wine

Building for IOS is also a possibility however it is out of scope for this since I'm unwilling to pay the apple tax to release free games.

Into the editor for some configuration.
***************************************

Once you load up Godot, move over to the Editor settings:

.. image:: {static}/images/godot/Pasted\ image\ 20241103132045.png
   :alt: Editor settings
   :align: center


From here you'll want to navigate to the **Export / Android** section and fill out a couple of details based on where the installation of the **JDK and Android SDK tools** have been installed.

.. image:: {static}/images/godot/Pasted\ image\ 20241103132245.png
   :alt: Android settings
   :align: center

Lastly you'll need to install the Android build templates:

.. image:: {static}/images/godot/Pasted\ image\ 20241103132438.png
   :alt: Android build templates
   :align: center

This will now allow you to setup Android builds in the Export panel:

.. image:: {static}/images/godot/Pasted\ image\ 20241103132550.png
   :alt: Android build settings
   :align: center

Once you have all these things setup you can follow along the `godot documentation <https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html>`_ to get your first Android build up and running.

This will allow you to target Android and build **apk/aab's** that you can install and test on your Android devices. If you want to publish to the Google Play store, that's not really a Godot specific topic, since you just need a release key. The process can be quite lengthy if it's your first time publishing on the Play store, so don't expect quick turnaround there as the automation at the machine that is Google is fraught with many pitfalls and time sinks. Maybe more on this some other time.

I'm not highlighting anything extra for setting up exporting to Windows or Linux as those things **just work™** out of the box, as long as you have wine etc installed. However there was some extra configuration required to get Android builds going, so I'm just documenting this here as a reminder to myself and anyone else this would help out.

What's next?
************

I'll be going over some of the basics of GDScript, the scripting language that Godot uses and it's parallels to Python.
