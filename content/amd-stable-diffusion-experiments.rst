Stable-Diffusion on Amd cards with rocm on Arch Linux
#####################################################

:author: mcgillij
:category: Linux
:date: 2022-09-09 13:49
:tags: Linux, AMD, rocm, stable-diffusion, AI, ML
:slug: stable-diffusion-on-amd-cards-with-rocm-on-arch-linux
:summary: Experimenting with Stable-Diffusion with my AMD card on Arch Linux with rocm.
:cover_image: arch.png

.. contents::

Like any self-respecting nerd, I've been playing around with stable-diffusion since it came out.

.. image:: {static}/images/sd/1.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

Stable-Diffusion
================

Stable-Diffusion is a new AI/ML framework that is being developed by the `stability.ai <https://stability.ai>`_ folks. I've been toying with it for the last couple weeks.

The idea of using text-prompts to generate images isn't new, however the level of detail and accuracy achieved with stable-diffusion, is enough to remove any doubts questioning it's legitimacy.


.. image:: {static}/images/sd/2.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

AMD cards
=========

The issue with most documentation, and docker containers and environments for running stable-diffusion is the baked in Nvidia CUDA packages. However I've only got AMD cards, so I needed to find a solution to running with a different back-end.

The documentation for stable diffusion great already to follow along, however so I hope to just supplement the missing pieces here with regards to AMD cards, and what I had todo to get it up and running on my system.

.. image:: {static}/images/sd/3.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

Pre-requisites
==============

For this I'm using Arch Linux, but you can replace the commands with whatever the equivalent from your distro's package manager.

Firstly we need the **hsa-amd-aqlprofile-bin rocm-opencl-runtime rocminfo docker** packages.

Running the following commands will install and enable docker.

.. code-block:: bash

    yay -S hsa-amd-aqlprofile-bin rocm-opencl-runtime rocminfo docker
    sudo systemctl enable docker # this is optional to make docker start on system startup
    sudo systemctl start docker

You will also need to add yourself to the docker group, if you haven't already.

.. image:: {static}/images/sd/4.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

Docker shenanigans
==================

Next we will need to create an alias or shortcut for the docker command to provide GPU and privileged access to the system, since we will not be running ordinary docker containers, we will be allowing it to access our GPU directly.

And also creating a volume mount point in **$HOME/dockerx** that will allow us to update our stable-diffusion as needed, without having to rebuild the dependencies in the container.

Either save this snippet in your path, or create an alias.

Example **~/bin/docker_gpu**:

.. code-block:: bash

   #!/bin/bash
   sudo docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined -v $HOME/dockerx:/dockerx

Or add an alias similar to this:

.. code-block:: bash

   alias docker_gpu='sudo docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined -v $HOME/dockerx:/dockerx'

.. image:: {static}/images/sd/5.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

Running the container
=====================

Now we can update the dependencies list from the stable diffusion repo to remove CUDA and use **rocm** as the back-end.

Note: I have a 6800xt, so the pytorch image I'm using is only for Navi21 cards, you may have to check `dockerhub <https://hub.docker.com/r/rocm/pytorch/tags>`_ for your GPU if it's different.

.. code-block:: bash

   docker_gpu rocm/pytorch:rocm5.2_ubuntu20.04_py3.7_pytorch_1.11.0_navi21

You should now have a prompt inside the container. Now we can open up another terminal and clone the stable-diffusion repo (https://github.com/sd-webui/stable-diffusion-webui I chose this one, since I wanted the webui as well). Clone this repo in your **~/dockerx/** since it's volume mounted into your docker container.

Now we will hop into the container as our regular user, use the following command to find the container name and hop into the container.

.. code-block:: bash

   docker container ls
   > CONTAINER ID   IMAGE                                                          COMMAND   CREATED              STATUS              PORTS     NAMES
   cba1b9b628e7   rocm/pytorch:rocm5.2_ubuntu20.04_py3.7_pytorch_1.11.0_navi21   "bash"    About a minute ago   Up About a minute             eager_bose

In this case our container name is **eager_bose**. And we can hop into it with the following command.

.. code-block:: bash

   docker exec -it eager_bose bash

Now in the container, we can start fixing up the Conda environment. Navigate to your stable-diffusion directory and lets setup and activate the Conda environment.

.. code-block:: bash

   cd /dockerx/stable-diffusion-webui
   conda env create -f environment.yaml
   conda activate ldm

.. image:: {static}/images/sd/6.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

PyTorch / Conda
===============

Now we will want to browse to the `pytorch <rocm/pytorch:rocm5.2_ubuntu20.04_py3.7_pytorch_1.11.0_navi21>`_ website and grab the ``pip`` command that we will be using in our container to update the pytorch dependencies.

.. image:: {static}/images/pytorch.png
   :alt: pytorch

We can modify the command to add the ``--upgrade`` flag, and run it in our container.

.. code-block:: bash

   pip install --upgrade torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/rocm5.1.1

This will replace the pytorch inside the Conda environment with one that can run on AMD GPUs.

From here you now have stable diffusion pretty well up and running you can run the tests / start up the `webui`.

Using the following command: 

.. code-block:: bash

   python scripts/relauncher.py

And click on the **localhost** url that is generated, and you will have access to the WebUI for your experiments.

.. image:: {static}/images/sd/7.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

Optional
========

Now, you have everything running, however you will have to restart some of the steps each time, since the work you did in the container isn't going to persist.

.. image:: {static}/images/sd/8.png
    :alt: Stable-Diffusion
    :width: 100%

.. raw:: html

   <br/>

Saving your container
^^^^^^^^^^^^^^^^^^^^^

Run the following docker command in another terminal to save your work. First we need to find the container id.

.. code-block:: bash

   docker container ls
   > CONTAINER ID   IMAGE                                                          COMMAND   CREATED              STATUS              PORTS     NAMES
   cba1b9b628e7   rocm/pytorch:rocm5.2_ubuntu20.04_py3.7_pytorch_1.11.0_navi21   "bash"    About a minute ago   Up About a minute             eager_bose

In this case our container id is **cba1b9b628e7**. And we can save it with the following command.

.. code-block:: bash

   docker commit cba1b9b628e7 stable-diffusion

**Caution** This will be a large container.

Now you can exit the container as your user, and as the root user. And to use your new saved container, you can run the following command.

.. code-block:: bash

   docker_gpu stable-diffusion

And you'll just need to activate your Conda environment from inside the container as your user / kick off the WebUI etc.

Trimming down the image, modifying the Conda dependencies is left as an exercise to the reader.

More fun some fun images, that I generated while playing with this.


.. image:: {static}/images/sd/9.png
    :alt: Stable-Diffusion

.. image:: {static}/images/sd/10.png
    :alt: Stable-Diffusion

.. image:: {static}/images/sd/11.png
    :alt: Stable-Diffusion

.. image:: {static}/images/sd/12.png
    :alt: Stable-Diffusion

.. raw:: html

   <br/>

Let please let me know what interesting prompts you come up with, and send me some of the images you generated, I'd love to see them.
