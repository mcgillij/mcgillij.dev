(function() {
    'use strict';

    var lightbox = null;
    var currentIndex = 0;
    var items = [];

    function createLightbox() {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
            <button class="lightbox-next" aria-label="Next">&#8250;</button>
            <div class="lightbox-content">
                <img src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;

        var closeBtn = lightbox.querySelector('.lightbox-close');
        var prevBtn = lightbox.querySelector('.lightbox-prev');
        var nextBtn = lightbox.querySelector('.lightbox-next');
        var content = lightbox.querySelector('.lightbox-content img');
        var caption = lightbox.querySelector('.lightbox-caption');

        function showImage(index) {
            if (index < 0 || index >= items.length) return;
            currentIndex = index;
            var item = items[currentIndex];
            content.src = item.href;
            content.alt = item.alt || '';
            caption.innerHTML = item.caption || '';

            prevBtn.style.display = items.length > 1 ? 'block' : 'none';
            nextBtn.style.display = items.length > 1 ? 'block' : 'none';
        }

        closeBtn.addEventListener('click', function() {
            lightbox.remove();
            lightbox = null;
            document.body.style.overflow = '';
        });

        prevBtn.addEventListener('click', function() {
            showImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', function() {
            showImage(currentIndex + 1);
        });

        lightbox.querySelector('.lightbox-content').addEventListener('click', function(e) {
            if (e.target === content || e.target === caption) return;
            var rect = lightbox.querySelector('.lightbox-content').getBoundingClientRect();
            var x = e.clientX - rect.left;
            if (x < rect.width / 3 && items.length > 1) showImage(currentIndex - 1);
            else if (x > (rect.width * 2) / 3 && items.length > 1) showImage(currentIndex + 1);
        });

        document.addEventListener('keydown', function(e) {
            if (!lightbox) return;
            if (e.key === 'Escape') closeBtn.click();
            if (e.key === 'ArrowLeft' && items.length > 1) prevBtn.click();
            if (e.key === 'ArrowRight' && items.length > 1) nextBtn.click();
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeBtn.click();
        });

        document.body.appendChild(lightbox);
    }

    function initGallery() {
        var galleries = document.querySelectorAll('.gallery');

        for (var i = 0; i < galleries.length; i++) {
            var links = galleries[i].querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"], a[href$=".webp"]');

            for (var j = 0; j < links.length; j++) {
                (function(link) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        items = [];

                        for (var k = 0; k < links.length; k++) {
                            var href = links[k].getAttribute('href');
                            var caption = '';
                            if (links[k].getAttribute('caption')) {
                                caption += links[k].getAttribute('caption').replace(/\\n/g, '<br>');
                            }
                            if (links[k].getAttribute('title')) {
                                caption += '<small>' + links[k].getAttribute('title');
                            }
                            if (links[k].getAttribute('exif')) {
                                caption += ' - ' + links[k].getAttribute('exif') + '</small>';
                            }

                            items.push({
                                href: href,
                                alt: links[k].getAttribute('title') || '',
                                caption: caption
                            });
                        }

                        if (!lightbox) createLightbox();

                        for (var m = 0; m < items.length; m++) {
                            if (items[m].href === this.getAttribute('href')) {
                                currentIndex = m;
                                break;
                            }
                        }

                        var contentImg = lightbox.querySelector('.lightbox-content img');
                        var captionEl = lightbox.querySelector('.lightbox-caption');
                        contentImg.src = items[currentIndex].href;
                        contentImg.alt = items[currentIndex].alt;
                        captionEl.innerHTML = items[currentIndex].caption;

                        document.body.style.overflow = 'hidden';
                    });
                })(links[j]);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }
})();
