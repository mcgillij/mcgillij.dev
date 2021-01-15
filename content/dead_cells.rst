Dead Cells controller issues
############################

:author: mcgillij
:category: Games
:date: 2021-01-14 23:30
:tags: Linux, Games, Roguelike, #100DaysToOffload
:slug: dead-cells-controller-issues
:summary: How I managed to resolve (kinda), my controller issues with Dead Cells in Linux
:cover_image: dead_cells.jpg

.. contents::

Dead Cells
**********

`Dead Cells <https://store.steampowered.com/app/588650/Dead_Cells/>`_ is a rogue-like on `Steam <https://steampowered.com>`_ that I played quite a bit of a while ago and there's a new DLC coming out next week I think, so I figured I'd try to get back into it and gauge if I want to snag it when it comes out.

First sign of trouble
*********************

Fires up fine in Linux, except I notice some red text at the bottom that says. We recommend playing with a controller. Which is what I intended to do anyways, and I had one in my hands.

Ok so the game isn't seeing my controller, shouldn't be too hard to solve.

.. code-block:: bash

   lsusb
   Bus 003 Device 015: ID 054c:05c4 Sony Corp. DualShock 4 [CUH-ZCT1x]

So I can see my controller, the lights on, I check the steam settings to see if it's detecting my controller, it is...


I also tried with my "Steam" controller, with the same results. And I remembered that back in the day when "Big Picture" mode had just been released you had to run the game through that to get some controller options working for certain games at least for the *Steam controller*, so I go ahead and try that to no avail.

Steam Controller settings
*************************

If for some reason your controllers aren't showing up in your Steam controller settings, you will need to add the following line to your ``/etc/udev/rules.d/99-steam-controller.rules``

.. code-block:: bash

   SUBSYSTEM=="usb", ATTRS{idVendor}=="28de", MODE="0666"
   KERNEL=="uinput", MODE="0660", GROUP="<put your group here>", OPTIONS+="static_node=uinput"
   # Steam controller
   KERNEL=="hidraw*", ATTRS{idVendor}=="28de", MODE="0666"
   # Regular ps4
   KERNEL=="hidraw*", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="05c4", MODE="0666"

The product ID's should be fine **054c** is Sony and **28de** is Valve, you will just need to replace your **group** in the above configuration and then re-trigger the udev rules if you don't want to reboot, with the following commands.

As root:

.. code-block:: bash

   udevadm control --reload-rules && udevadm trigger

That should reload the settings, and if your controllers showed up with ``lsusb`` previously, they should also show up in the Steam controller settings.

.. figure:: {static}/images/controller.png
   :figwidth: 100%
   :align: center
   :alt: Controller settings

   Steam controller settings

Some Research
*************

So I did a bit of poking around, and it looks like my controller **is** actually working fine, in pretty well any other game I've tried out. The problem seems to be only with Dead Cells for the moment. A bit more poking around, and I noticed that dead cells ships with some ultra old version of a Ubuntu64 **libSDL2-2.0.so.0**, and that some people had some success by deleting that and letting the system lib run in it's place. This however also didn't work for me.

Enter Proton
************

Ok now were in super not ideal territory, basically running the game in wine through steam, but whatever I want to play it, and if I can get the controller working this way I'll just deal with it. Worse case I do have a working VFIO GPU pass through VM of Windows 10 setup that I can just fire up, but it's a bit overkill for a game that HAS A WORKING LINUX VERSION... Anyways it's not come to that yet has it?

So I try out the experimental version of Proton using Steam compatibility. No go, so I chose an older version pictured below.

.. figure:: {static}/images/steam_compatibility.png
   :alt: steam compatibility settings

   Steam compatibility settings

Success
*******

It's working, I can use my controller, the performance is great, not really noticing any differences than when I was running it natively in Linux other than, I had to play with the keyboard which wasn't ideal.

Conclusion
**********

While it isn't the worse work-around, it isn't ideal. Usually my issue with games in Linux is that they don't run at all, never usually with the peripherals, so first time for everything. Now I can get back to dying over and over.
