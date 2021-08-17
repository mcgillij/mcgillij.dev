Installing Arch Linux (with helpful screenshots)
################################################

:author: mcgillij
:category: Linux
:date: 2021-08-12 21:49
:tags: Linux, Arch, #100DaysToOffload
:slug: installing-archlinux
:summary: Not a replacement for the installation wiki, but a complement for newer folks interested in Arch.
:cover_image: arch.png

.. contents::

Preface
*******

This is not a replacement for the `installation wiki <https://wiki.archlinux.org/title/installation_guide>`_.

Who is this for?
^^^^^^^^^^^^^^^^

Anyone interested in a modern Linux desktop environment, playing games in Linux(SteamOS / Steam Deck!!! But on desktop?), virtual machines and developers etc...

What makes Arch different?
^^^^^^^^^^^^^^^^^^^^^^^^^^

- Arch strays a bit from the pack of typical Linux distributions, by requiring the users to make actual *choices*, not very hard ones, but *choices none-the-less*.

What does this mean practically? You will *need* to have actual opinions about how you want your system to run, as well as the applications that you want running.

- Rolling distribution model, no clear-cut versions. As long as you update, your always running the "current" version.

- Package management is done with **pacman**, I've written a couple other articles on **pacman** in the past if you want anymore information on the subject.

- **AUR**'s (`Arch User Repositories <https://aur.archlinux.org/>`_) are another incredible thing in the Arch world bridging the gap for installing projects not in the main archives.

- Documentation, their `Wiki <https://wiki.archlinux.org/>`_ is a tremendous resource that only Gentoo comes close to.

New to Linux? Should you install Arch?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You totally can, farbeit for me to stop you, however it's generally not recommended as a first Linux distribution *choice*. If your goal is to get up and running with Linux quickly, I'd highly suggest using `Manjaro <https://manjaro.org>`_.


Installer?
^^^^^^^^^^

While there is technically an "installer" I will not be covering that.

Whats wrong with other distributions?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nothing, they all set out to do their own thing. They for the most part offer opinionated installations, with varying degree's of sane defaults. Most distributions canned choices are often harder to trim down post installation than Arch is to configure from scratch which is why I'm going to go over the installation process, in the event that you are curious with the installation process and choices I've made while installing Arch.

Onward to the installation
**************************

Ok with that out of the way onto the installation and choices.

Booting the installation media
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Once you've booted the USB image, you'll be greeted by the grub menu that looks like the following.
From here you have several options, you can run memory tests, boot into existing OS's or install Arch Linux. Lets choose that option.

.. image:: {static}/images/arch_grub.png
   :alt: grub arch screen


root@archiso ~ #
^^^^^^^^^^^^^^^^

.. image:: {static}/images/arch_root.png
   :alt: arch_root

Ok so now assuming you have internet access you can acccess the installation wiki by typing in **installation_guide** and reading along. You are now in whats commonly referred to as the 'live' (on usb, cd or ram) environment. From here we will be provisioning our system to run Arch Linux.

**Alt-F1,F2,F3...** are shortcuts you can use this to *swich* to alternate terminals to run other commands and return to reading the wiki.

Partitioning your disk(s)
^^^^^^^^^^^^^^^^^^^^^^^^^

As with most Linux installations your going to have to partition your disk. There are a number of tools at your disposal in the *live* environment that you can use to-do this.

**lsblk** listing the block devices that you have available will help you find the right names for your drives. Lets take a look at what we have available.

.. code-block:: bash

   root@archiso ~ # lsblk
   NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
   vda         259:0    0    40G  0 disk

Your entries may look different depending on if you have SATA, NVMe drives. Once you spot the drive that you want to use, you can proceed to the partitioning.

Note: that your disk will likely be named: ``/dev/sd*`` or ``/dev/nvme``, mine in the examples are ``/dev/vda`` since I'm installing it in a VM since I'm already running Arch, and not installing it again while doing this tutorial.

Partitioning
%%%%%%%%%%%%

Unless you have a specific use-case, you can just use a pretty generic parititioning scheme that I will outline below.

You will *need* a ``/boot`` (optional if your system will only have Linux installed), ``/`` (root) and ``swap`` partition at the very least. You may also want ``/var``, ``/tmp`` and ``/home`` on their own partitions.

As a minimum, you will want to have at least **256MB** for your ``boot`` partition, **512MB** for your ``swap`` and the rest of your disk for your ``/`` (root).

**cfdisk** and **fdisk** are available for your partitioning needs, use whichever you like. I'll show some screenshots of the parititon process with **cfdisk** since I generally just use that.

.. code-block:: bash

   cfdisk /dev/vda

Select the gpt label type.

.. image:: {static}/images/arch_cfdisk1.png
   :alt: cfdisk gpt

.. image:: {static}/images/arch_cfdisk2.png
   :alt: making partitions

You will want to select "New" on your free space, and create your ``boot`` partition, and enter the size you want. Repeat this for your ``swap`` and ``/`` (root) filesystems.

Once you've got those created, select "Write", and then "Quit" and we can move onto formatting those partitions and mouting them for the installation. You should have something like the following:

