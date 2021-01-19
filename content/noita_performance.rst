Noita - Linux performance
#########################

:author: mcgillij
:category: Linux
:date: 2021-01-19 18:49
:tags: Linux, Games, Noita, CPU, proton, #100DaysToOffload
:slug: noita-linux-performance-tweaks
:summary: Some settings and programs you can use to improve responsiveness of Noita, and other CPU intensive games.
:cover_image: noita.png

.. contents::

Preface
*******

Noita devs **please release a native Linux** branch, thanks (*from all the devs who play your game*)! 

OK now with that out of the way, while not **officially** supported in Linux, you do have a couple options to play Noita in Linux.

- Proton
- VFIO

Proton
******

Valve has done some tremendous work in the recent years to bring us at least playability of a great majority of Windows games in Linux by their excellent work on `Proton <https://github.com/ValveSoftware/Proton>`_. However this doesn't help us to get native support for games which in the long run is ideal. This results in still running an emulation layer (or syscall interceptor however you feel like looking at it) of Wine (this is branded *Steam Play* in the Steam settings).

This has to be toggled on, in your Steam settings to allow the use of Proton for the non-supported games. Noita falls in this category of *"working but not supported"*, however there is a bit of a performance hit for running it this way. I'll try to address some of these later below.

Steam Settings
**************

.. image:: {static}/images/steamplay.png
   :width: 100%
   :alt: How to enable steamplay for all titles

Once you have *Steam Play* enabled for all your games, you will likely need to restart Steam, and then you can set the **Proton** version for each game independently by right clicking them in your **Library -> properties -> Compatibility**. Noita as of *Jan 19 2021* for me only works with the following Proton version (5.0-10).

.. image:: {static}/images/noita_linux.png
   :alt: Proton version for running Noita

After selecting this Proton version for Noita, Steam will start downloading it. And that's all you need to get Noita "working". Now the performance may or may not be OK for you. If it works to your liking great! You're done!

Tweaking Performance
********************

There are a couple things that we can do to improve the responsiveness which is very important for a perma-death rogue-like in my opinion.

- gamemode
- cpu scheduler

Gamemode
^^^^^^^^

You can find **gamemode** on `github <https://github.com/FeralInteractive/gamemode>`_, or chances are it's also in your distributions package manager. It's a helpful package that tweak some system settings temporarily while your game runs to improve your performance and responsiveness for your game. It will tweak the cpu governor, io, process niceness and turn off your screensaver etc for the duration of your gaming session, a truly handy utility.

Debian: 

.. code-block:: bash

   apt install gamemode

Arch:

.. code-block:: bash

   pacman -S gamemode

Once installed, all you need is to prefix your game commands with ``gamemode ./path_to_game`` however since were using Steam as our launcher it isn't that simple, however it's pretty easy to add this. Right click your game from the **Library -> Properties -> General** and add the following to the *Launch Options* ``gamemoderun %command%``

.. figure:: {static}/images/gamemode.png
   :alt: adding gamemode to the launch options
   :width: 100%

   Add *gamemoderun %command%* to your launch options

This will now call *gamemode* while launching your game from the Steam Library or from a shortcut.When your game exits gamemode will reset your settings back to the defaults you had set prior to starting up the game.

CPU settings
^^^^^^^^^^^^

As all things in Linux there's many ways to address problems, if you don't want to run gamemode for whatever reason, or just want to control your CPU settings manually, you can do that as well. Below are a couple one-liners that you could use to manage your CPU settings, add them to *scripts* or *alias's* in your shells environment.

Excerpt from *~/.bashrc*

.. code-block:: bash

   ...
   alias cpu_performance='echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor'
   alias cpu_powersave='echo powersave | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor'
   alias cpu_schedutil='echo schedutil | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor'
   alias cpu_freq='watch -n 1 "cat /proc/cpuinfo | grep \"^[c]pu MHz\""'
   ...

With these *alias's* in place, you can issue the ``cpu_performance`` command, and it will prompt you to set your CPU's cores into **performance** mode. Once you're done gaming you can issue the ``cpu_powersave`` or ``cpu_schedutil`` to return to your regular CPU settings.

Also provided is the ``cpu_freq`` to allow you to watch the clocks of your cores to see the differences in the various CPU settings.

Excerpt from ``cpu_freq``

Using ``schedutil`` settings:

.. code-block:: bash

   ...
   cpu MHz         : 3096.383
   cpu MHz         : 2777.892
   cpu MHz         : 2668.597
   cpu MHz         : 2665.021
   ...

Using ``performance``:

.. code-block:: bash

   ...
   cpu MHz         : 3716.279
   cpu MHz         : 3756.786
   cpu MHz         : 3734.277
   cpu MHz         : 3688.920
   ...

So you can watch in real-time the performance per-core of your CPU and the effects the various settings have on them.

However I've found that running my CPU in performance mode does make the experience with Noita better while running it with Proton, but as always YMMV.

VFIO
****

Now onto the second part, you could however just emulate "all" of windows and just run Noita "natively" in there. Using VFIO you can run a virtual machine passing in your actual PCIe hardware devices to the Guest. This results in close to *bare-metal* performance for most things. It does however require potentially some extra hardware and configuration depending on your setup. So this solution isn't for everyone. However I have a pretty detailed walk-through on the subject if you are interested in that.

My VFIO setup instructions can be found at:

1. `Intro to VFIO </vfio-part1.html>`_
2. `Isolation (of hardware) </vfio-part2.html>`_
3. `The Machine! (virtual) </vfio-part3.html>`_
4. `Odds and Ends </vfio-part4.html>`_

Conclusion
**********

It is to note that all the settings here aren't strictly for Noita, but can be applied to any game that your trying to get better responsiveness from your hardware while running Linux.

Let me know if you have any other performance settings that you like to use not only for Noita but any other games.
