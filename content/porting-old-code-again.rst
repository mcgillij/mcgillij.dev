Porting old code again!
#######################

:author: mcgillij
:category: Python
:date: 2021-07-22 22:49
:tags: Games, Roguelike, Python, #100DaysToOffload, Danzig
:slug: porting-old-code-again
:summary: Again with porting old projects to modern Python and PyGame
:cover_image: pyTB.png

.. contents::

Why port old code?
******************

Some people were asking me on Github to port some of the projects that I had done a long time ago to some modern Python.

Mostly game projects, and I recently had a bit of free time. So I went ahead and ported a few of them over to the new modern equivalents.


Here there be dragons!
**********************
 
Old code, even written by yourself, decades ago, can look foreign and you ask what was I thinking. And for the most part, I was learning the Python at the time so I have to cut myself some slack.

Dependencies
************
I sure knew how to pick them, seems quite a few libraries that I was using back in the day haven't been ported from Python2.7 to 3.

So in updating some of my projects, I essentially also become the defacto maintainer of several old game libraries that I used, and have now ported over to Python3 for a number of projects.

So if you need a couple Vect2 libraries or some A* pathfinding, or a modern bulletML port, well I should have them all in my GitHub somewhere's.

A bit of a story
****************

Earlier today I was reminded that my boss had used one of my bits of Python code to generate Orc names (as test users for some load testing framework he was working on, to benchmark our work clusters). When another co-worker noticed that some of the test users in one of our Development environments had some shady names.

No calls to HR were made, since we don't have an HR department, but I'm sure he's since deleted all the Orcs from our DEV environment.

Orcs
****

So tonight I figured I may as well port that project over to Python3 since I had a nice fond memory of it. Now you can find my old Squad based Roguelike now updated to run on the new PyGame and Python3 here: https://github.com/mcgillij/pyTB.

Dwarves don't move!!!
*********************

Also recently ported is my Dwarf Fortress clone (with possibly the most hilarious bug ever reported). I'm used to fixing bugs and issues at work with quite possibly the lamest descriptions every I guess so maybe my bar is low here. But the bug was entitled "Dwarves don't move!!!"... Anyways code is ported to the new Python and PyGame, and the Dwarves do in fact move now. There's still a slew of bugs I imagine, since I wrote that code probably close to 15 years ago. It however fires up now. You can find that here if you're curious, https://github.com/mcgillij/pyDF

That's all for tonight, just felt like writing up a small summary of some of the random projects I've been working on these days.
