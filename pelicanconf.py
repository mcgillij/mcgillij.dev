#!/usr/bin/env python
# -*- coding: utf-8 -*- #
THEME="theme"
AUTHOR = 'Jason McGillivray'
SITENAME = "Dev Oops - All things Arch, Debian and Python"
SITEURL = 'https://mcgillij.dev'
SITETITLE = "Dev Oops - All things Arch, Debian and Python"

PLUGIN_PATHS = ['pelican-plugins']

PLUGINS = [
    'pelican-cover-image',
    'readtime',
    'pelican_youtube',
    'extract_toc',
    'better_figures_and_images',
    'sitemap',
    'better_tables',
    'css-html-js-minify',
#    'optimize_images',  # mega slow single threaded or something
    'image_process'
]


IMAGE_PROCESS = {
    "crisp": {
        "type": "responsive-image",
        "srcset": [
            ("1x", ["scale_in 800 600 True"]),
            ("2x", ["scale_in 1600 1200 True"]),
            ("4x", ["scale_in 3200 2400 True"]),
        ],
        "default": "1x",
    },
    "large-photo": {
        "type": "responsive-image",
        "sizes": (
            "(min-width: 1200px) 800px, "
            "(min-width: 992px) 650px, "
            "(min-width: 768px) 718px, "
            "100vw"
        ),
        "srcset": [
            ("600w", ["scale_in 600 450 True"]),
            ("800w", ["scale_in 800 600 True"]),
            ("1600w", ["scale_in 1600 1200 True"]),
        ],
        "default": "800w",
    },
}

SITEMAP = {
    "exclude": ["tag/", "category/"],
    "format": "xml",
    "priorities": {
        "articles": 0.5,
        "indexes": 0.5,
        "pages": 0.5
    },
    "changefreqs": {
        "articles": "monthly",
        "indexes": "daily",
        "pages": "monthly"
    }
}

RESPONSIVE_IMAGES = True
FIGURE_NUMBERS = True

GOOGLE_ANALYTICS = "UA-31674674-2"


STATIC_PATHS = ['images', 'extras', 'icons']
EXTRA_PATH_METADATA = {
    'extras/favicon.ico': {'path': 'favicon.ico'},
    'extras/youtube.css': {'path': 'youtube.css'},
    'extras/robots.txt': {'path': 'robots.txt'},
    'extras/error.html': {'path': 'error.html'},
}

ARTICLE_EXCLUDES = ['extras']

COVER_IMAGES_PATH = 'images'
DEFAULT_COVER_IMAGE = "dingle.jpg"

TYPOGRIFY = True

PATH = "content"

TIMEZONE = 'America/Halifax'

DEFAULT_LANG = 'en'
OG_LOCALE = "en_US.UTF-8"
LOCALE = "en_US.UTF-8"

# Feed generation is usually not desired when developing
#FEED_ALL_ATOM = None
#CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

FEED_MAX_ITEMS = 15
FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'

# Blogroll
LINKS = (('Kernel', 'https://kernel.org'),
         ('Python', 'https://www.python.org'),
         ('Level1techs', 'https://forum.level1techs.com'),
         ('Arch Wiki', 'https://wiki.archlinux.org'),
         ('Debian', 'https://debian.org'),
         )

# Social widget
SOCIAL = (('github', 'https://github.com/mcgillij'),
        ('gemini capsule', 'gemini://gemini.mcgillij.dev'),
        ('@mcgillij', 'https://fosstodon.org/@mcgillij'),
        ('keyoxide', 'https://keyoxide.org/hkp/mcgillivray.jason@gmail.com'),
           ('Atom/RSS', '/feeds/all.atom.xml'),
          )

DEFAULT_PAGINATION = 20

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
