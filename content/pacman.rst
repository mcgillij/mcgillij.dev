pacman coming from apt / dpkg
#############################

:author: mcgillij
:category: Linux
:date: 2021-01-07 19:49
:tags: Linux, Arch, Debian, pacman, #100DaysToOffload
:slug: pacman
:summary: Working with the Arch Linux package manager
:cover_image: pacman.jpg

.. contents::


WTF is pacman
*************

Apparently the package manager for Arch based distributions and here I was thinking it was an old video game character. I'm sure that jokes never been made.

Anyways I'll be likening the commands to what I would have traditionally done on Debian for the most part.

Basics
******

.. code-block:: bash

   usage:  pacman <operation> [...]
   operations:
       pacman {-h --help}
       pacman {-V --version}
       pacman {-D --database} <options> <package(s)>
       pacman {-F --files}    [options] [package(s)]
       pacman {-Q --query}    [options] [package(s)]
       pacman {-R --remove}   [options] <package(s)>
       pacman {-S --sync}     [options] [package(s)]
       pacman {-T --deptest}  [options] [package(s)]
       pacman {-U --upgrade}  [options] <file(s)>

   use 'pacman {-h --help}' with an operation for available options

This doesn't seem overly intuitive to me, while this command technically encompasses everything that **apt** would do, it doesn't have the same user experience as other package managers. Nor does the **man** page really clarify how to use it to do regular user things. It does however seem quite a bit more flexible.

Updating your cache
*******************

Usually before searching for packages to install you'll want to update your package cache.

Debian:

.. code-block:: bash

   apt-get update

Arch:

.. code-block:: bash

   pacman -Sy

This will update your cache, and allow you to search for packages to install.


Searching
*********

Often your trying to find a package to install for a particular application in this instance we'll search for **qemu**.

Debian: 

.. code-block:: bash

   apt-cache search qemu

Arch: 

.. code-block:: bash

   pacman -Ss qemu

These commands are essentially equivalent but pacman will list if the package is already installed or not.

Installing
**********

Where in Debian based distributions you would do the following to install a package.

Debian:

.. code-block:: bash

   apt-get install qemu

Arch:

.. code-block:: bash

   pacman -S qemu

Both the above commands will go ahead and install the package along with the dependencies required for installation.

Removing
********

As always you would also like to be able to remove packages should you not need them anymore.

Debian:

.. code-block:: bash

   apt-get --purge remove qemu

Arch:

.. code-block:: bash

   pacman -R qemu

OK so now we find out that all of the regular user things aren't done by just **-S**, removing does require the use of **-R**

Listing
*******

Wanting to get a list of the packages you've installed is a pretty common thing to do.

Debian:

.. code-block:: bash

   dpkg -l

Arch:

.. code-block:: bash

   pacman -Q

Listing optional dependencies
*****************************

Arch:

.. code-block:: bash

   pacman -Qi <packagname>

This will display some nice package information along with the optional dependencies available for installation.



Upgrading
*********

If you've used any Debian based distribution for any length of time, you will have run a **dist-upgrade** at some point.

Debian:

.. code-block:: bash

   apt-get dist-upgrade

Arch:

.. code-block:: bash

   pacman -Syu

Each of these will update all of the required packages to get you upgraded.

Cleaning up
***********

Want to clean up your installed packages cache?

Debian:

.. code-block:: bash

   apt-cache clean

Arch:

.. code-block:: bash

   paccache -r

That's about it for my common commands, I'll likely go over installing source / AUR packages as well in the future

