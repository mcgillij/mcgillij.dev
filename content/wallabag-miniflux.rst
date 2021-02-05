Miniflux + Wallabag + Android client = 👍
#########################################

:author: mcgillij
:category: Web
:date: 2021-02-02 14:49
:tags: Linux, Miniflux, Wallabag, RSS, Android, #100DaysToOffload, Web
:slug: wallabag-miniflux
:summary: Setting up Miniflux with Wallabag to read articles on my Android phone.
:cover_image: wallabag.png

.. contents::

Does anyone still use RSS?
**************************

It's been a while since `Mozilla/Firefox <https://www.mozilla.org/en-CA/firefox/new/>`_ removed **live bookmarks** support from their browser.

I loved those.

All my RSS feeds in the browser as just another bookmarks toolbar, it was super convenient and worked very well for many years. But for some reason they didn't want to support it anymore. So I guess that opens the market to other RSS aggregation services/sites and apps.

I've actually written several different RSS reader applications and scripts in `Python <https://python.org>`_ to try to fill the void left by the **live-bookmarks** that Firefox had left in me, and have been searching for an alternative that works for me for quite some time.

Goal
****

Setup `Miniflux <https://miniflux.app/>`_ to fetch all my feeds, which I can parse through manually during the day and send over the choice pieces to `Wallabag <https://github.com/wallabag/wallabag>`_ for later reading, either at lunch or at nighttime using my phone. Wallabag has a nice Android client application that you can install that will interface with your Wallabag instance so you can do your reading where ever you are. The important part here is that if you choose to self-host these services, that the data is always on your own network and not managed by 3rd parties.


Miniflux
********

`Miniflux <https://miniflux.app/>`_ is an RSS aggregator. What differentiates it from the other services, is the ability to *self-host* (set it up on your own hardware or vps). This allows you finer-grain control over your data and privacy, and allows extra flexibility in the configurations available to you. 

Not having a self-hosted solution has been a pain-point for me with many of the online services that provide a similar service.

Installation
^^^^^^^^^^^^

Dependencies
%%%%%%%%%%%%

- **docker**
- **docker-compose**

Installing these services is made ridiculously easy with docker, I'll walk through my configurations.

*docker-compose.yml*

.. code-block:: docker

   version: '3.8'
   services:
     miniflux:
       restart: always
       image: miniflux/miniflux:latest
       container_name: miniflux
       ports:
         - "2080:8080"
       depends_on:
         - db
       environment:
         - DATABASE_URL=postgres://miniflux:SEKRET_PASSWORD@db/miniflux?sslmode=disable
         - RUN_MIGRATIONS=1
         - CREATE_ADMIN=1
         - ADMIN_USERNAME=admin
         - ADMIN_PASSWORD=EVEN_MORE_SECRET_PASSWORD
       extra_hosts:
         - "host.docker.internal:host-gateway"
     db:
       restart: always
       image: postgres:latest
       container_name: postgres
       environment:
         - POSTGRES_USER=miniflux
         - POSTGRES_PASSWORD=SEKRET_PASSWORD
       volumes:
         - miniflux-db:/var/lib/postgresql/data

   volumes:
     miniflux-db:


The above *docker-compose.yml* has been slightly modified from the standard one provided by Miniflux. I'll highlight the changes I've made to it. You can likely get by with just using the default configuration depending on your use-case.

I'm using a non-standard port for it since I have other services running on my server on the ports it wants to use by default.

Port configuration:

.. code-block:: docker

   ports:
     - "2080:8080"

This will allow me to access Miniflux by going to **http://MYSERVER:2080/** on my LAN(local area network).

I've also added the following lines to allow Miniflux to reach my Wallabag instance running from a separate docker-compose.yml by allowing it to talk to the **host**.

.. code-block:: docker

   extra_hosts:
     - "host.docker.internal:host-gateway"

I've also gone ahead and added the **restart** directives for the containers, so that if my server reboots, the services will come back up automagically. You can add the following lines to each container if you want that functionality as well.

.. code-block:: docker

   restart: always

That's it for my modifications, you'll need to replace your **admin** users password and **database** password as well as they are just placeholders.

Start it up
^^^^^^^^^^^

Start up your Miniflux instance with the following ``docker-compose`` command.

.. code-block:: bash

   docker-compose up -d && docker-compose logs -f

This will bring up the log console, so you can make sure your service is running properly, and you can login to it and start configuring it to your liking. More on that later when we configure it to work with Wallabag.

Wallabag
********

`Wallabag <https://github.com/wallabag/wallabag>`_ is a reader service which also provides and Android client for reading, giving you options in how you would like to access your stored articles.

- Allowing you to make offline copies of articles that you want to read at a later date
- Clean up the content removing ads
- Makes them easily available to your other devices or computers

