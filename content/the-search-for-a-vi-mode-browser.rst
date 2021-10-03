The search for a Vi mode browser
################################

:author: mcgillij
:category: Web 
:date: 2021-09-23 22:49
:tags: Web, Browser, Vi, Nyxt, #100DaysToOffload
:slug: the-search-for-a-vi-mode-browser
:summary: Trying out Nyxt in the search for a Vi mode browser.
:cover_image: nyxt.png

.. contents::

The things using Vi, Vim and Neovim for 25+ years will do to a person is un-thinkable and horrific.

Every couple years I try to find a good **Vi-mode plugin** for my applications/browser with limited success. Having tried the likes of *Vimium, Tridactyl, Vimperator, Dooms, Spacemacs, vscodevim, ideavim*. None of them ever felt quite right, and just seemed to be bolted on.

Nyxt
****

WTF's is `Nyxt <https://nyxt.atlas.engineer>`_ (Next Browser)?

   In legends it is told that Athena had a powerful headache from using Internet Explorer. For months, the pressure built in her head, until one day, with a loud explosion, Nyxt sprang directly from her forehead. All of Athena's wisdom and cunning was imbued into the vessel known as Nyxt.

   Stolen from Mount Olympus by Prometheus himself, Nyxt is the titan's gift to humanity! Use it wisely, the power of the Internet is yours!

OK so there's that... Pulled directly from their site. I'll attempt to do a better job describing it, at least from my perspective.

Features
********

- Modify all the things, including itself
- All of the key-binds
- REPL
- Some familiar concepts to Emacs and Vim (Buffers and Windows instead of tabs)

Aimed at `power users` Nyxt comes built-in with **3** different sets of modify-able keybindings *Common User Access (CUA)*, *Emacs* and of course **Vi**.

Not only are the key-bindings user modifiable, so is just about all the functionality of Nyxt. Allowing you to essentially hack away at the browser while it's running which is pretty cool.

Not many browsers come with a `REPL <https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop>`_ built-in (I'm not counting the JS console built into most browsers for the sake of argument since it's not readily usable to modify the browser itself, as it's mostly relegated to modifying the look and feel and not actual functionality).

With a recent release of 2.2.0, I decided to give it a spin. While I do not consider myself a **browser power-user**, I do like the idea of a browser with built in Vi bindings (and not some bolted on plugin).

All the standard mouse controls are available like you would have access to with any other browser. However it really starts coming into it's own when using it the way it was designed, with the keyboard (in my case the vi key-binds).

Installation
************

With the new release, and of course being on `Arch <https://archlinux.org>`_ someone in the `AUR <https://aur.archlinux.org/nyxt.git>`_'s has created a Nyxt repo, which has the latest version in there. So the installation was a breeze.

.. code-block:: bash

   yay -S nyxt

Mash enter a bunch accepting all the defaults, and you've got yourself a nice new browser to fiddle with.

First usage
***********

At first startup, I *mashed* a bunch of Vi keys that I would have tried to "guess" would potentially work, but no luck.

Eventually I mashed **:** to enter ``command mode`` and typed **help** and that worked.

.. code-block:: bash

   :help

From here you're greeted with a very fancy help page seen below.

.. image:: {static}/images/nyxt_help.png
   :alt: help page

From here you can click (since you don't know to navigate by Elements yet!) on the **Common settings** button and set your key-binds to Vi mode if your so inclined as well as a few other options.

.. image:: {static}/images/nyxt_common_settings.png
   :alt: common settings in nyxt

With our selected control-scheme in place, the **List Bindings** on the previous **Help** page will now reflect our current setup.

There is an overwhelming amount of functionality accessible through these bindings. So I will just outline a few to get you able to browse and shuffle through buffers etc, enough to get comfortable with some key based browsing.


Some helpful keys to know
*************************

: <--
^^^^^

Yep that's a colon, probably the most important command to learn till you get the hang of the others.

It allows you to browse the list of built-in commands and their key combinations using the arrow keys to navigate through them (or the vi movement keys of course).

.. image:: {static}/images/nyxt_commands.png
   :alt: Nyxt command mode

<ESC>
^^^^^

Just like in Vi, *ESC* is handy to get out of *insert* mode. Sometimes mashing it a couple times is required to back out of some modes etc.

Ctrl-l, Ctrl-L
^^^^^^^^^^^^^^

Finally this is how we browse to sites. With the lower case **l** loading the site in the current buffer, or upper case **L** loading the site in a new buffer.

Type in your url, and press enter and off to the races you go. Most navigation can be done with the regular combinations of mouse scrolling / page up / down or arrow or vi movement keys.

#protip
&&&&&&&

Automagically search using a prefix of **ddg** to search `DuckDuckGo <https://duckduckgo.com>`_. You can also add other search-engines, but I'll leave that as an exercise for the reader.

.. image:: {static}/images/nyxt_ddg.png
   :alt: duckduckgo search
   :width: 100%

Ctrl-j
^^^^^^

Navigating to a specific part of the page, or **clicking** a link (with your keyboard), this is accomplished by pressing **Control-j**. Once pressed, a bunch of letter combinations will appear on all the clickable elements on the page. If you type in any of those combinations, you will then be able to essentially click it.

.. image:: {static}/images/nyxt_elements.png
   :alt: nyxt elements

Don't forget to press **i** to enter insert mode if you selected an **input** box so that you can type into it :)

H
^

This is your **Back** button.

(Ctrl-w, Ctrl-w) and (Ctrl-W)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These combinations will open other Nyxt windows, and upper case **W** will close it, similar to interacting with **splits** in Vim.

Ctrl-[, Ctrl-]
^^^^^^^^^^^^^^

Shuffling buffers, essentially tabs in traditional browsers.

.. image:: {static}/images/nyxt_buffers.png
   :alt: buffers

(Ctrl-x Ctrl-k) or D
^^^^^^^^^^^^^^^^^^^^

These will allow you to destroy buffers / close them.

Z Z, Ctrl-x Ctrl-c, C-q
^^^^^^^^^^^^^^^^^^^^^^^

Quit

With those commands you will be off to a great start in using Nyxt and build up familiarity. There is also a built in **tutorial** and the documentation is pretty straight forward.

Bonus: Importing your bookmarks
*******************************

You can also import your bookmarks into Nyxt using the following **command**.

.. code-block:: bash

   :import-bookmarks-from-html

You will then type in the path to your exported bookmarks etc.

.. image:: {static}/images/nyxt_bookmarks.png
   :alt: bookmarks sidebar

You can bring up your newly imported bookmarks using the **show-bookmarks-panel** command.

Conclusion
**********

Hopefully Nyxt keeps getting better, I did run into a couple issues, that already seem to be documented in their `github issues page <https://github.com/atlas-engineer/nyxt/issues>`_.

Let me know if you have found a good usable Vi-mode application. Always interested in using that old built up muscle memory for something.

And it's refreshing to see folks building a new application from the ground up rather than a plugin to an existing application allowing for much better user interactions to be dictated by the users themselves vs the frameworks of the existing applications.

As always let me know your thoughts on the subject.
