Adding Python Virtual Env support to Synth Shell
################################################

:author: mcgillij
:category: Python
:date: 2021-02-01
:tags: Python, Bash, Linux, #100DaysToOffload
:slug: adding-venv-to-synth-shell
:summary: Just a quick write up of adding Python virtualenv support to Synth Shell
:cover_image: synth.png

.. contents::

Python Virtual Environments
***************************

Be it for work or personal things, I've always got what seems like 30 or 40 different Python virtualenv's kicking around, and the default way that virtualenv's handle this is by pre-pending the environment to the **PS1** shell prompt in a completely hacky way.

So if you've done any amount of customization to your shell prompt this gets blown away or makes your shell look like garbage.

Synth Shell
***********

I use `Synth Shell <https://github.com/andresgongora/synth-shell>`_ a very **Hackerman** themed shell, although I do like the aesthetic and I wanted to add support for showing my python virtual environments while not breaking completely the functionality of Synth Shell.

.. figure:: {static}/images/hackerman.webp
   :alt: Hackerman
   :width: 100%
   
   Hackerman!

Modifications required
**********************

Synth shell installs itself into **~/.config/synth-shell/** by default. So the file were looking for is called ``synth-shell-prompt.sh``

We're going to need to open that up in a text editor and find the following lines:

.. code-block:: bash

   if [ ! -z "$(getGitBranch)" ] && $SSP_GIT_SHOW; then
        PS1=$SSP_PS1_GIT
   else
        PS1=$SSP_PS1
   fi

So here we have where the prompt figures out if your in a git repo or not, we'll add our own condition statements here to see if were in a **virtualenv** or not.
Below this code-block you will want to add the following to show your virtual environment.

.. code-block:: bash

   if [ -n "${VIRTUAL_ENV}" ]; then
       ## PYTHON VIRTUALENV PROMPT
       SSP_PS1_VIRTENV="\e[0;31m($(basename ${VIRTUAL_ENV}))\e[0m"
       PS1="$PS1 $SSP_PS1_VIRTENV"
   fi


What it should look like
************************

.. figure:: {static}/images/synthshell_venv.png
   :alt: synthshell venv

   what a virtual environment looks like with synth shell now

If all went well, the next time you **source** / **activate** / **workon** / ``pipenv shell`` or ``poetry shell`` your prompt should still remain the same, but also additionally display your virtual environment.
