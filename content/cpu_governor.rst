cpu_governor.py a py3status module
##################################

:author: mcgillij
:category: Python
:date: 2021-01-29 22:49
:tags: Linux, Python, i3, py3status, #100DaysToOffload
:slug: cpu-governor-py3status
:summary: Another py3status module for i3, this time for showing the CPU governor
:cover_image: cpu_cover.png 

.. contents::

cpu_governor
************

A simple module for py3status written to show the status of which CPU governor that your currently using.

If your anything like me, and change the governor quite often for different workloads, this is handy information to have on your desktop to remind you to change it back when your done doing processor intensive tasks.

Screenshot
**********

.. figure:: {static}/images/cpu_governor.png
   :alt: cpu_governor screenshot

   This is what the module looks like on my system

Code
****

Below is the entirety of the code.

**cpu_governor.py**

.. code-block:: python

   
   # -*- coding: utf-8 -*-
   """
   Module to report the CPU governor state in py3status bar
   """
   
   
   class Py3status:
       cache_timeout = 600
       format = '💻: {status}'

       def _get_cpu_status(self):
           try:
               status = self.py3.command_output(["cat", "/sys/devices/system/cpu/cpu0/cpufreq/scaling_governor"])
               return {'status': status.strip()}

           except self.py3.CommandError as ce:
               return len(ce.output.splitlines())

       def cpu_governor_status(self):

           status = self._get_cpu_status()
           full_text = self.py3.safe_format(self.format, status)

           return {
               'full_text': full_text,
               'cached_until': self.py3.time_in(self.cache_timeout)
           }

   if __name__ == "__main__":
       from py3status.module_test import module_test
       module_test(Py3status)

Installation
************

To install the module just copy it to ``~/.i3/py3status/`` and add the following line to your ``~/.config/i3/i3status.conf``

.. code-block:: bash

   order += "cpu_governor"

That's it, restart your i3 session and you should be able to see your cpu governor setting.

Source
******

The source is also `available on github <https://github.com/mcgillij/cpu_governor>`_ if you don't want to copy / paste from a webpage.
