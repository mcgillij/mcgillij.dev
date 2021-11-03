exa a replacement ls
####################

:author: mcgillij
:category: Linux
:date: 2021-10-27 22:49
:tags: Linux, ls, exa, #100DaysToOffload
:slug: exa-ls-replacement
:summary: Exa a modern ls replacement, it's pretty neat.
:cover_image: pacman.jpg

.. contents::

**exa** is a modern replacement for ls.

Whats modern mean in the context of `ls`? For instance exa has colors on by default, can show git status, xattrs of files etc.

More information can be found:

- `website <https://the.exa.website/>`_
- `github <https://github.com/ogham/exa>`_

It really is a simple application that does what it says quite well.

Below are the **bash** alias's that I created for using it on my machines.
It's not only 'pretty' but also useful in that you can show the `git` status of files in your directory listing etc. Checkout their documentation to tailor it's output to your specifications.

I wasn't ready to drop `ls` entirely, so I created some alias's below that you can use to check out `exa` without having to `replace` ls entirely.

I suspect that after a couple weeks of using the below alias's I'll just replace `ls` as I haven't really found any downsides yet.

Installation
************

.. code-block:: bash

   $ sudo pacman -S exa
   # or on debian
   $ sudo apt install exa

Alias's
*******

.. code-block:: bash

   alias e='exa --icons'
   alias el='exa --long --git --header --icons'
   alias et='exa --tree --icons'

Screenshots
***********

Sample output from the above alias's

**e**

.. image:: {static}/images/exa-e.png
   :alt: exa e

**el**

.. image:: {static}/images/exa-el.png
   :alt: exa el

**et**

.. image:: {static}/images/exa-et.png
   :alt: exa et

There you have it, it just basically works as an `ls` replacement whist providing extra functionality. It's always nice to find modern console utilities.
