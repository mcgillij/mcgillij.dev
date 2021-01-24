Fancy terminal
##############

:author: mcgillij
:category: Linux
:date: 2021-01-24 17:49
:tags: Linux, #100DaysToOffload, Alacritty, ueberzug, ranger, terminal
:slug: fancy-terminal-images
:summary: Setting up Alacritty, ranger and ueberzug for image previews in the terminal
:cover_image: fancy_term.png

.. contents::

Preface
*******

I work mostly in the terminal, and being able to preview images in the terminal is pretty handy on the day to day. I don't mind hopping into `Gimp <https://gimp.org>`_ to do actual manipulation of images, however I'm not a huge fan of having to fire it up just to preview the image. I've found a happy medium that allows me to preview images in the terminal, and then when selecting them I can open them up directly in Gimp for editing, which is all made quite easily with the fantastic terminal file browser **ranger** in combination with Alacritty.

Alacritty
*********

A term app written in `Rust <https://www.rust-lang.org/>`_ and `OpenGL <https://www.opengl.org/>`_, and my current terminal of choice at home. It's very quick and easily configured, and I don't have to recompile it every time I change the settings like with ``st``. You can find Alacritty in most distributions maintained packages or from it's `github page <https://github.com/alacritty/alacritty>`_.

ranger
******

A terminal file browser, with preview capabilities for images. As I generally run **tiling WM's** and not full **Desktop Environments** I usually don't have much in the way of *File managers* installed. But I do use ranger to browse my files and open them up in their respective applications when needed.

ueberzug
********

A relatively new entry into the "images in the terminal" space, something that usually would have been handled by **w3m**. This is a **Python 3** application, that allows drawing of images (over) in the terminal, allowing quick preview.

ucollage
********

If your looking for an actual "Image Browser" with some light manipulation abilities directly from the terminal (see `ucollage <https://github.com/ckardaris/ucollage>`_ for some really neat functionality. Look for **ucollage** in the `Arch AUR <https://aur.archlinux.org/packages/ucollage/>`_, but the other packages mentioned above are available directly through *pacman*. If you need help installing AURs check my previous post on the subject.

.. image:: {static}/images/ucollage.png
   :alt: screenshot of ucollage

Installation
************

Below is the installation instructions that will install the required dependencies to get images displaying in your terminal on Arch Linux.

.. code-block:: bash

   pacman -S alacritty ueberzug ranger

This will fetch all the dependencies required, you can however additionally configure different settings for each of these, but for the sake of brevity I'll just go over the basic configuration here as some of this just comes down to personal preference with how you want it setup.

Configuration
*************

With the dependencies installed, you will want to edit your **ranger** configuration which can be found at **~/.config/ranger/rc.conf** (if it doesn't exist just create it). Add the following lines to the configuration file.

.. code-block:: bash

   set preview_images true
   set preview_images_method ueberzug

That's it, you can now use ranger in your Alacritty terminal and browse images using ueberzug!
