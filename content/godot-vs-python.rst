GDScript vs Python (from a Python Dev's perspective)
####################################################

:author: mcgillij
:category: Python
:date: 2024-11-04 18:49
:tags: Linux, Python, GDScript, Godot
:slug: godot-vs-python
:summary: Learning curve coming in from having done many years of Python Dev, syntactically the language "looks" very similar, there's very little visual differences when looking at the code.
:cover_image: godot.png

.. contents::

GDScript from a Python Dev's point of view
==========================================

Learning curve coming in from having done many years of Python Dev, syntactically the language "looks" quite similar, there's little visual differences when looking at the code. I find myself not really having to context switch much when reading Python or GDScript code which is nice.

Whitespace:
***********

Python uses 4 spaces instead of Tabs in GDScript, this is something that's kind of annoying since my Neovim config is tailored mostly to Python. However I've been using the Godot Editor itself while learning for the most part so it's automagically taken care of the editor to format the code when you save anyways, so I've not really run into many issues with this.


GDScript can be written in a way that's almost visually indistinguishable from Python, with the types being optional in both Python and GDScript, more on types later.

Here's some key differences that I've had to adapt, they are all minor.

Variable declaration:
*********************

Python:
^^^^^^^

.. code-block:: python

    speed = 10
    speed2: int = 10

GDScript:
^^^^^^^^^

.. code-block:: GDScript

    var speed = 10
    var speed2: int = 10
    var speed3 := 10 #shorthand walrus doesn't work the same as in python

The walrus operator is not the same between the languages. In GDScript it's used to assign the "Type" during declaration vs the Python walrus functionality.

Function Declaration with types:
********************************

In Python we use *def* to define functions, however in GDScript *func* is used.
Parameter types and return types are implied **identically** for both.

Python:
^^^^^^^

.. code-block:: python

    def surface_area_of_cube(edge_length: float) -> str:
        return f"The surface area of the cube is {6 * edge_length ** 2}."

GDScript:
^^^^^^^^^

.. code-block:: GDScript

    func surface_area_of_cube(edge_length: float) -> String:
        return "The surface area of the cube is %s" % str(6 * edge_length ** 2)

GDScript Types:
***************

Types not only make it easier to refactor and debug your code in GDScript, they also power the editor's completion.

For instance if you have a class declared in a separate file, it won't be able to auto-populate in the editor if you are in another script without adding the type in the functions parameter or variable declaration.

Example:  **Ability.gd**

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

If we defined the following function, no completion would be usable in the function, without adding the type to the parameter.

.. code-block:: GDScript

    func setup(ability):
        ability_name.text = ability.name
        ability_image.texture = ability.texture
        ability_desc.text = ability.description
        ability_effect.text = str(ability.effects)
        ability_damage.text = str(ability.damage)
        cooldown_value.text = str(ability.initial_cooldown)
        mana_labels(ability)

Since the typing is optional in GDScript, this would still work properly, but you have to remember all the functions and variables etc. By adding the types, you'll be able to use the editors autocomplete functionality.

.. code-block:: GDScript

    func setup(ability: Ability) -> void:
        ability_name.text = ability.name
        ability_image.texture = ability.texture
        ability_desc.text = ability.description
        ability_effect.text = str(ability.effects)
        ability_damage.text = str(ability.damage)
        cooldown_value.text = str(ability.initial_cooldown)
        mana_labels(ability)

This now has the ability to autocomplete, and with the added return type specified helps with future refactoring and debugging.

Types within other data structures.

You can type Array values (but not Dictionary):

.. code-block:: GDScript

    var ability_list: Array[Ability]

Anyways the type system in GDScript is nice to work with, especially when using the built-in editor. I do not find it too overwhelming to use, and it hasn't gotten in the way of development.

Some things missing from GDScript that I've noticed that I always reach for in Python.

Sets:
*****

There currently no **Sets** in GDScript, which kinda sucks, but you can implement sets by using the existing Dictionary class.

.. code-block:: GDScript

    class_name Set
    extends RefCounted

    var _items: Dictionary = {}

    func _init(items: Array = []) -> void:
        for item in items:
            add(item)

    # Add an item to the set
    func add(item) -> void:
        _items[item] = true

    # Remove an item from the set
    func remove(item) -> bool:
        return _items.erase(item)

    # Check if an item exists in the set
    func has(item) -> bool:
        return _items.has(item)

    # Get the number of items in the set
    func size() -> int:
        return _items.size()

    # Clear all items from the set
    func clear() -> void:
        _items.clear()

    # Return all items as an array
    func to_array() -> Array:
        return _items.keys()

    # Return true if set is empty
    func is_empty() -> bool:
        return _items.is_empty()

    # Set operations
    func union(other_set: Set) -> Set:
        var result = Set.new(to_array())
        for item in other_set.to_array():
            result.add(item)
        return result

    func intersection(other_set: Set) -> Set:
        var result = Set.new()
        for item in to_array():
            if other_set.has(item):
                result.add(item)
        return result

    func difference(other_set: Set) -> Set:
        var result = Set.new(to_array())
        for item in other_set.to_array():
            result.remove(item)
        return result

    # Iterator support
    func _iter_init(_arg) -> bool:
        return not is_empty()

    func _iter_next(_arg) -> bool:
        return false

    func _iter_get(_arg):
        return to_array()[0]

Counter:
********

Basically anything from python's **collections** will need custom implementations.

.. code-block:: GDScript

    func count_array(arr: Array) -> Dictionary:
        var dict := {}
        for a in arr:
            if dict.has(a):
                dict[a] += 1
            else:
                dict[a] = 1
        return dict

Merging Dictionary with adding values:
**************************************

.. code-block:: GDScript

    func merge_dict(dict_one: Dictionary, dict_two: Dictionary) -> Dictionary:
        var dict := dict_one.duplicate()
        # Handle keys from dict_one that exist in dict_two
        for key in dict_one.keys():
            if dict_two.has(key):
                dict[key] = dict_one[key] + dict_two[key]

        # Add any keys that only exist in dict_two
        for key in dict_two.keys():
            if not dict_one.has(key):
                dict[key] = dict_two[key]

        return dict

Bonus things for learning:
**************************

Built into the editor itself is the comprehensive documentation for GDScript, it's accessible by either pressing **F1** or using the help menu.

You can hold **CTRL + click** and it will show underlines on any function / variable / class that you can click on to either go to the documentation page, or to the definition within your code. This is super handy for learning the all the built-ins.

.. image:: {static}/images/godot/Pasted\ image\ 20241104180532.png
   :alt: Editor
   :align: center

Often times I find myself typing out the class that I want to peek at the documentation and then **CTRL + clicking** it. To take a peek at the *Dictionary* documentation, I'd just type in Dictionary anywhere's in the godot code-editor and then CTRL+clicking it.

.. image:: {static}/images/godot/Pasted\ image\ 20241104180421.png
   :alt: Dictionary documentation
   :align: center

Running some unit tests:
************************

The godot command line can be a bit clunky, and doesn't really seem to take well to having some globals declared while running unit tests, but for the most part you can run headless testing with something like the below tidbit.

.. code-block:: bash

    godot project.godot --headless -s Equipment/Generator_test.gd

REPL:
*****

Well there isn't one, this is one of the major features that are missing from GDScript. There are 3rd party add-ons that implement a form of a basic REPL.

Some interesting new variable types unique to GDScript
******************************************************

GDScript has **@export** **@onready** and **signals**, visually to me when I first saw these I was a bit confused since I just assumed that they would have been Python decorators. This is not the case...

.. code-block:: GDScript

    @export var abilitiy_name: String = "default value"

**@export** vars are used to be able to set the value of a variable through the editor, turns out this is super handy when defining scenes and objects. I will dig deeper into these at a later date when looking into **Resources** and patterns.

**@onready** vars I find myself mostly using to reference scene objects / Nodes, but you can use them to do assignment once the **Object.\_init()** function has been called, and before \_ready() has been called. Since in godot you are often stitching multiple scenes and Nodes together, the chronology of instantiation can often time be a bit confusing. So the **@onready** helps out immensely with this.

.. code-block:: GDScript

    @onready var cooldown_value: Label = %cooldown_value

**signals** are used to pass well signals between scenes / nodes, generally these will be associated with "call-ables" aka passing functions around in python, or callbacks.

.. code-block:: GDScript

    signal back_button

    func _on_back_button_pressed() -> void:
        emit_signal("back_button")


The simplicity of using signals in the editors interface is nice when you are working with only a handful of scenes, but quickly, it escalates to having to create / manage a global EventBus (I'll cover this at a later date).

Using the **signals** you will be able to trigger other functions with parameters passed around through the callbacks. This will allow you to build up between multiple scene objects or UI buttons etc.

Missing pieces:
***************

List / Dict / Set comprehension's aren't available. Lambda's are mostly only usable to make list filters.

Conclusion:
***********

I've been enjoying learning GDScript, it's been a nice change of pace from Python, and I've been able to pick it up quite quickly. At it's core it's not trying to be Python, but only Python-like, and that's enough, as the readability and the syntax is very similar. The editor itself is a joy to work with, and the documentation is quite comprehensive.


Some of you may find this interesting if you are also trying to dig deeper into GDScript, and have a familiar background in Python development.

Let me know if you've also experienced some similarities or differences.
