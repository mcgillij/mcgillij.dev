Neovim and Github Copilot
#########################

:author: mcgillij
:category: Linux
:date: 2021-10-27 21:49
:tags: Linux, Neovim, Github, Copilot, Arch, #100DaysToOffload
:slug: neovim-github-copilot
:summary: Getting up and running with Neovim and Github Copilot on Arch Linux
:cover_image: battery.jpg

.. contents::

With the announcement today of Github Copilot's availability in `Neovim <https://neovim.io>`_.

I wanted to give it a spin.

Outlined below are the pre-requisites, for getting a minimalistic Neovim and 
Copilot setup up and running.

And while I don't totally agree with code **~~stealing~~^H^H^H^H^H^H** ``generation`` from peoples 
repositories.

I was interested in seeing it in action but not enough to install an IDE.

However being available in neovim now makes the proposition way more attractive.

For more information about this: https://github.com/github/copilot.vim

Prerequisites:
**************

- Git
- Nightly Build of Neovim (6+)
- Nodejs (12+)
- Arch Linux (optional, but you'll have to just wing it)
- Vim-Plug (or another package manager)

That's it to get the basics up and running, I'll provide some extra plugins and
setup along the way that is totally optional to get up and running with Copilot.

You can install the main dependencies with: 

.. code-block:: bash

   $ sudo pacman -S nodejs git


Neovim nightly
^^^^^^^^^^^^^^

You have a couple options here, either an appImage, creating a package (the nightly 
build AUR is currently broken as the package it references is not available since it 
links to a nightly build job on github that gets pruned), or manually installing it yourself.

Creating a package
^^^^^^^^^^^^^^^^^^

I went the route of creating a package and in trying to use **pacman** to manage
all my packages, I found better than trying to maintain a manual installation of neovim.

You will need to grab the PKGBUILD file either from cloning this `AUR <https://aur.archlinux.org/packages/neovim-nightly-bin/>`_ or pasting the below contents into a file named **PKGBUILD**.

**PKGBUILD**

.. code-block:: bash

   _pkgname=neovim
   _pkgver=0.6.0
   pkgname=neovim-nightly-bin
   # I HAD TO CHANGE THE LINE BELOW
   pkgver=0.6.0+dev+498+gd0f10a7ad
   pkgrel=1
   pkgdesc='Fork of Vim aiming to improve user experience, plugins, and GUIs - Nightly Builds'
   arch=('x86_64')
   url='https://neovim.io'
   backup=('etc/xdg/nvim/sysinit.vim')
   license=('custom:neovim')
   provides=("${_pkgname}=${_pkgver}" 'vim-plugin-runtime')
   conflicts=("${_pkgname}")
   optdepends=('python2-neovim: for Python 2 plugin support, see :help python'
               'python-neovim: for Python 3 plugin support, see :help python'
               'xclip: for clipboard support, see :help clipboard'
               'xsel: for clipboard support, see :help clipboard')

   _date="$(date -u +%Y%m%d)"
   # CHANGE THIS LINE AS WELL TO THE NIGHTLY VERSION
   source=("nvim-linux64.tar.gz")
   sha512sums=(SKIP) 
   install=neovim.install

   pkgver() {
     cd "${srcdir}/nvim-linux64"
     ./bin/nvim --version | head -1 | awk '{ printf $2 }' | sed 's/-/+/g' | sed 's/v//'
   }

   check() {
     cd "${srcdir}/nvim-linux64"
     ./bin/nvim --version
     ./bin/nvim --headless -u NONE -i NONE -c ':quit'
   }

   package() {
     cd "${srcdir}/nvim-linux64"

     mkdir -p "${pkgdir}/usr/bin"
     cp -r lib "${pkgdir}/usr/"
     cp -r share "${pkgdir}/usr/"
     install bin/nvim "${pkgdir}/usr/bin"

     # Make Arch vim packages work
     mkdir -p "${pkgdir}"/etc/xdg/nvim
     echo "\" This line makes pacman-installed global Arch Linux vim packages work." > "${pkgdir}"/etc/xdg/nvim/sysinit.vim
     echo "source /usr/share/nvim/archlinux.vim" >> "${pkgdir}"/etc/xdg/nvim/sysinit.vim

     mkdir -p "${pkgdir}"/usr/share/nvim
     echo "set runtimepath+=/usr/share/vim/vimfiles" > "${pkgdir}"/usr/share/nvim/archlinux.vim
   }

With the **PKGBUILD** downloaded you will need to also download the nightly build from
https://github.com/github/copilot.vim/releases/download/neovim-nightlies/nvim-linux64.zip

Place it in the same folder as your **PKGBUILD** and ``unzip`` it (For some reason
it's a zipped up tarball).

.. code-block:: bash

   $ unzip nvim-linux64.zip

This should leave you with a ``nvim-linux64.tar.gz`` which corresponds with the above PKGBUILD
file **source** section allowing us to build a package from this.

Building the package
^^^^^^^^^^^^^^^^^^^^

Thankfully building packages in Arch is amazingly easy. And it's one of the
features I most enjoy about this distribution.

If you don't have a **chroot** setup for building packages you can find more info
about it `here <https://mcgillij.dev/aur-with-chroot.html>`_.

.. code-block:: bash

   $ makechrootpkg -c -r $HOME/chroot

This will build the package for you and plop out a ``zst`` file in the current directory.

Once the package is built you can install it with:

.. code-block:: bash

   $ sudo pacman -U --asdeps neovim-nightly-bin-0.6.0+dev+498+gd0f10a7ad-1-x86_64.pkg.tar.zst

This will prompt you that it will remove your previous **neovim** as it conflicts with it.
And this is great, since we aren't hosing our system now by actually creating a package vs
installing a random binaries.

Checking the version
^^^^^^^^^^^^^^^^^^^^

Checking if the correct version is present now with: 

.. code-block:: bash

   $ nvim --version

   NVIM v0.6.0-dev+498-gd0f10a7ad
   Build type: RelWithDebInfo
   LuaJIT 2.1.0-beta3
   Compilation: /usr/bin/gcc-11 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1 -DNVIM_TS_HAS_SET_MATCH_LIMIT -O2 -g -Og -g -Wall -Wextra -pedantic -Wno-unused-parameter -Wstrict-prototypes -std=gnu99 -Wshadow -Wconversion -Wmissing-prototypes -Wimplicit-fallthrough -Wvla -fstack-protector-strong -fno-common -fdiagnostics-color=always -DINCLUDE_GENERATED_DECLARATIONS -D_GNU_SOURCE -DNVIM_MSGPACK_HAS_FLOAT32 -DNVIM_UNIBI_HAS_VAR_FROM -DMIN_LOG_LEVEL=3 -I/home/runner/work/neovim/neovim/build/config -I/home/runner/work/neovim/neovim/src -I/home/runner/work/neovim/neovim/.deps/usr/include -I/usr/include -I/home/runner/work/neovim/neovim/build/src/nvim/auto -I/home/runner/work/neovim/neovim/build/include
   Compiled by runner@fv-az139-646
   
   Features: +acl +iconv +tui
   See ":help feature-compile"

      system vimrc file: "$VIM/sysinit.vim"
     fall-back for $VIM: "/share/nvim"

   Run :checkhealth for more info

Something along those lines should work (anything 6+).

Assuming you didn't have **nvim** installed prior you will also want to create a
configuration for yourself in **~/.config/nvim/init.vim** (or .lua if you want to configure it with lua).

However for this example setup I'll just use the regular `init.vim`

Installing Vim-Plug
*******************

You can install it in a number of ways, here's the easiest:

.. code-block:: bash

   sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'

This installs the plugin in the default location (.local/share/nvim/site/autoload/plug.vim).


From here ``source`` (``:source ~/.config/nvim/init.vim``) your configuration or quit and open nvim again.

To allow it to autoload vim-plug (since that's where the above command plopped it).

Installing Copilot.vim
**********************

Add the following lines to your **~/.config/nvim/init.vim** file:

.. code-block:: bash

   call plug#begin()
   Plug 'github/copilot.vim'
   call plug#end()

And from inside nvim issue the command ``:PlugInstall``
This will go download the plugin for you and install it.

You will also need to issue ``:Copilot setup`` to setup the plugin. Which
will prompt you to accept some conditions and allow the use of Copilot.

That's it!

Now just start typing.

.. image:: {static}/images/copilot_suggestion.png
   :alt: copilot suggestion

Copilot will **try** to help.

All you need is to stop typing for a second, and you should see some suggestions.
Similar to how you would usually get autocomplete suggestions.

Now you can take part in all the Copilot Meemz! It's usefulness seems to range from 
wanting to paste giant blocks of random text to somewhat meaningful suggestions.

YMMV, however I'm excited to see what it comes up with when I stop typing.

Let me know if it generates anything halfway usable for you!
