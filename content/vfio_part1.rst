Intro to VFIO
####################


:author: mcgillij 
:category: Linux
:date: 2020-12-25 14:49
:tags: Linux, VFIO, Vitualization, Tutorial
:slug: vfio-part1
:summary: Intro to VFIO in Linux
:cover_image: vfio_header.png

.. contents::

This will be an outline of how to get up and running with VFIO with Linux and a Windows 10 Virtual machine with relatively modern hardware.

Intro to VFIO
*************

VFIO and pass through have been around for a while (10~ years) and supported quite well at the processor level, however the motherboard manufacturers are only recently paying attention to actually having usable IOMMU groups, so it's no longer hit or miss when trying to choose hardware as most modern boards will support this in some form right out of the gates. The end goal of VFIO is generally to get as close as possible to "bare-metal" performance out of your hardware by passing through actual hardware bits to the virtual machine ( KVM / Qemu ).

Pre-requisites
**************

1. Which motherboard and CPU are you using?
2. Is IOMMU enabled in your BIOS?
3. How many GPU's do you have?
4. Which Linux distribution are you planning on running?
5. What is your end goal?

------

Lets go over each of the items above in a little more detail to outline some of the choices available.

Hardware
========

Various vendors will have different feature sets available to you that may limit the possible configurations that your hardware will support.

For example, some motherboards do not allow you to specify which GPU to boot from, limiting your PCI-E slot choices for your GPU's. This means you may want to slot your top slot with your "host" GPU and then put your pass through GPU in one of the remaining slots. Gigabyte BIOS's generally support choosing a boot GPU and provide good IOMMU groups out of the gates, making them popular within the VFIO community. There are many pro's and con's to the various vendors offerings, but something that's probably best left for another time.

AMD and Intel both support virtualization with their CPUs, but the options in the BIOS's will be different. On Intel CPU's you will want to look for and enable VT-d/x instructions and on the AMD side you will want to enable SVM.

GPUs
****

While single GPU pass through is possible, it does require quite a bit of overhead to the point of dual booting is likely a faster alternative. So in this set of descriptions we won't go into too much detail about doing a single GPU pass through setup and will focus more on a dual GPU setup. Although if you have any questions please feel free to ask.

Software
========

BIOS / UEFI
***********

You will need to chase down and enable the IOMMU options in your BIOS, there are generally 3 or 4 places that these settings will need to be toggled, and the places where they can be found are different between all the motherboard vendors. Also of note, you will need to make sure they are set to "Enabled" instead of "Auto". Since auto is generally to deal with Windows bugs, and we want the full implementation.


Linux
*****
The Linux distro your going to use largely is irrelevant, as long as your familiar with it is the important part. I'll try to outline some of the differences in the actual technical steps where they differ. But mostly it just comes down to which boot loader and package manager your going to use to install your dependencies.

Goal
====

Here it's up to you as to what you actually want to accomplish with your VFIO / GPU pass through setup. I will outline a base set of configurations that will allow you to move onto different options later if you choose to do so. We can take a look at LookingGlass, optimization for games, different options for disks or controller pass through etc...

----

Glossary
========

BIOS
  Your computers firmware, Basic Input/Output System
UEFI
  Unified Exentsible Firmware Interface (Modern BIOS)
VFIO
  Virtual Function I/O
IOMMU 
  Input/Output Memory Management Unit


----

`Part 2 <{filename}/vfio_part2.rst>`_
