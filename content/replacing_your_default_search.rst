Replacing your default search in Firefox
########################################

:author: mcgillij
:category: Linux
:date: 2025-03-15 14:49
:tags: Linux, Firefox, Searxng, Privacy, Security
:slug: replacing-your-default-search-in-firefox
:summary: How to replace your default search in Firefox with Searxng
:cover_image: searx.png

.. contents::


Intro
=====

I've used Firefox since it's first public releases, however it's reliance on Google search has always been a concern of mine. I've been using Searxng for a while now and I'm happy with the results. I'll walk you through how to replace your default search in Firefox with a local private `Searxng <https://github.com/searxng/searxng>`_ setup with a combination of `Docker <https://docker.com>`_ and `Nginx <https://nginx.org>`_.

First off what is Searxng? Searxng is a privacy-respecting, hackable metasearch engine. It is a free and open-source search engine that aggregates results from other search engines while respecting your privacy. Searxng does not track your searches or store your search history, making it a great alternative to other search engines that may collect and store your personal information.

You could use one of the freely available (and likely much faster instances) if you want, however I'm going to go over the setup steps for running it locally (or in my case on a spare server I have on my LAN) for a more privacy focused setup.

While it's nice to have it running locally on my LAN, having to remember to always go to the URL to search is a bit of a pain. So I'm going to show you how to set it up as your default search engine in Firefox, replacing the default Google search when typing into the address bar making it a seamless experience.

Pre-reqs:
=========

The defaults provided by the searxng-docker project are pretty good and will likely work for you out of the box. However in my case I already have an Nginx server running on the same machine that I use for a bunch of different Homelab services that I want to use to proxy the requests to the Searxng instance.

- docker / docker-compose
- Nginx (optional) Caddy comes by default with the searxng-docker project and is perfectly usable
- a FQDN that you can use to access the Searxng instance / used to generate the SSL certs
- lets encrypt certbot (if you want to use SSL)


Searxng
=======

The documentation for the searxng-docker project is pretty good and should get you up and running in no time.

The first step is to clone the `searxng-docker` repository from GitHub. This repository contains a `docker-compose.yml` file that will allow you to stand up a Searxng instance using Docker.

.. code-block:: bash

    git clone https://github.com/searxng/searxng-docker.git
    cd searxng-docker
    sed -i "s|ultrasecretkey|$(openssl rand -hex 32)|g" searxng/settings.yml

Note: There is a bit of a dance required go get the `uwsgi.ini` created with the correct permissions. Involving commenting out all the **cap_drop: - ALL** lines in the `docker-compose.yml` file, running the `docker-compose up -d` command, then un-commenting the lines and running `docker-compose up -d` again.

This will allow the creation of the `uwsgi.ini` file with, and then future docker-compose commands will no longer require those permissions, so we can drop them all.


Also I removed the Caddy service from the `docker-compose.yml` file as I'm going to use Nginx to proxy the requests to the Searxng instance.

So my `docker-compose.yml` file looks like this:

.. code-block:: yaml

    version: "3.7"

    services:
      redis:
        container_name: redis
        image: docker.io/valkey/valkey:8-alpine
        command: valkey-server --save 30 1 --loglevel warning
        restart: unless-stopped
        networks:
          - searxng
        volumes:
          - valkey-data2:/data
        cap_drop:
          - ALL
        cap_add:
          - SETGID
          - SETUID
          - DAC_OVERRIDE
        logging:
          driver: "json-file"
          options:
            max-size: "1m"
            max-file: "1"

      searxng:
        container_name: searxng
        image: docker.io/searxng/searxng:latest
        restart: unless-stopped
        networks:
          - searxng
        ports:
          - "127.0.0.1:8686:8080"
        volumes:
          - ./searxng:/etc/searxng:rw
        environment:
          - SEARXNG_BASE_URL=https://${SEARXNG_HOSTNAME:-localhost}/
          - UWSGI_WORKERS=${SEARXNG_UWSGI_WORKERS:-4}
          - UWSGI_THREADS=${SEARXNG_UWSGI_THREADS:-4}
        cap_drop:
          - ALL
        cap_add:
          - CHOWN
          - SETGID
          - SETUID
        logging:
          driver: "json-file"
          options:
            max-size: "1m"
            max-file: "1"

    networks:
      searxng:

    volumes:
      caddy-data:
      caddy-config:
      valkey-data2:

I also changed the ports from `127.0.0.1:8080:8080` to `127.0.0.1:8686:8080` as I have Nginx running on port 8080 already on the machine as to not create a conflict.

One last configuration before we stand it up proper.