.. image:: {static}/images/arch_cfdisk3.png
   :alt: partitioned

Lets run **lsblk** again to see our paritions.

.. image:: {static}/images/arch_lsblk.png
   :alt: lsblk showing new partitions

Now you can see the partitions that we created, now lets format them appropriately.

Formatting and turning on the Swap
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

Firstly lets format our boot partition as **vfat** (since I also have a Windows partition that can use the same bootloader).

.. code-block:: bash

   mkfs.vfat /dev/vda1

Now we can format our ``swap``.

.. code-block:: bash

   mkswap /dev/vda2

And finally our ``/`` (root).

.. code-block:: bash

   mkfs.ext4

OK, with the parititions made, we just need to *turn on* the swap and we are ready to mount them for installation.

.. code-block:: bash

   swapon /dev/vda2

We haven't done anything out of the ordinary so far that wouldn't be done already by a regular OS installation. Remember to use your own device names and not the *vda* devices listed above.

Mounting the filesystems
%%%%%%%%%%%%%%%%%%%%%%%%

Firstly we will mount the root filesystem directly to ``/mnt``, creat the "boot" directory and then mount the ``/boot`` partition in there with the following commands.

.. code-block:: bash

   mount /dev/vda3 /mnt
   mkdir -p /mnt/boot
   mount /dev/vda1 /mnt/boot

Verify that you have the partitions mounted properly with something like:

.. image:: {static}/images/arch_mount.png
   :alt: mount | grep vda

Installation starts!
^^^^^^^^^^^^^^^^^^^^

