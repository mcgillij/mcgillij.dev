ssh-copy-id
###########


:author: mcgillij
:category: Linux
:date: 2021-01-04 14:49
:tags: Linux, SSH, #100DaysToOffload
:slug: ssh-copy-id
:summary: More commands that I didn't know about
:cover_image: encryption.png

.. contents::

Usually when setting up SSH key access between boxen I'm manually copying over public keys like some kinda sucker. But recently I've found out about ``ssh-copy-id`` and it's pretty helpful.


Usage
*****

All you need is to already have your SSH id generated on your main workstation and to have password access to your destination. Then you can run the following command to get your SSH public key copied to the destination box.

.. code-block:: bash

   ssh-copy-id destinationbox

That's all, your keys now setup on the destination box.

**~/.ssh/config**
*****************
You can add a similar block to your SSH config so you can just ``ssh destination`` to login automagically.

.. code-block:: bash

   Host destination
   	HostName destination
   	User j
   	IdentityFile ~/.ssh/id_rsa

