Installing Lineage on my Pixel 2xl
##################################

:author: mcgillij
:category: Linux
:date: 2022-08-24 22:30
:tags: Linux, LineageOS, Pixel, Android
:slug: lineage-on-pixel-2xl
:summary: Overview of how to install Lineage on my Pixel 2xl
:cover_image: lineageos.png

.. contents::

My Pixel 2xl was really starting show it's age, with the battery life trending downwards.

And being several years out of support from Google, stuck on Android 11.

I decided to install LineageOS on the phone, and I'll go into details the process of doing so from Arch Linux.

Here's a link to the `official documentation <https://wiki.lineageos.org/devices/taimen/install>`_ it's quite great and comprehensive.


Pre-requisites on your desktop
------------------------------

In Arch Linux, you will need the **android-tools** package that contains the ``adb`` and ``fastboot`` binaries.

You can install it with the following command:

.. code-block:: bash

    $ sudo pacman -S android-tools

You will need to download the recovery image for LineageOS and the OS image for your phone `from here <https://download.lineageos.org/taimen>`_.

They will be named something like **lineage-19.1-20220811-recovery-taimen.img** and **lineage-19.1-20220811-nightly-taimen-signed.zip**

If you want to install Google Play services, you will need to install the **MindTheGapps-12.1.0-arm64-20220605_112439.zip** package which can be found `here <https://androidfilehost.com/?w=files&flid=322935>`_.

Pre-requisites on your phone
----------------------------

Your phone will need to have **developer mode** enabled, OEM unlocked and USB Debugging. These options are available in the **Settings -> System -> Developer** menu.

Enabling the developer options is quick, go to *Settings -> About*, find the *build number* and mash on it 7 times.

Once those settings are all enabled. We will use **fastboot** to fully unlock the bootloader.


Open your terminal of choice
----------------------------

From a terminal you can verify that you can connect to your phone with **adb** using the following command after plugging in the USB cable.

.. code-block:: bash

    $ adb devices
    > List of devices attached
    > 905KTBA1965395    device

If you see the device there, you should be good to go.

Rebooting into the bootloader
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can reboot into the bootloader now with:

.. code-block:: bash

    $ adb reboot bootloader

Watch your phone reboot itself into the bootloader, and from there you can unlock the bootloader fully.

.. code-block:: bash

    $ fastboot flashing unlock

Then you'll have to press "yes" on the phone to continue the process.

Flashing the recovery image
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Next we will flash and boot into the recovery image for LineageOS.

.. code-block:: bash

    $ fastboot flash recovery lineage-19.1-20220811-recovery-taimen.img

This should only take a couple seconds, and use your phones volumes buttons to select booting into recovery mode and hit the power button.

You should be greeted with the LineageOS recovery menu, which we will now use to install LineageOS proper.

You may have to re-plug your USB cable, to make it appear with **adb devices**.

Once you've validated that it's connected, you will click on the **Apply Update** button, and **Apply from ADB**.

Which will setup the phone for sideloading, which we will use to install the full LineageOS image using the following command:

.. code-block:: bash

    $ adb sideload lineage-19.1-20220811-nightly-taimen-signed.zip

At this point you are potentially done (if you don't want any of the Google apps, you can reboot now and enjoy LineageOS).

Installing MindTheGapps
^^^^^^^^^^^^^^^^^^^^^^^

If you want to run some of the Google Play services, you will need to install the **MindTheGapps-12.1.0-arm64-20220605_112439.zip** package as well.

From the recovery menu you will need to choose **Advanced** and **Reboot to Recovery**, then select **Apply Update** and **Apply from ADB** again, and repeat the sideloading process once again for the MindTheGapps package as seen below.

.. code-block:: bash

    $ adb sideload MindTheGapps-12.1.0-arm64-20220605_112439.zip

You will need to accept installing the unsigned package from the phone, and with that installed you can reboot your device and you're good to go.

.. image:: {static}/images/lineage_on_phone.png
    :alt: LineageOS on phone

.. image:: {static}/images/lineage_about.png
    :alt: LineageOS about

It's really incredible what the LineageOS team has done to give us better support for end of life devices. Great work guys, it really runs great.
