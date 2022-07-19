Ever want Twitch.tv streams in your launcher (Rofi)?
####################################################

:author: mcgillij
:category: Linux
:date: 2022-07-18 22:49
:tags: Linux, Rofi, Twitch, Launcher, i3
:slug: rofi-wtwitch
:summary: Here's how I setup my Rofi and used wtwitch and mpv to play Twitch.tv streams.
:cover_image: stream.png

.. contents::

Whats ROFI?
===========

I use `Rofi <https://github.com/davatorium/rofi>`_ as my default launcher in my i3 configuration.
It's quite theme-able, and extendable to accommodate
pretty much any use-case that you may have that supports outputting a ``list``.

It looks something like this.

.. figure :: {static}/images/rofi_1.png
   :align: right
   :alt: Rofi Launcher

Rofi supports different "modes" which for me I can switch between them by pressing ``shift + -> or <-`` (arrow keys).


Rofi Twitch mode
================

If I switch it to the twitch mode it looks like:

.. figure :: {static}/images/rofi_2.png
   :align: right
   :alt: Rofi Launcher w/twitch

Usually there would be a few other listings in there, but since it's late when I took the screenshot.
There are only a few people still streaming. But anyways you can manage your list with ``wtwitch``, which I will cover next.

wtwitch
=======

You can find `wtwitch <https://github.com/krathalan/wtwitch>`_ or in the AUR repository.

Installing wtwitch can be done with the following incantation if you are on Arch Linux:

.. code-block:: bash

   sudo pacman -S wtwitch

Once this is installed you can use it to manage your list of streams.

.. image:: {static}/images/wtwitch.png
   :align: right
   :alt: wtwitch

Now that ``wtwitch`` is installed, you can start managing your **subscriptions** (note: these aren't actual subscriptions in twitch, just a list of channels you want to see in your list).

Add each of the streams that you want to see with the following command:

.. code-block:: bash

   wtwitch s Pestily

Where **Pestily** is the name of the stream.

Wrapping it up
==============

Now we have all the moving parts, but we still need some glue between Rofi and wtwitch.

For me I created a small script ``rt`` (RofiTwitch), which just parses the output for Rofi and I stored that in ``~/bin/rt``.

``rt``:

.. code-block:: bash

   #!/bin/bash
   # If nothing is passed in print a list of streams
   if [[ -z "$1" ]]; then
       wtwitch check | sed -n '/Live/,/Offline/p' | sed '/Live channels/d;/Offline/d' | sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g;s/   //;'
   else
       # if a param is passed in, open the stream
       name=$(echo "$1" | awk {'print $1'} | sed 's/\://')
       wtwitch w "$name" > /dev/null
   fi

This script filters out all the offline streams from the output of ``wtwitch`` and then prints the output to the terminal, also when passed a parameter (the stream), it will start it up in MPV (for me, this is configurable with wtwitch).


Now in your i3 configuration, or where ever you instantiate your Rofi. You can add the following command.

.. code-block:: bash

   # use ROFI instead of dmenu
   bindsym $mod+space exec --no-startup-id "rofi -modi 'drun,run,window,rt:rt' -show drun -font 'Roboto 16' -show-icons"

Note the ``rt:rt`` command in the list of modi, this is in reference to the script above that does the munging of the stream lists.


Action screenshot
=================

.. image:: {static}/images/twitch.png
   :align: right
   :alt: Action screenshot

Now this only gets you the video feed directly not the chat (but I see this as a good thing).
