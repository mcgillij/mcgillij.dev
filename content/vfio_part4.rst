Odds and Ends
############################

:author: mcgillij
:category: Linux
:date: 2020-12-28 14:52
:tags: Linux, VFIO, Virtualization, Tutorial, BIOS, 100DaysToOffload
:slug: vfio-part4
:cover_image: oddsandends.jpg
:summary: BIOS and optimizations

.. contents::

Misc Odds and Ends
******************

While all the other steps are pretty universal, there are a couple places where the configurations or settings may diverge based on what your goals are or what hardware you have available.

- BIOS settings
- Host improvements
- Guest optimizations

------

BIOS / UEFI
***********
 
I'll start with BIOS settings, for me I'm using a `x570 Aorus Master from Gigabyte <https://www.gigabyte.com/ca/Motherboard/X570-AORUS-MASTER-rev-10#kf>`_, so the settings I will be outlining will be more pertinent to those using similar boards. However it's just a matter of finding where your vendors are hiding the similar settings in their UEFI UI's.

First things first you'll need to enable your CPU specific VM instructions, for me that's SVM.

.. image:: {static}/images/bios-svm.png
   :alt: AMD SVM
   :width: 100%


Next we'll want to hunt down the IOMMU settings in a couple places in the BIOS.
 
.. image:: {static}/images/bios-iommu.png
   :alt: IOMMU
   :align: left
   :width: 100%


.. image:: {static}/images/bios-iommu2.png
   :alt: IOMMU in NBIO settings
   :align: right
   :width: 100%

Make sure these settings are set to "Enabled" and not "Auto" as that's a workaround for Windows machines and aren't entirely enabled.

Depending on what type of PCIe setup you have going with your GPU's and which ones your going to be passing through, you may want to change which PCIe slot is to be used for your initial display, this will help with not binding the GPU to your kernel's driver.

.. image:: {static}/images/bios-pcie.png
   :alt: PCIe

Lastly we will want to disable CSM support, as this will likely interfere with booting up your machine fully with UEFI.

.. image:: {static}/images/bios-csm.png
   :alt: Disable CSM

From here this should be your baseline configuration for a working GPU pass through for the x570 Aorus Master or any other Gigabyte board that shares the same BIOS's. You can save this as a profile, that you can then toggle whichever other settings you may want to get working on your board (XMP, OC, etc). But for the sake of getting pass through working this is the baseline that I work from before going and tweaking other things.

----

Host
****

There are a number of host level optimizations that you can do to your VM once you get it up and running and have validated that everything's working properly.

CPU
===

CPU pinning is one of them, and the folks over at the `Arch Wiki <https://wiki.archlinux.org>`_, have a great section on this that can be `found here <https://wiki.archlinux.org/index.php/PCI_passthrough_via_OVMF#CPU_pinning>`_. Don't worry about the information being Arch specific, most of the directions there are portable to just about any distro around. You can go even further with this and isolate the CPUs as well but it all depends on the work-loads that your going to be dealing with as there's no silver bullet for 'optimal' performance in every case.

AMD
===

There are some AMD CPU specific optimization available as well. Generally you will want to start off by configuring your CPU section in the virt-manager with settings similar to this: 

.. image:: {static}/images/cpu.png
   :alt: CPU Topology

To enable AMD SMT (hyperthreads), you will need to manually edit the XML file ( ``virsh edit win10``) for your virtual machine and add an extension to the cpu block. Add the ``<feature policy='require' name='topoext'/>`` below the topology section in your XML as seen below.

.. code-block:: xml

   <cpu mode='host-passthrough' check='none'>
     <topology sockets='1' cores='8' threads='2'/>
     <feature policy='require' name='topoext'/>
   </cpu>

Once that's in place, you can actually change your configuration to look like:

.. image:: {static}/images/amd-smt.png
   :alt: AMD SMT

Not only does this more accurately correspond to your actual CPU configuration, you should get a bit of a bump in performance.

Networking
**********

There a ton of different ways to configure your network with various bridge devices, actual hardware pass through, NAT'ing etc. However I personally find the best way to get networking on a "Windows" guest in particular is to use the VirtIO driver from Redhat.

.. image:: {static}/images/virtio-network.png
   :alt: Network

Selecting this option before you create your VM has the added benefit of not allowing any networking of your Windows 10 VM right after your installation (until you install the VirtIO drivers). Which gives you a bit of breathing room to clean up and block things like Windows Updates from Microsoft downloading just a whole bunch of garbage to your machine. 

.. figure:: {static}/images/dumpsterfire.gif
   :align: right
   :alt: Actual footage from Windows 10 installation 

   Actual footage from Windows 10 installation

This allows you to setup mitigations against this and turn off services that generally will install that stuff during the installation. This is also a very optimized driver provided by RedHat. Alternatively if your motherboard has multiple NIC's you can pass one through directly to the VM however the VirtIO driver will give it a run for it's money when it comes to performance.

NVMe vs a Block
***************

If you have (or want) to still be able to dual boot into your windows disk, you have a couple options available to you. Passing through the entire PCIe controller for your NVMe device works great. Or you can pass it in as a Block device, this will however require  you to install the VirtIO drivers mentioned previously "during" the Windows installation process. There is very little performance loss from doing this, and you get the added benefit of easier snapshots / backups and better support for moving the VM around.

----

Guest
*****

Most of the guest level optimizations, are pretty standard Windows things. 

- Remove as much trash as you can
- Set high performance mode power setting and GPU
- Make sure you have the Qemu guest agent and VirtIO drivers installed

Here are a couple great resources for removing the garbage from Windows, these are best done prior to putting Windows on the network and allowing it to run any Windows updates. However I highly recommend that you go over the configurations for these applications as they could leave your VM in a bad state. Like anything else don't blindly run anything from the internet without going over it.

- Sophia_
- `Sycnex win10 debloater <https://github.com/Sycnex/Windows10Debloater>`_

.. _Sophia: https://github.com/farag2/Windows-10-Sophia-Script 

Either of these work pretty well for getting rid of most of the telemetry that Microsoft puts in their products. However since were running in a VM, we can further limit this by applying our own firewall rules to the VMs, but that's not in scope for this.

`Part 3 <{filename}/vfio_part3.rst>`_ |  `Demo Video <{filename}/cyberpunk_vfio.rst>`_
