X Forwarding
############

:author: mcgillij
:category: Linux
:date: 2021-09-14 19:49
:tags: Linux, X, SSH, #100DaysToOffload
:slug: x-forwarding
:summary: Just a quick overview of how to setup X Forwarding
:cover_image: links.jpg

.. contents::

Why would I want to foward X in 2021?
*************************************

It's 2021 shouldn't we have flying cars by now? Why the heck would I want to be forwarding X sessions now?

- Do you do lots of work on a server on your LAN or Remote?
- Have many VM's, or "work" VMs?
- Like separation of concerns?
- Cross compiling applications?
- Want to separate your work browser from your home browser?
- Want to setup a Ghetto `Qubes <https://www.qubes-os.org/>`_

There are any number of scenarios that can arise for needing or wanting todo xforwarding.

It's dead simple to setup and use, and I'll cover that below.

Focusing mainly on the browser use-case as an example below. But you could using the exact same configuration forward any GUI application over SSH.

Working from home
*****************

Lots of us tech workers are working from home due to the pandemic etc. (I've also worked from home for 12 years prior to the pandemic, making me somewhat of an expert in doing work stuff on my personal machines while keeping all the work setup separate).

In my setup, I usually have a semi-decent workstation, along with a server (usually on my LAN, with a bunch of Linux VM's to spin up various development environments).

My setup may not be typical, however many of the lessons can be applied to a single machine environments as well. And with how powerful single CPU's are getting these days needing a server to off-load or cross compile things is slowly getting phased out anyways.

SSH not just for terminal applications
**************************************

X Forwarding allows running separate browser instances(IDE, terminals, anything with a GUI) over `SSH <https://www.openssh.com/>`_, sometimes even from remote machines and/or compartmentalized Virtual Machines.

Now while I can also just **rdesktop**, **xfreerdp**, VNC, virt-manager console to those machines and get the **full** desktop environment accessible.

Having a whole'nother desktop accessible is nice but also cumbersome, when what I really want is just a **seamless** application that happens to be running in a different environment. 

Example:

.. image:: {static}/images/xforwarding.png
   :alt: xforwarding

In the above example, while I have 2 `Firefoxes <https://www.mozilla.org/en-CA/firefox/products/>`_ open, and they do look similar. The top instance is my personal Firefox running locally, and the other is running from inside a "work" Virtual Machine(not using any fancy seamless mode from virtualbox or VMWare, just xforwarding).

This allows me to have 2 totally different sets of plugins installed on different Firefox instances, and in no way can I mix them up. Since I only have the LastPass (only used for work) setup on my work browser. And I use BitWarden locally for my own usage. 

Allowing for great separation of concerns and the simplicity of not needing to manage a whole'nother desktop environment just to get the browser working.

Couldn't I just run 2 different browsers?
*****************************************

Kinda, you totally could just setup say something like Chromium and just use that, but for my use-case, my "work" firefox ends up having to be VPN'd to our Corporate development LAN. Thus it actually needs a separate connection VPN'd (which I enjoy just having running in my VM).

Anyways enough about my use-cases onward to the configuration.

Configuration
*************

Client (local)
^^^^^^^^^^^^^^

Locally you have a couple options, if you are manually typing out your ssh connection string all you need todo is add the **-X**.

Example: 

.. code-block:: bash

   ssh -X j@workvm
   ssh -X mcgillij@debianvm
   ssh -X totallylegituser@192.168.100.20

Alternatively if you use **~/.ssh/config** add the following line to the host your going to be using X Forwarding from.

.. code-block:: bash

   ...
   Host totallylegithost 
     ForwardX11 yes
   ...

Server (remote)
^^^^^^^^^^^^^^^

The below lines are likely already in your configuration, they just need to be uncommented. Once that's done you'll need to restart your **sshd** server with something like ``systemctl restart ssh``.

**/etc/ssh/sshd_config**

.. code-block:: bash

   X11Forwarding yes
   X11DisplayOffset 10
   X11UseLocalhost no

That's It
*********

Now any gui application that you will start will automagically get forwarded to your local X session (you can even do this from Windows if you happen to be running an X server on there).

It sometimes feels weird typing `firefox` on a remote machine, but you get used to it :)
