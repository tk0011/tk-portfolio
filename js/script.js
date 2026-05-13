// ─── Theme (runs immediately to avoid flash) ──────
(function () {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();

document.addEventListener('DOMContentLoaded', () => {
    // ─── Theme Toggle ──────────────────────────────────
    const themeBtn = document.getElementById('theme-toggle');
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    };

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            applyTheme(isLight ? 'dark' : 'light');
        });
    }

    // ─── Cursor ────────────────────────────────────────
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const sections = document.querySelectorAll('section');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;

        // ─── Spotlight: update --mx/--my relative to each section ──
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            sec.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            sec.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });

    function animCursor() {
        dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
        rx += (mx - rx) * .12;
        ry += (my - ry) * .12;
        ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;
        requestAnimationFrame(animCursor);
    }
    animCursor();

    // ─── Nav scrolled ──────────────────────────────────
    const nav = document.getElementById('nav');
    const main = document.documentElement;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ─── Scroll Spy (Nav & Dots) ────────────────────────
    const navLinks = document.querySelectorAll('.nav-links a, .nav-logo');
    const dotLinks = document.querySelectorAll('.side-line .dot');

    const observerOptions = {
        root: null,
        threshold: 0.5, // 50% of the section should be visible
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update dots
                dotLinks.forEach(dot => {
                    dot.classList.toggle('active', dot.getAttribute('data-section') === id);
                });

                // Update nav links
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ─── Intersection fade-in ──────────────────────────
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => {
        if (!el.classList.contains('visible')) {
            fadeObserver.observe(el);
        }
    });

    // ─── Mobile Menu Toggle ──────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-links');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerText = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.innerText = '☰';
            });
        });
    }

    // ─── Project Slider Logic ────────────────────────
    const slider = document.getElementById('projects-slider');
    const prevBtn = document.getElementById('prev-proj');
    const nextBtn = document.getElementById('next-proj');

    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        // Button navigation
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -400, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 400, behavior: 'smooth' });
        });

        // Skew effect on scroll
        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

        let lastScroll = slider.scrollLeft;
        const cards = document.querySelectorAll('.project-card');

        const updateSkew = () => {
            let diff = slider.scrollLeft - lastScroll;
            lastScroll = slider.scrollLeft;
            let skew = clamp(diff * 0.1, -15, 15);
            
            cards.forEach(card => {
                card.style.transform = `skewX(${skew}deg) scale(${1 - Math.abs(skew) / 100})`;
            });
            
            requestAnimationFrame(updateSkew);
        };
        updateSkew();
    }

    // ─── FAQ Accordion ─────────────────────────────────
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item.open').forEach(el => {
                el.classList.remove('open');
                el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            });
            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
