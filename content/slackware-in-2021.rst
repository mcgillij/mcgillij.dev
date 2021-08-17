Slackware 15.rc1 in 2021
########################

:author: mcgillij
:category: Linux
:date: 2021-08-16 19:49
:tags: Linux, #100DaysToOffload
:slug: slackware-15-in-2021
:summary: Preview / How to install Slackware 15.RC1, and small review.
:cover_image: slackware.jpg

.. contents::

Slackware 15.rc1 from 14.2
**************************

With the `announcement today <http://www.slackware.com/changelog/current.php?cpu=x86_64>`_ that they cut the RC1 of Slackware 15. And while interesting, I'm not a huge fan anymore of "versions" of Linux distributions. However `Slackware's <http://slackware.com>`_ always been very stable even using the 'current' branch (as a kind of pseudo rolling release, before it was a thing).

For me Slackware was my first exposure to Linux in 98 the summer before going to University, so it will always have a special place in my heart. While it wasn't the first distro that I had ever installed on my own hardware, it was the first time that I'd seen "Linux" in the wild running on a buddy's machine. And how glorious it was.

With a focus on simplicity and ncurses gui's, Slackware has provided some useful tools over the years that have become staples of the Unix ecosystem as a whole.

There are some impressively recent Kernel's and Mesa libraries making their way into the 15 release. So it should be quite a capable gaming setup, I'll have to investigate how well *steam* integrates into it to be able to judge if it's worth the effort for running it full time. Since I do enjoy some gaming.

Installation
************

So whats changed in the installation in the last 25 years of Slackware. *Spoilers* not too much, it's just about the same, except new versions of almost the same application list are installed.

First booting off your installation media, you are greeted with the following prompt, which would allow you to start the installation or boot into existing disks.

.. image:: {static}/images/slackware_boot.png
   :alt: slackware bootloader for installation media
   :width: 100%

KB Layout
^^^^^^^^^

Next we pick a keyboard layout if not using the standard US layout.

.. image:: {static}/images/slack_kb.png
   :alt: slackware keyboard layout selection

Logging in as root
^^^^^^^^^^^^^^^^^^

Logging into the installation environment as ``root``. (Seems eerily similar to the Arch install docs that I wrote a couple days ago doesn't it :)).

.. image:: {static}/images/slack_login.png
   :alt: slackware login
   :width: 100%

Partitioning
^^^^^^^^^^^^

No Linux installation is possible without partitioning some disks. Using `cgdisks /dev/vda` (note devices for you will be called something different). We can setup our partitions. You can use whichever partitioning scheme that you want. You will later be able to set the mount points you need during the installation.

- **cgdisk**

.. image:: {static}/images/slack_cgdisk.png
   :alt: partitioning for gpt with cgdisk
   :width: 100%

- Turning on our swap file for the installation

Running `setup`
^^^^^^^^^^^^^^^

Once your partitions are created, you can run `setup` which starts the installation proper. The rest is done through the ncurses gui.

.. image:: {static}/images/slackware_partitioning.png
   :alt: partitioning
   :width: 100%

- Selecting your swap and root filesystems

.. image:: {static}/images/slack_swap.png
   :alt: selecting swap partition
   :width: 100%

- packages for installation

.. image:: {static}/images/slackware_packages.png
   :alt: slackware packages
   :width: 100%

- Just say No to usb boot device (unless you really want to)

.. image:: {static}/images/slack_usb_boot.png
   :alt: choose no for usb boot
   :width: 100%

Welcome to Slackware
^^^^^^^^^^^^^^^^^^^^

.. image:: {static}/images/slack_welcome.png
   :alt: Slackware Welcome
   :width: 100%

Like Archlinux, Slackware doesn't presume to know what you want for the most part. However it can through the installer and your choices pre-install some servers and desktop environments for you. 

Now you are at a terminal. First things first, you'll login with the `root` user with the password that you setup during the installation, and you can then create yourself a user with the `adduser` command.

Once you have that done. We will move onto the upgrade to the new version.

Upgrade
*******

After installation

Updating Packages
^^^^^^^^^^^^^^^^^

Using your favorite editor, edit your mirrors in `/etc/slackpkg/mirrors`.

.. code-block:: bash

   vi /etc/slackpkg/mirrors

Uncomment one of the entries that are near your geographical location, and then we'll update the package listing.

Should look something like (replace with a mirror close to you):

.. code-block:: bash

   http://mirror.its.dal.ca/slackware/slackware64-current/

This will update from the mirrors the list of packages available.

.. code-block:: bash

   slackpkg update gpg

Lets make sure there aren't any new encryption keys that we should have. Once those are updated.

.. code-block:: bash

   slackpkg upgrade slackpkg
   slackpkg upgrade-all

Using `slackpkg` to upgrade itself and the rest of your system packages, since we'll be doing an upgrade it's safer doing this than upgrading directly to the newest "current" release.

Below is essentially the loop for updating to the new version of Slackware "current".

.. code-block:: bash

   slackpkg new-config
   slackpkg update slackpkg
   slackpkg update
   slackpkg update-all
   slackpkg clean-system

Now you should have all the new packages from the `current` branch (15RC1) installed and ready to go, now you just need to reboot (if you installed a new kernel). Or not, you can just fire up your X session with `startx` and be on your way.

.. image:: {static}/images/slackware_upgrade_all.png
   :alt: update all
   :width: 100%

After a nice reboot, you'll be running 15.

.. image:: {static}/images/slackware_15.png
   :alt: slackare 15

Wiki
****

Slackware has a pretty comprehensive wiki as well, which can be found here: `slackware wiki <https://docs.slackware.com/start>`_
