35 mins to Arch
###############

:author: mcgillij
:category: Linux
:date: 2021-03-29 14:49
:tags: Linux, Arch, py3status, #100DaysToOffload, Python
:slug: 35-mins-to-arch
:summary: 35 minutes from release to Arch
:cover_image: arch.png

.. contents::

Bleeding Edge or Stability?
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Some people (myself included) enjoy the stability of Linux. Certain distributions bring this to another level see `Debian <https://debian.org>`_ for a lesson on stability, used as a basis for countless other distributions. I've used Debian for a very long time, and still do on my server.

Over the Xmas holidays I built a new workstation and decided to give `Arch Linux <https://archlinux.org>`_ a chance since for many years I'd actually started to hear some 'good' things about it. Ever curious I decided it would be a decent opportunity to install it on my system. **Spoilers** I didn't even know that the installer was essentially just a wiki page... That's how much research I'd done on the project before-hand. The installation took roughly an hour and went smoothly. Anyways this isn't what this is about.

A number of times I've written about the switch here:

- `Installing Arch Linux </arch-after-debian-part1.html>`_
- `pacman vs apt/dpkg </pacman.html>`_
- `Building AUR's with a chroot </aur-with-chroot.html>`_
- `Dwarf Fortress in Arch </dwarf-fortress-in-arch.html>`_

4 months later
^^^^^^^^^^^^^^

Still running Arch on my workstation, and it's been quite pleasant. No issues so far. However I was impressed by how quickly changes were getting into the distribution. I didn't really have any **metric** to go by, maybe just the frequency of the updates (not only application, but also Kernel updates) that were finding their way onto my system at best this was a guesstimate.

   Note: I used to run Debian **unstable and experimental** on my systems. However I mostly stick to **Testing** for workstations.

A new issue!
^^^^^^^^^^^^

A couple weeks ago, I ran into an issue with `py3status <https://github.com/ultrabug/py3status>`_ while writing a module for it `py3status-http-monitor <https://github.com/ultrabug/py3status>`_. I've written a few other modules that didn't run into any issues, and managed to get them working as Arch packages (AUR) as well.

A little background not that it's important. Py3status has 3 supported ways to load modules.

1. Built-in modules
2. User modules (**~/.i3/py3status/**)
3. Python environment (pip installed modules, or AUR, apt etc)

I wanted users to be able to install the AUR or PyPi package and have the module be loadable by Py3status. As it's not recommended that AUR's or Arch packages for that matter write files to the users **$HOME**.

And I wasn't super interested in trying to get my modules merged into the built-in Py3status modules.

Only option left was creating a Python module, pushing it to `PyPi <https://pypi.org/project/py3status-http-monitor/>`_ for anyone to install and have Py3status pick it up when configured properly.

This was the case for my other modules: `py3status-cpu-governor <https://pypi.org/project/py3status-cpu-governor/>`_, `py3status-ups-battery-status <https://pypi.org/project/py3status-ups-battery-status/>`_ and `py3status-github-notifications <https://pypi.org/project/py3status-github-notifications/>`_.

They all loaded up correctly when loaded from PyPi or AUR. But for some reason my HTTP monitor wasn't working as expected.

If I loaded up a single instance of the HTTP monitor, it would work correctly. However it's created in a way that you can call it several times for different services that you would like to monitor.

.. image:: {static}/images/status_bar.png
   :alt: Image of the http monitor.

Digging deeper (And why I love open source)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The *http* module would load perfectly fine, when copied into the built-in modules and loaded that way. Would also work fine when run from the *User* modules.

When installed as a System Python package via `pip` or package manager there were errors. And there were only issues if it was loaded multiple times with different parameters (something supported by the other 2 installation methods).

Py3status being open source and hosted on Github, I snagged a copy of the code and started reproducing the issue locally. Finally when it was clear it wasn't just some crazy issue that I had on my system or my own ineptitude. I put in an issue ticket for it with the project. And the next day I had a quick patch and **pull request** up for fixing the issue.

My pull request was eventually closed in favor of an easier fix by someone who was actually familiar with their codebase, which is fine since I just wanted the issue fixed.

Turns out that the bug was valid, and that not many people make re-usable modules that are distributed as python or system packages, so it slipped through the cracks till I was messing with it.

Now we wait
^^^^^^^^^^^

At this point I had already built up a patched version of py3status for my system, but this issue was blocking my "release" of the http monitor module, since I didn't want to have something out there that you could install but wasn't working right.

Fast forward to the next Py3status release
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

So a couple days ago, I ran my daily `pacman -Syu`, for those not in the know, that's a system update in the Arch world. And oh shit, new version of py3status! I wonder if it has the fix I needed. So I look at the version, hop onto Github to check the release... OK the numbers match the latest release, great. That's when I noticed it.

**35 Minutes ago** the release was created.

Props to the Arch maintainers, even on Debian unstable, I'd have waited likely weeks before this would have even been built.

Granted, it could have been even quicker. As I don't have my update service chain spamming looking for updates.

Finally I was able to push my packages to PyPi and push to the AUR for my new py3status module.

Bleeding edge
^^^^^^^^^^^^^

Py3status falls under the 'community' packages, which I assume don't have as rigorous testing / stability requirements as the main packages. However as someone actively developing a module for it, I was super pleased at the turn-around time.

After a while you get desensitized to how well open source actually "just works". And sometimes you're reminded how great it is as well.

If it only takes 35 minutes to get a fixed release from Github to my system through the proper channels. And how infrequent there are breaking bugs. Is there a down side to living on the bleeding edge? Technically yes... but for a home workstation I think the risk is acceptable for me at least.
