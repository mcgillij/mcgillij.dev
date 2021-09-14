Ploopy! New gear GET!
#####################

:author: mcgillij
:category: Hardware
:date: 2021-09-13 20:49
:tags: Hardware, Opensource, Ploopy, Trackball, 3D-Print, #100DaysToOffload
:slug: ploopy-classic-build
:summary: WTF is a Ploopy? Opensource Trackball that runs QMK!
:cover_image: ploopy_nano.png

.. contents::

WTF is a Ploopy?
****************

`Ploopy <https://ploopy.co>`_ is a trackball/mouse, that alone isn't impressive (although it's actually super good). The important/innovative part is that it's **Open Source** hardware and software.

As someone that co-founded opensource directory in the late 90's, it's still as important as ever to me now that software and hardware I use are open source.

- Open Source software driven
- Open Source hardware design
- Mod-ability
- Repairable
- `QMK <https://docs.qmk.fm/#/>`_

.. figure:: https://camo.githubusercontent.com/b09963660303b11713be409da8c29f5a673fdde45fa2575b897dd8f48d75a2f5/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f626b75494147384964765970753250343673563867704a4e622d615841766974356c5f5254546444705561506c724c39595235372d5042466e6e323259457936444377684d7537334a62775070386d6a5a4d7971376a746d724957366f79376c6f7965454b3479387a68586963636e324b5731345f5f624c7336665264574e3369535f774975394b4976536c72445a52417048515344437a5372786542774d68515567676d6c4d47644a6b5075496f65386568784f697551763164324d414a54584b326554613130465075484a68476c59696530547568394d777638507a772d536a59305f33334561626264413871696268497562596a6c304636496c5758344e46427976744f42383156656a43725253626645644745766f7663794664734c2d7179757131696d6956397143554247796155595f463355727150305175645258504f5167694e6c5a31334b675f78484c616b354576787a6d446a31396d36496b32773859582d554869664f5764796438626651784a5759335635682d58686f78726754694774544f4e3332347765636b50746e71474c444d6a434641744a3558713657732d33394d687a372d4a76784266304d343967384e474a6b57515a676e686d46444156516e6d504234413643386470455a76455f7458507537736c2d425555694c367a5643427339305f325f4f6b49547357533358596b596c313856506f417679685177477631756d4931696d554f377250496a3559624456714b64616151574d506246626a65564c767731756e4362367638354464644b3579686a772d53597946433043723437636a77573657625147664c63566b6d57617952513767726354452d6642694973465a794c766e45366f54657656756c6261574f42715a4a5a4e7445384850646f354f673150424c673065423247346d6673516a63574349666f78573774615339454f39354a4f2d514d7a776f6d5f62774b376a31536c62514d57456752496f575f34736864714a69465a5556445048623959415135387278464d753177526363644b633d77313435342d683936392d6e6f
   :alt: ploopy parts everywhere's

   Ploopy Guts

Allowing you full customization (w/software with QMK-Quantum Mechanical Keyboard firmware) and repair-ability. Meaning you have access to all the 3d designs (**.stl** files etc) and hardware diagrams required for building your own or repairing your own Ploopy.

This allows modding and custom designs and improvements and is all around a great thing for hardware to be open sourced.

I got my Ploopy today (I grabbed the classic kit)! You can find out more on the Ploopy site. If you are interested in the different models, and you can get them in either assembled or as kits (which require a tiny amount of soldering).

Build
*****

I went over the docs briefly to make sure I only needed to have my soldering iron warmed up for a bit of time. But sure enough the docs are simple and quick enough that roughly 15 mins of time is all you'd realistically need even if you are really new to soldering.

Actually building the Ploopy was very straight forward, they have excellent documentation and images to walk you through the entire process, you can find the `assembly directions here on Github <https://github.com/ploopyco/classic-trackball/wiki/Ploopy-Trackball-Kit-Assembly>`_.

They provide a soldering "jig" for the tricky bit of attaching the 2 PCB's together, which was appreciated. And while I do have a set of helping hands, I didn't have to dig them out for this little project which was nice.

.. figure:: https://camo.githubusercontent.com/cb68adc65ad20e578f1a536b24b847593215c5d213ea3140c96705c62af4e387/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f4b316e4567342d7a6c455458514a6c3358654c6d6857656a4c6f6f7954774e3648346465654b49494a2d7348474131614854672d566c574644373673634d514a6537554e736444366f565a413266547845504a54696c6236414938526c43514471434f556271705f77645330763475304a71487859575742484e6938475a783243655a474b6a4e65764458736867576d704f4f62795569655a6b6b5a4f4f584c5a4b58383265347459344b38686478416e487838486e684674523342316b766a34754f70765a6d6b736430484c637267744c5f555268566b6663514d4b5f7a595734634133787167357531712d7559534b522d593846722d683665634b596c456d4f734c63412d67674532566642374f354f576b386a474c314963674a4334674971686e6c31547470534b7a4d68505f56705938684739713962395262394f466b6a36777850593876514668365a7162586b665657666168414a6b495a36564e486d7475394761444635517a70567a5777425a6475526a4752436d65486d46466f51706f4c74516f2d555a656458314633356d424c5854454448555f6d6e4d746843536770747041787171546f67706e6175594d34734164696233324267366f39325f4c594f4a5672337a5a495a354a30706a6b79465846734667675071453246486b30547a6854614772554f76495a4b465a5f576e4b413861576d657250304c337a4b45304c6a6d4c6f616138544b6c6779523846714a4f79413063746259356f72335941784a724d6b56566433664a557a69444768654a746954414c62774b7056345871593276486e674c6c48374e35346b4d30326f524e51647032703641506c4f5566574b5874506e433045445034474b5159316130544f747a6e4a4572586879432d71573733685178504446636d736e496361775a322d68377a746c773468505362776a33672d4a585273396c753858587854376b61386e785f4f756d7159623174626c69704f6b42774249305470726c6e5a66554435344b6d4238464b43487a736773794351594530493d77313435342d683936392d6e6f
   :alt: ploopy parts

   9 spots you need to solder


From there you solder 9 points, and put in 6 or so *heat-set threaded inserts* (aka little bits for screws to attach to) with your soldering iron, once those are all in you can turn it off and put it away as the rest is doable with just the screwdriver and allen-key.


Finished Ploopy
***************

When ordering a Ploopy, you can choose various colors etc, and obviously you can print your own as well.
I went with mostly black as you can see below.

.. figure:: {static}/images/ploopy.jpg
   :alt: ploopy

   Top down shot

.. figure:: {static}/images/ploopy2.jpg
   :alt: ploopy

   Thumb side w/bottom wedge

.. figure:: {static}/images/ploopy3.jpg
   :alt: ploopy

   Right hand side

.. figure:: {static}/images/ploopy4.jpg
   :alt: ploopy

   Head on

Support
*******

Nothing really out of the ordinary here, it all works great, out of the box in Arch Linux. Works along with my regular mouse being plugged in as well, no issues.

Trackballs vs Mice
******************

While I'm not out to win any FPS competitive games in the near future, I'm looking forward to being trying out the Ploopy for some slower paced gaming.

I'll let ya's know how it goes, I am just getting older now and just making sure that I don't get RSI too badly in my hands since most of my work and hobbies involves my hands. Computering and Guitaring both aren't the easiest things to enjoy doing while keeping your wrists alive and well. Anyways let me know if ya's get a Ploopy or other trackballs!

