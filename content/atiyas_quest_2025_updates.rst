Atiya's Quest Dev Log
#####################

:author: mcgillij
:category: Games
:date: 2025-07-16 20:00
:tags: Linux, Windows, Android, Atiya's Quest, Games, Release, Dog, Pom, Pomeranian, Atiya, PuzzleQuest
:slug: atiyas-quest-2025-dev-log
:summary: Going through the updates that I've made through out the year working on my game, Atiya's Quest.
:cover_image: atiya.jpg

.. contents::

Atiya's Quest Dev Log
*********************

Back in 2024, I released a free game that's available for `Linux <https://github.com/mcgillij/AQ/releases/download/0.1.2/AQ_linux_0.1.2.tar.gz>`_, `Android <https://play.google.com/store/apps/details?id=dev.mcgillij.ymbag>`_ and `Windows <https://github.com/mcgillij/AQ/releases/download/0.1.2/AtiyasQuest.0.1.2.7z>`_.

It's a match-3 puzzler game featuring my Pomeranian dog Atiya.

While I'm not super into the match-3 genre itself, a game that I really enjoyed growing up was `PuzzleQuest <https://en.wikipedia.org/wiki/Puzzle_Quest>`_, and I spent countless days and evenings playing that on my Playstation PSP. I've always wanted to make my own version and I've been learning `Godot <https://godotengine.org>`_.

Anyways, so I've been making my own PuzzleQuest-like. And I'll try to detail the progress I've been making over the past year since I released the puzzle-only version last year.

First Steps
***********

With the puzzle version created, I had an essential part created that I'd need, a grid of tiles that can be swapped and matched.

The next part was adding monsters and a battle system. I wanted to have a turn-based battle system where you can swap tiles to attack monsters, and I wanted to have a variety of monsters with different abilities.

.. image:: {static}/images/AQ/screenshot_monster_and_manabars.png
   :alt: Monster and Manabars
   :width: 100%

At this point I had monsters, and manabars, so matching colors would grant the appropriate mana colors, I didn't have any win conditions yet as you can see the monsters hp's at -3. But it's a start, and it helped me understand how to use / create custom **Resources** or Prefabs in Godot (I wrote an article on them previously if any clarification is needed on them).

I also added some very basic abilities that the player and eventually monsters could use.

Turns and Combat Log
********************

Next I needed some state and turns, so that the player and the monster would each get turns matching tiles.

I made a very basic turn transition screen, that I'm still using now, but I'll eventually fix it up to be more presentable, but it works for now! Also I've added a combat log to be able to display the log of the various abilities / mana gain done over the course of combat.

.. image:: {static}/images/AQ/screenshot.png
   :alt: showing the turn screen
   :width: 100%

Particles and Shaders
*********************

Next I wanted to have some floating damage numbers (I'm not sure if that's the technical term, but I remember it was the name of a MOD in world of warcraft that basically did the same).

To achieve these, numbers, it involves creating a subviewport that looks at a label. Which then screenshots the label, and can then use it as a particle effect texture. Which is kinda neat, and maybe I'll write some more about some of the effects that you can create with this trick in a later article, I've used it for quite a few things it turns out. Evade messages, Critical Strike notifications, XP, gaining gold, using Continues, etc.

.. image:: {static}/images/AQ/screenshot_floating_damage.png
   :alt: showing off floating damage numbers
   :width: 100%

Another thing you can spot here are the shader effects on the bomb pieces on the scene here, while it's a screenshot you can't really see the glowing effect clearly, they'll be featured in some later gifs. However I'd never written any shaders ever, so it was a really interesting subject, and I have a new found respect for dedicated shader writers. The one's I've written so far have mostly been really simplistic, and mostly to highlight/glow, but you can do pretty much anything with them, it's quite amazing.


.. image:: {static}/images/AQ/shaders.gif
   :alt: glow shader
   :width: 100%

In the above picture you can see a shader effect for my row bomb, and also my **Hint** effect that's just created with a `Tween` and position jitter.

Finally playing with different shaders, and trying to write a decent glow / highlighter, I was testing it out on my title screen.

.. image:: {static}/images/AQ/shader2.gif
   :alt: Shaders on my titlescreen
   :width: 100%


Some more experimentation with shaders:

.. image:: {static}/images/AQ/epilepsy_shader.gif
   :alt: shader playground
   :width: 100%


