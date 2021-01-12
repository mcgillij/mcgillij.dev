Building AUR's with a chroot
############################

:author: mcgillij
:category: Linux
:date: 2021-01-09 16:49
:tags: Linux, Arch, pacman, 100DaysToOffload
:slug: aur-with-chroot
:summary: How to build AUR's with a chroot cleanly
:cover_image: package.jpg

.. contents::

In the previous post we touched on some of the common commands that you would use with **pacman** to install the packages that are available.

But what if the packages aren't available from the default mirrors. Or they are but you want a more recent version?

AUR
****

`Arch User Repository <https://aur.archlinux.org>`_ are user maintained packages and sources available for installation.

There are over half a million packages available for installation via AUR, which is bonkers. They are however a little more tricky to install than your basic **pacman** installation. And you will generally want to build them in a **chroot** as to make sure your not building them with missing dependencies. I'll cover that in the next sections.

Git as a package manager
************************

You will need some passing familiarity with **git** to be able to use the AUR's, or at least the ability to have it installed and copy / paste some commands I guess. However it's generally a good idea to actually know what you're doing though. All of the AUR's are stored in separate git repositories, and the installation is usually as simple as cloning the repo, and building then installing the package. However there are a few steps to setup your build environment that I will cover below.

Build dependencies
******************

You will want to install **git** and **devtools**.

.. code-block:: bash

   pacman -S devtools git

Once those are installed you will want to create your **chroot** directory in your $HOME.

.. code-block:: bash

   mkdir ~/aur_build_chroot

Then you can add an **export** to your *.bashrc* if you like.

*.bashrc*

.. code-block:: bash

   export BUILD_CHROOT=$HOME/aur_build_chroot

You will also need to populate it with some of the build dependencies with the following command.

.. code-block:: bash

   mkarchroot $BUILD_CHROOT/root base-devel

Once you have this in place you can start building packages inside the chroot. Since I came from a long time of using Debian and I'm not super familiar with all the Arch commands I've just created some small scripts to help me with the building and installation of packages built in the chroot. I'll post them below.

Custom scripts
**************

*~/bin/make_package*

.. code-block:: bash

   #!/bin/bash
   makechrootpkg -c -r $HOME/$BUILD_CHROOT


*~/bin/install_package*

.. code-block:: bash

   #!/bin/bash
   sudo pacman -U --asdeps $1

I'll go over the usage of the above scripts here in a second, but as you can see they are quite simple however I wasn't remembering the particular parameters for the first couple packages that I installed, so I just fired them into scripts.


Typical Usage
*************

Here is the general *flow* of how I go about installing new packages from AUR.

1. Check if it's in the regular mirror
   ``pacman -sS slack-desktop``

If the package is available that you want from a regular mirror, I would just skip the rest of the steps as it's much easier and convenient to use those. However if it's not available, the below steps will guide you in the build / installation of your AUR package.

2. Find the AUR for the application
   `AUR <https://aur.archlinux.org/packages/slack-desktop>`_
3. Clone the repo in your $HOME directory

You can clone the repo that is listed by copy/pasting the "Git Clone URL" on the AUR page for the package your trying to install with the following command.

.. code-block:: bash

   git clone https://aur.archlinux.org/slack-desktop.git
   cd slack-desktop
   ls
   ...
   PKGBUILD

The above commands you should be able to see a **PKGBUILD** in the folder where you cloned the repository.

You can open this file with any text editor to see what exactly the steps are going to be to build this package for installation.

4. Running **make_package** from the package directory (in this case the *slack-desktop* directory where we cloned it). This will use sudo to prompt you for your credentials to build in the chroot you defined above.

   Once your package is built, you can run another ``ls`` and you should see a couple new files in the directory along with your newly compiled package. It should have a **zst** extension.

.. code-block:: bash

   make_package
   ...
   ls
   ...
   PKGBUILD                                   slack-desktop-4.12.0-amd64.deb
   slack-desktop-4.12.0-1-x86_64-package.log  slack-desktop.patch
   slack-desktop-4.12.0-1-x86_64.pkg.tar.zst

In our case the package wasn't actually built from source, but rather from a Debian package, since slack doesn't make their source available. However you can use this to build source packages as well. I guess I just choose poorly for an example package that I had kicking around.

5. Installation

   To install the package you can use the **install_package** script above or just run the command inside it if you remember the appropriate parameters.

.. code-block:: bash

   install_package slack*.zst

This should again prompt your with sudo for your credentials to install the package on your system. Note that the **--asdeps** from the ``sudo pacman -U --asdeps $1`` command inside the **install_package** script, will allow you to cleanly remove or manage the dependencies for this package with **pacman** in the future if you need to update or remove the package. Or if it's outdated by another package.

Maintenance
***********

You can use this similar pattern to install just about any package from the AUR, which is nice cause there's quite a bit of resources available there. And you can manage your packages installed this way with **pacman** like you would manage any of the regular packages from the mirrors.

Thoughts?
*********

I kinda dig using git as a package manager, what are your thoughts about it?
