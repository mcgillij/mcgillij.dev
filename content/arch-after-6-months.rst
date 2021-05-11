Arch Linux after 6 months
#########################

:author: mcgillij
:category: Linux
:date: 2021-05-11 19:49
:tags: Arch, Linux, #100DaysToOffload
:slug: arch-after-6-months
:summary: Recap / Review after 6 months of usage of Arch Linux
:cover_image: arch.png

.. contents::

What am I looking for?
**********************

- Modern Hardware support
- Simple packaging (creation and installation)
- Least amount of toying with the default configuration
- Easily manage development environments
- VFIO GPU passthrough for virtual machines

So Arch?
********

While, I like to keep an eye on whats happening in other distributions I'm not one to distro-hop much these days, since at the end of the day I still end up having to get some work done.

However over the Christmas holidays I snagged a new workstation, and it came time to install an OS on it. I toyed around a bit with a few distributions, just to make sure I wasn't **missing** out on anything of particular note.

There is some interesting work going on in a few of the modern distro's which I was interested in seeing.

- `NixOS <https://nixos.org/>`_: has a very interesting way to package everything.
- `Gentoo <https://gentoo.org>`_: **portage** has always interested me, but I don't have unlimited time.
- `Debian <https://debian.org>`_: I know this works, and is great.
- `Arch <https://archlinux.org>`_: **pacman** is it all it's cracked up to be?
- `Fedora <https://archlinux.org>`_: still haven't run any RedHat variant at home since version 5 maybe it's good now?

I've largely stuck to Debian as my primary home workstation driver for well over 20 years. But I figured with a new machine, time for a something a bit different possibly?

Each of the above distro's were considered and to a certain extent toyed with on my new workstation with varying degree's of success.

NixOS
^^^^^

A very interesting packaging structure, with everything being focusing on reproducibility and using a declarative language for it's configuration. This was almost what I ended up going with, and maybe in a couple years it will be. It just isn't there for me right now as most of my development work is done in `Python <https://python.org>`_. And the Python packaging situation on NixOS is a minor shit show to say the least. Things are getting better now with the advent of `Poetry  <https://python-poetry.org/>`_ however.

Gentoo
^^^^^^

Gentoo, is super fun, and I wish I was 20 years younger to be able to run this full time. I love absolutely everything about gentoo, from being able to specify at a package level compilation parameters for everything. Even being able to select filtering on which packages I can install based on the **licenses** in the event that I was super anal about which license the packages are released with. I enjoy that it puts the choice clearly back in the users hands. However the copious amount of compiling required to get even the base system up and running is a bit of a deal breaker for me, since I like to keep my packages updated quite frequently.

Debian
^^^^^^

My home since forever. But slow on the uptake for bleeding-edge packages and Kernels. Still my current choice of server OS.

Fedora
^^^^^^

Just no, not for me. I tried the new version (33 at the time, I know 34's out now with the fancy new Gnome40(0 fucks given)). Fedora's probably great for some people. I had to spend so much time just removing the pre-configured shit that I didn't need that it wasn't worth it for me.

However you want a really low maintenance distribution that feels like your at "work". By all means giver!

Arch
^^^^

Finally Arch, has been getting better and better over the years. And I remember when it was a trainwreck. However those days are long gone it seems.

With rolling updates (a mandatory feature these days for me at least), support for bleeding-edge Linux kernels.

Possibly the single most interesting package manager of the bunch **pacman**.

Lets not forget the best part the documentation: `Arch Wiki <https://wiki.archlinux.org>`_. It's a rare treat these days for documentation to actually be the exciting part but it actually is.

The wiki is regularly updated and has really become somewhat of a defacto standard for modern Linux documentation regardless of which distribution that your using.

What makes a distro?
********************

For me a distribution boils down to how it manages its packages and views on user choice.

Fedora's package manager is fine, but the enforced choice of software that come *pre-packaged* with it's OS is too much for me to deal with. However a great many people may actually find that to be it's greatest feature.

Gentoo offers an almost ridiculous amount of choice, but being a source distribution requires more time in compiling that I have time for even with a great new processor at my disposal.

NixOS will be great soon and I can't wait to try it out for longer. But it currently can't meet my requirements without jumping through many hoops to support the language that I love writing my applications in.

Arch strikes an almost perfect balance of great package management and hands-off approach to choice. As an Arch user, you can choose what you want to be running at every step of the way much like Gentoo, however you aren't **required** to compile all of the packages yourself (although you surely can if you really are into that).

With the addition of `AUR <https://aur.archlinux.org/>`_ it's hard to beat the available software in any distribution (although Nix's packages are getting up there!)

Arch specifics
**************

Since much of what you make of Arch is up to you. Everyone's experience will likely be different. Having to learn a new package manager is always kinda lame at the end of the day.

I've grown to appreciate **pacman**, even though I think it should probably be split into several independent commands.

If I had to describe Arch to someone using only 1 word, it would be **pacman**. It just does everything. I don't really think I've used anything else that's Arch specific (with the exception of a handful of commands to build Arch packages, that could then be installed and managed with *pacman*).

