/* ================================================
   CONSOLID CONSTRUCTORA — Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- STICKY HEADER ----------
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- HAMBURGER MENU ----------
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Mobile dropdown toggles
    document.querySelectorAll('.has-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });

    // Close mobile nav on link click
    document.querySelectorAll('.dropdown a, .nav-item:not(.has-dropdown) > a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ---------- HERO SLIDER ----------
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 6000);
    }

    // ---------- COUNTER ANIMATION ----------
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const start = performance.now();

                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ---------- SCROLL ANIMATIONS ----------
    const animateElements = document.querySelectorAll('.quick-card, .project-card, .testimonial-card, .service-card, .timeline-item, .plano-card');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });

    // ---------- CAROUSEL ----------
    const carousel = document.querySelector('.projects-carousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 320;
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // ---------- LIGHTBOX ----------
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Cerrar">&times;</button>
            <img src="" alt="Gallery image">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ---------- FORM VALIDATION ----------
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let valid = true;
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#e74c3c';
                    field.addEventListener('input', () => {
                        field.style.borderColor = '';
                    }, { once: true });
                }
            });
            if (!valid) {
                e.preventDefault();
                alert('Por favor completá todos los campos obligatorios.');
            }
        });
    });

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---------- ACTIVE NAV HIGHLIGHT ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.parentElement.classList.add('active');
        }
    });

});
