Ventoy how did I not know about you?
####################################


:author: mcgillij 
:category: Linux
:date: 2021-01-03 17:01
:tags: Linux, tutorial
:slug: ventoy
:summary: Neat tool that I didn't know about for bootable media
:cover_image: usbkey.jpg

.. contents::

Missed the boat
***************

I'm probably late to the party, but I just found out about `Ventoy <https://ventoy.net>`_ just a great open source utility to create multi-bootUSB drives. As I've spent a bunch of time as of late formatting USB keys for installing various Linux distributions onto my new workstation, this could have saved me so much time, although I'm sure I'll get to use it in the future.

Simple to use
*************

Anyways it's super simple, you just download the Linux tarball, and fire the extracted script to your USB drive ala ``Ventoy2Disk.sh -i /dev/sda`` (where **/dev/sda** is your usb device) and it creates 2 partitions, one for itself to use, and the rest of the space for you to dump **ISO/IMG's** in there. And it will create a boot menu for you to use containing all your images, simple and great.

You can reformat that secondary partition to pretty well whatever you like, however as long as it supports files over 4gb you should be fine for most ISO's. There is also the ability to customize / theme your installation however I didn't really dig into that, I just wanted to load up my USB stick with some handy tools and distro's that I use commonly.

Some tools
**********

Some handy images that I recommend:

- `Memtest86 <https://www.memtest86.com/>`_
- `Gparted <https://gparted.org/livecd.php>`_ Live CD
- `Debian Testing <https://cdimage.debian.org/cdimage/weekly-builds/amd64/iso-cd/>`_
- `Arch <https://archlinux.org/download/>`_ installer
- `Windows 10 <https://www.microsoft.com/en-ca/software-download/windows10ISO>`_

Are there bootable tools that I should have on there? Let me know!
