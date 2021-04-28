Who wrote this?
###############

:author: mcgillij
:category: Python
:date: 2021-04-28 17:49
:tags: Python, 2to3, #100DaysToOffload
:slug: porting-my-old-project
:summary: Fun times porting my first personal Python project to Python3
:cover_image: jshooter.png

.. contents::

WTF IS THIS?
************

Ever look at your old source code and wonder? Who wrote this? WHY? WTF is going on here?


Some context
************

This was my experience last weekend when playing around with the new version of `Pygame <https://pygame.org>`_ / `Pyglet <https://pyglet.org>`_ and `Pymunk <https://pymunk.org>`_.

Here I was playing around with Pygame functions, trying to get my Steam controller working with the goal to make a little dude run around on my screen using my gamepad. Simple right?

.. image:: {static}/images/steam_controller.png
   :alt: Steam controller image

There were a couple issues that I ran into while doing this, something that may be worth highlighting.

- While Steam if running

  The controller will need to be accessed through the Steam SDK

- While Steam is not running

  The Steam controller works correctly as a "gamepad/joystick"

This lead to some head scratching, as I did have Steam running prior to starting fiddling around.

It seems to access the steam controller with steam running I'd have to hook into the Steam SDK which doesn't really support `Python <https://python.org>`_.

So I have to actually do my development with Steam off, to allow my controller to work as a gamepad.

Onto the project
****************

Once I had the gamepad being recognized I was able to make some quick progress on getting a basic rendering loop and start moving my **sprite** around on the screen.

So now I wanted to make my little guy be able to shoot some bullets, when I pressed one of the controller buttons. And I had figured, hey I did this a really long time ago, I should just go nab the code from my old project. I had dumped it onto github ages ago (12 years ago~ and the code was written before that, when I was using SVN as my main source control).

After a quick ``git clone`` of my old repository, I figured I'd be up and running quickly (and it was to an extent *spoilers*).

So I'm looking through the code in horror at what abomination was going on in the source here.

First off I recall this actually running... however now it doesn't. Then I remembered this was written when Python3 wasn't even a thing.

Alright there's going to be a bit of work to-do to get it cleaned up.

Actual Horror
*************

It seems my past self, hadn't bothered in setting up **visible whitespace** in Vim. Nor did it seem like I knew about ``Pylint``, ``Flake8`` and ``black`` certainly didn't exist back then. However things like ``pep8`` likely existed that I didn't know about as I was just learning the language with this project to begin with.

However, I'm trying to be objective and critical of my own code here, after having done thousands of code reviews since then.
Looking at this foreign code now, just leaves me with a bad feeling.

.. image:: {static}/images/python_wtf.png
   :alt: The Horror
   :class: image-process-large-photo

Anyways at a glance, it doesn't look like any Python code that I've ever seen. 

**Tabs** I haven't seen those in many years. Who in their right mind would use tab characters anyways.

Not only that, it's no longer valid Python (and for good reason). Since then how **Exceptions** work has changed, along with many other things leading to actual *syntax errors*.

Armed with some experience with modern tooling, I was going to get this working again.

Running `2to3` to get the main language changes done, I was left fixing some whitespace issues along.

Using a combination of `Pylint <https://pypi.org/project/pylint/>`_, `Flake8 <https://pypi.org/project/flake8/>`_ and `Black <https://github.com/psf/black>`_, I was able to wrangle most of the formatting issues.

Add in a dash of refactoring some of the dependent old libraries, and I have it working again.

Conclusion
**********

I hadn't planned on doing this little project, I was merely looking for some old code in the project, but wanting to see all the pieces running together to see all the bits working together was just part of what had to be done for me to be able to grab the bits  of code that I wanted to use in my new toy project.

Modern tooling, to the rescue along with visible white space... oh god the **RED** all over my nvim.
