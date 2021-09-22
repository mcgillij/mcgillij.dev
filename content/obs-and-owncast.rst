Open Broadcast Software and Owncast on Linux with Nginx and LetsEncrypt
#######################################################################

:author: mcgillij
:category: Linux
:date: 2021-09-19 23:49
:tags: Linux, Streaming, OBS, Owncast, nginx, LetsEncrypt, #100DaysToOffload
:slug: obs-and-owncast
:summary: Open Broadcast Software (OBS) and Owncast all running in Linux, the perfect open source streaming solution?
:cover_image: obs.png

.. contents::

Intro
*****

We will be covering the installation and setup of **OBS** and `Owncast <https://owncast.online>`_ on Linux.

And then the installation of Owncast on a remote VPS or server to allow for the best possible streaming setup (alternatively you can set this all up on one machine, but your machine will also be doing the heavy lifting of encoding and streaming as well so it's not optimal). This is commonly referred to as a dual-pc streaming setup or separate streaming PC.

Pre-reqs:
^^^^^^^^^

- VPS or server
- Access to your routers port forwarding
- Linux
- Podman (or Docker if you're hard up)
- Domain name

Installing **podman** isn't covered in this document, however I wrote up a story not too long ago that you can `find here <https://mcgillij.dev/podman-compose.html>`_ that should cover the installation and basic usage required.


OBS - Open Broadcast Software / OBS Studio
******************************************

Pretty much the industry standard for streaming, not a whole lot to say here, and it's Linux support is outstanding.

You can find out more on the `OBS site <https://obsproject.com/>`_.

Installation:
^^^^^^^^^^^^^

Install obs-studio with your distributions package manager. We'll be using **pacman** to install OBS, the following will install it along with it's dependencies. We will be installing this on the machine that we will be streaming from.

And Owncast will be installed on our "server" or VPS.

.. code-block:: bash

   pacman -S obs-studio

That's all that's required for installing OBS. We will move onto the configuration once we setup Owncast below.

Owncast
*******

Owncast is an open source alternative streaming site / software that's easy to self-host. It includes an optional (opt-in, through the admin interface) `directory service <https://directory.owncast.online/>`_, which will let you list your stream in their directory if that's something that your interested in.

There are `several methods <https://owncast.online/quickstart/>`_ for setting up Owncast, however I'm going to cover the **podman** method since they don't cover that on their website.
We will start by creating a **bash** script on our server so we don't have to remember a bunch of flags every time we want to start our Owncast server.

**start_owncast**

.. code-block:: bash

   #!/bin/bash
   OWNCAST_HOME="${HOME}/podman_owncast"
   mkdir -p "${OWNCAST_HOME}"
   podman run -d -v "${OWNCAST_HOME}":/app/data -p 8080:8080 -p 1935:1935 -it gabekangas/owncast:latest

Now we just need to run our script to setup our Owncast podman image. First we will make our script executable.

.. code-block:: bash

   chmod 700 start_owncast

And now we can startup Owncast anytime by logging into our server and running the **start_owncast** script like.

.. code-block:: bash

   ./start_owncast

Checking to make sure it's working properly.

.. code-block:: bash

   $ podman ps
   CONTAINER ID  IMAGE                                   COMMAND         CREATED        STATUS            PORTS                                           NAMES
   fec0bebc97be  docker.io/gabekangas/owncast:latest     /app/owncast    4 seconds ago  Up 4 seconds ago  0.0.0.0:1935->1935/tcp, 0.0.0.0:8080->8080/tcp  busy_khorana

From here we can see ``0.0.0.0:1935->1935/tcp, 0.0.0.0:8080->8080/tcp`` that our Owncast service is listening on ports 1935 and 8080 on our server. So we should be good to move to setting up a reverse proxy.

Nginx Reverse proxy
*******************

We will be using Nginx (but you can use any other web server if you want) for our reverse proxy (I already had it installed on my server so I just used it).

This will allow us to serve our Owncast instance to the internet over HTTPS, and terminate SSL on our proxy and redirect to our Owncast service running in podman.

Installing Nginx
^^^^^^^^^^^^^^^^

We install Nginx on our server (my servers running Debian, so I'll be using **apt** below, but use whatever your distributions package manager is to install it).

You can also just run nginx in a podman container, however I was already running Nginx on my server, so I just modified it's configuration (I should eventually move it to a podman container but I didn't have time tonight).

.. code-block:: bash

   apt-get update && apt-get install nginx

Once installed, we will want to make sure that it is accessible on the internet.

Port forwarding
^^^^^^^^^^^^^^^

You may have to login to your router, and setup some port forwarding rules (if you ware setting this up at home behind a NAT, otherwise on your VPS just make sure that your host is accessible over port 80 and 443. So that we can request a **Let's Encrypt** SSL certificate.

Certbot
^^^^^^^

Once you've verified that your web server is internet accessible (you may have to use a service like `geopeeker <https://geopeeker.com>`_ to make sure.
 
We will request an SSL certificate with the `EFF's <https://www.eff.org>`_ `certbot <https://certbot.eff.org/>`_

Go through their excellent documentation, and choose your web server / server OS, get it installed and eventually you'll have some certificates created in ``/etc/letsencrypt/<YOURDOMAINNAMEHERE>/``

Now we just create a couple *symbolic links* from those certs over to the `/etc/nginx/ssl` folder.

.. code-block:: bash

   ln -s /etc/letsencrypt/YOURDOMAIN/YOURDOMAIN/fullchain.pem /etc/nginx/ssl/yourcert.crt
   ln -s /etc/letsencrypt/YOURDOMAIN/YOURDOMAIN/privkey.pem /etc/nginx/ssl/yourcert.key

And add a new **nginx** configuration ``/etc/nginx/conf.d`` we can call it *owncast.conf* for now edit the content below inputting your certificates and `HOSTNAME`.

**/etc/nginx/conf.d/owncast.conf**

.. code-block:: bash

   server {
     listen 443 ssl http2;
     server_name PUTYOURDOMAINNAMEHERE;
     client_max_body_size 100M;

     ssl_protocols TLSv1.1 TLSv1.2;
     # link to the certs generated by let's encrypt certbot below
     ssl_certificate /etc/nginx/ssl/yourcert.crt;
     ssl_certificate_key /etc/nginx/ssl/yourcert.key;

     access_log /var/log/nginx/PUTYOURDOMAINNAMEHERE.log;
     location / {
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_http_version 1.1;
         proxy_set_header X-Forwarded-Proto $scheme;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection $connection_upgrade;
         proxy_pass http://127.0.0.1:8080;
     }
   }

Restart your Nginx server or container.

.. code-block:: bash

   systemctl restart nginx

Your service should now be accessible and wrapped in SSL/HTTPS.

Configure OBS -> streaming server
*********************************

Now we just need to open OBS, click on the ``File -> Settings`` menu, and onto the **Streaming** tab.

.. image:: {static}/images/obs_stream.png
   :alt: OBS stream settings

Enter your domain name and Stream key (Hint: username: admin, Stream Key: **abc123**, if you haven't configured it in Owncast yet).

You should now be able to hit the **Start Streaming** button in OBS, and your off to the races.

Owncast exposes an **Admin** interface that lets you customize your instance, you can access it by going to your **domain/admin**.
