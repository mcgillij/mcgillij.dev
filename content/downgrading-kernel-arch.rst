Downgrading your Linux kernel in Arch Linux
###########################################

:author: mcgillij
:category: Linux
:date: 2021-06-27 21:49
:tags: Linux, Arch, AMD, amdgpu, #100DaysToOffload
:slug: downgrading-linux-kernel-archlinux
:summary: Quick write up of downgrading your Linux kernel using Arch Linux in the event of some issues.
:cover_image: pacman.jpg

.. contents::

Downgrading your kernel
***********************

Why downgrade your kernel? Isn't the bleeding edge of Arch always the best? **/s**

Sometimes there are bugs in computer programs (I know right, how impossible to believe). For the most part Linux kernel issues haven't affected me in a while. However over the weekend I updated to *5.12.13* and I ran into some weird issues with my video cards. They seemed to be running full blast while doing nothing... Turns out there was a regression in the 5.12.13 release that caused this. Bug in question can be found `here <https://gitlab.freedesktop.org/drm/amd/-/issues/1632>`_.

So it was time to downgrade.

Options
*******

There are a several options to downgrading in Arch

- Arch Linux Archives repositories
- *downgrade* or *downgrader-git* from AUR's
- Arch Rollback Machine
- pacman

I'll just go over the details of the easiest one (this is assuming that you don't vehemently clear your **paccache** with ``paccache -r`` every couple minutes) which is just using **pacman**, which you likely use to install packages anyways so you should already know how to use this. But you may not be aware of how to actually go and re-install old packages (or in this case kernels).

The Downgrade
*************

OK so lets go take a peek at what downgrades we have available. We'll want to go check the **/var/cache/pacman/pkg** directory to see whats available.

.. code-block:: bash

   cd /var/cache/pacman/pkg && ls -al |grep linux | grep -v sig

   rw-r--r--   1   root   root     94 MiB   Thu Jun 10 14:35:18 2021    linux-5.12.10.arch1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     94 MiB   Wed Jun 16 19:14:38 2021    linux-5.12.11.arch1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     94 MiB   Fri Jun 18 20:19:31 2021    linux-5.12.12.arch1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     95 MiB   Wed Jun 23 14:16:19 2021    linux-5.12.13.arch1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     95 MiB   Fri Jun 25 20:49:37 2021    linux-5.12.13.arch1-2-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root      1 MiB   Sun May 16 23:06:40 2021    linux-api-headers-5.12.3-1-any.pkg.tar.zst
   rw-r--r--   1   root   root    167 MiB   Sat May 15 03:32:38 2021    linux-firmware-20210511.7685cf4-1-any.pkg.tar.zst
   rw-r--r--   1   root   root     98 MiB   Thu Jun 10 14:35:17 2021    linux-zen-5.12.10.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     98 MiB   Wed Jun 16 19:14:38 2021    linux-zen-5.12.11.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     98 MiB   Fri Jun 18 20:19:31 2021    linux-zen-5.12.12.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     98 MiB   Wed Jun 23 14:16:19 2021    linux-zen-5.12.13.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     98 MiB   Fri Jun 25 20:49:38 2021    linux-zen-5.12.13.zen1-2-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     24 MiB   Thu Jun 10 14:35:18 2021    linux-zen-headers-5.12.10.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     24 MiB   Wed Jun 16 19:14:39 2021    linux-zen-headers-5.12.11.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     24 MiB   Fri Jun 18 20:19:32 2021    linux-zen-headers-5.12.12.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     24 MiB   Wed Jun 23 14:16:20 2021    linux-zen-headers-5.12.13.zen1-1-x86_64.pkg.tar.zst
   rw-r--r--   1   root   root     24 MiB   Fri Jun 25 20:49:39 2021    linux-zen-headers-5.12.13.zen1-2-x86_64.pkg.tar.zst

Alright so it looks like we still have a few options here for kernel's to roll back to stored locally. Why go to the Internet when you don't have to.

So there were problems with the ~5.12.13~ kernel's. So I'm just going to roll-back to the *5.12.12* release. You can do the same if needed with the following command.

.. code-block:: bash

   sudo pacman -U linux-5.12.12.arch1-1-x86_64.pkg.tar.zst linux-zen-5.12.12.zen1-1-x86_64.pkg.tar.zst linux-zen-headers-5.12.12.zen1-1-x86_64.pkg.tar.zst
   sudo grub-mkconfig -o /boot/grub/grub.cfg

That's it. You'll be prompted saying that your downgrading some packages. The second line is not always required, unless you've changed something recently with your grub configuration.

Reboot
******

Profit, or in this case, make my video cards not run at 100% all the time.
