Noita Save Manager
##################

:author: mcgillij
:category: Games
:date: 2021-02-28 20:49
:tags: Linux, Noita, Games, Mod, #100DaysToOffload
:slug: noita-save-manager
:summary: Linux compatible Noita Save Manager
:cover_image: noita.png

.. contents::

Noita Save Manager
******************

Small Python script I put together for myself, since none of the other save managers work in Linux. I know I'm in the minority here that plays Noita in Linux. But it also works in Windows in the event that your looking a save-file manager for `Noita <https://store.steampowered.com/app/881100/Noita/>`_.

Screenshot
**********

Here's an "action" shot of it.

.. figure:: {static}/images/noita_save_manager.png
   :alt: Screenshot of Noita Save Manager

   Screenshot of the script running.

Mandatory
*********

As with all my Noita posts, I'll ask the dev's to please consider releasing a Linux native port. With that over with onto the features.

Features
********

- Non-destructive, always creates backups prior to restoring saves
- Won't run while Noita is running as to not create corrupt backups
- Works in Linux or Windows
- Open source, you can build it on your own if your so inclined

Downloads
*********

You can snag it from `my github <https://github.com/mcgillij/noita_save_manager>`_ from the `release page <https://github.com/mcgillij/noita_save_manager/releases>`_.

I'll fire it up on PyPi, at a later date when I get it cleaned up some and remove the debugging window. But it's quite usable as is.