Now the actual "installation" starts as in packages get fired onto your disk. And you get to start making some choices (or in this case see the ones I've made for my use-case).

Which editor to use?
%%%%%%%%%%%%%%%%%%%%

I chose `nvim <https://neovim.io>`_, but you can use whatever editor you want, choose one that your at least familiar with and confortable editing files from the command line with.

Boot strapping
^^^^^^^^^^^^^^

We will now bootstrap the installation. Installing the bare minimum required to get the OS installed (you can further tweak this later as well).

.. code-block:: bash

   pacstrap /mnt base linux linux-firmware neovim grub efibootmgr

This installs the Linux `Kernel <https://kernel.org>`_ the firmware packages used by most hardware and GPU's along with a minimal set of tools used to strap together a minimal Linux system and Grub (our bootloader, optional if you want to install a different one).

Once that is finished you should see something like: 

.. image:: {static}/images/arch_pacstrap.png
   :alt: pacstrap'ing a system

We can check now to make sure everything got installed correctly into our filesystem by checking out what got installed in ``/mnt``.

.. image:: {static}/images/arch_mnt.png
   :alt: ls /mnt

fstab
*****

Now we will populate `/etc/fstab`, the Arch team have provided a handy utility called `genfstab` that we can use for this.

.. code-block:: bash

   genfstab -U /mnt >> /mnt/etc/fstab

We can make sure our entries correctly got added to the `/mnt/etc/fstab` by looking at it as follows.

.. image:: {static}/images/arch_fstab.png
   :alt: /etc/fstab

Looks good, those are the partitions I setup earlier.

Chroot'in
*********

Now we will play with our toy Linux system **FROM WITHIN**. If you're not familiar with chroot'ing it's a jailed environment that cannot **see** outside of it's jail. We do this now to tweak our installation without having to boot into it yet.

.. code-block:: bash
   
   arch-root /mnt

Again the Arch team have provided a custom utility for doing this (you could also use regular **chroot**, but you'd have to mount some extra things).

You will notice your prompt change, this is to indidcate that you are now operating from within the *chroot*.

.. image:: {static}/images/arch_chroot.png
   :alt: arch-chroot

The rest of these commands unless noted, will be run from within the chroot.

Setting TimeZone
^^^^^^^^^^^^^^^^

Since I'm in Halifax, I'm setting that TimeZone, but set whatever is appropriate for you.

.. code-block:: bash

   ln -sf /usr/share/zoneinfo/America/Halifax /etc/localtime
   hwclock --systohc

Setting your locale
^^^^^^^^^^^^^^^^^^^

.. code-block:: bash

   echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
   locale-gen
   echo "LANG=en_US.UTF-8" > /etc/locale.conf

DNS and Networking
^^^^^^^^^^^^^^^^^^

To find out which network interfaces you have, you can run the following command.

.. code-block:: bash

   ls /sys/class/net/

You will use this device name (not ``lo`` since this is the loopback device) in the following section.

Local DNS
%%%%%%%%%

.. code-block:: bash

   echo "archbox" > /etc/hostname
   cat << EOF > /etc/hosts
   127.0.0.1 localhost
   ::1 localhost
   127.0.1.1 archbox.localdomain archbox
   EOF

Wired Networking
%%%%%%%%%%%%%%%%

The following section sets up DHCP networking for the interface we found above. And I put in my DNS server's address there, yours will be different so keep that in mind.

.. code-block:: bash

   cat << EOF > /etc/systemd/network/20-wired.network
   [Match]
   Name=enp6s0

   [Network]
   DHCP=yes
   DNS=192.168.2.16
   EOF

Root password
%%%%%%%%%%%%%

Finally setting a **root** password with the following command.

.. code-block:: bash

   passwd

Grub (bootloader) on /boot
**************************

There are many choices here, I went with `Grub2 <https://www.gnu.org/software/grub/>`_ since it's the one I'm most familiar with and have used it for years, if you want to use a different one refer to the wiki. However the steps are likely very similar.

Since we installed **grub** with the **pacstrap** command above and mounted our `/boot` partition earlier, we need only run the following command to install our bootloader.

.. code-block:: bash

   grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
   grub-mkconfig -o /boot/grub/grub.cfg

That's it
*********

**CTRL-D (exits chroot) && shutdown -r now (reboots)**

Reboot and your running Arch.

.. image:: {static}/images/magic.gif
   :alt: MAGIC

You may be asking, where's my *graphix*, well now you get to choose which Desktop environment, Window manager and login manager if any that you want to use. What we have here is called **bare bones** system. From here you could run a minimalistic server configuration, create a cloud image, setup a gaming machine or all of the above.

Generally you don't get to make these decisions when installing other distro's, and this is the reason I recommend having an opinion or goals prior to installing Arch.

While it is possible to install just about every DE / WM available out of the box, it's nice to actually get to choose which one you want to run rather than leaving that decision upto the distribution maintainers that may have been trying to solve different problems than you.

My installed packages
*********************

I generated this list with **pacman -Qqe**

.. code-block:: bash

   alacritty
   alsa-utils
   amd-ucode
   amdvlk
   amfora
   arandr
   ardour
   asp
   aspell
   atom
   autoconf
   automake
   autorandr
   awesome-terminal-fonts
   base
   bc
   bdf-unifont
   bind
   binutils
   bison
   bpytop
   cadence
   carla
   chromium
   cmake
   cmus
   deluge
   deluge-gtk
   devtools
   discord
   dmenu
   dmidecode
   dnsmasq
   docker
   dwarffortress
   ebtables
   edk2-ovmf
   efibootmgr
   electrum
   evemu
   fakeroot
   feh
   figlet
   firefox
   fish
   flameshot
   flatpak
   flex
   freerdp
   fzf
   gamemode
   gcc
   gdb
   gimp
   git
   glances
   glmark2-git
   glu
   gource
   goverlay-bin
   groff
   grub
   gst-plugins-bad
   gst-plugins-base
   gst-plugins-good
   gucharmap
   i3-gaps
   i3blocks
   i3lock
   i3status
   inetutils
   jack2
   jack_mixer
   joyutils
   lib32-amdvlk
   lib32-vkd3d
   lib32-vulkan-radeon
   libnotify
   lightdm
   lightdm-gtk-greeter
   linux
   linux-firmware
   linux-zen
   linux-zen-headers
   lshw
   lsof
   lua
   lutris
   m4
   make
   man-db
   man-pages
   mangohud
   mangohud-common
   meld
   mesa
   mpv
   namcap
   neofetch
   neovim
   nfs-utils
   noto-fonts
   noto-fonts-emoji
   ntp
   nut
   obs-studio
   optipng
   os-prober
   pacman
   pacman-contrib
   pacutils
   pamixer
   patch
   pavucontrol
   peek
   perl-anyevent-i3
   picom
   pipewire-alsa
   pipewire-jack
   pipewire-pulse
   pkgconf
   pkgstats
   powerline
   powerline-fonts
   powertop
   psensor
   py3status
   pyenv
   pyside2
   python-dephell
   python-google-auth
   python-google-auth-oauthlib
   python-pip
   python-pygithub
   python-pynvim
   python-rich
   python-tzlocal
   qemu
   qjackctl
   radeontop
   ranger
   rdesktop
   retext
   ripgrep
   rofi
   ruby-manpages
   ruby-rainbow
   scrot
   sdl2_ttf
   sensors-applet
   shellcheck
   spice-protocol
   steam
   strace
   strawberry
   sudo
   texlive-bibtexextra
   texlive-core
   texlive-fontsextra
   texlive-formatsextra
   texlive-games
   texlive-humanities
   texlive-latexextra
   texlive-music
   texlive-pictures
   texlive-pstricks
   texlive-publishers
   texlive-science
   texstudio
   texworks
   thunderbird
   tk
   tmux
   ttf-font-awesome
   ttf-hack
   ttf-inconsolata
   ttf-nerd-fonts-symbols-mono
   ttf-roboto
   ttf-roboto-mono
   ueberzug
   unrar
   usbutils
   virt-manager
   vkd3d
   vlc
   vulkan-mesa-layers
   vulkan-tools
   vulkan-validation-layers
   w3m
   weechat
   wget
   which
   wine
   wine-gecko
   wine-mono
   wireplumber
   xclip
   xf86-video-amdgpu
   xmlto
   xorg-server
   xorg-xinit
   xorg-xkill
   xorg-xrandr
   zip

But I'll leave you with this. Learn to use **pacman** since it's Arch's package manager, and it does a great job of resolving all the dependencies between packages.

Let me know what you install!
