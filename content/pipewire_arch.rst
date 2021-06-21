Pipewire one sound dilly to rule them all?
##########################################

:author: mcgillij
:category: Linux
:date: 2021-06-03 22:49
:tags: Linux, Sound, Pipewire, PulseAudio, Alsa, OSS, #100DaysToOffload
:slug: pipewire-in-arch
:summary: Taking a peek at Pipewire, to see if it's really the dragon slayer of Linux sound?
:cover_image: pipewire.png

.. contents::

Brief history of sound in Linux
*******************************

In the early days first there was OSS (**Open Sound System**), while it has "open" in the name it became quite proprietary.

Eventually dumped out of most Linux distributions in favor of ALSA (**Advanced Linux Sound Architecture**).

As more and more people started using Linux professionally Jack (**Jack Audio Connection Kit**) came about and filled in the gaps allowing professional recording and audio re-routing.

Then came *PulseAudio* to add yet another standard to the mix fixing exactly nothing and breaking everything.

And it's been a mixed landscape of sound systems for quite sometime now.

Now we have **Pipewire** coming into the mix with the promise to fix all the sound issues we've ever had and slay all of the dragon's that are held in the Linux sound scape. I'm attempting to find out if it's actually usable these days on Arch as my testbed.

- `OSS <http://www.opensound.com/index.html>`_
- `ALSA <https://alsa-project.org/wiki/Main_Page>`_
- `Jack <https://jackaudio.org/>`_
- PulseAudio (No link intentionally)
- `Pipewire <https://pipewire.org/>`_

Open Sound System, the not so open API
**************************************

*OSS* for the most part worked, as for as much as I was trying to do at the time anyways. I wasn't much into recording or streaming or re-routing audio from different applications, but it was simple enough to get most sound hardware available at the time working with this in Linux. But as soon as it was even moderately successful, it updates were closed sourced and most of the support was dropped in the 2.5 Linux Kernel release in favor of *ALSA*.

ALSA
****

The transition wasn't pretty, at least for me I had to frig around quite a bit to get my sound working on several machines. But it could have been from my inexperience with the new tools at the time, as I had essentially just updated my kernel and now my sound had stopped working. Over the years, I became familiar with the tooling and the support for audio hardware was almost ubiquitous and I never had to think about it again, or so I thought anyways.

Jack-D
******

Getting into Guitars and recording, having to setup various sound devices, creating effects chains and loops, I needed something to route the audio to and from different applications.

*Jack* to the rescue, a great system working in conjunction with *ALSA* to provide the functionality. *Jack* for the most part always worked quite well for me, and I never had many issues with it. Although it's not really for the casual Linux user as generally you will need to muck around with some real-time settings in your kernel and user/group permissions to get the best performance if your trying to do real-time DSP or effects processing. However for regular users this is never required. Jack was largely optional to the Linux sound landscape. However it did work quite well.

PulseAudio
**********

If there was ever an application that no one asked for or needed, here we have PulseAudio coming in as a "sound server" to relay everything through it, be it from ``aRts, ESD, OSS, ALSA`` etc...

It failed miserably, and lead to quite possibly thousands of people not using Linux due to their sounds not being configurable or usable with PulseAudio due to the sheer amount of garbage you had to go through to get it up and running in the early phases where it was be pushed aggressively by most distributions. And sure it kinda works today, but were talking about 16 years of a Linux sound shit-show due to this piece of software. But hey it supports networked sound... Anyways hopefully *Pipewire* can kill this dragon.


Pipewire
********

Is this the dragon slayer we've been waiting for? I certainly hope so. PulseAudio cannot die soon enough. *Pipewire* aims to fill in for *Jack* and Pulse in the Linux sound landscape. And I mean if it can get rid of Pulse it will have won in my books. However Pipewire aims to also work on video / screen sharing and Wayland support along with pushing the Flatpak agenda and routing sound and video to those applications as well. But all that doesn't matter as long as it can get of PulseAudio for me ;)

Below I'll go over whats required to get up and running in Arch Linux with Pipewire.

Getting rid of Pulse
********************

This one's easy:

.. code-block:: bash

   pacman -R pulseaudio

Just make sure to mash the ``[Return]`` key very hard.

Installing Pipewire
*******************

Also easy, I'll list some helpful packages and go over what they do afterwards.

.. code-block:: bash

   pacman -S pipewire pipewire-jack pipewire-pulse qjackctl

This will get essentially "pro-audio" working now in Linux, allowing you to re-route audio at low latency to your hearts content.

- **pipewire**: you guessed it pipewire.
- **pipewire-jack**: this allows you to load the pipewire libraries instead of Jack libraries when calling applications that depend on Jack running. Allowing you to do some interesting stuff with pipewire like:

.. code-block:: bash

   pw-jack carla
   pw-jack qjackctl
   pw-jack cadence

`AUR repo <https://aur.archlinux.org/packages/pipewire-jack-dropin/>`_ if you don't like pre-pending the **pw-jack** command (pipewire-jack-dropin). This allows pipewire to pretend as if Jack's running and allows you to continue using the interfaces that your already familiar with. This is some pretty neat stuff.

- **pipewire-pulse**: similarly this allows tools like **pavucontrol** and other pulse tools to work in controlling pipewire.
- **qjackctl**: this is what I usually use for my audio routing with Jack, however thanks to *pipewire-jack* I can keep using it while having the different backend.

.. figure:: {static}/images/qjackctl.png
   :alt: screenshot of qjackctl

Configuration
*************

You can configure pipewire using */etc/pipewire/pipewire.conf* however it worked out of the box for me without any configuration at all.

Conclusion
**********

Just install it, it works. If you don't have any issues with Pulse, you can disregard this whole thing. I just think it's been a blight on the Linux community for far too long and I'm glad the dragons dead "Long live Pipewire!".

