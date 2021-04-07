Hello Gemini
############

:author: mcgillij
:category: Web
:date: 2021-04-04 22:49
:tags: Gemini, #100DaysToOffload, NotGopher, Bash, Python, RST
:slug: hello-gemini
:summary: Porting my site to Gemini, with Bash and Python
:cover_image: gemini.jpg

.. contents::

Whats my goal here?
*******************

I've written about browsing Gemini in the past, and trying to make heads or tails of it. So I decided to take the plunge and write up a transition layer to port my site over to Gemini.

Goal:

- Write once in ReStructured Text
- Insert some magic in Python (As it's my home)
- Push to https://mcgillij.dev
- Push to gemini://gemini.mcgillij.dev

Tradeoffs
*********

The content of my site is for the most part portable to Gemini, however the layout and how Gemini handles links, is where things start to break down.

I do like the reading experience in Gemini. It gains a bit of readability by not supporting all of what  we take for granted in modern browsers.

Things like having different colored backgrounds, font colors, size, emphasis. It also does away with ads, banners, trackers which I'm not using anyways so those won't be a problem.

First things first
******************

As most of my projects start, check to see if someone else has already solved this. I found **sphinx-gemini-builder** which seems it'll do the trick.

Using this Python module, I can convert my **RST** to **.gmi** fairly easily. But since I don't actually maintain a static *index* page for my site. I'll have to generate my own Gemini *index.gmi*.

Writing a parser
****************

So we need a parser to comb through my RSTs and extract the relevant information to programmatically generate our *index.gmi*.

The relevant information will need a place to live when we find it. I used a *namedtuple* for this as they are immutable and quite fast, and I didn't need full blown objects for my entries.

.. code-block:: python

   Entry = namedtuple("Entry", ["filename", "title", "date", "summary"])

Now that we have a structure to store our data, we can work on something to iterate over all the nodes of a RST document (using **docutils**).

The crux of what the below code does is, generate a tree of nodes based on the document, and **walk** over them dispatching the **dispatch_visit** method on each one, where we can check if they have the fields and values were looking for.

.. code-block:: python

   def walk_docstring(document):
   """ walk over the rst nodes the fields """
   doctree = publish_doctree(document)

   class Walker:
       """ Walker class to iterate over nodes """

       def __init__(self, document):
           self.document = document
           self.fields = {}
           self.title = ""
           self.summary = ""
           self.date = ""

       def dispatch_visit(self, x):
           """ Check all the fields for title, date and summary """
           if isinstance(x, docutils.nodes.title) and not self.title:
               self.title = x.pop()
           if isinstance(x, docutils.nodes.date):
               self.date = x.pop()
           if isinstance(x, docutils.nodes.field):
               field_name = x.children[0].rawsource
               field_value = x.children[1].rawsource
               self.fields[field_name] = field_value

   walk = Walker(doctree)
   doctree.walk(walk)
   return (
           walk.title.rawsource,
           walk.date.rawsource,
           walk.fields.get("summary")
           )


Now we can pass in a "document" which is just one of the RST files, read in with a file **open**. So with that as the engine for our translation, we can move onto the **main** part of the script.

.. code-block:: python

   if __name__ == "__main__":

   p = Path(".")
   file_list = p.glob("*.rst")
   title, date, summary = "", "", ""
   results = []

   for filename in file_list:
       doc = open(filename.resolve()).read()
       title, date, summary = walk_docstring(doc)

       datetime_object = datetime.strptime(date, "%Y-%m-%d %H:%M")
       filename_part = os.path.splitext(filename)[0]

       results.append(
           Entry(
               filename=filename_part,
               title=title,
               date=datetime_object.strftime("%Y-%m-%d"),
               summary=summary,
           )
       )

   sorted_results = sorted(results, key=attrgetter("date"))
   sorted_results.reverse()

For now the script doesn't take any parameters since it's mostly just for myself, but if there's any interest I can make a more usable version that supports parameters etc.

This section is pretty simple, as we just open the path to all the RST files and iterate over them and extract the relevant information into **Entry**'s, that we will later use to generate our content. Since I wanted to preserve the order of the posts, I had to do some shenanigans with *datetime* and sorting in reverse order since I wanted newest posts to show up at the top.

Only one **gotcha** in the above code is that **.reverse()** will reverse the list in-place (which is a bit weird).

Onto the fun stuff!
*******************

Generating the content, but more importantly some ASCII art. What better place to jam in a bunch of ascii art than a Gemini page!

.. code-block:: python

   HEADER = """
   ```
   ▓█████▄ ▓█████  ██▒   █▓ ▒█████   ▒█████   ██▓███    ██████
   ▒██▀ ██▌▓█   ▀ ▓██░   █▒▒██▒  ██▒▒██▒  ██▒▓██░  ██▒▒██    ▒
   ░██   █▌▒███    ▓██  █▒░▒██░  ██▒▒██░  ██▒▓██░ ██▓▒░ ▓██▄
   ░▓█▄   ▌▒▓█  ▄   ▒██ █░░▒██   ██░▒██   ██░▒██▄█▓▒ ▒  ▒   ██▒
   ░▒████▓ ░▒████▒   ▒▀█░  ░ ████▓▒░░ ████▓▒░▒██▒ ░  ░▒██████▒▒
   ▒▒▓  ▒ ░░ ▒░ ░   ░ ▐░  ░ ▒░▒░▒░ ░ ▒░▒░▒░ ▒▓▒░ ░  ░▒ ▒▓▒ ▒ ░
   ░ ▒  ▒  ░ ░  ░   ░ ░░    ░ ▒ ▒░   ░ ▒ ▒░ ░▒ ░     ░ ░▒  ░ ░
   ░ ░  ░    ░        ░░  ░ ░ ░ ▒  ░ ░ ░ ▒  ░░       ░  ░  ░
   ░       ░  ░      ░      ░ ░      ░ ░                 ░
   ░                  ░
   ```
   """

   FOOTER = """
   => /atom.xml Atom/RSS to subscribe
   """

   BODY = ""
   for j in sorted_results:
       BODY += f"""
   => /{j.filename}.gmi {j.date} - {j.title}
   {j.summary}
   """

   print(f"{HEADER}\n\n{BODY}\n\n{FOOTER}")

Now were talking, 3 parts, HEADER, BODY and FOOTER. From those the .gmi index will be created.

JetForce
********

Now I needed a place to host this. And as I have a server sitting right next to my workstation. I decided that it was good enough to host my Mordhau and Vallheim server, it's good enough to host my Gemini site!

Jetforce to the rescue. A python gemini hosting solution. Setting up **jetforce** was trivially easy, they have great docs, and I didn't have to deviate from them to get it running. I think the only difference is that I installed it as a user service rather than a **root** service in the event that it gets compromised my server won't get immediately hosed.

Convenience
***********

Now with a bit of manual intervention I got my .gmi's pushed to my server. And I'm able to see the site in all it's glory!

.. image:: {static}/images/gemini_server.png
   :alt: Image of the site in a gemini browser

Tying it all together
*********************

There still some automation to be done.

Now the tools that I'm using **sphinx-gemini-builder** or **sphinx** in general wasn't really made to process my site or it's templates. So there's a bit of massaging still required to get the images loaded / copied over as well.

Since these are all manual steps that I had to do anyways, I figured I should probably just throw them into a **bash** script and be done with it.

**~/bin/gemify**

.. code-block:: bash


   #!/bin/bash
   set -ue
   
   cd ~/mcgillij.dev/content || exit
   touch index.rst
   sphinx-build -b gemini -C . ../gem_capsule *.rst
   rm -rf ../gem_capsule/\{static\}/
   rm index.rst
   python ~/gits/rst2gem/rst2gem.py > ../gem_capsule/index.gmi
   
   cd ../gem_capsule || exit
   for filename in ./*.gmi; do
        sed -i 's/{static}//g' "${filename}"
   done
   cp -Rupv ../content/images ./
   gemfeed -n 25 -b gemini://gemini.mcgillij.dev -t 'DevOops' -s "@mcgillij's blog"
   cd ..
   scp -r gem_capsule ryzen:

The above script roughly does:

- Go to content
- Do sphinx shenans
- Convert posts to gmi
- Generate index
- Clean up sphinx shenans
- Generate Atom.xml
- Clobber old site with new site

There's a nice Python module named **gemfeed** that you can use to generate an Atom.xml for your gemini site as well.

`gemfeed <https://tildegit.org/solderpunk/gemfeed>`_

If for whatever reason you want to look at the code in it's entirety for my rst2gem.py you can find it on my github.

`my github <https://github.com/mcgillij/rst2gem>`_

Now I can update my site by simply typing in ``gemify`` in my term anytime I want update my gemini capsule.

Also I'm not sure that web browsers can render ``gemini://`` links. But if you want to check out my site in Gemini you can find it here `gemini.mcgillij.dev <gemini://gemini.mcgillij.dev>`_.
