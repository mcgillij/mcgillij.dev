Falling Everything in Python
############################

:author: mcgillij
:category: Python
:date: 2021-01-28 20:49
:tags: Python, Noita, Pygame, #100DaysToOffload
:slug: noita-falling-everything-in-python
:summary: Small Python demo of the Noita physics engine "falling everything" written in Python.
:cover_image: noita.png

.. contents::

Falling Everything
******************

Last night after playing a few rounds of `Noita <https://noitagame.com>`_ from `Nolla games <https://nollagames.com>`_. 

Thinking about their physics engine and how fun the sandbox they provide is.
What a nice little experiment it would be to see if I can implement the basics in `Python <https://python.org>`_ and `PyGame <https://pygame.org>`_.

I hadn't used PyGame in quite a few years, and it seems they've now transitioned to using SDL2. So I figured I could maybe get back up to date with that, and try to implement the basics of the Noita's engine "falling everything".


Step 1: Poetry
**************

Poetry is a relatively new addition to the Python dependency management scene, however I find it has quite good dependency resolution and *virutalenv* management compared to **pipenv**.


Create a Python **virtualenv** and install the libs needed with `poetry <https://python-poetry.org/>`_.

.. code-block:: bash

   poetry init
   poetry add pygame numpy
   poetry add -D ipython
   poetry shell

In the above block I install the dependencies that I will be using, also installing `iPython <https://ipython.org>`_ as I like to use it instead of the regular python console when screwing around. The **-D** will make it a "dev" dependency in the event that you are using the packaging functionality of poetry down the line and don't want to ship all your *dev* dependencies.

Step 2: Boilerplate PyGame
**************************

Next up we want to setup a little PyGame test environment so we can try out some experiments.

We'll *import* pygame and define a few colors to play with and setup our game loop(**while 1**). 

.. code-block:: python

   #!/usr/bin/env python
   import pygame as pg
   # Going to run our Physics at 64x64 
   REZ_X = 64
   REZ_Y = 64
   RENDER_REZ_X = 512
   RENDER_REZ_Y = 512
   # Define some colors
   GREEN = pg.Color(0, 255,0)
   BLACK = pg.Color(0,0,0)
   RED = pg.Color(255,0,0)
   BLUE = pg.Color(0,0,255)

   # Main loop
   def main():
       pg.init()
       pg.display.set_mode((RENDER_REZ_X, RENDER_REZ_Y))
       surface = pg.Surface((REZ_X, REZ_Y))
       pg.display.flip()
       clock = pg.time.Clock()

   while 1:
       for event in pg.event.get():
           if event.type == pg.QUIT:
               raise SystemExit
           if event.type in [pg.MOUSEBUTTONDOWN, pg.KEYDOWN]:
               break
       screen = pg.display.get_surface()
       # do up scaling
       pg.transform.scale(surface, (RENDER_REZ_X, RENDER_REZ_Y), screen)
       pg.display.update()
       clock.tick(60) # fps
   pg.quit()

   if __name__ == "__main__":
       main()

That should cover the boilerplate PyGame things we need to get up and running. The above code will just setup a loop that we can use to display our simulation in the following steps.

Step 3 lets draw some lines!
****************************

Lets add some lines to the screen and give ourselves a way to reset the screen back to the default state. Adding the below functions to the mix.

Knowing that the Noita engine focus's on rendering each pixel individually, we'll need to start by using a pixel array to represent the simulation. This will allow us to query each of the pixels or set them to individual colors as needed in a relatively quick fashion using **numpy** backed arrays. 

.. code-block:: python

   def add_some_pixels(surface):
       ar = pg.PixelArray(surface)
       # sand
       for i in range(1, 15):
           ar[32,i] = BLACK
       # water
       for i in range(1, 15):
           ar[44,i] = BLUE
           ar[45,i] = BLUE
       # add some solid RED
       for i in range(64):
           ar[i,63] = RED
       ar[41,60] = RED
       ar[48,60] = RED
       ar[42,61] = RED
       ar[47,61] = RED
       ar[43,62] = RED
       ar[46,62] = RED
       del ar
       return surface
   
   def reset_state(surface):
       surface.fill(GREEN)
       add_some_pixels(surface)

We will call these from our **main** function shortly, but they just put some colors on the screen. We will be using, Black for "sand", blue for "water", red for solids, and green for the background.

Step 4 Physics:
***************

Now we can start taking a look at adding some things to play around with like sand and water.

.. code-block:: python

   
   def sand(surface, x,y):
       ar = pg.PixelArray(surface)
       if ar[x,y] == surface.map_rgb(BLACK):
           if ar[x,y+1] == surface.map_rgb(GREEN):
               ar[x,y+1] = BLACK
               ar[x,y] = GREEN
           elif ar[x -1, y+1] == surface.map_rgb(GREEN):
               ar[x -1, y+1] = BLACK
               ar[x,y] = GREEN
           elif ar[x+1, y+1] == surface.map_rgb(GREEN):
               ar[x+1, y+1] = BLACK
               ar[x,y] = GREEN
       del ar
       return surface

   def water(surface, x,y):
       ar = pg.PixelArray(surface)
       if ar[x,y] == surface.map_rgb(BLUE):
          if ar[x,y+1] == surface.map_rgb(GREEN):
              ar[x,y+1] = BLUE
              ar[x,y] = GREEN
          elif ar[x -1, y+1] == surface.map_rgb(GREEN):
              ar[x -1, y+1] = BLUE
              ar[x,y] = GREEN
          elif ar[x+1, y+1] == surface.map_rgb(GREEN):
              ar[x+1, y+1] = BLUE
              ar[x,y] = GREEN
          elif ar[x-1, y] == surface.map_rgb(GREEN):
              ar[x-1, y] = BLUE
              ar[x,y] = GREEN
          elif ar[x+1, y] == surface.map_rgb(GREEN):
              ar[x+1, y] = BLUE
              ar[x,y] = GREEN
       del ar
       return surface

   def physics(surface):
       for x in range(REZ_X):
           for y in range(REZ_Y-1, 0, -1):
               surface = sand(surface, x, y)
               surface = water(surface, x, y)
       return surface


The above code just looks like a hot mess of coordinates, and that's exactly what it is. Using the pixel array we can poke and prod for the colors of the pixels using the **Surface.map_rgb()**. It should be pretty clear how the coordinates work, but I'll put up a diagram to help visualize whats going on we start at (X, Y) which can be any point in our surface, and we're just looking at the neighbors to see if there's any room for the pixels to fall down.

.. figure:: {static}/images/coords.png
   :alt: coordinates for array

   PixelArray coordinates

By just looking left/right and below the selected pixel, we can determine where we want to move our materials to.

Our **physics** function above, will loop over our entire array of pixels passing in their X and Y coords to our various material functions and move each of the pixels if required.

Step 5 profit?
**************

Ha, not really, this is just for fun. Lets just run it and see what we get.

.. figure:: {static}/images/falling.gif
   :alt: falling everything demo in python

   Animation of what we have so far

So we have dirt / sand and water simulations on the go, and we can use the exact same water calculations, but instead of looking below our pixels for empty spaces, we look above them. And bam you've simulated **gasses** in a similar fashion to the "falling everything" engine.

Iteration
*********

Iterating on a concept even as simple as the above physics engine, can lead to tremendous fun and creativity, Nolla games have done an amazing job with Noita. I can't wait to see what they come out with next.

Code
****

On github you can find the `full example <https://github.com/mcgillij/falling_everything_py/blob/main/falling.py>`_ if you want to download it and play around with it.
