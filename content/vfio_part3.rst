The Machine! (virtual)
###########################

:author: mcgillij 
:category: Linux
:date: 2020-12-27 14:51
:tags: Linux, VFIO, Tutorial, Virtualization 
:slug: vfio-part3
:summary: Configuring your VM
:cover_image: machine.jpg

.. contents:: 

Now that you have one of your GPU's loaded up with the "vfio-pci" kernel module, we can move onto the configuration of your VM environment.

Now you have several options in how to configure the VM, and how you want to run them. However if this is your first time doing a VFIO setup, I would recommend using "virt-manager" to manage your VM and configuration. 

Optionally you could set this up as a headless host, with guest VM's for Linux and Windows or single GPU pass through, but that's beyond the scope of this particular article.

virt-manager
************

On Debian based distros:

.. code-block:: bash

   apt install virt-manager ovmf

On Arch:

.. code-block:: bash

   pacman -S qemu edk2-ovmf virt-manager

Your package manager should pull down all the dependencies for you. On Arch you will have to enable the service with systemctl start libvirtd.service && systemctl enable libvirtd.service

Once you have 'virt-manager' and the open source BIOS's downloaded and installed you can proceed to setting up your VM.

## Permissions
You will generally want to run the VM as your user and not as root, most of the previous commands would have had to be run as root to work at all as you've probably noticed.

Here's how you can add your user to the "kvm" and "libvirt" group, as the last command that requires root on your machine.

``usermod -a -G kvm,libvirt <yourusername>``

Once you login again you can check to make sure your part of the right groups with id.

The output should look something like: 

.. code-block:: bash

   uid=1000(j) gid=1000(j) groups=1000(j),975(libvirt),992(kvm)

Dependencies
************

You will need a couple of files to make the most of your virtual machine(s). For the sake of this exercise lets say your installing Windows 10, you will need a copy of the installation media, which Microsoft_ actually provides. Along with some VirtIO_ drivers from RedHat. Once you have these ISO's downloaded you can fire them in ``/var/lib/libvirt/images`` if you want virt-manager to automagically see them, otherwise you'll need to browse to them on your filesystem during the installation.

.. _Microsoft: https://www.microsoft.com/en-ca/software-download/windows10ISO

.. _VirtIO: https://docs.fedoraproject.org/en-US/quick-docs/creating-windows-virtual-machines-using-virtio-drivers/

New VM
******

Alright firstly lets create a bare bones VM, selecting all the default options and your Windows10 ISO as the installation medium. Maybe at a later date I can put together some diretions on how to use an existing disk, or block device for pass through. But for now were just going to make sure that everything is setup properly with the VM and your host OS

1. Choose local install media (ISO image or CDROM)
2. Browse to your Win10 iso
3. Assign some CPU and Memory
4. Create the default 40 GiB disk
5. Check the "Customize configuration before install" checkbox

.. image:: {static}/images/customize.png
   :alt: Installation Medium

Once you've clicked the Finish button, you will want to click the "Add Hardware" button in the bottom left of the UI and select "Storage".

.. image:: {static}/images/storage.png
   :alt: storage

In the storage options you will want to select the "Select or create custom storage" option, and change the "Device Type" to CDROM device. Click the "Manage..." button and select your VirtIO ISO that you downloaded previously, click Finish. This will allow us to install some drivers that you will need after the guest installation is complete.

Optional Settings
*****************

Adjusting your CPUs to match your Architecture will likely lead to some better VM performance, but you can adjust this anytime the VM isn't running so it's not a huge deal to nail this down right away. Below is a shot of my settings for my VM, you will want to make sure that the 'host-passthrough' is selected, and match the configuration to the number of cores you want to allocate to your VM.

.. image:: {static}/images/cpu.png
   :alt: CPU

First Boot
**********

Alright it's time to hit "Begin Installation", this should fire up your VM, go ahead and install windows as you normally would. I won't cover that in here. If you were installing onto a block device the CDROM you added with the VirtIO drivers would be used during the installation process. However with the default configuration that we are working with here, we should be able to complete the installation without them for the sake of validating that everything is working properly.

Guest agent and drivers
***********************

Now that Windows 10 is installed and your booted into the VM, you will want to install the Guest Agent along with the VirtIO drivers that are mounted in your CDROM. I won't go over in detail how todo this as it's Windows, just "WinKey+E" browse to your VirtIO CDROM drive and click on a bunch of EXE's that for your architecture. Once those are installed you can shutdown your Virtual Machine, do this from the Windows Start menu selecting "Shutdown".

Time for Pass Through
*********************

So far so good? Nothing has actually been passed through yet, but you have a VM setup that we can start testing of PCI-e pass through. 

1. Click on the Settings again for your Windows 10 VM
2. Click "Add Hardware" -> PCI Host Device. 
3. Select the GPU that you isolated in the previous steps
4. Click Finish
5. Click "Add Hardware" -> PCI Host Device
6. Select the audio device that corresponds to the GPU
7. Click Finish

Now the reason we have to pass through the audio device as well, is that the Windows driver expect that all of the hardware will be present when installing the driver (so it's technically not required, but really is required if you actually want to install the vendors drivers).

Fire it UP!
***********

Almost! Gotcha! That's how it would work in a perfect world, however we have hardware vendors that like to prevent us from actually using hardware that we've purchased. So here we are hiding VM's and mucking about with XML.

In your terminal you will want to execute the following command:

.. code-block:: bash

   virsh edit <yourvmnamehere>

This will popup whatever EDITOR you have set in your environment, use that to edit the XML to add the following sections. Add a new "kvm" block within the "features" section.

.. code-block:: xml

   <features>
     ...
     <kvm>
       <hidden state='on'/>
     </kvm>
     ...
   </features>

Also adding the "vendor_id" section to the hyperv section:

.. code-block:: xml

   <hyperv>
     ...
     <vendor_id state='on' value='randomid'/>
     ...
   </hyperv>

Save / Exit the editor to persist the changes to your VM's configuration, and now were "actually" ready to fire it up.

Fire it up for realsies!
************************

Meanwhile back in virt-manager, just click the play button on your VM, Windows should boot up if everything went well. And we can move onto checking the "Device Manager" to make sure your GPU is being passed through properly. 

- Right click your Start menu and select Device Manager
- Find your Video adapters and see if you have <GPU that you passed through>
- Right click on it to make sure the drivers are correctly installed

Now you can actually go to your hardware vendors website and download the appropriate drivers for your device, as this hardware is actually being passed through, it's capable of loading the actual drivers required for processing and not seen by Windows as an emulated device. Install it, reboot, profit.

----

`Part 2 <{filename}/vfio_part2.rst>`_ | `Part 4 <{filename}/vfio_part4.rst>`_
