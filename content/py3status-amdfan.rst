Initial release py3status-amdfan
################################

:author: mcgillij
:category: Python
:date: 2021-04-14 22:49
:tags: Linux, py3status, AMD, i3wm, Python, #100DaysToOffload
:slug: py3status-amdfan
:summary: The initial release for my new py3status module to monitor fan RPM and temperatures.
:cover_image: monitor.png

.. contents::

WTF's py3status-amdfan?
***********************

A small `Python <https://python.org>`_ module written for use with `py3status <https://github.com/ultrabug/py3status>`_.

It can be use for monitoring fan RPM's and temperature of any video card powered by the `amdgpu` kernel module.

Screenshot
**********

.. image:: {static}/images/py3status-amdfan.png
   :alt: glorious picture of py3status-amdfan

You can change it's format to display the values however you like however, that's just the configuration I run on my machine.

Pre-reqs
********

This project depends on another one of my projects `amdfan <https://github.com/mcgillij/amdfan>`_, so you'll need that installed prior to launching **py3status-amdfan** otherwise it won't be able to load it in as a library.

**Amdfan** can be used to tune your fan settings or monitor your temperature in the terminal as well as running as a daemon in the background applying a fan curve that you can define.

Since I wasn't happy with the defaults provided by the `amdgpu` drivers (basically idle fans till 65 degree's Celsius, then full blast... not ideal).

Anyways I figured I'd want to monitor the fan settings in my status bar. So now we have **py3status-amdfan**.

Installation
************

You can fetch both the packages from either, PyPi(w/pip, pipenv or poetry), github or the AUR repo if your using Arch. I'll pop the links below.

Installing from PyPi
^^^^^^^^^^^^^^^^^^^^

Using whatever Python package manager, you can install directly from PyPi.

.. code-block:: bash

   pip install amdfan py3status-amdfan
   pipenv install amdfan py3status-amdfan
   poetry add py3status-amdfan amdfan && poetry install

Installing on Arch
^^^^^^^^^^^^^^^^^^

- `amdfan aur <https://aur.archlinux.org/packages/amdfan/>`_
- `py3status-amdfan aur <https://aur.archlinux.org/packages/py3status-amdfan/>`_

Installing from Github
^^^^^^^^^^^^^^^^^^^^^^

Alternatively if you want to install it manually or just see the source code / directions you can find them here.

- `Amdfan github <https://github.com/mcgillij/amdfan>`_
- `py3status-amdfan github <https://github.com/mcgillij/py3status-amdfan>`_


Let me know if you would like to see any features added or if you have troubles running either of these.


