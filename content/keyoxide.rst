KeyOxide
########

:author: mcgillij
:category: Encryption
:date: 2021-01-17 23:49
:tags: Encryption, Identity, Federation, #100DaysToOffload
:slug: keyoxide
:summary: Setting up KeyOxide for DNS, Github and Mastodon
:cover_image: encryption2.png

.. contents::

Why cryptography?
*****************

In a time when we have such non-sense going on in the world, wouldn't it be nice to actually know if who your talking to is who they claim to be? Cryptographers have long solved this problem, but cryptography doesn't have a great marketing...

Public key encryption
*********************

For when you need to verify that the person your talking to over the internet actually is that person.

PGP / GPG, have been synonymous with encryption and digital signatures for as long as I can remember, and generally you would just push your key to a key server and be done with it, and assume people can query it if they need to find your public key. However there seems to be a new service in place now called `keyoxide <https://keyoxide.org>`_ that allows you to show those claims without having to try to explain it to someone by getting them to run some commands in a terminal.


Claims and Proof
****************

Now with KeyOxide you can "prove" that you are (or control said resource / account etc) by publishing encrypted verifiable claims. This is pretty neat, but it's easier to visualize than explain I guess.

.. figure:: {static}/images/keyoxide.png
   :alt: keyoxide screenshot

   Verified Claims

Encrypted Email
***************

One of these applications that we deal with every day is with email. Usually the process of getting someone's public key involves logging into a key server via the command line, and running some commands that most people have no idea what the heck is going on with. KeyOxide makes this process pretty painless now, as they can send messages directly from here. Or by retrieving my public key from the site, and using it with your favorite mail client.

This makes it fairly trivial to send me an encrypted email now that only I can (and some other folks if they have a couple universe heat deaths worth of time to decrypt) read.


Who makes this?
***************

Some clever fella named Yarmo, you can find the code at `https://codeberg.org/yarmo <https://codeberg.org/yarmo>`_


Trust
*****

What if you don't trust this Yarmo guy from the internet, well you can self-host your own copy of keyoxide if you like, and the code is open source under the AGPL-v3 license.
