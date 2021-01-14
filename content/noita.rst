Wizards and State Machines
##########################

:author: mcgillij
:category: Games
:date: 2021-01-12 19:11
:tags: Noita, State Machine, Games, Wizard, Witch, Spell Wrapping, #100DaysToOffload
:slug: wizards-and-state-machines
:summary: Noita, the best Witch game you haven't played.
:cover_image: noita.png

.. contents::

Noita
*****

`Noita <https://store.steampowered.com/app/881100/Noita/>`_ (Witch in Finnish) is a game that was released in 2020 by `Nolla Games <https://nollagames.com>`_. It's definitely my pick for best new game to come out in the last couple years as I'm partial to "rogue-likes", and I was a bit dis-heartened that it lost out to "Death Stranding" for `most innovative gameplay <https://store.steampowered.com/steamawards#MostInnovativeGameplay>`_ in the "Steam Awards". Noita isn't going to win any popularity contests against Kojima that's for sure. 

However I do believe that it brings much more "new" to the table than most recent games.

Trailer
*******

.. youtube:: 0cDkmQ0F0Jw

Noita has many things going for it, and watching the trailer you notice a focus on "every single pixel is simulated", and there's some really neat details in their implementation of that on the technical side. As well as other interesting bits like they chose to not use "double-buffering" for their rendering and instead have all the pixels draw themselves and not to redraw pixels that haven't changed. The Trailer however doesn't really put much emphasis on what I think is the 'best' part of Noita, which is the wand building, the experimentation, the learning, dying a bunch and finally exploiting the wand crafting mechanic to often times hilarious ends.

Wands
*****

.. figure:: {static}/images/regular_wand.gif
   :alt: regular wand
   :align: right

   Regular starting wand

So you play as a Witch, and to cast spells you need wands. Wands come with spells on them already, but you can modify them whilst your in "The Holy Mountain". "The Holy Mountain" is a special area between levels where you are free to edit your wands and spells.

Wands come in different flavors of:

- Shuffle: Yes
- Shuffle: No
- Stats
- Cast Delay
- Recharge

Shuffle: Yes wands you can think of as random access, these wands have un-controllable spell selection but they generally have better *base* statistics than the non-shuffle variety.

Shuffle: No wands are where things start to get interesting. The spell casting is no longer random, but sequential. And now different spells can now interact with each other in interesting ways within that wand.

Spells
******

There is a huge variety of spells in Noita, many of which have visible, and invisible statics and hidden effects. These effects will alter the performance of the wands you put them on. Meaning if you can find certain spells that reduce the "Cast Delay" or "Recharge" time to 0. You end up with something that's extremely rapid fire.


.. figure:: {static}/images/fast_wand.webp
   :alt: fast wand

   Rapid fire

This may not be sustainable with the current wand statistics, so you also have to consider the maximum mana as well as the mana-recharge rate of the wands your working with. But there's also spells for that. Shuffle: No wands function essentially like a "State-Machine" when being evaluated (when you click the shoot button). When doing more advanced techniques you can take advantage of this with some features like "spell wrapping". Putting certain spells near the end of your wand that require other spells will cause your wand to "wrap" around to the beginning of the wand again looking for another spell for it's purpose.

.. youtube:: IK8HiVWOCfI

Exploiting certain spells with wrapping will give you double the effects (and passive effects) of the spells depending on how you've configured your wands. A some very common spell wraps that you will want to start to get familiar with would be.

1. Wrapping for mana
2. Wrapping for speed: chainsaw, luminous drills, drill shots etc
3. Wrapping for damage modifiers

Wrapping Mana
^^^^^^^^^^^^^

Wrapping over a mana spell will allow you to double-dip in it's mana regeneration properties, allowing you to continuously cast sets of spells that you may not have thought possible at a glance.


Wrapping for speed
^^^^^^^^^^^^^^^^^^

When wrapping for speed, you are generally trying to fix a wand with a wand that has too slow of a cast-delay or recharge speed, by trying to get double the effect of a spell like "luminous drill" that would lower both the "cast-delay" along with the "recharge" time.

Wrapping for damage
^^^^^^^^^^^^^^^^^^^

You can also wrap a wand to recast the first spell block but with perhaps some modifiers applied to them, the possibilities are somewhat staggering with options that are available to you.

Triggers and Timers
*******************

Triggers and timers are spell types that will cast other spells when they resolve. You can think of them as containers for spells, or a way to front-load a bunch of spells "out" of another spell to chain spells together.

.. figure:: {static}/images/trigger_wand.gif
   :alt: trigger wand

   Wand with a trigger



Conditionals
************

The conditional spell types, are more of an 'end-game' type spell that you will be using to "program" your wands when you have many spell slots available to you on your wands. But they operate just like conditionals would in your favorite programming/scripting language ``if CONDITION; then SPELL block``. I'm starting to see why most of the people that seem to enjoy Noita are programmers and there's nothing wrong with that.

Conclusion
**********

Not only is Noita a very good rogue-like on it's own, completely discounting the endless replay-ability of the wand mechanics. This standout feature is so unique that I believe it will be emulated in other games for quite some time, well maybe not mainstream games, but at least in cult hits. Noita is one of my favorite games ever made, along with `Dwarf Fortress <http://bay12games.com/dwarves>`_, the Binding of Isaac and the Dark Souls series.

Bonus
*****

If your interested in the technical aspects of Noita's development definately check out the below video from GDC.

.. youtube:: prXuyMCgbTc
