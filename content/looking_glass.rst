Looking Glass
#############

:author: mcgillij
:category: Virtualization
:date: 2020-12-30 22:32
:tags: Linux, VFIO, Virtualization, Tutorial, BIOS, LookingGlass, 100DaysToOffload
:slug: looking-glass-vfio
:cover_image: lg.png
:summary: Basic Looking Glass setup

.. contents:: 

WTF is Looking Glass?
*********************

`LG <https://looking-glass.io>`_ is at two part application that uses a shared memory device, that allows dumping of a framebuffer through the PCI bus to be rendered by a secondary GPU.

This is a fancy way to say you can have Windows powered by a secondary GPU rendered in your Host OS as either a window or full-screen with very little overhead or latency.

Directions
**********

1. Setup your ``/dev/shm/looking-glass``
2. Install the **client** in your Host OS.
3. Configure your Guest VM to use the **shm** device

Setting up Looking Glass is very straight forward, and they put together a really great `quick-start guide <https://looking-glass.io/wiki/Installation>`_ on their homepage. I highly suggest following along with their directions.

However it seems that there's always a bit of confusion as to how the various components are named and what you should be downloading and installing where.

I'll briefly describe the steps involved with setting up Looking Glass as some of the pieces are named in a way that sounds more complicated than it actually is.

Setting up **/dev/shm/looking-glass**
*************************************

Memory reqs
^^^^^^^^^^^
If your rendering a guest between ``1920 x 1080`` or ``2560 x 1440`` you'll need **32mb**
otherwise larger resolutions should create a device **64mb** in size.

/dev/shm/looking-glass
^^^^^^^^^^^^^^^^^^^^^^

Use systemd to create a your shared memory device, create a file located at ``/etc/tmpfiles.d/10-looking-glass.conf`` with the following content:

.. code-block:: bash

   f    /dev/shm/looking-glass  0660    yourusernamehere    kvm     -

Replace 'yourusernamehere' with  your own user, this will make sure that your device gets recreated at boot time. Now you can create it right away with the following command, as to not have to reboot right away.

.. code-block:: bash
   
   systemd-tmpfiles --create /etc/tmpfiles.d/10-looking-glass.conf


Installing the **client** on your Host OS
*****************************************

Follow the compiling directions for your distribution and make sure you install the dependencies first. Directions for compiling can be found here in the `LG quickstart guide <https://looking-glass.io/wiki/Installation>`_.

Once it's compiled make sure to grab the binary and fire it in your ``PATH`` somewhere's so you can use it later.

Next up we will want to add the device to your virtual machine's configuration. This can be done with the following command:

.. code-block:: bash

   virsh edit win10

Where **win10** is your virtual machine configuration name. Add the following block near the bottom above the end ``</devices>`` section.

.. code-block:: xml

   <shmem name='looking-glass'>
     <model type='ivshmem-plain'/>
     <size unit='M'>64</size>
     <address type='pci' domain='0x0000' bus='0x09' slot='0x01' function='0x0'/>
   </shmem>

Make sure to swap out the value with the one determined above (32 or 64) in the previous step.
Now a Ram Drive will show up in your Windows guest the next time we boot it up and you'll need to install the `VirtIO driver <https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/upstream-virtio/virtio-win10-prewhql-0.1-161.zip>`_ for it.

Configure your Guest VM
***********************
Boot up your Guest and install the VirtIO Ram Drive driver, you can find the driver `here <https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/upstream-virtio/virtio-win10-prewhql-0.1-161.zip>`_.

Download and install the **Looking Glass "host" Windows application** from the looking glass site inside your Guest and make sure it's the same version as you compiled the "client" for in your Host OS.

Visible Confusion
*****************
So looking glass has 2 components:

- **LG_Host** application that runs in your *Guest VM*
- **looking-glass-client** that runs in your *Host OS*

The **LG_Host** running in your VM will dump the frames to be rendered to the shared memory device, and you can use a the **looking-glass-client** to render those frames in either the *Host OS* or another *Guest VM* depending on what type of setup your running.

Final steps
***********
Finally you will want to change your display type to **none** from QXL in *virt-manager* to allow the **looking-glass-client** to take over responsibility for displaying output from the VM.

.. image:: {static}/images/video_none.png
   :alt: video none

Looking glass installs the the host application as a Windows service, so it should be started when the VM boots up. 

`Demo Video <{filename}/cyberpunk_vfio.rst>`_
