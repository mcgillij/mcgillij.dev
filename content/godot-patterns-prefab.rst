Godot Patterns: Prefab
######################

:author: mcgillij
:category: Games
:date: 2024-11-07 19:49
:tags: Linux, Python, GDScript, Godot, Patterns, Prefab
:slug: godot-patterns-prefab
:summary: In this post I'll go over the Prefab pattern that I've been using in Atiya's Quest, that allows for dynamic content creation in Godot.
:cover_image: godot.png

.. contents::

Patterns part2: Prefabs
=======================

I'm not sure if this is the actual name for this type of pattern, but until corrected I'm just going to call it a prefab for my own documentation.

Using Resources
---------------

It breaks down to using **Resource**'s / Scripts and sometimes inheritance to power creating many different game objects and class combinations that will allow you to define these things within the editor's *Inspector* tab. The alternative is huge blocks of repeated code, you could just make a giant dictionary of basically these things and dynamically create all the same things if you wanted to.

**Resource**'s have a number of advantages over just using a giant `Dictionary` or data structure to store your game objects. **Resources** support serializing / saving to disk with the usage of `ResourceSaver.save()` and loading with `load()` or `preload()`.

Here's an example of looking at one of the Ability Resources.

.. image:: {static}/images/godot/Pasted\ image\ 20241107174620.png
   :width: 100%
   :alt: Inspector in godot editor showing the Ability resource

It's got a bunch of fields and settings to populate, these are defined by the script that's attached to the **Resource**.

My Base Class: **Ability.gd**:

.. code-block:: GDScript

    extends Resource

    class_name Ability
    enum ABILITY_TYPES { Bark, Reflex, Alertness, Vigor, Enthusiasm }

    @export var name: String
    @export var ability_type: ABILITY_TYPES
    @export_multiline var flavor_text: String
    @export var level: int
    @export var texture: Texture2D
    @export var disabled_texture: Texture2D
    @export var cost: Dictionary # mana cost
    @export var damage: int
    @export var initial_cooldown: int # in turns
    @export var effects := {}
    @export var description: String

    func _to_string() -> String:
      return "[Ability: %s (%s)]" % [name, ability_type]

Some of my abilities just attach this script to their resources directly, since they don't have any extra activated portions. In this case, I'm using inheritance to define a **Bite.gd** script that will inherit from **Ability** with a function that will get called within my processing loop. I will go over this at a later date when talking about a "manager" pattern (would loosely be based on a Mediator / Facade pattern).

**Bite.gd**

.. code-block:: GDScript

    extends Ability

    func booster_ability() -> void:
      var bite_cols := []
      match level:
        1:
          bite_cols = [3]
        2:
          bite_cols = [1, 5]
        3:
          bite_cols = [1, 3, 5]
      EventBus.do_bite_booster.emit(bite_cols)

So doing, this I'll get all the goodies from the **Ability.gd** as well as my custom functionality one-off for *Bite*. This means I don't need to have a massive **Ability.gd** with a massive set of conditional statements for each of my abilities etc.

So, so far we have our `Ability.gd`, `Bite.gd` and our `bite.tres` (just blank newly created resource from the editor). We can attach the Bite.td to the resource, which then will allow the *Inspector* will now allow you to fill out the new ability details directly.

Now if you want to create any new abilities, you can just *duplicate* one of the **Resources**, and then just attach the `Ability.gd` to the resource if you need just the basic functionality, otherwise you can create a small script that will inherit from the *Ability* and define your one-off functionality in the new script. Either way you then just have to modify the values from the *Inspector*, and you can load these resources and use them in your scenes like normal.

Anyways this isn't the whole **prefab** pattern, this is just basic resource usage, but I figured I should cover it in the event someone reading this is just starting out. Onto the rest.

So now we can define our resources, populate their attributes through the inspector. But how do we go about really using all of these things in scenes as prefabs.

Prefabs
-------

So whats a prefab... Practically it's a half-baked **PackedScene** that you can dynamically instantiate to display different "things".

Here's a look at my AbilityViewerPrefab:

.. image:: {static}/images/godot/Pasted\ image\ 20241107181852.png
   :width: 100%
   :alt: AbilityViewerPrefab scene in godot editor

