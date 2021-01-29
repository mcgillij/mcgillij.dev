http_monitor for i3 (py3status)
###############################

:author: mcgillij
:category: Python
:date: 2021-01-26 18:49
:tags: Python, Linux, #100DaysToOffload, http
:slug: i3-py3status-http-monitor
:summary: Small http monitoring script that I wrote to keep track of some services running on my server.
:cover_image: monitor.png

.. contents::

Whats **http_monitor**
**********************
A small script written to monitor some services running on my server. The goal was to have the status reflected in my desktop's status bar which is running `py3status <https://py3status.readthedocs.io/en/latest/>`_. If you're running **i3**, **py3status** and have some services (or websites) you'd like to monitor feel free to use this module.

Where to download
*****************

The script is available on `github <https://github.com/mcgillij/http_monitor>`_ along with the installation directions.

Screenshot
**********

.. image:: {static}/images/status_bar.png
   :alt: status bar with http_monitor

Installation
************

.. code-block:: bash

   git clone git@github.com:mcgillij/http_monitor.git ~/.i3/py3status/

Configuration
*************

Next you will need to add the services you want to monitor, and optionally choose some appropriate emoji's.

*~/.config/i3/i3status.conf*

.. code-block:: bash

   ...
   general {
      colors = true
      interval = 15
   }
   
   order += "http_monitor apache"
   order += "http_monitor medusa"
   order += "http_monitor pihole"
   order += "http_monitor nextcloud"
   order += "http_monitor plex"
   order += "http_monitor virtualbox"
   order += "http_monitor airsonic"
   order += "clock"
   order += "mail"
   ...
   
   http_monitor  'nextcloud' {
      service_location = "http://yourserver:8181"
      service_name = '⛅'
   }
   
   http_monitor  'virtualbox' {
      service_location = "http://yourserver:81/vb/"
      service_name = '💻'
   }
   
   http_monitor  'plex' {
      service_location = "http://yourserver:32400/web/index.html#"
      service_name = '🎥'
   }
   
   http_monitor  'airsonic' {
      service_location = "http://yourserver:4040"
      service_name = '🍃'
   }
   
   http_monitor  'pihole' {
      service_location = "http://yourserver:80"
      service_name = '🕳️ '
   }

   http_monitor  'apache' {
      service_location = "http://yourserver:81"
      service_name = '🪶'
   }

   http_monitor  'medusa' {
      service_location = "http://yourserver:8081"
      service_name = '🐍'
   }

Configuration Options
*********************

You can pass in the following configuration options:

 - service_location
 - service_name
 - timeout (http timeout for the request, default=3)
 - cache_timeout (how often it gets refreshed, default=600)
