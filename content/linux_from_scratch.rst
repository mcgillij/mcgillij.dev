Linux From Scratch again!
#########################

:author: mcgillij
:category: Linux
:date: 2021-05-09 17:49
:tags: Linux, LFS, review, #100DaysToOffload
:slug: linux-from-scratch
:summary: Taking a look at Linux From Scratch again whats changed in the last 20 years since I last ran through it?
:cover_image: penguin.png

.. contents::

Linux From Scratch re-review
****************************

I first took a look at Linux From Scratch `<https://www.linuxfromscratch.org/>`_ a little over 20 years ago. Back in a time when I was working at Open Source Directory. I'm pretty sure the book wasn't complete back then, and it definitely wasn't at a 1.0 release yet.

Some of the instructions were a bit rough around the edges back then and the packages were sometimes a bit of a chore to track down.

However the process was quite a bit simpler back then. Since then the Linux landscape has changed quite a bit.

Things still take forever to compile and test.

I'm not sure modern computers are any faster if we keep making software that takes longer and longer to compile.

I used the knowledge gained from LFS to make some of my first distro's to tinker with, and would later use that same skill-set at every other jobs since.

When I would have to create customized Linux distro's for various tasks and mediums Live-CDs, VPN's etc. `Knoppix <https://www.knopper.net/knoppix/index-en.html>`_ was a big help here as well at the time.

Past experience
***************

The machine I had used to first go over the initial release of LFS was an AMD-k6-2 400MHz, and I can't even remember how much RAM and storage it would have had, but I can't imagine it was much.

The setup and build took roughly the entire weekend, there was very minimal **tests** or **checks** in place, and a good many places that you could screw up the entire process that weren't documented overly well.

The experience was great, although I had already used Linux for  quite a bit of time at this point, there are always some packages that you see fly by on a console and wonder "what does that even do?".

LFS was a great introduction as to what's the bare minimum required to get up and running with a kernel and minimal user-land. And it included all the build tool chain required to bootstrap the OS with it's own compilers.


Modern day
**********

All the same rules still apply these days when bootstrapping an OS, the tools are all much more mature, have testing frameworks in places, ways to validate things are being build for the correct target architecture etc. However the steps remain consistently the same, adding a few dependencies here and there.

The book has a great many versions now (10.1 as of writing this), supplemental material for post-installation configuration and optional user contributions to address just about any scenario that you could imagine. It's quite interesting, and allows you to tinker with any number of interesting scenarios that would be possible on regular distributions, but would require almost as much work to execute as starting from scratch (literally).

Interested in building your own distro package managers, minimalistic distribution, changing init systems, the list goes on and really you can do anything with it since it's still a Linux system in the end. It's by far one of the best DIY platforms and tinkering playgrounds available still today.

You could install something like Gentoo and get a streamlined and bit more polished versions of this. However it's not starting you off from scratch, you are still running through someones choices for the most part with some of your own input.

Retrospective
*************

My goals back then were in learning more about the system I loved to use. And still today, it remains the same.

Back then I was able to create a distribution for my friends and I to use around the world, something I would have never imagined possible.

As for this weekends experiment, I'm not plotting to create a new distro or exploring any new concepts. But more revisiting an old book that I had such pleasure in reading through the first time and going through the process again.

This time LFS for me is being built from an Archlinux system, and will eventually live inside a VM for tinkering. I don't expect that I'll want to run this full time again as I did many years ago, but having a snapshot that I can recover from a base LFS should allow me plenty of tinkering opportunities for some future weekend projects that I have in mind.

Some people like Hockey, and that's fine. I like systems.
