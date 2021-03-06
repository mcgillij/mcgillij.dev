Creating a py3status module to monitor my UPS battery
#####################################################

:author: mcgillij
:category: Python
:date: 2020-12-31 19:09
:tags: UPS, Battery, Python, Tutorial, i3, #100DaysToOffload
:slug: py3status-battery-monitor
:summary: How to create a py3status module
:cover_image: battery.jpg

.. contents::

I recently bought a `CyberPower battery backup <https://www.cyberpowersystems.com/product/ups/battery-backup/gx1325u/>`_, since my apartment has crazy unreliable power, and so that my computers will stop shutting down improperly.

Setting up the UPS
******************
Battery UPS's are fairly well supported in Linux due to the popularity in the server world.
To setup your UPS you will likely need to install your distributions version of the **nut** (Network UPS Tools) package.

In Arch I had to run the following command to get the packages required for the setup.

.. code-block:: bash

   pacman -S nut usbutils

This installed the required packages and also the ``lsusb`` utility to allow some better debugging and fetching of some of the required information for configuration.

The **nut** package comes with a great utility to scan for batteries and essentially generate your configuration for you. I was able to run the ``sudo nut-scanner`` command to succesfully probe my battery and create the configuration file for it.

Here is the output of the above command for me:

.. code-block:: bash

   [nutdev1]
	driver = "usbhid-ups"
	port = "auto"
	vendorid = "0764"
	productid = "0501"
	product = "LX1325GU"
	serial = "QAQJV2001010"
	vendor = "CPS"
	bus = "001"

Once you are able to probe your batter and make a configuration file for it, you can save it in ``/etc/nut/ups.conf`` and you can give it a name I choose to name it *battery*.

So my configuration in /etc/nut/ups.conf looks like:

.. code-block:: bash

   [battery]
	driver = "usbhid-ups"
	port = "auto"
	vendorid = "0764"
	productid = "0501"
	product = "LX1325GU"
	serial = "QAQJV2001010"
	vendor = "CPS"
	bus = "001"

UPSD
****
Now we can setup **upsd** to allow us to query the server for the various battery stats and configurations.

The default configuration for me was fine in ``/etc/nut/upsd.conf``, so I just created a ``/etc/nut/upsd.users`` to create a user that I'll be able to use in my i3 py3status plugin to query the battery status.

.. code-block:: bash

   [myuser]
     password = sekretpassword
     upsmon master
     actions = SET
     instcmds = ALL

With this file in place we can start the service with ``systemctl start nut-server.service``. If everything came up alright you be able to query the status of the battery with ``upsc battery`` and it should output something like:

.. code-block:: bash

   battery.charge: 100
   battery.charge.low: 10
   battery.charge.warning: 20
   battery.mfr.date: CPS
   battery.runtime: 420
   battery.runtime.low: 300
   battery.type: PbAcid
   battery.voltage: 24.0
   battery.voltage.nominal: 24
   device.mfr: CPS
   device.model: LX1325GU
   device.serial: QAQJV2001010
   device.type: ups
   driver.name: usbhid-ups
   driver.parameter.bus: 001
   driver.parameter.pollfreq: 30
   driver.parameter.pollinterval: 2
   driver.parameter.port: auto
   driver.parameter.product: LX1325GU
   driver.parameter.productid: 0501
   driver.parameter.serial: QAQJV2001010
   driver.parameter.synchronous: no
   driver.parameter.vendor: CPS
   driver.parameter.vendorid: 0764
   driver.version: 2.7.4
   driver.version.data: CyberPower HID 0.4
   driver.version.internal: 0.41
   input.voltage: 115.0
   input.voltage.nominal: 120
   output.voltage: 139.0
   ups.beeper.status: enabled
   ups.delay.shutdown: 20
   ups.delay.start: 30
   ups.load: 52
   ups.mfr: CPS
   ups.model: LX1325GU
   ups.productid: 0501
   ups.realpower.nominal: 810
   ups.serial: QAQJV2001010
   ups.status: OL LB
   ups.test.result: No test initiated
   ups.timer.shutdown: -60
   ups.timer.start: -60
   ups.vendorid: 0764

