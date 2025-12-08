Hyprland / Waybar Utilities
###########################

:author: mcgillij
:category: Python 
:date: 2025-12-07 21:49
:tags: Linux, wayland, Hyprland, waybar, AMDFAN
:slug: waybar-utilities-2025
:summary: Small utilities that I wrote today to help my transition to using Hyprland/waybar
:cover_image: hyprland.png

.. contents::

Wayland
=======

`arewewaylandyet.com <https://arewewaylandyet.com/>`_ is a great resource for tracking the progress of various applications and toolkits to support wayland.
And also something that I generally check a couple times a year, if anything to meme about, but this year, I decided to actually give it a go.

Hyprland
========

Having used nothing but `i3 <https://i3wm.org>`_ on Arch for the last 7 or so years, and the looming transition of everything to wayland away from X11.
I've finally made the switch (for now), to `Hyprland <https://hypr.land/>`_ and `waybar <waybar.org>`_.

While it's not like I'm not used to being on the bleeding edge, I haven't been quick on the adoption of wayland mostly because I generally use XForwarding quite often, and there's no real alternative.

But we are going to be getting Mac's at work in theory, so I won't be able todo that anyways, so I don't need to worry about that anymore.

First impressions after installing the **polkit** and **hyprland** package in arch, I had to disable my **lightdm** with `systemctl disable lightdm`, after a quick kill of the **i3** session,
I was able to fire up the default config of Hyprland, and as it turns out, seems to come with an Anime Girl background, I audibly lol'd when it popped up. Anyways that's what I get for going with the defaults.
But hey it's my first time using this WM.

.. code-block:: bash

   Hyprland

That was it, I was off and running, it didn't help that I had no idea any of the keybinds, and I didn't have **kitty** installed, which seems like the default. So the warnings popped up.
And I couldn't fire up a terminal yet, but I had this Anime girl there, so I guess that's where we're at.

Keybindings
===========

First things first, edit the keybindings found in `~/.config/hypr/keybindings.conf`

Set the default terminal to **ghostty** and my editor to **nvim**, and update the terminal keybinds, there are some neat things in this configuration file.

Mainly I like that you can add a description to each of the keybinds, so that they populate a keybind menu in Hyprland itself, in the event that you forget / don't know them.
However, I'm swapping all the defaults to the i3 controls that I already have under my fingers, as I don't have time to adjust, when it's configurable, why should I :P.

`~/.config/hypr/keybindings.conf`

.. code-block:: bash

   ## █▄▀ █▀▀ █▄█ █▄▄ █ █▄░█ █▀▄ █ █▄░█ █▀▀ █▀
   ## █░█ ██▄ ░█░ █▄█ █ █░▀█ █▄▀ █ █░▀█ █▄█ ▄█
   # Assign apps
   $TERMINAL = ghostty
   $EDITOR = nvim
   # $EXPLORER = dolphin
   # $BROWSER = firefox

   $wm=Window Management
   $d=[$wm]
   bindd = $mainMod Shift, Q, $d close focused window, exec, $scrPath/dontkillsteam.sh
   bindd = Alt, F4, $d close focused window, exec, $scrPath/dontkillsteam.sh
   bindd = $mainMod, Delete, $d kill hyprland session, exec, hyde-shell logout
   bindd = $mainMod Shift, Space, $d Toggle floating, togglefloating
   bindd = $mainMod, G, $d toggle group, togglegroup
   bindd = $mainMod, F, $d toggle fullscreen, fullscreen
   bindd = $mainMod, L, $d lock screen, exec, lockscreen.sh
   bindd = $mainMod Shift, F, $d toggle pin on focused window, exec, $scrPath/windowpin.sh
   bindd = Control Alt, Delete, $d logout menu, exec, $scrPath/logoutlaunch.sh
   bindd = Alt_R, Control_R, $d toggle waybar and reload config, exec, hyde-shell waybar --hide
   # bindd = ALT_R, Control_R,toggle waybar, exec, killall waybar || waybar # toggle waybar without reloading, this is faster

   $d=[$wm|Group Navigation]
   bindd = $mainMod Control, H, $d change active group backwards   , changegroupactive, b
   bindd = $mainMod Control, L, $d change active group forwards  , changegroupactive, f

   $d=[$wm|Change focus]
   bindd = $mainMod Shift, Left, $d focus left, movefocus, l
   bindd = $mainMod Shift, Right, $d focus right , movefocus, r
   bindd = $mainMod Shift, Up, $d focus up , movefocus, u
   bindd = $mainMod Shift, Down , $d focus down, movefocus, d
   bindd = ALT, Tab,$d Cycle focus, cyclenext

   # Move active window around current workspace with mainMod + [←→↑↓]
   $d=[$wm|Move active window across workspace]
   $moveactivewindow=grep -q "true" <<< $(hyprctl activewindow -j | jq -r .floating) && hyprctl dispatch moveactive
   bindde = $mainMod, left, Move active window to the left, exec, $moveactivewindow -30 0 || hyprctl dispatch movewindow l
   bindde = $mainMod, right, Move active window to the right, exec, $moveactivewindow 30 0 || hyprctl dispatch movewindow r
   bindde = $mainMod, up, Move active window up, exec, $moveactivewindow  0 -30 || hyprctl dispatch movewindow u
   bindde = $mainMod, down, Move active window down, exec, $moveactivewindow 0 30 || hyprctl dispatch movewindow d

