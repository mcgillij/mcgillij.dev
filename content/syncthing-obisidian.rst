Setting up Syncthing and Obsidian
#################################

:author: mcgillij
:category: Linux
:date: 2022-11-26 15:49
:tags: Linux, Obsidian, Syncthing, Onyx, Boox, Android
:slug: syncthing-obsidian
:summary: Setting up Syncthing and Obsidian on a Boox Onyx, Android phone, Linux desktop and Server
:cover_image: books.png

.. contents::


I was getting frustrated with the constant spam from google about running out of space in my drive / gmail and the spam for google one (which I had a year free from when I got my Chromebook, now I get spammed for life it seems)?

Trying to put an end to also emailing myself files to share between my phone and desktop and vice versa.

I wanted to find a sync'ing solution in place that wouldn't rely on `Google <https://google.com>`_ or `Dropbox <https://dropbox.com>`_ and that I could self-host on my own server.

Plan
^^^^

.. image:: {static}/images/syncthing_plan.png
   :alt: Syncthing Plan
   :width: 100%

Ultimately I wanted to be able to write notes on my tablet or phone and have them sync to my desktop and server from where I could do some better formatting in the `Obsidian <https://obsidian.md>`_ desktop client for organization.

This would allow me to take notes either while working or out and about, and then fine tune them later when I get back to my workstation.


The Requirements
^^^^^^^^^^^^^^^^

The requirements were a short list:

- Self-hosted on my Linux server
- Work on my Pixel phone
- Work on my Boox Onyx
- Work on my Linux desktop

After doing a bit of research, all signs pointed to `Syncthing <https://syncthing.net/>`_. I could have used `NextCloud <https://nextcloud.com>`_, but it seemed a bit overkill for what I was trying to do.

The Setup
^^^^^^^^^

I opted for using **docker** images with **docker-compose** even though Syncthing was available in the Arch Linux repositories, since I didn't want to end up with version mismatches on my Debian server. This allows me to run the same versions on the desktop and on the server.

Setting up the server and desktop
*********************************

I used the following *docker-compose.yml* on both the server and desktop machines:

.. code-block:: yaml

   ---
   version: "2.1"
   services:
     syncthing:
       image: lscr.io/linuxserver/syncthing:latest
       container_name: syncthing
       hostname: syncthing #optional
       environment:
         - PUID=1000
         - PGID=1000
         - TZ=America/Halifax
       volumes:
         - /home/j/syncthing/appdata/config:/config
         - /home/j/syncthing/data1:/data1
         - /home/j/syncthing/data2:/data2
       ports:
         - 8384:8384
         - 22000:22000/tcp
         - 22000:22000/udp
         - 21027:21027/udp
       restart: unless-stopped

This basically the default configuration, with my home directory specified in the volumes.

From there you can access the web interface at http://localhost:8384 and add the devices you want to sync with.

Note: Make sure you setup password authentication, since by default the web interface isn't protected by anything.

Setting up the Android phone and tablet
***************************************
I installed the Android app on both the phone and tablet and set it up to sync with the server by pasting the **device-ids** which are found once you start up the application. And from there you can setup the folders that you want to sync.

The Android app is available on the `Google Play Store <https://play.google.com/store/apps/details?id=com.nutomic.syncthingandroid>`_.

Obsidian for notes
******************

Now all that was left was to get my Obsidian vault created in one of the shared folders and the replication was now happening between all the devices.


Conclusion
**********

Now I have a sync solution in place that avoids the usage of any cloud resources, and sync's to my own server and desktop (even when I'm not on my personal network, since Syncthing can use a `stun server <https://www.3cx.com/pbx/what-is-a-stun-server>`_ to get access from the internet). While requiring little more configuration than a Dropbox or Google Drive (in Linux this still sucks). And I can load it up with way more than 2 gigabytes of files if required.

However I am still *on-the-hook* for backups, which I already have in place to a certain extent.
