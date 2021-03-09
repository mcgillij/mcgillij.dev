weechat and tmux for remote IRC
###############################

:author: mcgillij
:category: Linux
:date: 2021-03-09 17:49
:tags: Linux, IRC, Terminal, weechat, tmux, #100DaysToOffload
:slug: weechat-tmux-remote-irc
:summary: Quick setup for persistent weechat with tmux and systemd
:cover_image: weechat.png

.. contents::

IRC in 2021?
************

Who in their right mind is using IRC in 2021? Seems like it's still quite popular at least in some circles. Think of it as **Slack** for open-source projects. And if you need some help or want to contribute to some open source projects it's quite often the fastest means of communications.

Weechat
*******

There are many great Linux IRC clients, however today I'm going to be going over how to setup `weechat <https://weechat.org/>`_ with `tmux <https://github.com/tmux/tmux/wiki>`_ (terminal multiplexer). This combination will allow you to have a persistent IRC session that you can attach / detach from.

Weechat isn't only an IRC client however as it supports multiple protocols, and has great scripting support in multiple languages (most importantly `Python <https://python.org>`_ and `Perl <https://perl.org>`_).

Tmux
****

WTF do I need a terminal multiplexer for you may be asking yourself. Well you don't "need" one, but it is convenient, even if you are just running **weechat** locally. However it's even more useful if you are running it remotely on a VPS / Server or Cloud box.

Why is it useful? If you want your connection to be persistent, even after "closing" your terminal by accident. Or rebooting your local machine, the IRC connection can remain persistent (assuming your server or VPS remains online).

This also allows you to re-connect to your session from anywhere in the world from other computers or phones (anything that would support terminal sessions really).

SystemD
*******

This is the abomination of an init system that we'll use to startup our **tmux'd weechat** sessions at server startup, since it's present in most of the modern Linux distributions.

Dependencies
************

Above we've covered the moving parts that we'll be configuring here. SystemD is likely already installed on whatever distro your using. Below are the commands you can use to install weechat and tmux if you need a hand with that.

Debian: 

.. code-block:: bash

   apt install weechat tmux

Arch:

.. code-block:: bash

   pacman -S weechat tmux

Creating your service
*********************

Now we will create our user systemd service that we will need to enable on our server/VPS for startup.

Add the following to ``~/.config/systemd/user/weechat.service`` (you will likely have to create this directory if it doesn't exist).

.. code-block:: bash

   [Unit]
   Description=Weechat with tmux
   
   [Service]
   Type=oneshot
   RemainAfterExit=yes
   ExecStart=/usr/bin/tmux -2 new-session -d -s irc /usr/bin/weechat
   ExecStop=/usr/bin/tmux kill-session -t irc
   
   [Install]
   WantedBy=default.target

Once created, you will need to enable and start the service. And you can do that with the following commands.

.. code-block:: bash

   sudo loginctl enable-linger $(whoami)
   systemctl --user enable weechat
   systemctl --user start weechat

Finally you can check on it to make sure everything's OK with the following command:

.. code-block:: bash

   systemctl --user status weechat

.. figure:: {static}/images/weechat_status.png
   :alt: weechat systemd status

   SystemD status of the **weechat** service

Now it may say **(exited)** there, but that's just cause the process is backgrounded. You should now be able to connect to your tmux session.

Connecting from anywhere
************************

Locally you can connect with the following command:

.. code-block:: bash

   tmux attach -t irc

You can then use ``ctrl-b d`` to detach the session.

If you are on a remote host, and you have **SSH** access you can connect with the following command:

.. code-block:: bash

   ssh <yourserver> -t tmux attach -t irc

Documentation
*************

Tmux and weechat both have a billion features and configuration options, that you can tune to your liking, however that's beyond the scope of this entry. I'll leave you with the links to the documentation on how to use either.

- `Weechat docs <https://weechat.org/doc/>`_
- `Tmux docs <https://github.com/tmux/tmux/wiki>`_