This gets me 90% of the way there, for i3 muscle memory.

Now that it's usable as a WM, we need a bar of some sort, after some quick googling, seems waybar is a good choice for now.

Waybar
======

Github Notifications
____________________

For both my personal projects and work, I rely heavily on GitHub notifications—especially when it comes to code reviews. Having quick access to these notifications is essential; otherwise, I’m stuck using the website, which is far less convenient.

Previously, I wrote custom py3status modules for i3 to handle notifications. Now that I’ve switched to Waybar, I realized many of those modules don’t exist... Surprisingly, there wasn’t a GitHub notification plugin or module available for Waybar, something I found hard to believe!

To solve this, I ported my ``py3status_github_notifications`` project to Waybar. You can check it out on GitHub: `waybar_github_notifications <https://github.com/mcgillij/waybar_github_notifications>`_.

Getting started is simple: just clone the repository, add a couple of configuration parameters to your Waybar config, and you’re good to go. The documentation should help you get set up quickly.

`~/.config/waybar/config`

.. code-block:: json

   ...
   "modules-center": [
     "hyprland/window",
     "cpu",
     "memory",
     "network",
     "custom/gh", // < add it here
   ...
   "custom/gh": {
     "format": "{text}",
     "return-type": "json",
     "exec": "$HOME/.config/waybar/custom_modules/gh_notifications.sh",
     "interval": 300,
     "on-click": "exec xdg-open https://github.com/notifications?query=reason%3Aparticipating",
   }
   ...

Amdfan Monitor
______________

I also maintain `Amdfan <https://github.com/mcgillj/amdfan>`_ and `py3status_amdfan <https://github.com/mcgillij/py3status_amdfan>`_, which I rely on to keep my fan status visible in my status bar. This is especially useful since I'm often pushing my VRAM to the limit with various machine learning models for experimenting with my Discord bots.

For Waybar, all that's needed is **JSON** output from the application. I was able to format it similarly to the old py3status module, so after a quick `poetry init/add/install`, everything was up and running. You can find the new `waybar_amdfan <https://github.com/mcgillij/waybar_amdfan>`_ on GitHub. Installation is straightforward—just clone the repository and add a config block.

`~/.config/waybar/config`

.. code-block:: json

   ...
   "modules-center": [
       "hyprland/window",
       "cpu",
       "memory",
       "network",
       "custom/gh",
       "custom/gh#2",
       "custom/fan_monitor", // < add at some spot
     ],
   ...
   "custom/fan_monitor": {
       "format": "{text}",
       "exec": "$HOME/.config/waybar/waybar_amdfan/waybar_amdfan.sh",
       "restart-interval": 5,
       "return-type": "json",
   },
   ...

Overall I find **waybar** really easy to work with, and quite similar to **py3status**, it doesn't support as many features yet, but it does allow me to write the modules in **Python** and **Bash** or really any language, so what
it lacks in features, it makes up for in flexibility.

Still need to figure out how to conditionally change the colors that are displayed for my github notifications, but for now I at least have the base functionality covered.

Discord
_______
Finally, **Discord**. When it came time to play some D&D, I didn’t expect any issues, as Discord had mostly been working fine. However, I hadn’t tried using voice chat or push-to-talk since switching to Hyprland/Wayland.

On Wayland, Discord’s keybinds don’t work because there’s no mechanism for global hotkeys. You either have to use voice activation, a software mute button, an external program to manage keybinds, or run Discord under XWayland.

For now, I chose to run Discord in XWayland, which restores its X11 keybinding functionality. However, this only works when Discord is the focused window. It’s a temporary workaround, and I’ll need to research better solutions. It’s unclear how the Wayland community will address this, as they seem resistant to implementing features needed by many applications. Maybe there’s an easy solution I’ve missed.

To launch Discord under XWayland, use the following command:

.. code-block:: bash

   ELECTRON_OZONE_PLATFORM_HINT=x11 /usr/bin/discord-canary

This allows Discord to retain some keybinding functionality, but the focus issue remains.

Conclusion
__________

So far so good, only 1 day into Hyprland, but it's familiar enough, and hopefully some of the issues with apps like discord, and I'm sure as soon as I try to do a screenshare, that it will be a mess, but for now it's ok.

I'm sure I'll end up with a pile of hacks and configuration shenans at some point, but I'll jam it into some dotfiles and go on with my day.

Let me know if you've also made the move over to Wayland, and have run into particular issues.
