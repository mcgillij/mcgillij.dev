Debian 11
#########

:author: mcgillij
:category: Linux
:date: 2021-08-17 19:49
:tags: Linux, Debian, #100DaysToOffload
:slug: debian11
:summary: Installing Debian11 into a VM to setup as my Work machine.
:cover_image: debian.png

.. contents::

An old friend
*************

It feels like it's been forever since a new Debian release happened. Yet here we are. Let's see whats new in my old favorite distro.

Having been a Debian user for close to 25 years, it's always nice to see new versions, however more recently I've been getting more into rolling distributions. But it's always nice to see whats changed in the default installations. And I'll be using this VM for work anyways.

On-ward to the installation.

Installation
************

After firing in your boot media, you'll be greeted by the fancy Grub screen with your options.

.. image:: {static}/images/debian11_grub.png
   :alt: debian grub screen

After choosing the graphical installer, we get to pick our language.

.. image:: {static}/images/debian11_lang.png
   :alt: debian language selection

And then location.

.. image:: {static}/images/debian11_location.png
   :alt: debian language selection

Default keyboard layout.

.. image:: {static}/images/debian11_kb.png
   :alt: debian keymap

Setting up your machines hostname.

.. image:: {static}/images/debian11_hostname.png
   :alt: debian hostname

Selecting your root and user accounts passwords.

.. image:: {static}/images/debian11_password.png
   :alt: debian password

Setting the timezone information.

.. image:: {static}/images/debian11_tz.png
   :alt: debian timezones

Now we will partition our disks.

.. image:: {static}/images/debian11_part.png
   :alt: partitioning

Finalizing partitioning.

.. image:: {static}/images/debian11_part2.png
   :alt: partitioning 2

Scanning extra installation media (not sure this has been a thing in many years, mostly due to installation mostly taking part over the internet).

.. image:: {static}/images/debian11_installation_media.png
   :alt: installation media

Popularity contest to see which packages people use the most.

.. image:: {static}/images/debian11_pop_contest.png
   :alt: popularity contest

Selecting your Window manager / Desktop Environment

.. image:: {static}/images/debian11_wms.png
   :alt: window managers

Gnome, Xfce, Gnome Flashback, KDE Plasma, Cinnamon, Mate, LXDE, LXQt

.. image:: {static}/images/debian11_gdm.png
   :alt: configuring gdm

And were done the installation

.. image:: {static}/images/debian11.png
   :alt: login screen for debian11

From here you can install and configure your environment to your liking. For me that includes installing `docker`, `nvim` and `guake`. And I should be good to go for work.
