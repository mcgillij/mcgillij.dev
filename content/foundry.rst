Foundry setup in Linux
######################

:author: mcgillij
:category: Dice
:date: 2021-01-13 23:04
:tags: Linux, Dice, Dungeons and Dragons, pen and paper, #100DaysToOffload, Docker
:slug: foundry-vtt-self-hosting
:summary: Quick setup guide for self-hosting Foundry VTT
:cover_image: woods.jpg

.. contents::

Whats FoundryVTT?
*****************

`Foundry VTT <https://foundryvtt.com>`_ is a virtual tabletop to play traditionally pen and paper games on the internet with friends. That's a fancy way to say, it's to play *Dungeons and Dragons* with your friends, while the pandemic is going on.

While it's not the first of it's kind as there are many virtual tabletop alternatives, `Tabletop Simulator <https://store.steampowered.com/app/286160/Tabletop_Simulator/>`_, `Roll20 <https://roll20.net>`_, etc.

However it is one of the only ones that I know of that allow you to self-host, which allows you some freedoms that the other VTT's either don't offer, or you would have to pay a subscription fee for the same features.

Self-Hosting
************

Self-Hosting allows you to store as many assets for you and your players as you have storage available, something that's not a possibility with some of the other services without paying some hefty fees. This isn't a comparison between all the various VTT's though, so onward to some information about self-hosting.

Some things to consider when self-hosting, where's it going to live?

- Do you have a spare server kicking around?
- Some Amazon/Azure/Google credits for some cheap cloud hosting?
- Are you going to run it locally?

Should it remain on at all times?
Do you want it available over the internet or just on your LAN?

Prerequisites
**************

I'll provide a couple different solutions for self-hosting on Linux, using either *systemd* or `Docker <https://docker.com>`_ with `docker-compose <https://docs.docker.com/compose/>`_.

- node installed, or in a docker image
- systemd or docker
- a Linux box

You can likely host in Windows as well, that will not be covered here.

Local Installation
******************

Dependencies
^^^^^^^^^^^^

For a local installation you will need to have the *nodejs* package installed since Foundry is a node application.

In Debian:

.. code-block:: bash

   apt install -y libssl-dev
   curl -sL https://deb.nodesource.com/setup_14.x | bash -
   apt install -y nodejs

On Arch:

.. code-block:: bash

   pacman -S node-lts-fermium

Extracting and running Foundry
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: bash

   unzip foundryvtt.zip
   cd foundryvtt/
   node resources/app/main.js

After extracting your copy of the Foundry download, *cd* into it's directory and run the **foundryvtt** script. And then you can hit **https://localhost:30000** in your browser and access your copy of Foundry from there. When your done you can just *ctrl-c* and turn it off again.

Data
^^^^

You will likely want to create a *data* folder as well to store your resources and world configurations, you can just make this along side your extracted foundry folder for the sake of this exercise.

.. code-block:: bash

   mkdir foundry_data

Now to use your data folder you can pass in a parameter to the *foundryvtt* script when starting it up as follows:

.. code-block:: bash

   ./foundryvtt --dataPath=../foundry_data

Persistence
***********

The above setup will work if you don't care about your instance being available 24/7. Below I will walk you through setting it up to start up every time your system boots up using *systemd* and *docker*. You do not need both of these configurations, they are just options, choose whichever you like or are most familiar with and go with that.

systemd
^^^^^^^

For *systemd* to know how to start the service at system boot, you will need to add the following file in ``/etc/systemd/system/foundry.service``

.. code-block:: bash

   [Unit]
   Description=foundry
   After=network.target

   [Service]
   ExecStart=node /home/<yourusernamehere>/foundry/resources/app/main.js --dataPath=/home/<yourusernamehere>/foundry_data
   Restart=always
   User=<yourusernamehere>
   Group=<yourusernamehere>
   Environment=PATH=/usr/bin:/usr/local/bin
   Environment=NODE_ENV=production
   WorkingDirectory=/home/<yourusernamehere>/foundry

   [Install]
   WantedBy=multi-user.target

Once in place, you can start the service with ``systemctl start foundry.service``, and to make sure it's running OK you can check the status with ``systemctl status foundry.service`` and make sure it's bound to the right port with a ``netstat -an |grep 30000``. If those 2 pre-conditions are met you can just **enable** the service with the following command: ``systemctl enable foundry.service``. Now your service should restart when your server or machine reboots.

Docker and docker-compose
*************************

