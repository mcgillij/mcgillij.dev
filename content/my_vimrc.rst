My .vimrc
#########

:author: mcgillij
:category: Linux
:date: 2021-02-06 14:49
:tags: Linux, Vim, #100DaysToOffload, Editor
:slug: my-vimrc
:summary: It ain't much but it's mine
:cover_image: work.jpg

.. contents::

Vim and VI
**********

Have been installed on every single system I've ever had or SSH'd into for the last 25 years.
And while you can **supe** it up to be quite jazzy and IDE'like.

That's not it's main strength in my opinion. It's availability, stability, consistency and performance are still unrivaled in the editing world.

I've gone through phases of installing a bunch of plugins and getting it all setup with tab completion for every language under the sun, fancy file handling, git management etc. However I end up never remembering half the shit I have installed and generally still stick to the basic functionality that's stuck in my muscle memory.


.vimrc
******
Here's my **.vimrc**, it's not much but it's mine.

.. code-block:: vim

   # load vim-plug if it's not installed
   if empty(glob('~/.vim/autoload/plug.vim'))
     silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
       \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
     autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
   endif

   " install my huge selection of plugins
   call plug#begin(expand('~/.vim/plugged'))
     Plug 'arcticicestudio/nord-vim'
     Plug 'scrooloose/syntastic'
     Plug 'airblade/vim-gitgutter'
   call plug#end()
   
   " Syntastic settings
   set statusline+=%#warningmsg#
   set statusline+=%{SyntasticStatuslineFlag()}
   set statusline+=%*
   
   let g:syntastic_always_populate_loc_list = 1
   let g:syntastic_auto_loc_list = 1
   let g:syntastic_check_on_open = 1
   let g:syntastic_check_on_wq = 0
   " End Syntastic settings

   " automagically enter/exit paste mode when pasting with the mouse
   let &t_SI .= "\<Esc>[?2004h"
   let &t_EI .= "\<Esc>[?2004l"
   
   inoremap <special> <expr> <Esc>[200~ XTermPasteBegin()

   function! XTermPasteBegin()
     set pastetoggle=<Esc>[201~
     set paste
     return ""
   endfunction

   " The good stuff
   colorscheme nord
   syntax on
   filetype indent plugin on
   :set listchars=eol:$,tab:>-,trail:~,extends:>,precedes:<
   set list
   :set spell spelllang=en_us

VIM-PLUG
********

I use **vim-plug** for plugin management, I like it cause I don't have to do anything and it does it's job nicely.

.. code-block:: vim

   # load vim-plug if it's not installed
   if empty(glob('~/.vim/autoload/plug.vim'))
     silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
       \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
     autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
   endif

   " install my huge selection of plugins
   call plug#begin(expand('~/.vim/plugged'))
     Plug 'arcticicestudio/nord-vim'
     Plug 'scrooloose/syntastic'
     Plug 'airblade/vim-gitgutter'
   call plug#end()

The first section will install *vim-plug* if it isn't already installed, this is handy for when I'm on a fresh install or SSH'd into another host that I'll be working on for a bit. It allows me to pull down my configuration from git and be up and running instantly.

And I install 2 plugin and a color theme, the color theme may vary sometimes, but for the most part I use something that works well with dark terminals.

gitgutter
*********

This plugin just shows me which lines are different from the my branch in git in the sidebar. Super helpful while not requiring me to actively remember or do anything. You will see this as a theme for the plugins I use.

.. code-block:: vim

     Plug 'airblade/vim-gitgutter'

Syntastic
*********

This plugin is nice since again, I don't actually have to do anything and it provides immediate value, by showing errors and warnings in the bottom panel of the editor otherwise there's no bottom panel, perfect.

.. code-block:: vim

   " Syntastic settings
   set statusline+=%#warningmsg#
   set statusline+=%{SyntasticStatuslineFlag()}
   set statusline+=%*
   
   let g:syntastic_always_populate_loc_list = 1
   let g:syntastic_auto_loc_list = 1
   let g:syntastic_check_on_open = 1
   let g:syntastic_check_on_wq = 0
   " End Syntastic settings

This section just sets the default recommended configuration for **Syntastic**, I've never seen the need to configure it any more as it's default settings work quite well.

Syntastic does use external linters and syntax checkers, so make sure they are installed and in your path while using this or it won't do much.

Recommended packages to install would be: `shellcheck <https://shellcheck.net>`_, `pylint <https://pylint.org>`_ and `flake8 <https://flake8.pycqa.org/en/latest/>`_.


Copy/Pasta
**********

About the only thing I use my mouse for is to copy / paste blocks of text around, and instead of manually having to type in ``set paste`` every time I want to paste stuff into Vim and not have the *indenting crap all over the formatting* of the text, again this block allows me to not have to do anything, and it will auto-toggle the indenting off / on when pasting.

.. code-block:: vim

   " automagically enter/exit paste mode when pasting with the mouse
   let &t_SI .= "\<Esc>[?2004h"
   let &t_EI .= "\<Esc>[?2004l"
   
   inoremap <special> <expr> <Esc>[200~ XTermPasteBegin()

   function! XTermPasteBegin()
     set pastetoggle=<Esc>[201~
     set paste
     return ""
   endfunction

Vim default settings
********************

The rest of the settings aren't based on plugins or custom functions, they are just little tweaks to the default Vim options.

.. code-block:: vim

   colorscheme nord
   syntax on
   filetype indent plugin on
   :set listchars=eol:$,tab:>-,trail:~,extends:>,precedes:<
   set list
   :set spell spelllang=en_us

I set a color-scheme (imported with vim-plug), set the syntax highlighting on, enable proper indenting for my Python scripts with the indent plugin.

To manage my **white space**, I use the following which will show all the white space in the files I'm editing, this is handy since we have some crazy white space requirements at work and allows me to keep stuff cleaner. In the event that I want to paste from Vim to another application, I'll have to run ``set list!`` to disable the white space formatting temporarily.

.. code-block:: vim

   :set listchars=eol:$,tab:>-,trail:~,extends:>,precedes:<
   set list

Lastly I use the **spellchecker**, this will highlight words that are misspelled, and you can be prompted to change them by pressing ``z=`` while your cursor is in the words.

.. code-block:: vim

   :set spell spelllang=en_us

Simplicity
**********

Not having to actually remember how to use anything other than the editor itself is nice, and my **.vimrc** kinda just slowly evolved over the years, to something I don't ever have to really manage and it's nice.