Some of the previous material that I've written on Arch/pacman since switching:

- `35 mins to Arch <https://mcgillij.dev/35-mins-to-arch.html>`_
- `Building AUR's with a chroot <http://mcgillij.dev/aur-with-chroot.html>`_
- `pacman coming from apt / dpkg <http://mcgillij.dev/pacman.html>`_
- `Installing Arch Linux blind after 20 years of Debian <http://mcgillij.dev/arch-after-debian-part1.html>`_

Enough about that, here's a couple more **pacman** nuggets.

pacman wtf changed
******************

If you ever wondered... Which config files have I modified on this system since I've installed it.

I call this one 'wtf changed'

.. code-block:: bash

   pacman -Qii | grep ^MODIFIED | cut -f2

   /etc/fstab
   /etc/group
   /etc/hosts
   /etc/issue
   /etc/motd
   /etc/passwd
   /etc/resolv.conf
   /etc/shells
   /etc/locale.gen
   /etc/default/grub
   /etc/libvirt/qemu.conf
   /etc/lightdm/lightdm.conf
   /etc/pam.d/lightdm
   /etc/mkinitcpio.conf
   /etc/nut/ups.conf
   /etc/ssh/sshd_config
   /etc/pacman.conf
   /etc/pacman.d/mirrorlist
   /etc/security/limits.conf
   /etc/X11/xinit/xinitrc

I don't think I would have been able to-do this as easily on Debian with any combination of *dpkg* and *apt*.

Is that from Arch or AUR?
*************************

Here's a simple one that I use quite often to remember if I have a package installed from Arch directly or from the AUR.

.. code-block:: bash

   pacman -Qm

   amdfan 0.1.9-1
   awesome-terminal-fonts-patched 1.0.0-2
   colortail-git 20160223.3b76525e-1
   cpufetch-git v0.94.r28.g7916e8c-1
   ebtables 2.0.10_4-8
   electron6 6.1.12-6
   inxi 3.2.01.1-1
   lagrange 1.3.0-1
   libglade 2.6.4-7
   progress-quest-bin 6.2-1
   protontricks 1.4.4-1
   py3status-amdfan 0.1.0-1
   py3status-cpu-governor 0.1.2-1
   py3status-github-notifications 0.1.0-1
   py3status-http-monitor 0.1.2-1
   py3status-ups-battery-status 0.1.2-1
   pygtk 2.24.0-12
   python-vdf 3.3-2
   python2-gobject2 2.28.7-6
   rpcs3 0.0.14-2
   ruby-clocale 0.0.4-1
   ruby-colorls 1.4.4-1
   ruby-filesize 0.2.0-1
   ruby-unicode-display_width 1.7.0-1
   slack-desktop 4.12.0-1
   syncplay 1.6.7-1
   tty-clock 2.3-1
   ucollage 0.1.0-2
   whalebird 4.3.1-1

The above will show you all the packages that you have installed from AUR sources. And if you want to see your regular packages you've install manually can use ``pacman -Qe``.

Finding dependencies
********************

I may have covered this in a previous entry, although I use this quite often to find the dependencies of certain packages. It's quite a simple one, but useful none-the-less.

.. code-block:: bash

   pacman -Qi amdfan

   Name            : amdfan
   Version         : 0.1.9-1
   Description     : Python daemon for controlling the fans on amdgpu cards
   Architecture    : any
   URL             : https://github.com/mcgillij/amdfan
   Licenses        : GPL2
   Groups          : None
   Provides        : None
   Depends On      : python  python-yaml  python-numpy  python-rich  python-click
   Optional Deps   : None
   Required By     : py3status-amdfan
   Optional For    : None
   Conflicts With  : None
   Replaces        : None
   Installed Size  : 33.04 KiB
   Packager        : Unknown Packager
   Build Date      : Sat 10 Apr 2021 09:21:25 PM ADT
   Install Date    : Thu 06 May 2021 10:57:51 PM ADT
   Install Reason  : Installed as a dependency for another package
   Install Script  : No
   Validated By    : None

Updating the mirrors
********************

Sometimes you just want to update the mirrors, this can be accomplished with ``pacman -Syy``, usually accompanied by a system update ``pacman -Syu``.

Again it's weird that one command has so much functionality, and flags and parameters however when you actually start using it, it's quite a blessing since there isn't this much functionality in just about any other tool out there.

Back to the review
******************

Enough about pacman and how awesome of a tool it is. We were speaking of Arch and reviewing a half year of usage with it. I'm still on the same installation. I update daily, and am quite impressed with the turn-around time for getting packages into the main distribution from the time of the upstream changes. I think you'd be hard pressed to find another distribution with such efficient pipelines. This is perfect for a desktop for a person that's willing to deal with bleeding edge bugs (however I haven't run into any so far honestly).

I'd likely not run Arch on my servers, mainly due to the amount of tooling that's already available for other distributions. That being said, if there was ever a modern desktop OS for me it's Arch Linux as it combines the functionality and ease-of-use of modern tooling and package management without compromising on user choice.

Lets touch back on this in another 6 months to see if I still feel the same way?

