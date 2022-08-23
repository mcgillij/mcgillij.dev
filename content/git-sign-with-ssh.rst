Sign your git commits with SSH instead of GPG
#############################################

:author: mcgillij
:category: Linux
:date: 2022-08-23 20:00
:tags: Linux, Git, Github, Signing, SSH, GPG, Verified
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

Signing commits with your SSH key
---------------------------------

When you are ready to commit your changes you can use the following git flag **-S** for commits or **-s** for tags to sign them with your newly configured SSH signing key.

Example:

.. code-block:: bash

   git commit -S -m "Commit message"
   git tag -s -m "Tag message" v1.0.0

Alternatively you can set the following **git.config** option to auto-sign your commits.

.. code-block:: bash

   git config --global commit.gpgsign true

Debugging
---------

If you are having some troubles and you need to debug what `git` is doing behind the scenes for signing (or really any other issues your having with git, you can enable GIT_TRACE logging).

.. code-block:: bash

   GIT_TRACE=1 git commit -S -m 'test'

Validating signatures
---------------------

Once you have a commit staged you can verify that the signature is working by running the following command:

.. code-block:: bash

   git show --show-signature

You should see something like this:

.. image:: {static}/images/git-show-signature.png
   :alt: git show --show-signature

Finally
-------

You will need to add your public signing key to your github accounts settings.

.. image:: {static}/images/github_settings.png
   :alt: github settings

When you commit your changes to a github repo, you will be able to see the verified badge to go along with your commits similarly to when you had to jump through a bunch of hoops to use GPG.


.. image:: {static}/images/github-signed.png
    :alt: github signed

Arguments for / against signing
-------------------------------

Some people believe that there's plausible deniability that goes along with not signing commits, but at the end of the day it's up-to you. I choose to sign my commits when I can.