So we've got a whole bunch of UI elements / Controls defined for our placeholder Ability viewer. And at the top level we attach a script which you can take a look at below:

.. code-block:: GDScript

    extends Node2D

    @onready var cost_label: Label = %cost_label
    @onready var ability_name: Label = %ability_name
    @onready var ability_image: TextureRect = %ability_image
    @onready var ability_desc: Label = %ability_desc
    @onready var ability_effect: Label = %ability_effect
    @onready var ability_damage: Label = %ability_damage
    @onready var cooldown_value: Label = %cooldown_value

    const MANA_LABELS = "booster1_mana_labels"

    func setup(ability: Ability) -> void:
        ability_name.text = ability.name
        ability_image.texture = ability.texture
        ability_desc.text = ability.description
        ability_effect.text = str(ability.effects)
        ability_damage.text = str(ability.damage)
        cooldown_value.text = str(ability.initial_cooldown)
        mana_labels(ability)

    func mana_labels(ability: Ability, is_visible: bool = true) -> void:
        # iterate through all the booster groups / mana costs and set them
        cost_label.visible = true
        var mana_labels = get_tree().get_nodes_in_group(MANA_LABELS)
        for p in mana_labels:
            for mana_color in ability.cost.keys():
                if p.name == mana_color:
                    p.text = str(ability.cost[mana_color])
                    p.get_parent().visible = is_visible

As you can see the bulk of this script, is just references to UI elements, and setting them based on the parameter passed into the `setup()` function. Notice that it takes an `Ability` as a parameter. You can likely see where this is going.

So we have a scene filled with placeholders, and then a setup function that populates these placeholders with the values from a "thing".

There isn't much functionality or game-logic here, you will want to handle that in other places, the idea is to have *placeholder* UI elements that do not encompass any of the logic and just display the "things".

Anyways so we save this scene, and we will go over how to use it as a prefab in another scene that will instantiate it.

.. image:: {static}/images/godot/Pasted\ image\ 20241107182900.png
   :width: 100%
   :alt: AbilityViewerPrefab scene in godot editor

So how do we use the damn thing? Using an `@export` var we define a **PackedScene** variable for our prefab. And then populate it from the *Inspector* or you could just `load()` it if you want to hard-code the location to it (In my case here I have different "views" for abilities, so the possibility of needing to swap it out is there, so I set it with the inspector). 

I also set a `bool` value to toggle if the display is active or not, but it's not necessary, just adjust based on how you're using the a prefab.

.. code-block:: GDScript

    func show_monster_ability_panel(ability: Ability) -> void:
        if ability_panel_out:
            active_ability_panel.queue_free()
            ability_panel_out = false
        else:
            active_ability_panel = ability_view_prefab.instantiate()
            add_child(active_ability_panel)
            active_ability_panel.setup(ability)
            active_ability_panel.position = ABILITY_VIEW_LOCATION
            ability_panel_out = true

In the above snippet, you can see how we are *instantiate* our prefab and call it's `setup()` and pass it one of our Ability **Resource**'s.

1. Instantiate the prefab (`.instantiate()`)
2. add it to the scene (`add_child()`)
3. call the setup with a resource (`active_ability_panel.setup(ability)`)

That's it. The process of working with prefabs once they are created is super concise. There is however a bit of upfront configuration and resource creation. However over the long term this will allow you to dynamically add more Abilities (in my case) to your game, even without recompilation since you can manage the resources without having to recompile the game itself. Let me know if you find this helpful, or if you have any other neat patterns to work with in Godot.

Bonus uses with Ability resource and prefabs:
-----------------------------------------------------


.. image:: {static}/images/godot/Pasted\ image\ 20241107184247.png
   :width: 100%
   :alt: Skill / ability tree in Atiya's Quest

.. image:: {static}/images/godot/Pasted\ image\ 20241107184725.png
   :width: 100%
   :alt: Ability select page in Atiya's Quest

.. image:: {static}/images/godot/Pasted\ image\ 20241107184802.png
   :width: 100%
   :alt: Game screen showing ability viewer in Atiya's Quest


Using prefabs allows easy re-use of the resources that you've defined.
