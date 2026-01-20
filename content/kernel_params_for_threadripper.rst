Threadripper and Radeon Pro Linux Kernel settings
#################################################

:author: mcgillij
:category: Linux
:date: 2026-01-18 21:49
:tags: Kernel, AMD, linux, Radeon
:slug: kernel-parameters-for-threadripper
:summary: Some helpful kernel parameters to do with my motherboard / threadripper / amd radeon pros
:cover_image: encryption2.png

.. contents::

Context
=======

Just keeping a note of some of kernel parameters I put in place in my **/boot/EFI/limine/limine.conf** to speed up the boot
of my threadripper system along with making sure the display port inputs of my secondary radeon pro aren't used so the card can be used exclusively for gpu-compute.

There were also some USB controller issues with my Asus TRX50 sage motherboards USB controllers that required some kernel parameters to fix.

Here's my full entry:

.. code-block:: ini

   /Arch Linux (linux-zen)
    protocol: linux
    path: boot():/vmlinuz-linux-zen
    cmdline: cryptdevice=PARTUUID=1e0229e8-c916-4f6a-bcd8-c7079981776b:root root=/dev/mapper/root zswap.enabled=0 rootflags=subvol=@ rw rootfstype=btrfs acpi_enforce_resources=lax usbcore.initial_descriptor_timeout=500 usbcore.autosuspend=-1 loglevel=3 amdgpu.dc=1 video=PCI:0000:23:00.0:d amdgpu.dcdebugmask=0x10 amdgpu.gpu_recovery=1 pcie_aspm=off
    module_path: boot():/initramfs-linux-zen.img

The custom entries that were added:

* acpi_enforce_resources=lax
* usbcore.initial_descriptor_timeout=500
* usbcore.autosuspend=-1
* loglevel=3
* amdgpu.dc=1
* video=PCI:0000:23:00.0:d
* amdgpu.dcdebugmask=0x10
* amdgpu.gpu_recovery=1
* pcie_aspm=off


Bonus firefox settings
======================

Just jotting these down as they don't really need to be included in their own posts, but they are handy to running large resolutions / diffs from the stock settings that I use on my other machines.

**about:config**

Search for **devp**:

* `layout.css.devPixelsPerPx` setting this to 1.2 is pretty good for 4k resolution
* `mousebutton.4th.enabled` set to false (just because of discord push to talk using this in my setup)