This would potentially be a good transition format if you wanted to do your daily reading on an E-Reader device... Which I do have one.. Maybe that's my next steps here.

Installation
^^^^^^^^^^^^

So were going to create another *docker-compose.yml*, and start it up similarly to our Miniflux service.

*docker-compose.yml*

.. code-block:: docker

   version: '3.8'
   services:
     wallabag:
       restart: always
       image: wallabag/wallabag
       environment:
         - MYSQL_ROOT_PASSWORD=wallaroot
         - SYMFONY__ENV__DATABASE_DRIVER=pdo_mysql
         - SYMFONY__ENV__DATABASE_HOST=db
         - SYMFONY__ENV__DATABASE_PORT=3306
         - SYMFONY__ENV__DATABASE_NAME=wallabag
         - SYMFONY__ENV__DATABASE_USER=wallabag
         - SYMFONY__ENV__DATABASE_PASSWORD=SECRET_DATABASE_PASSWORD
         - SYMFONY__ENV__DATABASE_CHARSET=utf8mb4
         - SYMFONY__ENV__MAILER_HOST=127.0.0.1
         - SYMFONY__ENV__MAILER_USER=~
         - SYMFONY__ENV__MAILER_PASSWORD=~
         - SYMFONY__ENV__FROM_EMAIL=PUTYOURE@EMAIL.HERE
         - SYMFONY__ENV__DOMAIN_NAME=http://YOUR_SERVER_HOSTNAME_HERE:8585
         - SYMFONY__ENV__SERVER_NAME="PUT YOUR SWEET INSTANCE NAME HERE"
       ports:
         - "8585:80"
       volumes:
         - ./images:/var/www/wallabag/web/assets/images
     db:
       image: mariadb
       restart: always
       environment:
         - MYSQL_ROOT_PASSWORD=SECRET_DB_ROOT_PW
       volumes:
         - ./data:/var/lib/mysql
     redis:
       restart: always
       image: redis:alpine

Again we've gone ahead and lightly modified the *docker-compose.yml* file, I won't go over the individual changes in detail.
But I did add the **restart: always** and changed the default ports to match what I wanted on my server. Again you will need to also switch out the password information for your database connections to whatever you need.

Spin it up!
^^^^^^^^^^^

Again using ``docker-compose up -d && docker-compose logs -f`` will allow to watch the startup of the containers and check to make sure nothing's going wrong during startup.

Login to your instance, and configure it to your liking.

Linking the 2 services
**********************

OK we have both services up and running now, but they aren't talking to each other. They will do this using the Wallabag client API.

We'll start in the Wallabag settings to create our client for Miniflux.

Wallabag settings
^^^^^^^^^^^^^^^^^

.. figure:: {static}/images/wallabag_api.png
   :alt: wallabag settings

   Click the API clients management in the user settings menu

You can create a new client by clicking the **CREATE A NEW CLIENT** button in the Wallabag user settings.

Take note of the **Client ID** and **Client Secret** to pass into Miniflux, you can name your client as well if you wish.

Miniflux Settings
^^^^^^^^^^^^^^^^^

Next we move back to our Miniflux instance, and go to the settings and select **Integrations**. Scroll down and fill out your **Client ID** and **Client Secret** from your Wallabag instance along with your user credentials to the Wallabag instance.

.. figure:: {static}/images/miniflux_wallabag.png
   :alt: Miniflux Wallabag integration screenshot

   Put in your credentials and make sure to use the right endpoint

The **endpoint** should be your Wallabag container, now usually containers running in different docker-compose environments cannot see each others networks (by default). However since we added the *extra host* directive to the Miniflux configuration, we will be able to talk to our host and through that Wallabag.

So make sure your endpoint reflects this, in my case I had to connect to **http://host.docker.internal:8585** for you depending on if you modified the port settings of your Wallabag container it may be different. 

That's it for the integration bit, now you just need to save some stories in Miniflux and they will automagically appear in your Wallabag reader.

Sending stories to Wallabag from Miniflux
*****************************************

Once you've added some RSS feeds to Miniflux, and you've read some headlines that your interested in, click "Save" and the stories will be sent to your Wallabag instance, which you can easily setup the Android client to view as well if you don't want to browse through a web browser.

.. image:: {static}/images/miniflux.png
   :alt: miniflux save

Troubleshooting
***************

If for some reason you can't send the stories over to the Wallabag instance, you will need to take a peek at the logs using the commands I outlined above. But I'll put them here as well so save you from scrolling.

.. code-block:: bash

   docker-compose logs -f

This will allow you to inspect the logs of either of the docker-compose environments that we setup and allow you to see if you have maybe typed in your password incorrectly, or didn't copy/paste your client id etc.

Next steps
**********

Maybe I'll setup forwarding of the stories to my Kindle so I can read it on a nice E-ink display. 

Anyways hope you enjoy reading your stories on whichever device you choose.
