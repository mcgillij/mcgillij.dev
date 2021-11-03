Newsboat, yt-dlp and mpv
########################

:author: mcgillij
:category: Linux
:date: 2021-11-02 20:49
:tags: Linux, Newsboat, RSS, yt-dlp, #100DaysToOffload
:slug: newsboat-rss-and-yt-dlp
:summary: Newsboat and yt-dlp for RSS and a usable YouTube.
:cover_image: newsboat.png

.. contents::

If you're a fan of RSS at all, or just tired of how terrible the `Youtube <https://youtube.com>`_
experience is on the web. `Newsboat <https://newsboat.org>`_ + `yt-dlp <https://github.com/yt-dlp/yt-dlp>`_
may be a decent alternative for you. I've been using it now for several weeks
and it's been great. Since switching from ``youtube-dl``. Since Youtube has been
hosing it's speeds, ``yt-dlp`` doesn't seem to run into the same bandwidth issues
(at least for now, knock on wood).

With a couple very simple configurations, you can turn Newsboat into a decent youtube
front end, without any of the ads and piping directly to `mpv <https://mpv.io>`_
for viewing videos.

Installation
------------
Newsboat and mpv should both be in the regular Arch repos, however ``yt-dlp`` is only
found in the AUR's for now, so you will need something like ``yay`` to install it.

.. code-block:: bash

   yay -S newsboat mpv yt-dlp


Configuration
-------------

Below is my Newsboat configuration. It's quite basic, but it works quite nicely for me.

**~/.newsboat/config**

.. code-block:: bash

   auto-reload no
   browser firefox
   macro v set browser "setsid -f mpv --really-quiet --no-terminal" ; open-in-browser ; set browser firefox

**,** will toggle the ``macro`` mode of Newsboat, and as you can see in the configuration
above we mapped it to v (for video, but you can choose any other key that you like).

**,** + **v** will open youtube links in mpv.

Finding youtube channel RSS links
---------------------------------

Next you will need some RSS links to the youtube channels that you want to watch.
You can snag this by peeking at the source of the youtube channels. Grabbing the ID
from the URL bar and building your link manually, or this short command line script below.


**yt_snag_rss_link.py**

.. code-block:: python

   import argparse
   import requests

   # snag the rss link from the youtube channel
   def snag_rss_link(channel_id):
       response = requests.get(f'https://www.youtube.com/channel/{channel_id}')
       # alternatively if you don't want to actually hit youtube and parse the source
       # you can just build the link and template the channel_id in there.
       #return f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
       return response.text.split('"rssUrl":"')[1].split('"')[0]

   if __name__ == '__main__':
       parser = argparse.ArgumentParser(description='Get the rss link from a youtube channel')
       parser.add_argument('channel_id', help='the channel id')
       channel_id = parser.parse_args().channel_id

       # channel_id = 'UCBJycsmduvYEL83R_U4JriQ'
       print(snag_rss_link(channel_id))

Here is how to use the script:

.. code-block:: bash

   $ python yt_snag_rss_link.py UCBJycsmduvYEL83R_U4JriQ

   https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ

From there you can add the URLs to your Newsboat urls file.

**~/.newsboat/urls**

.. code-block:: bash

   "  "
   "---HN---"
   https://news.ycombinator.com/rss "news"

   "  "
   "---Python---"
   https://reddit.com/r/python/.rss "python"
   https://reddit.com/r/learnpython/.rss "python"
   https://reddit.com/r/pythontips/.rss "python"
   https://reddit.com/r/pygame/.rss "python"

   "  "
   "---People---"
   https://www.mcgillij.dev/feeds/all.atom.xml "me"
   https://fasterthanli.me/index.xml

   "  "
   "---Youtube---"
   https://www.youtube.com/feeds/videos.xml?channel_id=UCOWcZ6Wicl-1N34H0zZe38w "linux" #Level1Tech Linux
   https://www.youtube.com/feeds/videos.xml?channel_id=UCSAXsBMga3Y2wYSPwFI5f5w #gnif
   https://www.youtube.com/feeds/videos.xml?channel_id=UChz00vupzP_mNPIYD8GSmBw "overlanding" #dahl
   https://www.youtube.com/feeds/videos.xml?channel_id=UCUMSHXWczvxHy9e8silnVNw "gloriouseggroll" #glorious eggroll
   https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ "marquee"

