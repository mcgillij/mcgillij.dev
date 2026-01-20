Encrypted disk chain unlocking
##############################

:author: mcgillij
:category: Encryption
:date: 2026-01-19 20:49
:tags: Encryption, luks, linux, btrfs
:slug: luks-encryption-auto-unlocking
:summary: Unlocking mulitple disks from one passphrase / chain
:cover_image: encryption2.png

.. contents::


Goal
====

After installing Arch on my new machine over the holidays, I had a secondary nvme drive that I wanted to also have encrypted / unlocked during the boot process.
However I didn't want to have to remember essentially 2 passphrases, or have to type multiple passphrases on boot.

The solution:

Store encrypted key on the root disk, so when it's mounted / unencrypted, we can use that to chain unlock the secondary volume automatically.
This functionality is avavailable in cryptsetup / systemd-cryptsetup.

So it should be pretty straight forward.

Note: Do not follow these directions verbatime as they will be different on your own machines. Make sure you are comfortable with `lsblk`, `mkfs`, `parted` etc.

.. image:: {static}/images/encrypted_boot.png
   :alt: image of encryped boot process

Initial state
=============

The layout, current root disk and mounts.

.. code-block:: bash

   ~
   ❯ sudo parted /dev/nvme0n1 --script \
     mklabel gpt \
     mkpart primary 0% 100%

   ~
   ❯ lsblk
   NAME        MAJ:MIN RM  SIZE RO TYPE  MOUNTPOINTS
   zram0       252:0    0    4G  0 disk  [SWAP]
   nvme1n1     259:0    0  1.9T  0 disk
   ├─nvme1n1p1 259:4    0    1G  0 part  /boot
   └─nvme1n1p2 259:5    0  1.9T  0 part
     └─root    253:0    0  1.9T  0 crypt /var/log
                                         /var/cache/pacman/pkg
                                         /home
                                         /
   nvme0n1     259:1    0  1.9T  0 disk
   └─nvme0n1p1 259:2    0  1.9T  0 part


Formatting
==========

.. code-block:: bash

   ~
   ❯ sudo cryptsetup luksFormat /dev/nvme0n1p1
   WARNING: Device /dev/nvme0n1p1 already contains a 'vfat' superblock signature.

   WARNING!
   ========
   This will overwrite data on /dev/nvme0n1p1 irrevocably.

   Are you sure? (Type 'yes' in capital letters): YES

Generating Key
==============

.. code-block:: bash

   sudo dd if=/dev/urandom of=/root/.luks-second.key bs=4096 count=1
   sudo chmod 0400 /root/.luks-second.key

   and adding it to LUKS

.. code-block:: bash

   sudo cryptsetup luksAddKey /dev/nvme0n1p1 /root/.luks-second.key

Decrypting
==========

.. code-block:: bash

   ❯ sudo cryptsetup open /dev/nvme0n1p1 crypt_nvme_data

Mounting
========

.. code-block:: bash

   ~/second
   ❯ sudo mount /dev/mapper/crypt_nvme_data /home/j/second
   mount: (hint) your fstab has been modified, but systemd still uses
          the old version; use 'systemctl daemon-reload' to reload.

   ~/second🔒
   ❯ ls

   ~/second🔒
   ❯ lsblk
   NAME                MAJ:MIN RM  SIZE RO TYPE  MOUNTPOINTS
   zram0               252:0    0    4G  0 disk  [SWAP]
   nvme1n1             259:0    0  1.9T  0 disk
   ├─nvme1n1p1         259:4    0    1G  0 part  /boot
   └─nvme1n1p2         259:5    0  1.9T  0 part
     └─root            253:0    0  1.9T  0 crypt /var/log
                                                 /var/cache/pacman/pkg
                                                 /home
                                                 /
   nvme0n1             259:1    0  1.9T  0 disk
   └─nvme0n1p1         259:2    0  1.9T  0 part
     └─crypt_nvme_data 253:1    0  1.9T  0 crypt /home/j/second  ~/second🔒

getting drive UUID
==================

.. code-block:: bash

   sudo cryptsetup luksUUID /dev/nvme1n1p1
   xxxx-xxxx-xxxx-xxxx

/etc/fstab and /etc/crypttab
============================

❯ sudo cat /etc/fstab /etc/crypttab
**/etc/fstab**

.. code-block:: fstab

   /dev/mapper/crypt_nvme_data /home/j/second btrfs noatime,compress=zstd,ssd 0  0

.. code-block:: fstab

   crypt_nvme_data        UUID=xxxxxxxx-xxxx /root/.luks-second.key luks,x-initrd.mount


mkinitcpio.conf
===============

Make sure you have a `HOOKS=(base udev autodetect modconf block keyboard encrypt filesystems fsck)`

The importance here is to have the key **encrypt**, and have it before **filesystem**.

If it wasn't in there already you'll need to rebuild your initramfs with something like `sudo mkinitcpio -P`.

Conclusion
==========

That's about it, written mostly as a reminder to myself, for next time I ultimately have to set this up again.

But this allows chain un-encrypting disks, from one passphrase for the root volume, then using a randomly generated key to unlock the subsequent disks and mounting them during the regular boot process.
