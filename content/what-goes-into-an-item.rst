What goes into an item in Atiya's Quest
#######################################

:author: mcgillij
:category: Games
:date: 2025-02-25 19:29
:tags: Linux, Godot, GameDev, Atiya
:slug: what-goes-into-an-item
:summary: Explore the intricate process of creating equipment in Atiya's Quest, from effects and rarity to unique names and descriptions.
:cover_image: atiyas_quest_equipment.png

.. contents::

What goes into an item in Atiya's Quest
=======================================

In *Atiya's Quest*, each piece of equipment isn't just a random item—it's crafted with care and logic to ensure it fits seamlessly into the game's ecosystem. Whether it's a weapon, armor, or accessory, every item is designed to enhance your adventure in meaningful ways. In this post, we'll explore how these items are created, from their basic structure to the intricate details that make them unique.


The Equipment Blueprint
-----------------------

At its core, every piece of equipment is an instance of the `Equipment` class, which extends the base `Item` class. This inheritance means that all equipment has properties like a name, texture, and value but adds specific attributes tailored for enhancing Atiya's abilities:

.. code-block:: GDScript

    extends Item

    class_name Equipment

    enum equipment_types { HAT, TAIL, COLLAR, HARNESS, BRACERS, WEAPON }
    enum equipment_rarity { TERRIBLE, BAD, OK, COMMON, GOOD, GREAT, UNCOMMON, SPECIAL, EXTRAORDINARY, RARE, EPIC, LEGENDARY, MYTHIC, ARTIFACT, UNIQUE }

    @export var type: equipment_types
    @export var effects: Dictionary

    @export var rarity: equipment_rarity
    @export var gold_value: int

Here’s what each property does:

 * **type**: Determines the category of the item (e.g., weapon, armor).
 * **effects**: A dictionary storing stat boosts or penalties.
 * **rarity**: Indicates how rare and powerful the item is.
 * **gold_value**: The price in gold coins.

Assigning Effects and Rarity
----------------------------

Each equipment piece has effect ranges (that are rolled to be within that range) that modify Atiya's stats. For example, a "Swift" prefix might increase reflexes, while a " the Quick" suffix could enhance evasion. These effects are merged from predefined prefixes and suffixes:

.. code-block:: GDScript

    var prefixes = [
        {"name": "Mighty", "effect": {"bark": Vector2i(1, 5)}},
        {"name": "Swift", "effect": {"reflex": Vector2i(1, 5)}},
        // ... more prefixes
    ]

    var suffixes = [
        {"name": "of Strength", "effect": {"bark": Vector2i(1, 5)}},
        {"name": "of Dexterity", "effect": {"reflex": Vector2i(1, 5)}},
        // ... more suffixes
    ]

The `RarityCalculator` determines an item's rarity based on the combined strength of its effects:

.. code-block:: GDScript

    class RarityCalculator:
        var effect_scores = {
            "bark": 10,
            "reflex": 10,
            // ... other stats and their weights
        }

        func calculate_effect_score(effects: Dictionary) -> int:
            var total_score = 0
            for effect in effects.keys():
                var value = effects[effect]
                if effect in effect_scores:
                    total_score += value * effect_scores[effect]
            return total_score

Higher scores result in rarer and more valuable items.


Generating Unique Names and Descriptions
----------------------------------------

No equipment is anonymous. Each item gets a unique name by combining random prefixes and suffixes:

.. code-block:: GDScript

    var bracer_names = ["Cuffs", "Gauntlets", "Bracers", ...]
    var hat_names = ["Hat", "Helmet", "Helm", ...]

    // In EquipmentGenerator:
    equipment.name = prefix["name"] + " " + equipment.name + " " + suffix["name"]

Flavor text adds personality and lore:

.. code-block:: GDScript

    func generate_flavor_text(prefix: String, suffix: String) -> String:
        var descriptions = [
            "It radiates an aura of %s,\nenhancing the wielder’s %s\npower and %s ability.",
            // ... more descriptions
        ]

        return description % [resolved_prefix, resolved_prefix, resolved_suffix]

The Generation Process
----------------------

.. image:: {static}/images/atiyas_quest_item.png
   :alt: Atiya's Quest item
   :align: center

Creating equipment involves several steps:

 1. **Select a Type**: Choose from categories like weapons or armor.
 2. **Assign Base Properties**: Set the texture and name based on type.
 3. **Apply Prefixes and Suffixes**: Combine effects to create unique stat boosts.
 4. **Calculate Rarity and Value**: Use the `RarityCalculator` to determine rarity and set a gold value.

Here's how it all comes together in code:

.. code-block:: GDScript

    func generate_equipment_of_rarity(desired_rarity: Equipment.equipment_rarity) -> Equipment:
        var equipment = Equipment.new()
        equipment.type = randi() % Equipment.equipment_types.size()

        // Set base properties
        set_equipment_base_properties(equipment)

        // Calculate target score for desired rarity
        var target_score = get_target_score_for_rarity(desired_rarity)
        var score_range = 20

        // Generate effects until we hit the desired score range
        while current_attempt < max_attempts:
            equipment.effects = {}
            prefix = prefixes[randi() % prefixes.size()]
            suffix = suffixes[randi() % suffixes.size()]

            equipment.effects = Utils.merge_dict(equipment.effects, roll_effects(prefix["effect"]))
            equipment.effects = Utils.merge_dict(equipment.effects, roll_effects(suffix["effect"]))

            var current_score = rare_calculator.calculate_effect_score(equipment.effects)
            if abs(current_score - target_score) <= score_range:
                // Success! Set name, flavor text, and return.
                equipment.name = prefix["name"] + " " + equipment.name + " " + suffix["name"]
                equipment.flavor_text = generate_flavor_text(prefix["name"], suffix["name"])
                equipment.rarity = desired_rarity
                equipment.gold_value = calculate_gold_value(desired_rarity)
                return equipment

        // If no match found, fallback to random generation.
        return generate_random_equipment()

Final Thoughts
--------------

Creating an item in *Atiya's Quest* is a intricate process that combines randomness with balance. Each piece of equipment is carefully designed to provide meaningful progression while maintaining variety and lore through unique names and descriptions. This system ensures that every time you find a new item, it feels like a special discovery—one that could tip the balance in your favor.

Hope that clears up what goes into an item in Atiya's Quest! If you have any questions or want to learn more about the game's development, feel free to ask in the comments.
