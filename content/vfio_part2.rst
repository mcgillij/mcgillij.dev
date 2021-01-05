Isolation (of hardware)
########################

:author: mcgillij
:category: Linux
:date: 2020-12-26 14:50
:tags: Linux, VFIO, Tutorial, Virtualization
:slug: vfio-part2
:summary: Isolation of components for VM pass through
:cover_image: dingle.png

.. contents::

First Steps
***********

The first steps with configuring your VFIO setup will be isolation of your pass through GPU. I will go over the steps to isolate your GPU along with verifying that it is ready to be passed through to a VM.

Make sure you've enabled SVM (for AMD) or VT-d/x (for Intel) CPU's in your BIOS along with the IOMMU options available from your motherboard vendors.

----

Poking and prodding
******************* 

Next you can copy the following script to your /home/<yourusername>/bin directory, and make it executable with a ``chmod +x ls-iommu.sh``. 

.. code-block:: bash

   #!/bin/bash
   for d in /sys/kernel/iommu_groups/*/devices/*; do
     n=${d#*/iommu_groups/*}; n=${n%%/*}
     printf 'IOMMU Group %s ' "$n"
     lspci -nns "${d##*/}"
   done


Once you've got a copy of this script you can run it, to see if you have some half decent  groupings available to you for passthrough, however the most important thing here is to see if your GPU's are properly separated into different groups (since were going to go on the assumption that your running multiple GPU's here for the sake of this tutorial). 

.. image:: {static}/images/isolation.png
   :alt: ls-iommu.sh output
   :width: 100%

Since I'm running 2 AMD GPU's the above image, I've just finished running ``ls-iommu.sh | grep ATI`` to help me filter the relevant information that were going to want to take a look at. I've highlighted a couple relevant pieces of information in the above image that you should take a look at for your own configuration.

On the left hand side I've highlighted the "device ids" and to the left are the "pci ids", either of these can be used to isolate your cards depending on your setup. If you have 2 identical cards you will need to use the "device ids" otherwise you can use the "pci ids" in later configuration steps.

So in the above image, we can see that I have one card and audio device combo living in ``0d:00.0,0d:00.1`` and one in ``10:00.0,10:00.1``, these correspond to my 6800xt and my Vega64 along with their audio counterparts. However I want to pass in my 6800xt to my virtual machine, so I'm just going to use the pci ids which are ``1002:73bf,1002:ab28``.

Note: Some cards may have other devices such as usb controllers built into them, you'll want to isolate those as well if you have a card with them, however we do not want to isolate the "PCI bridge" devices, just the video, audio and USB controllers.

Bootloader time!
****************

Ok so we've isolated the GPU and Audio device that were going to want to isolate, however we haven't actually done anything yet we've just poked and prodded at the system to see whats available for isolation. 

Onward to actual isolation. For the sake of this example I'll use Grub as the bootloader, but the same configurations can be applied to using the systemd bootloader or any other, as long as you can get some kernel parameters through you should be alright.

If you've got an AMD cpu, you'll want to add the following line to your ``/etc/default/grub``.


AMD Example: 

.. code-block:: bash

   GRUB_CMDLINE_LINUX="iommu=pt amd_iommu=on vfio-pci.ids=1002:73bf,1002:ab28 video=efifb:off"

Intel Example: 

.. code-block:: bash

   GRUB_CMDLINE_LINUX="iommu=pt intel_iommu=on vfio-pci.ids=1002:73bf,1002:ab28 video=efifb:off"

You will need to replace my vfio-pci.ids with your own from the devices that you want to isolate, also make sure to choose the right CPU vendor configuration above.

video=efifb:off <— Whats this? This tells the kernel to not bind to the efi boot GPU (in the event that it's the one you want to pass through depending on your PCI-e slot usage etc) this will change how your boot process "looks" as it disables one of the available framebuffers.

Once the above configuration is in place we will need to regenerate your Grub configuration. On most distro's this can be accomplished with an update-grub. Or if your running Arch the following should work grub-mkconfig -o /boot/grub/grub.cfg.

Reboot
******

Ok now you can reboot and see if we have some isolation going on(it's possible that the isolation isn't happening yet if you have similar graphics cards and may need another step modifying your initramfs) but I can cover that separately.

Isolation status
****************

Now that you've rebooted and are using the above kernel parameters, we should be able to check if your vfio-pci kernel module is loaded up for your isolated card with the following command: ``lspci -nnv | grep vfio``.

.. image:: {static}/images/vfio_small.png
   :alt: vfio-pci kernel drivers in use

You "should" see a number of entries matching the number of pci.ids you passed in. If not we may have to do a bit of meddling with the initramfs. However if you have isolation working at this point you're basically done, just have to configure your VM and pass through your device. Congrats on the hard part!

Initramfs
*********

If your in this section, the isolation didn't totally work yet, could be cause you have similar cards, or your motherboard doesn't support booting from a different PCIe slot etc. Whatever the reason, we can go over configuring your initramfs and getting you proper isolation.

Create the following script if you want to bind using "device ids".

.. code-block:: bash

   #!/bin/sh
   PREREQS=""
   DEVS="0000:0d:00.0 0000:0d:00.1" # our VGA / Audio adapters
   for DEV in $DEVS;
     do echo "vfio-pci" > /sys/bus/pci/devices/$DEV/driver_override
   done

   modprobe -i vfio-pci

You'll want todo the regular ``chmod +x vfio.sh`` to make it executable and then move it ``/etc/initramfs-tools/scripts/init-top/vfio.sh`` and make sure the files owned by root. If your on a Ubuntu or similar system, then you can ``update-initramfs -u``. This will regenerate your initramfs. You can validate that the script is installed in the initrd using the ``lsinitramfs /boot/initrd.img-yourkernelversionhere | grep "vfio.sh"``. And reboot and repeat the validation steps above to make sure you've got a video card bound to the "vfio-pci" drivers. 

Next we will look at the virtual machine configuration.

----

`Part 1 <{filename}/vfio_part1.rst>`_ | `Part 3 <{filename}/vfio_part3.rst>`_
