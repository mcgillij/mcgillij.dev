Dwarf Fortress in Arch with a Tile-set
######################################

:author: mcgillij
:category: Games
:date: 2021-01-11 17:49
:tags: Linux, Arch, Dwarf Fortress, Graphics, #100DaysToOffload
:slug: dwarf-fortress-in-arch
:summary:  Small write-up of how to install a tile-set for Dwarf Fortress in Linux (Arch, but any other distribution will work as well).
:cover_image: df.png

.. contents::

Installation
************

You can either download the binary from `bay12games <http://www.bay12games.com/dwarves>`_ or if you're on Arch Linux, there's a package you can snag with the following command:

.. code-block:: bash

   pacman -S dwarffortress

This will install most of the resources into ``/opt/dwarffortress``, and when you run the game for the first time with the ``dwarffortress`` command, it will populate your **$HOME/.dwarffortress** directory with some configuration files that we'll take a look at in a bit for adding a tile-set.

Where to get Tile-sets?
***********************

I found that the official forums and `DFFD <https://dffd.bay12games.com/>`_ site had mostly tilesets that would include all the windows binaries and configurations. Where I'm playing on Linux natively, so I wanted just the graphics by themselves so I could install them myself. So this `Github repo <https://github.com/DFgraphics>`_ has a great selection of Graphics Tilesets ready to be used directly in Linux.

Grab a Tile-Set
***************

I chose the *Ironhand* set that can be found `here <https://github.com/DFgraphics/Ironhand>`_, but the directions will work for any other regular tile-set.

Once downloaded, I unzipped the *Ironhand_47_04A.zip* to a temporary folder.

When extracted, you should see a **data** and **raw** folder, on Arch since I had already run Dwarf Fortress once, it had created my local configuration in **~/.dwarffortress** so I just copied the data folder over with the following command.

.. code-block:: bash

   cp -Rupv data/ ~/.dwarffortress/

And afterwards I copied the raw's over to the */opt/dwarffortress/raw* directory.

.. code-block:: bash

   sudo cp -Rupv raw/ /opt/dwarffortress/

Configuration
*************

Now we just want to check our configuration files to make sure the new tile-set is selected.

You can find it at *~/.dwarffortress/data/init/init.txt*, and look for your **GRAPHICS:** block, and make sure you put in your tile-set preference in the configuration.

.. code-block:: bash

   [GRAPHICS:YES]
   [GRAPHICS_FONT:ironhand.png]
   [GRAPHICS_FULLFONT:ironhand.png]

Make sure you update the "GRAPHICS_FONT" and "GRAPHICS_FULLFONT" with your tile-sets png, and toggle GRAPHICS: to YES as above.

Strike the Earth
****************

Now you're ready to strike the earth! With a graphical tile-set.
