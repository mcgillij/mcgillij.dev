Something new for me anyways
############################

:author: mcgillij
:category: Linux
:date: 2021-04-19 23:49
:tags: Linux, Vim, nvim, neovim, #100DaysToOffload
:slug: nvim
:summary: Giving **nvim** a try, after a very long time spent with Vim.
:cover_image: battery.jpg

.. contents::

It's been a long time coming
****************************

After more than 20 years using the same editor, I decided to look into a fancy new editor. **neovim**, just happens
to be a better version of Vim. Out with the old and in with the new! Luckily I already know how to use this editor, so the learning curve wasn't so bad.

And they had an excellent little tutorial for porting over your existing ``.vimrc`` when you start it up.

.. code-block:: vim

   :help nvim-from-vim

This will get you started to porting over your own **.vimrc**.

Will my plugins work?
*********************

So far all my plug-ins and configurations have been ported over successfully.

I made a post previously that you can find here, that details `my .vimrc </my-vimrc.html>`_ in detail explaining what I use. This also applies to neovim, however you will need the following section in your ``~/.config/init.vim``.

.. code-block:: vim

   set runtimepath^=~/.vim runtimepath+=~/.vim/after
   let &packpath = &runtimepath
   source ~/.vimrc

This just imports your existing ``~/.vimrc`` that's it.

Why switch though?
******************

Vim's synchronous loading has been giving me a hard time lately, and after looking into it, it turns out that nvim happens to address this. Neovim is also being maintained in a bit of a healthier fashion than the old Vim, allowing more developers to contribute and modernize it without compromising on the plug-in ecosystem that already exists for Vim. So you get twice as many plug-ins, and some very modern features, while still being essentially able to use the same muscle memory that you've already been using.

In that way nvim is kinda the perfect change, the painless kind, where it just works better and has more features. So far so good, we'll see if I have to go back to vim or not. It's only been a day.

``pacman -R vim && cd /usr/bin && ln -s nvim vim`` this way I don't even have to remember the name of it :)
