vImDE - NeoVim IDE
##################


:author: mcgillij
:category: Linux
:tags: Linux, Nvim, Vim, Plugins, Python, Telescope
:date: 2022-08-04 23:00
:slug: vimde
:summary: NeoVim IDE, I put together somewhat recently and some folks were asking me to post about it.
:cover_image: vimde.png

.. contents::

What's vImDE?
^^^^^^^^^^^^^

Yet another set of `Neovim <https://neovim.io/>`_ configurations. There's no shortages of custom Neovim configurations floating around.

You can find it on Github `vImDE <https://github.com/mcgillij/vimde>`_ repository.

I've used several myself including `LunarVim <https://github.com/LunarVim/LunarVim>`_, but once I started adding some of the missing functionality that I wanted, it started breaking apart.

I mainly enjoy doing development in a REPL, being able to quickly run my code in bits and pieces, similar to a Jupyter notebook, but without the hassle of having to work in an web editor.

By popular demand (some folks were asking about my configuration, so here it is).

Particular goals
^^^^^^^^^^^^^^^^

The goals I set out to achieve are:
 - Python REPL Driven development (with tmuxp)
 - Github Copilot integration
 - Nice fuzzy finding with Telescope
 - Error pane with `trouble.vim`
 - file browser with NerdTree
 - ability to quickly open up the `init.vim` file (with `,ec` and source it with `,sc`)


Using vImDE
^^^^^^^^^^^

This set of configurations, provides a usable neovim configuration for editing one off files,
as well as working within a project structure (in a git repo, is the assumption here).

When editing regular files, you can just use your regular `vi, vim or nvim` alias's.

However if you are within a git repo (preferably Python project, since we start up an IPython REPL).

Run the ``vimde`` command, to spin up a `tmux` split session with IPython and `NVim`.

You can highlight code and send it over to the REPL with a double ``CTRL-C``.

From the vImDE README.md
^^^^^^^^^^^^^^^^^^^^^^^^

Neovim + IPython and some plugins to work with a REPL workflow.

This repo is mainly a backup of my working configurations, but feel free to use them if you want to.
If you aren't interested in running IPython along side neovim in TMUX, you can just grab the `.config/nvim/init.vim` and still have a fancy setup.

# Screenshot

.. image:: https://github.com/mcgillij/vimde/blob/main/screenshot.png?raw=true
   :alt: screenshot

What this setup provides
^^^^^^^^^^^^^^^^^^^^^^^^

With this setup I can use my regular `nvim` when editing files or doing some brief work, but I can also use the `vimde` command if I'm working within a well defined Python project with dependencies managed by Poetry.

This allows me to follow some REPL driven development and debugging and allows me to detach the session and come back to it later.

Bonus Key mappings
------------------

- `,<space><space>` will bring the NERDTree file view
- `,ff` will open the fuzzy file search
- `,fg` fuzzy grep
- `,fb` fuzzy buffer
- `,ec` will edit this configuration file
- `,sc` will reload this configuration
- `<Tab>` and `<Shift><Tab>` will cycle splits
- `<Ctrl-c>` will send selection to IPython if running with TMUX
- `,z` and `,Z` to zoom and un-zoom a split
- `<Ctrl><Space>` omni complete with language server

Dependencies
^^^^^^^^^^^^

This configuration depends on a few Linux tools being available in the environment.

For Tmux + IPython:
- tmux
- tmuxp
- neovim
- some fonts with emojis

Neovim Plugins:
- pyenv (not required but you probably want this if your writing any amount of Python)
- poetry
- nodejs
- ripgrep
- fd

Setup
^^^^^

Setting this up takes a bit of effort as you need to know how to install / manage the plugins required to make this work.
When first loading your `nvim` you may get some Errors since the plug-in manager needs to be installed.

Follow along here: https://github.com/junegunn/vim-plug to install `Plug` or copy `.local/share/nvim/site/autoload/plug.vim` from this repo.

Once `Plug` is installed, you can install / fetch all the plugins defined in the configuration with `:PlugInstall`

Note: I did have to manually clone the vim-slime repo into my `~/.config/nvim/plugged` folder since `Plug` didn't seem to want to download it, however it picked it up after I had cloned it manually. Note (this isn't really required unless you plan to use IPython in a separate TMUX pane).

Language Servers
----------------

You can issue a `:LspInfo`, `:LspInstall pyright bashls terraformls tflint` to get the language servers once the plugins have been loaded.

Copilot
-------

Once the plugins are installed you should be able to activate GitHub Copilot with the following command: `:Copilot` this only has to be done once.

Extras
------

Any extra directions or configurations you can follow along by reading the `init.vim` file.
To open this in nvim use the `,ec` command, and once you save any modifications you can hot-reload the configuration with `,sc`

How to "use" this repo
----------------------

This assumes a fresh user on a fresh Linux install, allowing me to quickly setup my environment on a different machine. I just clone the repo, and then move all the files to ~/, and make sure that my `PATH` has `~/bin` in it.

Fire up Nvim, and Run the **:PlugInstall**, **:LspInstall pyright**, **:LspInstall bashls**, **:TSInstall python**, **TSInstall bash**
