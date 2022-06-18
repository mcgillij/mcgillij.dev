Dracula and FzF (fuzzy finder) for some shenanigans in the console
##################################################################

:author: mcgillij
:category: Linux
:date: 2022-05-08 22:49
:tags: Linux, Bash, Fzf, Dracula
:slug: fzf-dracula
:summary: fzf with some Dracula colors and some fun console shenanigans.
:cover_image: fuzzy.png

.. contents::

Whats fzf?
==========

`fzf <https://github.com/junegunn/fzf>`_ is a very fast fuzzy finder utility, that combines well with just about every Linux tool out there.

Does your command have some **Bash/Zsh/Fish** completion magic? Well it works with that too.

Do you like auto completing process ids for your `kill` commands? Covered!

Forget a couple ``git`` parameters? No problem.

I won't really be going over much of the functionality of ``fzf`` here, mainly just how to configure the colors, along with some extra niceties that can make the experience better and a little more colorful.


Preview:
========

History searching (`Ctrl-R`) and command completion(`Tab`) are supported.

.. image:: {static}/images/ctrl-r.gif
    :alt: Ctrl-R and Tab

Bonus shenanigans Ctrl-T, Alt-C

.. image:: {static}/images/fzf-shenans.gif
    :alt: fzf-shenans

Extra Fancy Dependencies
========================

- `bat <https://github.com/sharkdp/bat>`_ - A simple, fast, and user-friendly replacement for cat.
- `tree` installable via `yay -S tree`
- `fzf-tab <https://github.com/lincheney/fzf-tab-completion>`_

Installation
============

Finally with the dependencies installed we can proceed to install `fzf` with your package manager of choice.

.. code-block:: bash

   $ yay -S fzf

Configure **fzf**, add completion and bonus functions to your **~/.bashrc**

.. code-block:: bash

   # fzf settings
   export FZF_TMUX=1 # if you want to use a separate tmux pane
   
   # dracula in my fzf
   export FZF_DEFAULT_OPTS='
     --color fg:255,bg:236,hl:84,fg+:255,bg+:236,hl+:215
     --color info:141,prompt:84,spinner:212,pointer:212,marker:212'

   export FZF_CTRL_T_OPTS="--preview '[[ \$(file --mime {}) =~ binary ]] &&
     echo {} is a binary file ||
     (bat --style=numbers --color=always {} ||
     highlight -O ansi -l {} ||
     cat {}) 2> /dev/null | head -500' --preview-window=right:60%"
   export FZF_CTRL_R_OPTS="--preview 'bat --style=numbers --color=always --line-range :500 {}' --preview-window down:3:hidden:wrap --bind '?:toggle-preview'"
   export FZF_ALT_C_OPTS="--preview 'tree -C {} | head -200'"
   
   source /usr/share/fzf/key-bindings.bash
   source /usr/share/fzf/completion.bash
   source /home/j/gits/fzf-tab-completion/bash/fzf-bash-completion.sh
   bind -x '"\t": fzf_bash_completion'
   
   _fzf_compgen_path() {
     fd --hidden --follow --exclude ".git" . "$1"
   }
   
   # Use fd to generate the list for directory completion
   _fzf_compgen_dir() {
     fd --type d --hidden --follow --exclude ".git" . "$1"
   }


Time for some fun in the terminal!
==================================

Now you can try out your new **Ctrl-R** and **Tab** completion in the terminal, along with **Ctrl-T** and **Alt-C**.
