Automating the little things
############################

:author: mcgillij
:category: Linux
:date: 2021-03-16 23:49
:tags: Linux, bash, automation, Docker, #100DaysToOffload
:slug: automating-the-little-things
:summary: Small automation for my server
:cover_image: automation.png 

.. contents::

Another day, another service needing some random update on my server. Tired of manually updating my containers, I setup a small script to run in cron on my server as my user.

**update_services.sh**

.. code-block:: bash

   #!/bin/bash
   set -xue -o pipefail

   services=( airsonic linkding miniflux nextcloud owncast pihole plex pymedusa valheim wallabag )

   for service in "${services[@]}"; do
       cd "${service}" && docker-compose pull && docker-compose up -d && cd ..
   done

While this script is dead simple, you'd be hard pressed to not be able to understand whats going on here. However it saves me a decent amount of time every week.

No longer having to **ssh** into my server and arbitrarily run some ``docker-compose`` pulls for various services.

That's it for today.
