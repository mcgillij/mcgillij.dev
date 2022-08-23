Sign your git commits with SSH instead of GPG
#############################################

:author: mcgillij
:category: Linux
:date: 2022-08-23 20:00
:tags: Linux, Git, Github, Signing, SSH
:slug: git-sign-commits-with-ssh
:summary: How to sign your git commits with SSH instead of GPG
:cover_image: battery.jpg

.. contents::

`Github announced today <https://github.blog/changelog/2022-08-23-ssh-commit-verification-now-supported/>`_ the ability to show signed commits from SSH, which is nice since it was a bit of a pain to sign with GPG (to be fair **git** has supported this for quite a while, Github just didn't show the signed commits properly).

However getting this setup involved a bit of trial and error on my part.

Here's the steps I ended up taking to get it working.

Setup Git to use SSH instead of GPG
-----------------------------------

First we need to configure git to use SSH keys instead of GPG to sign commits.

.. code-block:: bash

   git config --global commit.gpgsign true
   git config --global gpg.format ssh

Below we indicate which public keys are allowed to sign commits.

.. code-block:: bash
 
   git config --global user.signingKey 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMSsJjYL0PNE8/ahTdQXbiOS4Fdg/rY8pafH2YWjmpJM mcgillivray.jason@gmail.com'
   git config --global gpg.ssh.allowedSignersFile ~/.config/git/allowed_signers
   echo "mcgillivray.jason@gmail.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMSsJjYL0PNE8/ahTdQXbiOS4Fdg/rY8pafH2YWjmpJM" >> ~/.config/git/allowed_signers

Checking to make sure which private keys are loaded in your **ssh-agent**.

.. code-block:: bash

   cd ~/.ssh
   ssh-add -L

This was empty for me since I had previously **killed** my ``ssh-agent``. So I needed to re-add my keys. Which can be done with the following command.

.. code-block:: bash

   ssh-add id_ed25519
   # now we can check again to make sure our key is present
   ssh-add -L
   > ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMSsJjYL0PNE8/ahTdQXbiOS4Fdg/rY8pafH2YWjmpJM mcgillivray.jason@gmail.com

Debugging
---------

.. code-block:: bash

   GIT_TRACE=1 git commit -S -m 'test'

   # once you have a commit staged you can verify that the signature is working by running the following command
   git show --show-signature
