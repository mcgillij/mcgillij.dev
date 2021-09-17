Qubes installation
##################

:author: mcgillij
:category: Linux
:date: 2021-09-16 22:49
:tags: Linux, Qubes, Virtualisation, VM, Fedora, Debian, Whonix, #100DaysToOffload
:slug: qubes-installation
:summary: Brief overview of Qubes and the installation process.
:cover_image: qubes.png

.. contents::


Keep em separated
*****************

What is `Qubes <https://www.qubes-os.org/>`_ (Reasonably secure OS).

A virtualisation masterpiece built around `Xen Dom0 <https://wiki.xenproject.org/wiki/Dom0>`_ and Fedora. A security focused Polish lady named Joanna Rutkowska founded / created the idea for Qubes. Focusing on security through isolation using virtualisation.

Building an OS where every application and even OS layer cannot be trusted, and thus can be replaced with alternate or disposible VM layers each with varying degree's of security(paranoia) applied to them.

.. image:: {static}/images/qubes_partition_data_flow.jpg
   :alt: qubes separations
   :class: image-process-large-photo

Qubes also allows classification of the security contexts (via color coding of security levels). So that you can easily determine if a VM/Application is related to your "work" or insecure/disposable or personal etc.

This enable use-cases that would otherwise be very hard to configure on a stand-alone Linux installation.

Allowing for instance running certain applications over a Tor network stack, while keeping all your internet banking separate. While being able to separate all your "work" and personal information in separate VM's that could be running totally different versions of Linux or Windows. While hard to verbally describe. It's simple to visualize the separation of concerns.

.. figure:: {static}/images/qubes_example.png
   :alt: image of 3 security contexts
   :class: image-process-large-photo

   In this example, the word processor runs in the “work” domain, which has been assigned the “blue” label. It is fully isolated from other domains, such as the “untrusted” domain (assigned the “red” label – “Watch out!”, “Danger!”) used for random Web browsing, news reading, as well as from the “work-web” domain (assigned the “yellow” label), which is used for work-related Web browsing that is not security critical. Apps from different domains run in different AppVMs and have different X servers, filesystems, etc. 

Pre-requisites
**************

For Qubes to work properly, you will need an Intel CPU with VT-x or AMD CPU with SVM along with IOMMU support allowing for physical device pass through to your virtual machines.

To check your CPU flags for SVM:

.. code-block:: bash

   cat /proc/cpuinfo |grep svm

Installation
************

Let's go over the installation steps, it's essentially like installing any other Linux distro. With a bit of post setup configuration thrown in for good measure.

.. image:: {static}/images/qubes1.png
   :alt: qubes language selection

Selecting the default language / keyboard layout.

.. image:: {static}/images/qubes2.png
   :alt: qubes installation summary

From the installation summary page you can modify your installation and setup your full disk encryption (except boot) using the hard drive partitioning selection to continue the installation.

.. image:: {static}/images/qubes3.png
   :alt: qubes harddrive partitioning

From here you can encrypt and choose your partitioning scheme along with encryption pass-phrase.

.. image:: {static}/images/qubes4.png
   :alt: qubes creating user during installation

You are prompted to create your user account during the actual installation process.

.. image:: {static}/images/qubes5.png
   :alt: qubes installation complete

That's it reboot, and onto the post-install configuration steps.

.. image:: {static}/images/qubes6.png
   :alt: qubes post install configuration / setup

From here a bit of house keeping for how you actually want your system to run / startup. And you will be thrown into the desktop environment afterwards.


Post-Install
************

Once installed and configured, you will be greeted with a relatively tame XFCE desktop environment, with a menu that's been pre-populated with all the Qubes goodies / Template VM's and Qubes manager.

.. image:: {static}/images/qubes7.png
   :alt: qubes manager

The Qubes manager allows the management of all the VM's through Dom0's virtual machine manager.

.. image:: {static}/images/qubes7.png
   :alt: qubes menu

Here's what the menu looks like basically just allowing launching all sorts of Virtual machines, which you will later be able to configure as separate environments for each of the application contexts that you will be running. There is a fair bit of work in using Qubes. However the benefits are literally security. So sometimes things are worth the bit of extra effort.