Similarly to the *systemd* method we will need to create some files for our running environment. Create the below Dockerfile.

*Dockerfile*

.. code-block:: dockerfile

   FROM debian:bullseye
   RUN mkdir data
   WORKDIR foundry
   COPY foundryvtt.zip .

   RUN apt-get update && apt-get install -y curl unzip libssl-dev && \
       curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
       apt-get install -y nodejs && apt-get clean
   RUN unzip foundryvtt.zip && rm -f foundryvtt.zip

   CMD node resources/app/main.js --dataPath=/data

With this file created in the same directory as your downloaded *foundryvtt.zip* file you can build your image with the following docker command:

.. code-block:: docker

   docker build -t foundry .

This will also tag your image to be named *foundry*. Now you could start up your instance with just this image, however you would need to pass it a bunch of parameters every time you wanted to restart it etc. So will go ahead and make a quick *docker-compose.yml* file for it.

docker-compose.yml
******************

Next we will create a **docker-compose.yml** file for our image, to allow us to manage it's life-cycle (restarting when the box reboots and volume mounts more easily than remembering a bunch of commands to pass to docker).

Create the following docker-compose.yml file in the same directory.

*docker-compose.yml*

.. code-block:: dockerfile

   version: '3'
   services:
     foundry:
       image: foundry:latest
       build:
         context: .
         dockerfile: Dockerfile
       restart: unless-stopped
       network_mode: host
       volumes:
         - /home/<yourusernamehere>/foundry_data:/data


Once this file is created, you will be able to use *docker-compose* to manage your foundry server.

Building
^^^^^^^^

.. code-block:: bash

   docker-compose build

This command will build your Dockerfile using docker-compose, if you ever want to update to a newer version of foundry, you will need to download the new zip file from the Foundry website, place it in the same folder, and then call the build again.

Standing up
^^^^^^^^^^^

.. code-block:: bash

   docker-compose up -d && docker-compose logs -f

This command will stand up your docker image and show you the logs to make sure everything's alright. The output should look something like: 

.. code-block:: bash

   foundry    | FoundryVTT | 2021-01-14 03:00:05 | [info] Foundry Virtual Tabletop - Version 0.7.9
   foundry    | FoundryVTT | 2021-01-14 03:00:05 | [info] Running on Node.js - Version 14.15.4
   foundry    | FoundryVTT | 2021-01-14 03:00:05 | [info] Loading data from user directory - /data
   foundry    | FoundryVTT | 2021-01-14 03:00:05 | [info] Application Options:
   foundry    | {
   foundry    |   "port": 30000,
   foundry    |   "upnp": true,
   foundry    |   "fullscreen": false,
   foundry    |   "hostname": null,
   foundry    |   "routePrefix": null,
   foundry    |   "sslCert": null,
   foundry    |   "sslKey": null,
   foundry    |   "awsConfig": null,
   foundry    |   "dataPath": "/data",
   foundry    |   "proxySSL": false,
   foundry    |   "proxyPort": null,
   foundry    |   "minifyStaticFiles": false,
   foundry    |   "updateChannel": "release",
   foundry    |   "language": "en.core",
   foundry    |   "world": null,
   foundry    |   "serviceConfig": null,
   foundry    |   "isElectron": false,
   foundry    |   "isNode": true,
   foundry    |   "isSSL": false,
   foundry    |   "demo": false,
   foundry    |   "noupdate": false
   foundry    | }
   foundry    | FoundryVTT | 2021-01-14 03:00:05 | [warn] Software license requires signature.
   foundry    | FoundryVTT | 2021-01-14 03:00:05 | [info] Requesting UPnP port forwarding to destination 30000
   foundry    | FoundryVTT | 2021-01-14 03:00:06 | [info] Server started and listening on port 30000

As you can see from the above log, you will just need to connect to https://localhost:30000 and you'll be able to start configuring your Foundry instance. You can also add in some SSL certificates and set it up to a DNS name so your players don't have to remember an IP address, but I'll leave that up to you.

Shutdown
^^^^^^^^

If you want to shut down the instance you can use the following docker-compose command.

.. code-block:: bash

   docker-compose stop

Conclusion
**********

Both of these methods will allow your service to come back up after your server reboots, however I find the docker method a bit cleaner since I already have docker and docker-compose installed on my server, it allows me to not have to install *nodejs* on the actual machine as it just runs from inside the container. However choose whichever setup is right for you. Lemme know what you think or if I missed anything.

Note that the docker option is probably better suited for setting up on a cloud provider.