If this doesn't give you epilepsy, I don't know what will. But it was a fun experiment in comparing my various shader implementations.

Gameplay
********

Next we have some early shots of how the gameplay was diverging from the basic puzzle grid that I had created. Now bombs glowed, and I had implemented glowing healing and damage effects over top of the player and monster images. You could do damage, and the abilities now showed their mana cost, and could go on cooldowns, same goes for the monsters (their abilities can be found below their portraits).

.. image:: {static}/images/AQ/gameplay.gif
   :alt: showing off some early gameplay
   :width: 100%

Abilities / Jobs
****************

Next I needed an interface for equipping abilities, but I also wanted to tie unique skills / stats to each possible (250) combinations along with a unique title granted to the player for each combination available.

.. image:: {static}/images/AQ/abilities1.png
   :alt: abilities1
   :width: 30%

.. image:: {static}/images/AQ/abilities2.png
   :alt: abilities1
   :width: 30%

.. image:: {static}/images/AQ/abilities3.png
   :alt: abilities1
   :width: 30%

Here you can see some of the various costs and ability descriptions, but also the unique job titles and some of the stats granted by them.

As you add more abilities to your action bar, your job title evolves along with your stats and abilities. So equipping more pink abilities will keep giving you more involved stats.

.. image:: {static}/images/AQ/abilities.gif
   :alt: Showing job swapping when adding abilities
   :width: 100%

Bark abilities / jobs

.. image:: {static}/images/AQ/bark_abilities.gif
   :alt: bark abilities
   :width: 100%



Skills Tree!
************

For the skill tree, I wanted to give as many interesting choices and flexibility to the player as I could, so I took inspiration from the Path of Exile tree's which are now infamous.

.. image:: {static}/images/AQ/skilltree.png
   :alt: skill tree screenshot
   :width: 100%

The skill tree allows you to increase your characters stats and unlock abilities that you can use during gameplay, and unlock different jobs.

Level select / Dungeons
***********************

Now we needed dungeons to discover and explore. The level selection is inspired by the branching graph choices from `Slay the Spire <https://www.megacrit.com/games/>`_ and the dungeon crawling from `BuriedBorne <https://nussygame.com/en/bb1/>`_.

.. image:: {static}/images/AQ/demo2-export.gif
   :alt: Shows the early dungeon crawling
   :width: 100%

Juicing up!
***********

(Mostly just shader shenanigans)

While not natively a gamedev, I wanted to add some neat effects to properly indicate the turns, and make the mana bars have some cooler effects (like the Bloodborne healthbars). You can see the gaining health "glow" effect in these as well as the turn indicator highlights.

.. image:: {static}/images/AQ/turn_indicator.gif
   :alt: turn indicator
   :width: 100%

.. image:: {static}/images/AQ/progress_bars.gif
   :alt: turn indicator
   :width: 100%

Balatro / Dynamic Shader BG's
*****************************

Getting more familiar with shaders, and the release of `Balatro <https://www.playbalatro.com/>`_ (If for some reason you haven't played it, it's one of the best games of the last few years). I put some effort in making dynamic backgrounds for some of my levels using only shaders. And Balatro makes great use of these, I found a reference shader on shadertoy and ported it to Godot, and here's the result when jammed into my game. I will likely remove this in the final release but for now it's a nice surprise when running into it on random runs.

.. image:: {static}/images/AQ/balatro.gif
   :alt: grid turned off, balatro bg
   :width: 100%


.. image:: {static}/images/AQ/ported_to_godot4.4.gif
   :alt: different shader background
   :width: 100%

Grid based abilities
********************

I needed more abilities, here's some prototyping of different grid based abilities.


First the "Slam" ability, which knocks out a crosshair shape out from the center of the screen.

.. image:: {static}/images/AQ/slam_ability.gif
   :alt: slam ability
   :width: 100%

And the Bork ability which makes an X shape.

.. image:: {static}/images/AQ/bork_ability.gif
   :alt: bork ability
   :width: 100%

World Map
*********

The overworld, or world map, allows you to investigate various locations (forests, caves, settlements) and interact with some NPC's farmers, cityfolk etc. From here I'll be able to eventually add Quests and Vendors and a bunch of RPG elements.

On my world map, I also start toying around with menu's and dialogue trees and interactable npcs.

Below you can briefly see my worldmap and dialogue tree when entering a short level select screen, before engaging in combat.

