Getting chat from Owncast into Obs
##################################

:author: mcgillij
:category: Python
:date: 2021-09-21 22:49
:tags: Linux, Python, Flask, Owncast, OBS, obs-studio, getting-started, #100DaysToOffload
:slug: getting-owncast-chat-in-obs
:summary: Small Python script to get your Owncast chat into an OBS overlay
:cover_image: obs.png

.. contents::

In a `previous article <https://mcgillij.dev/obs-and-owncast.html>`_ we covered getting `Owncast <https://owncast.online>`_ setup with `OBS Studio <https://obsproject.com>`_ for streaming.

Next we will tackle getting the chat from Owncast into an OBS **overlay** using a small `Python <https://python.org>`_ webhook service.

Setting up a Python/Flask webhook listener
******************************************

The first part of the puzzle will be to setup a small Python and `Flask <https://flask.palletsprojects.com/en/2.0.x/>`_ server to receive our chat messages from Owncast.

You can either clone my `github repo <https://github.com/mcgillij/owncast_chat_webhook>`_ here to get you started, or since the script is small enough I'll link it here below.

**server.py**

.. code-block:: python

   from datetime import datetime
   from dateutil import parser
   from flask import Flask, request, abort

   app = Flask(__name__)

   FILE_TO_WRITE_TO = '/home/j/obs_stuffs/chatlog.txt' # <------- change this line

   @app.route('/webhook', methods=['POST'])
   def webhook():
       if request.method == 'POST':
           message = request.json.get('eventData').get('body')
           user = request.json.get('eventData').get('user').get('displayName')
           timestamp = request.json.get('eventData').get('timestamp')
           formatted = datetime.strftime(parser.isoparse(timestamp), '%H:%M:%S')

           if user and message and timestamp:
               write_out_chatlog(formatted, user, message)
           return 'success', 200
       else:
           abort(400)

   def write_out_chatlog(timestamp, user, message):
       with open(FILE_TO_WRITE_TO, mode='a') as chatlog:
           chatlog.write(f"{timestamp} {user}: {message}\n")



   if __name__ == "__main__":
       app.run(host='0.0.0.0')

NOTE: Make sure to change the **FILE_TO_WRITE_TO** to point to where you want your **chatlog** to be written to.

You will want to save this script and name it something like **server.py** and you'll want to make sure that you have a Python environment setup with the dependencies installed as well.

Installing the dependencies
^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can install the dependencies however you like, below I'll outline a couple ways.

Using `Poetry <https://python-poetry.org/>`_:

.. code-block:: bash

   poetry add Flask python-dateutil

If you've just cloned the repo and already have poetry installed, you can just type in ``poetry install`` in the project and be off to the races.

Using `pip`:

.. code-block:: bash

   pip install Flask python-dateutils

Etc.

Starting the server.py
^^^^^^^^^^^^^^^^^^^^^^

Now we need to run the `server.py`, and make sure it's working properly. Make sure that you've added the **PATH** to the file where you want to write your *chatlog*, you will need this location later when we configure OBS.

You can start the server by running ``python server.py`` in your Python environment.

You should get something similar in your terminal:

.. code-block:: bash

   $ poetry run python server.py
   * Serving Flask app 'server' (lazy loading)
   * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
   * Debug mode: off
   * Running on all addresses.
   WARNING: This is a development server. Do not use it in a production deployment.
   * Running on http://192.168.2.35:5000/ (Press CTRL+C to quit)

You will see your IP address there, and you'll need that when we are configuring the webook on Owncast.

If you've cloned the repo, I've also included a **client.py** that can be used to make sure your server is working properly. It just sends a canned message to your listener which in turn will write it out to the file specified in ``server.py``.

**client.py**

.. code-block:: python

   import requests
   import json

   webhook_url = 'http://localhost:5000/webhook'

   data = {'eventData': {'body': 'f',
           'id': 'MHLpo7Hng',
           'rawBody': 'f',
           'timestamp': '2021-09-20T23:02:54.980066719Z',
           'user': {'createdAt': '2021-09-20T22:34:33.139297191Z',
                    'displayColor': 22,
                    'displayName': 'mcgillij',
                    'id': 'avyQt7N7R',
                    'previousNames': ['mcgillij']},
           'visible': True},
           'type': 'CHAT'}

   r = requests.post(webhook_url, data=json.dumps(data), headers={'Content-Type': 'application/json'})

Running the **client.py** will send a test message to your **server.py** and you can check the file to make sure everything's coming through fine.

You can run the client similarly to the server: ``poetry run python client.py``.

Once you've confirmed that your listener's working properly, we'll go setup the webhook in Owncast. You can delete or otherwise, just not use the **client.py** once you've validated that the server is working properly as it's not required.

Setting up a **webhook** in Owncast
***********************************

You will need to navigate to your admin section of Owncast.

From there you will need to click on the **Integrations / Webhooks** entry.

.. image:: {static}/images/webhooks.png
   :alt: webhooks

From here, click on the **Create Webhook** button, selecting the checkbox to send over chat events and filling out the server details that you saw earlier when firing up the server.

.. image:: {static}/images/webhook_create.png
   :alt: creating a webhook in owncast

Finally click OK, and we can move onto configuring OBS.

Configuring OBS to have a chat overlay
**************************************

In OBS, you will want to add a new **source** to a scene of the type "Text(FreeType2)"

.. image:: {static}/images/obs_source.png
   :alt: obs source

When adding the source a properties window will pop-up and allow you to select the settings required to use the *chatlog* we created earlier.

Check the **Read from file** along with the **Chat log mode** (also specifying chat log lines if you want to change the default value).

You will also need to go choose the chatlog file that ``server.py`` creates from Owncast events.

.. image:: {static}/images/obs_chatlog.png
   :alt: obs chatlog options

From here you can resize and position your new chatlog as you would any other OBS source.

Hopefully this is useful for anyone trying to get setup with Owncast and OBS.
