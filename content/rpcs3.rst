Demon's Souls / RPCS3
#####################

:author: mcgillij
:category: Games
:date: 2021-01-23 14:49
:tags: Games, #100DaysToOffload, Emulation
:slug: demons-souls-in-linux
:summary: Getting Demon's Souls up and running Linux
:cover_image: demonsouls.png

.. contents::

Demon's Souls
*************

My first exposure to "Souls" series, and to an extent the legendary `Hidetaka Miyazaki <https://en.wikipedia.org/wiki/Hidetaka_Miyazaki>`_ although I had played some of the Armored Core games I'm not sure if he was responsible for those as well. 

Demon's Souls was the only game I bought with my PS3, although I would go on to buy it several times over. I'd end up lending my copies to people only to never have them returned, and finally ended up buying it on the PSN so I could have it on the hard drive and never have to worry about having to buy it again. 

A pattern that repeated itself with the PS4 and Bloodborne I should have known better than to buy disc copies of games. I managed to play through all the Dark Souls on PC with Steam so I never had to worry about lending my discs out to friends this way :)

This game and series was hard, atmospheric, cryptic and very unforgiving and quickly became one of my favorite games and it absolutely still holds up.

Now I know I'm probably late to the party, as it seems it's been working with `RPCS3 <https://rpcs3.net/>`_ for quite some time now, and there's even now RPCN a free alternative to the PSN network, which allows playing with friends / random folks on the internet.

With the recent re-release of Demon's Souls for the PS5 (and not having a PS5), I was kinda getting that **itch** in the back of my head to get into the souls world. And what better way than to be able to play it on my PC. Sure beats having to dig out my PS3 from some packing boxes, and then having no one to play it with online.

RPCS3
*****

So apparently PS3 emulation is now a thing and quite stable it seems, they have a quite big list of compatible games however Demon's Souls is likely one of the only games worth emulating since most "good" PS3 games aren't exclusives to the system, but are playable already on the PC.

I'm going to cover how I got RPCS3 installed and configured on Arch Linux, if for some reason you need distro specific commands let me know.

Build
*****

RPCS3 is available as an AUR, so if you followed my previous post on how to build AUR's in a chroot, this will come in handy. As I used the chroot to build an optimized version for my system. I just ran ``make_package`` in the rpcs3 directory, however if you don't have a similar alias or command you can use the below commands.

First were going to snag the **PKGBUILD** by using ``git clone https://aur.archlinux.org/rpcs3.git``.

.. code-block:: bash

   cd rpcs3
   makechrootpkg -c -r $CHROOT

You may want to export the following command to your environment prior to building the RPCS3 package, as by default it's setup to only use 1 core while compiling which will only take *1 universe heat death* to compile.

.. code-block:: bash

   export MAKEFLAGS="-j$(nproc)"

The above command ``nproc`` will give you the number of cores available on your CPU, and you can specify how many you want to dedicate to the build.

Installation
************

Once your build is finished, you should be left with a **rpcs3-0.0.14-2-x86_64.pkg.tar.zst** in the current directory. And you can install it with ``install_package`` or the following command.

.. code-block:: bash

   sudo pacman -U --asdeps rpcs3-0.0.14-2-x86_64.pkg.tar.zst

Dependencies
************

Some dependencies that you will likely want to have installed for better rendering performance. You can install these after or before you build RPCS3 (the below packages assume you have an AMD gpu, NVIDIA users will need to install their vulkan packages). Having these dependencies installed will allow you to select the **vulkan** renderer which has better performance than the default **opengl** renderer.

Arch:

.. code-block:: bash

   pacman -S vulkan-tools vulkan-radeon vulkan-amdvlk vulkan-icd-loader

Configuration
*************

You will need the PS3 Firmware once you boot up RPCS3, which can be snagged from `here <http://dus01.ps3.update.playstation.net/update/ps3/image/us/2020_1203_03373a581934f0d2b796156d2fb28b39/PS3UPDAT.PUP>`_

*File->Install Firmware* and point it to your downloaded firmware.
Then you can *Add Game* with your copy of Demon's Souls or whatever game your trying to get running on RPCS3.

However the configuration options I will be going over will be specific for Demon's Souls.

Right click the game and select **Create Custom Configuration**.

CPU
^^^

.. figure:: {static}/images/ds_cpu.png
   :alt: CPU options

   CPU Options for best performance

GPU
^^^

.. figure:: {static}/images/ds_gpu.png
   :alt: GPU options

   GPU options

Note: **Do not** alter the **Default Resolution**, if you want to change the resolution use the **Resolution Scale** option.

Network
^^^^^^^

.. figure:: {static}/images/ds_network.png
   :alt: Network settings

   Network options required for online play.

If you want to play online with your friends, you will need to setup an RPCN account. And select the above options.

Follow the connection settings given at `The Archstones <https://thearchstones.com/serverinfo.html>`_ as they have setup a RPCN server for people to play Demon's Souls with, or you can self-host your own server using `RPCN <https://github.com/RipleyTom/rpcn>`_ directly.

Controllers
***********

You can find some directions on how to setup your controllers in Linux from a `previous post <https://mcgillij.dev/dead-cells-controller-issues.html>`_. It just has to already be working on your system and RPCS3 will be able to use it essentially.

Game Patches
************

There are also a number of patches that you can apply with RPCS3 that are pretty neat, I enabled the **32:9** support since I'm running with a *5160x1440* resolution and I enabled display stretching in the GPU options.

.. figure:: {static}/images/ds_patches.png
   :alt: Patches

   List of patches that you can apply to your game

Notes
*****

It is to be noted that Demon's Souls needs to be installed in RPCS3 as a "Disc" game, or you will be stuck with a black screen upon booting it up.