We have a .env file that needs to have the `hostname` specified in it that the `docker-compose.yml` will use (alternatively you can specify the hostname in the yaml file directly).

.. code-block:: bash

    echo "SEARXNG_HOSTNAME=searx.mcgillij.dev" > .env

Once you have the `docker-compose.yml` file setup to your liking you can run the following command to start the Searxng instance:

.. code-block:: bash

    docker-compose up -d

You should now see two services the redis/valkey and searxng services running.

You can hit those now by going to `http://localhost:8686` in your browser (however that only works locally, which in my case is on my server which doesn't do me much good on the rest of my machines).

So for this we will want a reverse proxy to allow it to be reachable from the rest of the machines on the network.

Nginx
=====

Assuming you don't already have Nginx installed, you can install it with your distro's package manager, or even run it as a Docker container if you prefer.


For Debian based distros you can install it with the following command:

.. code-block:: bash

    apt install nginx

Or Arch based distros:

.. code-block:: bash

    pacman -S nginx

Onto the configuration.

Here's what my `/etc/nginx/conf.d/searxng.conf` file looks like:

.. code-block:: bash

    server {
      listen 443 ssl http2;
      server_name searx.mcgillij.dev;
      client_max_body_size 100M;

      ssl_protocols TLSv1.1 TLSv1.2;

      ssl_certificate /etc/nginx/ssl/searx.crt;
      ssl_certificate_key /etc/nginx/ssl/searx.key;

      access_log /var/log/nginx/searx.ryzen.log;
      location / {
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_http_version 1.1;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection $connection_upgrade;

          proxy_pass http://127.0.0.1:8686;
      }
    }

Some things of note with the configuration: The server_name is the FQDN that you want to use to access the Searxng instance. The ssl_certificate and ssl_certificate_key are the paths to the SSL certificate and key that you want to use for the Nginx server. The proxy_pass directive is the IP address and port of the Searxng instance that you want to proxy requests to.

We haven't generated the certs yet, so let's do that now.

.. code-block:: bash

    certbot certonly --dns-route53 -d searx.mcgillij.dev

I'm using AWS **route53** for my DNS, so I'm using the `--dns-route53` option, but you will have to use the appropriate option for your DNS provider so that you can validate the domain.

This will generate the certs for you and then you can symlink them to the paths in the Nginx configuration that make sense for your configuration.

.. code-block:: bash

    ln -s /etc/letsencrypt/live/searx.mcgillij.dev/fullchain.pem /etc/nginx/ssl/searx.crt
    ln -s /etc/letsencrypt/live/searx.mcgillij.dev/privkey.pem /etc/nginx/ssl/searx.key

Also of note is the proxy_pass directive that points to the same address specified in the `docker-compose.yml` file for the Searxng service. This would allow me to also publish the Searxng instance on the internet if I wanted to, but I'm just going to use it on my LAN.

Once you have the Nginx configuration setup you can restart the Nginx service to apply the changes:

.. code-block:: bash

    systemctl restart nginx

Now I can actually hit the Searxng instance from any machine on my LAN by going to `https://searx.mcgillij.dev` in the browser.

And it should look something like this:

.. image:: {static}/images/searx.png
    :alt: Searxng instance

Now this works fine as a standalone search engine, but I want to be able to use it as my default search engine in Firefox.

You may also want to add / remove certain search engines from searxng and you can do that by going to the settings page of your instance, it should look something like:

.. image:: {static}/images/searx_settings.png
    :alt: Searxng settings

Firefox
=======

To set up Searxng as your default search engine in Firefox, you will need to add it as a search engine in the browser.

To do this, follow these steps:

1. Open Firefox and go to your Searxng instance that you set up in the previous steps.
2. Right click on the search/address bar and select "Add Searxng"
3. Now open the Firefox preferences/Settings and go to the Search tab.
4. In the Default Search Engine section, select Searxng from the drop-down menu it should have been added by the previous step.
5. Profit!

.. image:: {static}/images/searx1.png
    :alt: Firefox search settings

That's it! You have now replaced your default search in Firefox with Searxng. You can now use Searxng as your default search engine in Firefox and enjoy the privacy and security features that it offers.

I will note that it isn't as **fast** using Google directly (since we are actually hitting multiple search engines and aggregating the results), however not having 99999999 ads and tracking scripts running on the page is a nice change of pace.

There is also a slew of other settings and configuration options that you can do post setup, but this should get you up and running with a basic setup.

I hope you found this guide helpful, and if you have any questions or comments, feel free to leave them below.

.. image:: {static}/images/searx_search.png
    :alt: Searxng search results

Happy searching!
