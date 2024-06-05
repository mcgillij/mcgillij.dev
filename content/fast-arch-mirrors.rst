Fast Arch Mirrors
#################

:author: mcgillij
:category: Linux
:date: 2024-03-25 23:49
:tags: Linux, Arch
:slug: fast-arch-mirrors
:summary: How to find the fastest Arch mirrors
:cover_image: arch.png

.. contents::

How to find the fastest Arch Mirrors
************************************

Updates were going slow on my Arch Linux system, so I decided to find the fastest mirrors. Here's how I did it.

First, I installed the `rate-mirrors` package:

.. code-block:: bash

    yay -S rate-mirrors

Then, I ran the following command to find the fastest mirrors in Canada:

.. code-block:: bash

    rate-mirrors --disable-comments-in-file --entry-country=CA --protocol=https arch --max-delay 7200 | sudo tee /etc/pacman.d/mirrorlist

You can replace the **CA** with your country code.

I actually saved this into a file for my local **bin** directory, so I can run it whenever I want.

But this should populate your **mirrorlist** with the fastest mirrors in your region.
