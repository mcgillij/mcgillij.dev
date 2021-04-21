Bitwarden after a couple years of LastPass
##########################################

:author: mcgillij
:category: Linux
:date: 2021-04-20 22:49
:tags: Linux, Passwords, Encryption, Hunter2, #100DaysToOffload
:slug: bitwarden-vs-lastpass
:summary: Overview from a couple months of usage with bitwarden, coming from several unwilling years with LastPass.
:cover_image: encryption.png

.. contents::

LastPass
********

LastPass was my first foray into password managers. Until then I would god forbid just remember my passwords. 

However I'm not one to have many online accounts so it wasn't ever too big of a deal. That changed, when I moved to a new job several years ago. Due to my employer using it to manage all the work credentials. The experience wasn't super pleasant, however it was OK and got the job done.

But LastPass always seemed like a bit of a train-wreck.

- a terrible UI
- terrible browser extensions
- god awful mobile client
- requiring a binary client to attach files...
- possibly the worse track record ever for security vulnerabilities and mishaps

I don't think any of that's changed for the better since I've started using it. If anything it's only getting worse.

So anyways since I already used it for work, I just made another account and stored my credentials for my personal stuff in there. However when they announced that they were going to be hosing free clients. I had to find an alternative for my personal credentials.

Enter Bitwarden
***************

There are a couple alternatives around that I considered.

- `Bitwarden <https://bitwarden.com/>`_
- `Keepass <https://keepass.info/>`_

Bitwarden is more of a drop in replacement for LastPass with a self-hosted option via `bitwarden_rs <https://github.com/dani-garcia/bitwarden_rs>`_. It also supports importing from an exported LastPass vault, which is what I ended up doing. The mobile client, and web browser extension works great.

Keepass is less of a password manager, and more of an encrypted file manager. You have to manage that file's sync'ing to all your devices etc.

Both are better options than LastPass, although I still have to use it for work. However that access is mitigated since I only ever access it through a VM.

If you're looking for an open source password manager, you can't go wrong with either of these.