.. image:: {static}/images/AQ/worldmap.gif
   :alt: brief worldmap interaction
   :width: 100%

Events
******

If we are emulating Slay the spire, and just about every other dungeon crawler, you can't get away from random events.

Here I've implemented the beginnings of an event system.

.. image:: {static}/images/AQ/event.gif
   :alt: events
   :width: 100%

Achievements
************

Unlocks and Achievements are a nice fun part of most games, so I went to work implementing them for Atiya's quest, they are a simple panel that can take an Achievement prefab that I've created for the various achievements. I've also created an unlock system, that is driven mostly from unlocking certain achievements. Below are my character unlock screen and some achievements in their current incarnation, I'm sure like most things they'll change over time, as most features have gone over several iterations.

Achievement viewer:

.. image:: {static}/images/AQ/achievement.gif
   :alt: achievement
   :width: 100%

Character select screen:

.. image:: {static}/images/AQ/character_unlocks.gif
   :alt: character unlocks
   :width: 100%

Dice Rolls 2D
*************

Like most things going through several iterations, here's my first iteration on doing dice rolls / skill checks.

Starting simple I made a 2d dice roller, with some Tweens and Particles.

Iteration 1 initial dice:

.. image:: {static}/images/AQ/dice.gif
   :alt: d10's 2d 
   :width: 100%

Iteration 2 with basic skill check:

.. image:: {static}/images/AQ/dice2.gif
   :alt: d10's 2d second iteration
   :width: 100%

Iteration 3 Skill check with shader burn:

.. image:: {static}/images/AQ/skill_check.gif
   :alt: dice in a skillcheck
   :width: 100%

Iteration 4 3D Dice on a skillcheck:

.. image:: {static}/images/AQ/dice3.gif
   :alt: 3d dice in a skillcheck
   :width: 100%

Iteration 5 on the loot screen w/roll highlighting:

.. image:: {static}/images/AQ/dice4.gif
   :alt: 3d dice in a loot screen
   :width: 100%

Difficulty settings
*******************

Now I am starting to stitch most of the disparate systems that I've been creating together to make it resemble more of a game. But first we need a difficulty screen.


.. image:: {static}/images/AQ/difficulty_settings.gif
   :alt: difficulty select screen
   :width: 100%

Putting more pieces together
****************************

Stats viewer, we need something to browse our stats, that we get from all the equipment, abilities and jobs. Something that lets us track down where and what bonuses we are getting.

Basic stat viewer:

.. image:: {static}/images/AQ/stats_n_skills.gif
   :alt: stat viewer screen
   :width: 100%

Full stats screen:


.. image:: {static}/images/AQ/stats_screen.gif
   :alt: stats screen
   :width: 100%

Finally Steamdeck!
******************

So I wanted to play this on my Steamdeck, but my default resolution for this game is set to 720x1280 since I mostly play it on my cellphone. This gets scaled incorrectly on the steamdeck, it's still playable as-is, if you have tiny fingers or extreme patience to use the controller.

However in the immortal words of *Raymond Hettinger* -- **"there has to be a better way"**.

Clearly the only way to deal with this was to rotate the whole thing 90 degrees and swap the resolution to 1280x720 (SD uses x800, but 720 is close enough for now).

So first thing I do is write up a rig that can rotate my scenes on load, and a few helper methods to detect if I'm running on the steamdeck or not.

This however lead to many issues that I didn't realize I would have. Firstly, anything using a subviewport (which by default PopupMenu's, Tooltips and a few other native Godot types use), suffers from not actually getting rotated when we rotate the entire scene. Which meant implementing my own custom UI components to replace the menu's and tooltips that I was using.

Here's an early shot of my rotation shenanigans.

.. image:: {static}/images/AQ/rotate.gif
   :alt: screen rotation
   :width: 100%

If you are quick you can see on my settings screen the OS / Distro information and GPU settings, I use these to determine if you are running on a steamdeck or not and then apply the resolution / rotation automagically. Otherwise it's toggleable, in the event you want to play whilst hurting your neck at the same time.


Conclusion
**********

There's no conclusion, I keep working at this when I have spare time, as it's a super interesting project, I really enjoy reverse engineering different systems from games I really love, and working them into my own little creation here. Let me know if there's anything you'd like me to cover in the next updates, but I feel as if this ones already getting pretty long. Thanks to anyone that's made it this far.
