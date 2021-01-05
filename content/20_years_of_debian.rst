Installing Arch Linux blind after 20 years of Debian
####################################################

:author: mcgillij
:category: Linux
:date: 2021-01-01 16:49
:tags: Linux, Debian, Arch
:slug: arch-after-debian-part1
:summary: Some thoughts about Arch and Debian after 20 years of using primarily Debian
:cover_image: arch.png

.. contents::

Some history
************

I've been using Linux and BSD's for probably close to 25 years now, starting from early `Redhat <https://redhat.com>`_ and `Slackware <https://slackware.com>`_ floppy disk installations. I've gone through some of the many phases of distro choices and usage patterns ranging from manually configuring and compiling everything to trying to accept some semblance of sane defaults from various distributions. I've rolled my own distributions professionally as well as for fun. 

However I always end up with `Debian <https://debian.org>`_ at home on my main workstation, maybe due to familiarity, great package manager (you'd be hard pressed to be able to find something as simple and powerful as ``apt``), and general sane defaults for most packages allowing me to get up and running on any system very quickly. There's a reason it ended up as the *baseline* for so many other distributions. 

Debian for me was my distro because it aligned with my free software principles and it had great tooling.

Fast Forward
************

Over the holidays I picked up a new workstation so like any self respecting Linux nerd craving something a little different, and with a bit of curiosity as to the **state of the world** if you will of the modern Linux distros. I proceed to install all kinds of random distros (`Fedora 33 <https://getfedora.org/>`_, `PopOS <https://pop.system76.com/>`_, `Ubuntu 20.10 <https://releases.ubuntu.com/20.10/>`_, `Regolith <https://regolith-linux.org/download/>`_, `Debian Testing <https://debian.org>`_ and Finally `Arch <https://archlinux.org/download/>`_) on it to see how each of them have evolved over the years in comparison to my beloved Debian. At the end of the day I realize that each Linux distro is just preference, and that they are what you make of them. None are "better" than others as you could likely spend enough time with each of them and turn them into something worth using.


My target goals going into this:
- Usable i3
- Xorg
- Easily support custom kernels
- Replicable installation
- VFIO / GPU pass through

But for me the defaults are somewhat important as I am looking for an alternative for my daily driver with ideally the least amount of head-ache. With Ubuntu, Regolith (which is based on Ubuntu but comes with a fancy i3 setup and I do like a good i3 setup), Fedora 33 and PopOS I really felt like they were all just the exact same thing under the hood with their Gnome/GDM/Wayland configurations. I'd run into the exact same problems wanting to-do fairly simple things like switching to **lightdm** and logging into **i3**. This proved to be quite a pain in the ass in Ubuntu as it would fail to load into anything but the Wayland Gnome desktop environment despite listing the other environments in it's login menu.

Enter Regolith
***************

Regolith is nice, but the current version is based on Ubuntu 20.04 which when upgraded to 20.10 starts having "crashed application reports" every time you login to **i3** after a couple minutes. However it solved the issue of not being able to login to my **i3** session by only having **i3** installed by default, however still being Ubuntu under the hood lead to more issues when wanting to deal with custom kernels, and the general **PPA** cluster fuck that is present in the Ubuntu world. It still left a bad taste in my mouth, and I was about to just go back and fire Debian on here and be done with it.

Frustration
***********

I understand that my use-case is likely a bit different than most casual Linux users, but this frustration lead me in a totally different direction.

Arch
****

Having never used Arch Linux in the past since it used to be quite terrible from what I recall when it came to security, I figured I may as well give it a try. Fuck it some folks on the internet seem to really like it, so it can't really be that bad right? So here I go **dd**'ng an Arch ISO to a USB drive and installing Arch blind.

OK so the 'installer' is a terminal session
*******************************************

I had to check the year, but yep it was nearing the end of 2020 and here I was installing Arch Linux from a terminal session. So there I sat at the terminal which thankfully it found my NIC and setup networking so I could browse their helpful `wiki <https://wiki.archlinux.org>`_ on the installation (more on this later). 

It should be noted that if your trying to install Arch and aren't too familiar with Linux terminal sessions you can press **Alt-F1/F2/F3..** to switch to alternate terminals so you can effectively leave the Wiki up on one term while doing the installation on the other.

**For anyone new to Linux, I would probably stay away from Arch Linux unless your primary goal is learning.**

Enter the Arch Wiki
*******************

So the installation essentially gives you the option to load up the `Arch wiki installation <https://wiki.archlinux.org/index.php/Installation_guide>`_ documentation, which is pretty great, it outlines a couple of the commands that will get you up and running with a new Arch installation. However there's a couple caveats that are worth noting if your actually following the directions hoping for an actual usable / working system.

Their `wiki <https://wiki.archlinux.org>`_ will assume that you can make educated decisions based on some information given, their notion of "sane" defaults are essentially non-existent, you have to make those choices as you work through the installation process. Something I was not aware of going into this thing blind, but I'm OK with as we're trying something new.

Alright so I setup my partitions with **fdisk** mount them how I want them to be setup, generate the **/etc/fstab** and finally installing some packages into your **chroot** environment (which will become your live system after a reboot). 

It should be noted here that they only include 3 packages in their installation documentation.

From Arch Wiki installation:

.. code-block:: bash

   pacstrap /mnt base linux linux-firmware

Now this will get you "some" of what you need to wrap up your installation if your following along to their documentation, however not all of the things that you need since in the next steps they will suggest that you generate your locale's and you won't actually have some of the tooling required.

So I'm going to suggest if your reading this, and are interested in Arch at all, maybe save yourself a bit of time and **pacstrap** a few more packages into your **/mnt** before moving onto the next step in the `installation wiki <https://wiki.archlinux.org/index.php/Installation_guide>`_. 

Below is my suggested bare minimum for a quick installation and actually able to complete the installation

.. code-block:: bash

   pacstrap /mnt base linux linux-firmware sed pacman vim

**sed** at the bare minimum is required to actually complete the generation of your **locale**'s and I suggest and editor that your familiar with, I use VIM so I put it there for myself to use post-installation.

Maybe you also want to be able to install more packages either during your installation or afterwards, highly suggested that you also add **pacman** here as it's the default Arch package manager.

Most of the other installation steps are fairly sound after this point assuming you've gone ahead and installed an editor and **sed** which is used by their own scripts but not installed by the suggested command on their `wiki <https://wiki.archlinux.org>`_...

Bootloaders
***********

The documentation tells you that you need a boot loader, and goes above and beyond describing each and every choice that you can possibly make without telling you that 99% of the world is just going to pick Grub and be done with it. So here I think that during the installation process they could have cut down the signal to noise ratio quite a bit, but outlining maybe "common" installation options vs make your own choice out of these, and hopefully you picked one that the tooling is actually still relevant for... Anyways with that gripe out of the way, were ready to move onto the actual live system.

Reboot
******

Great I've got my small base installed and I reboot to into my live system (which during the installation had network connectivity by default). However they don't seem to outline that this won't be the case in the `installation wiki <https://wiki.archlinux.org/index.php/Installation_guide>`_ as of when I installed it.

So here I am with my terminal session Arch Linux installation, with no internet.

OK so it's been a while since I've had to manually setup my network in Linux as most distros have some form of sane defaults. Which as I'm quickly learning isn't the case with Arch. You are left with many options in how you can shoot your feet off.

Networking
**********

Now I want to setup my networking, but since it's not the early 2000's anymore **ifconfig** and a **/etc/resolv.conf** has gone out of fashion. Now I have this giant monolith of a mess called **systemd** installed and I get to use that to manage my network SCORE!!!

First things first setting up our **NIC** to get an IP from our ISP's DHCP server. Let's fill out our configuration file to setup our network ``/etc/systemd/network/20-wired.network``.

.. code-block:: bash

   [Match]
   Name=enp6s0
   
   [Network]
   DHCP=yes
   DNS=8.8.8.8
   DNS=8.8.4.4

And then we can re-start our networkd service and get our IP address with ``systemctl restart systemd-networkd.service``. Now we should actually be on the network but we can actually resolve any DNS names yet, we can do this by enabling the ``systemd-resolved`` with the following command ``systemctl enable systemd-resolved``.

Now we have a network up and going we are ready to rock.

Everything else from this point on-ward is what I would expect from a Linux distro.

Conclusion
**********

As long as I have a terminal, network and a working package manager, I'm happy and able to get the rest of my system up and running.

So *installing Arch blind was probably not the brightest thing todo*, I likely should have probably read up on it prior to installing it. That being said, much of the documentation is very misleading and could cause folks to waste a ton of time due to them not actually following their own directions on the Wiki to see if they have a working set of instructions that if you follow along, you'll be left with an actual installation that you can quite easily use. From leaving out **sed** and their own package manager **pacman** from the installation instructions, it limit's their audience to people who already have working knowledge of Linux in general. I wouldn't ever expect someone to have to know about **sed** to have to manually install it during an installation to be able to generate your **locale**'s which your instructed to in the same document. Just for the sake of giving the illusion of choice and not providing any defaults.

Anyways despite all this hassle, it did hit a nostalgic nerve with me of when I was manually configuring my systems back in the day, and I did quite enjoy going into this blind. And would recommend it to anyone interested in burning a couple hours over a weekend sometime.

After all of this, I was able to get up and running with i3, lightdm and all my favorite tools quite painlessly, however I still don't really like the syntax of **pacman** but that will take a while to get used to as I have 25 years of **apt** muscle memory built up that I'll have to overcome. But I'm willing to give this an actual try.

Debian vs Arch
**************

Debian is still my favorite distro, and remains on my server at home, but I'm willing to give Arch a try for the time being on my workstation. We'll see if this opinion changes over time.

End
****

I'd love to hear other peoples experiences with the Arch installation process especially if you've gone into it blind like I did.