We can also use **upsc** to querying for a single attribute like this ``uspc battery ups.status`` which output something like: 

``OL LB``

So whats OL and LB mean? Those are NUT status codes returned from the UPS device itself. The **OL** means "Online", and the **LB** means "Low battery". Since I just got my UPS this makes sense, it's still got to charge up the battery since they can't ship them charged. You can find other `nut status codes here <https://networkupstools.org/docs/man/genericups.html>`_

So that will allow me to pull the status into my python module to get the status onto my desktop enviornment. However we can still setup a few more UPS related settings to make our lives easier in the future.

Finally we can **enable** the service with ``systemctl enable nut-server.service``.

UPSMON
******

Now that we can query our battery we can use **upsmon** to run commands based on the status of our UPS. In short we can tell it to turn off our computers gracefully after a power outtage instead of just yanking the power cord.

For this we will want to edit the following file ``/etc/nut/upsmon.conf`` and add a similar line to your configuration.

.. code-block:: bash

   MONITOR battery@localhost 1 myuser sekretpassword master

From here you can start the service with ``systemctl start nut-monitor.service`` and if it's configured properly after checking the *status* of it with ``systemctl status nut-monitor.service``, finally you can *enable* it with ``systemctl enable nut-monitor.service``

This is the configuration where you can manage how your machine will shutdown once it's running on battery power, you can also setup alerting or email notifications from here. However for me I just wanted my machines to shutdown properly as there's nothing mission critical running on them.

i3 and py3status
****************

This was about writing a monitor for my battery, so onward to that. On my desktop I'm running `i3 <https://i3wm.org/>`_ and as a replacement to the *i3bar* I'm running `py3status <https://github.com/ultrabug/py3status>`_

Changing the default **bar** in *i3* is super simple, find your configuration file (usually in ``~/.config/i3/config``), and update the following section.

.. code-block:: bash

   bar {
        status_command i3status
   }

and replace it with

.. code-block:: bash

   bar {
        status_command py3status
   }

By default *py3status* will use the default **i3status.conf**. So we can edit it and add a section for our custom python module.

I'm calling my python module **battery_status** since there was already a module named battery in there that seems to be for laptops.

Adding my module to the **~/.config/i3/i3status.conf**

.. code-block:: bash

   ...
   order += "uptime"
   order += "arch_updates"
   order += "battery_status" #<<<<<<<<<< Our custom module
   order += "volume_status"
   ...

Restarting *i3* now will essentially give us a placeholder where our module should be loaded since we haven't written it yet.

Writing the module
******************

In ``.i3/py3status/`` create a file called **battery_status.py** as py3status checks that directory for custom modules on startup. Or you can fetch the file from my `Github account <https://github.com/mcgillij/py3status-ups-battery-monitor>`_.

The contents of the file is pretty simple, and there's lots of room for improvements should you want to add some runtime configuration or more statistics, but for my purpose I just wanted to get the status onto my desktop.

**battery_status.py**

.. code-block:: python

   # -*- coding: utf-8 -*-
   """
   Module to report the battery level from my UPS
   
   Dependencies: upsc
   And assumes you have named your UPS 'battery'
   If you named it something else you can set it below in the command
   """
   
   class Py3status:
       cache_timeout = 600
       format = 'Battery: {status}'
   
       def _get_battery_status(self):
           try:
               status = self.py3.command_output(["upsc", "battery", "ups.status"])
               return {'status': status.strip()}

           except self.py3.CommandError as ce:
               return len(ce.output.splitlines())

       def battery_status(self):
   
           status = self._get_battery_status()
           full_text = self.py3.safe_format(self.format, status)
   
           return {
               'full_text': full_text,
               'cached_until': self.py3.time_in(self.cache_timeout)
           }

That's the entirety of the module, the magic is from ``self.py3.command_output()`` which just runs a terminal command and returns the output, we strip off any new lines and then just feed it back to the formatter. The `docs for py3status <https://py3status.readthedocs.io/en/latest/>`_ are well written and easy to follow along.

Once that's in place you can just restart i3 and you should now have the status of your battery available to you on your desktop.

It should look something like: 

.. image:: {static}/images/battery_status.png
   :alt: battery status displayed in py3status bar
