/* ============================================================
   ADHIM SATYA NUGRAHA — PORTFOLIO JAVASCRIPT
   3D Animations, Particles, Tilt, Interactions
   ============================================================ */

'use strict';

/* ========================
   UTILITIES
   ======================== */
const qs = (sel, scope = document) => scope.querySelector(sel);
const qsa = (sel, scope = document) => [...scope.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

/* ========================
   LOADER
   ======================== */
const Loader = (() => {
    const loader = qs('#loader');

    const hide = () => {
        if (!loader) return;
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 700);
    };

    window.addEventListener('load', () => setTimeout(hide, 2200));
    // Fallback
    setTimeout(hide, 3500);
})();

/* ========================
   THEME TOGGLE
   ======================== */
const Theme = (() => {
    const toggle = qs('#themeToggle');
    const icon = qs('#themeIcon');
    const DARK = 'dark', LIGHT = 'light';

    const saved = localStorage.getItem('theme') || DARK;
    const apply = (theme) => {
        document.body.classList.toggle('light-mode', theme === LIGHT);
        if (icon) {
            icon.className = theme === LIGHT ? 'fas fa-moon' : 'fas fa-sun';
        }
        localStorage.setItem('theme', theme);
    };

    apply(saved);

    on(toggle, 'click', () => {
        const isLight = document.body.classList.contains('light-mode');
        apply(isLight ? DARK : LIGHT);
    });
})();

/* ========================
   PARTICLE SYSTEM (Canvas)
   ======================== */
const Particles = (() => {
    const canvas = qs('#particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -1000, y: -1000 };

    const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 100;
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

    const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.1,
        life: Math.random() * Math.PI * 2,
    });

    const init = () => {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    };

    const draw = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.life += 0.01;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha = 0.1 + Math.abs(Math.sin(p.life)) * 0.35;

            // Wrap
            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;
            if (p.y < -10) p.y = H + 10;
            if (p.y > H + 10) p.y = -10;

            // Mouse repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                p.x += dx / dist * 1.5;
                p.y += dy / dist * 1.5;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });

        // Draw connections
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#6366f1';
                    ctx.globalAlpha = (1 - dist / 100) * 0.12;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;

        requestAnimationFrame(draw);
    };

    on(window, 'resize', resize);
    on(window, 'mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    on(window, 'mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    init();
    draw();
})();

/* ========================
   CUSTOM CURSOR
   ======================== */
const Cursor = (() => {
    const dot = qs('#cursorDot');
    const outline = qs('#cursorOutline');
    if (!dot || !outline) return;

    // Only on non-touch devices
    if ('ontouchstart' in window) {
        dot.style.display = 'none';
        outline.style.display = 'none';
        return;
    }

    let mx = 0, my = 0, ox = 0, oy = 0;
    let rafId;

    on(document, 'mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    const animateOutline = () => {
        ox = lerp(ox, mx, 0.12);
        oy = lerp(oy, my, 0.12);
        outline.style.left = ox + 'px';
        outline.style.top = oy + 'px';
        rafId = requestAnimationFrame(animateOutline);
    };
    animateOutline();

    const hoverEls = 'a, button, .tilt-card, .filter-btn, .portfolio-card, .skill-card-3d';
    on(document, 'mouseover', e => {
        if (e.target.closest(hoverEls)) {
            dot.classList.add('hover');
            outline.classList.add('hover');
        }
    });
    on(document, 'mouseout', e => {
        if (e.target.closest(hoverEls)) {
            dot.classList.remove('hover');
            outline.classList.remove('hover');
        }
    });
    on(document, 'mouseleave', () => {
        dot.style.opacity = '0';
        outline.style.opacity = '0';
    });
    on(document, 'mouseenter', () => {
        dot.style.opacity = '1';
        outline.style.opacity = '1';
    });
})();

/* ========================
   SCROLL PROGRESS BAR
   ======================== */
const ScrollProgress = (() => {
    const bar = qs('#scrollProgress');
    if (!bar) return;
    on(window, 'scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        bar.style.width = (scrollTop / (scrollHeight - clientHeight) * 100) + '%';
    }, { passive: true });
})();

/* ========================
   NAVBAR
   ======================== */
const Navbar = (() => {
    const navbar = qs('#navbar');
    const hamburger = qs('#hamburger');
    const mobileMenu = qs('#mobileMenu');
    const overlay = qs('#mobileOverlay');
    const navLinks = qsa('.nav-link');
    const mobileLinks = qsa('.mobile-nav-link');
    let isOpen = false;

    // Scroll effect
    on(window, 'scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Hamburger toggle
    const toggleMenu = () => {
        isOpen = !isOpen;
        hamburger.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMenu = () => {
        if (!isOpen) return;
        isOpen = false;
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    on(hamburger, 'click', toggleMenu);
    on(overlay, 'click', closeMenu);
    mobileLinks.forEach(link => on(link, 'click', closeMenu));

    // Close on Escape
    on(document, 'keydown', e => { if (e.key === 'Escape') closeMenu(); });

    // Active nav link on scroll
    const sections = qsa('section[id]');
    const setActive = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = qs(`.nav-link[href="#${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    };
    on(window, 'scroll', setActive, { passive: true });
    setActive();
})();

/* ========================
   SMOOTH SCROLL
   ======================== */
qsa('a[href^="#"]').forEach(anchor => {
    on(anchor, 'click', function(e) {
        e.preventDefault();
        const target = qs(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ========================
   SCROLL REVEAL ANIMATIONS
   ======================== */
const Reveal = (() => {
    const els = qsa('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    els.forEach(el => observer.observe(el));
})();

/* ========================
   3D TILT EFFECT
   ======================== */
const Tilt = (() => {
    const cards = qsa('.tilt-card');
    const INTENSITY = 12;
    const SCALE = 1.02;

    cards.forEach(card => {
        const inner = card.querySelector('.glass-card, .card-3d-inner, .skill-card-inner, .portfolio-card-inner, .contact-info-card, .contact-form');

        on(card, 'mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotX = -y * INTENSITY;
            const rotY = x * INTENSITY;

            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${SCALE})`;
        });

        on(card, 'mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
})();

/* ========================
   HERO 3D PARALLAX
   ======================== */
const HeroParallax = (() => {
    const scene = qs('#hero3dScene');
    const heroCard = qs('#heroCard');
    if (!scene) return;

    on(window, 'mousemove', e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        qsa('.shape').forEach((shape, i) => {
            const depth = (i + 1) * 8;
            shape.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
        });

        if (heroCard) {
            const rx = -dy * 10;
            const ry = dx * 10;
            heroCard.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
    });

    on(window, 'mouseleave', () => {
        qsa('.shape').forEach(s => s.style.transform = '');
        if (heroCard) heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
})();

/* ========================
   TYPING EFFECT
   ======================== */
const TypingEffect = (() => {
    const el = qs('#typingText');
    if (!el) return;

    const texts = [
        'UI/UX Designer',
        'Full Stack Developer',
        'Creative Developer',
        'IT Teacher',
        'Game Developer'
    ];

    let textIndex = 0, charIndex = 0, isDeleting = false;

    const type = () => {
        const current = texts[textIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex--);
        } else {
            el.textContent = current.substring(0, charIndex++);
        }

        let delay = isDeleting ? 50 : 90;

        if (!isDeleting && charIndex > current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            charIndex = 0;
            textIndex = (textIndex + 1) % texts.length;
            delay = 400;
        }

        setTimeout(type, delay);
    };

    setTimeout(type, 2500);
})();

/* ========================
   COUNTER ANIMATION
   ======================== */
const Counters = (() => {
    const statEls = qsa('.stat-number');
    if (!statEls.length) return;

    const animateCounter = (el) => {
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        const target = parseInt(el.dataset.target);
        let current = 0;
        const duration = 1800;
        const increment = target / (duration / 16);

        const update = () => {
            current = Math.min(current + increment, target);
            el.textContent = Math.floor(current);
            if (current < target) requestAnimationFrame(update);
            else el.textContent = target;
        };
        update();
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target.querySelector('.stat-number');
                if (el) animateCounter(el);
            }
        });
    }, { threshold: 0.5 });

    qsa('.stat-box').forEach(box => observer.observe(box));
})();

/* ========================
   SKILL PROGRESS BARS
   ======================== */
const SkillBars = (() => {
    const bars = qsa('.skill-progress-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                if (bar.dataset.animated) return;
                bar.dataset.animated = 'true';
                bar.style.width = (bar.dataset.width || 0) + '%';
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
})();

/* ========================
   PORTFOLIO FILTERS
   ======================== */
const PortfolioFilter = (() => {
    const filterBtns = qsa('.filter-btn');
    const cards = qsa('.portfolio-card');

    filterBtns.forEach(btn => {
        on(btn, 'click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach((card, i) => {
                const cat = card.dataset.category;
                const show = filter === 'all' || cat === filter;

                if (show) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, i * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
})();

/* ========================
   SCROLL TO TOP BUTTON
   ======================== */
const ScrollTop = (() => {
    const btn = qs('#scrollTopBtn');
    if (!btn) return;

    on(window, 'scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    on(btn, 'click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ========================
   CONTACT FORM
   ======================== */
const ContactForm = (() => {
    const form = qs('#contactForm');
    if (!form) return;

    const nameEl = qs('#contactName');
    const emailEl = qs('#contactEmail');
    const msgEl = qs('#contactMessage');
    const nameErr = qs('#nameError');
    const emailErr = qs('#emailError');
    const msgErr = qs('#messageError');
    const successEl = qs('#formSuccess');
    const submitBtn = qs('#btnSubmit');

    const isValidEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    const showError = (el, msg) => {
        if (el) el.textContent = msg;
    };
    const clearError = el => { if (el) el.textContent = ''; };

    const validate = () => {
        let valid = true;
        clearError(nameErr); clearError(emailErr); clearError(msgErr);

        if (!nameEl.value.trim()) {
            showError(nameErr, 'Nama tidak boleh kosong');
            nameEl.focus();
            valid = false;
        }
        if (!emailEl.value.trim() || !isValidEmail(emailEl.value)) {
            showError(emailErr, 'Masukkan email yang valid');
            if (valid) emailEl.focus();
            valid = false;
        }
        if (!msgEl.value.trim() || msgEl.value.trim().length < 10) {
            showError(msgErr, 'Pesan minimal 10 karakter');
            if (valid) msgEl.focus();
            valid = false;
        }
        return valid;
    };

    on(form, 'submit', e => {
        e.preventDefault();
        if (!validate()) return;

        // Simulate sending
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Mengirim...</span><i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Kirim Pesan</span><i class="fas fa-paper-plane"></i>';
            successEl.classList.add('show');
            form.reset();
            setTimeout(() => successEl.classList.remove('show'), 5000);
        }, 2000);
    });

    // Real-time validation
    [nameEl, emailEl, msgEl].forEach(el => {
        on(el, 'input', () => {
            const err = el === nameEl ? nameErr : el === emailEl ? emailErr : msgErr;
            if (el.value.trim()) clearError(err);
        });
    });
})();

/* ========================
   SECTION BORDER GLOW (scroll)
   ======================== */
const SectionGlow = (() => {
    const sections = qsa('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.05 });
    sections.forEach(s => observer.observe(s));
})();

/* ========================
   INTERACTIVE FLOATING BADGES
   ======================== */
const Badges = (() => {
    const badges = qsa('.floating-badge');
    badges.forEach((badge, i) => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.12)';
            badge.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            badge.style.color = 'white';
            badge.style.borderColor = 'transparent';
        });
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = '';
            badge.style.background = '';
            badge.style.color = '';
            badge.style.borderColor = '';
        });
    });
})();

/* ========================
   STAT CARDS INTERACTIVE
   ======================== */
const StatCards = (() => {
    const cards = qsa('.stat-box');
    cards.forEach(card => {
        on(card, 'mouseenter', () => {
            card.style.transform = 'translateY(-6px) scale(1.03)';
            card.style.boxShadow = 'var(--shadow-glow)';
        });
        on(card, 'mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
})();

/* ========================
   MARQUEE — Pause on hover
   ======================== */
const MarqueeControl = (() => {
    const track = qs('.marquee-track');
    const content = qs('.marquee-content');
    if (!track || !content) return;

    on(track, 'mouseenter', () => {
        content.style.animationPlayState = 'paused';
    });
    on(track, 'mouseleave', () => {
        content.style.animationPlayState = 'running';
    });
})();

/* ========================
   LOGO HOVER EFFECT
   ======================== */
const LogoEffect = (() => {
    const logo = qs('.logo');
    if (!logo) return;
    on(logo, 'mouseenter', () => {
        logo.style.letterSpacing = '4px';
        logo.style.transition = 'letter-spacing 0.3s ease';
    });
    on(logo, 'mouseleave', () => {
        logo.style.letterSpacing = '';
    });
})();

/* ========================
   CARD 3D HERO ANIMATION
   ======================== */
const HeroCard3D = (() => {
    const card = qs('#heroCard');
    if (!card) return;

    // Idle floating animation
    let startTime = performance.now();
    const idleFloat = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const rotX = Math.sin(elapsed * 0.5) * 3;
        const rotY = Math.cos(elapsed * 0.7) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        requestAnimationFrame(idleFloat);
    };

    // Only run idle animation if not being hovered
    let isHovered = false;
    on(card, 'mouseenter', () => { isHovered = true; });
    on(card, 'mouseleave', () => {
        isHovered = false;
        startTime = performance.now(); // Reset time for smooth resume
    });

    const animate = () => {
        if (!isHovered) idleFloat();
        else requestAnimationFrame(animate);
    };
    idleFloat();
})();

/* ========================
   ACCESSIBILITY
   ======================== */
// Keyboard navigation for portfolio filters
qsa('.filter-btn').forEach(btn => {
    on(btn, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});

// Focus visible outline restoration for keyboard users
on(document, 'keydown', e => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});
on(document, 'mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ========================
   CONSOLE BRANDING
   ======================== */
const styles = [
    'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;',
    'color: #8b5cf6; font-size: 12px;',
    'color: #10b981; font-size: 12px;'
];
console.log('%c👋 Adhim Satya Nugraha — Portfolio', styles[0]);
console.log('%cUI/UX Designer | Full Stack Developer | Creative Developer', styles[1]);
console.log('%cLet\'s create something amazing together! 🚀', styles[2]);
console.log('%c📱 WhatsApp: wa.me/6282340619880', 'color: #25d366; font-size: 12px;');

/* ========================
   PROJECT DETAIL MODAL
   ======================== */
const ProjectModal = (() => {
    const modal       = qs('#projectModal');
    const backdrop    = qs('#modalBackdrop');
    const closeBtn    = qs('#modalClose');
    const mainImg     = qs('#modalMainImg');
    const thumbsWrap  = qs('#modalThumbnails');
    const counter     = qs('#galleryCounter');
    const prevBtn     = qs('#galleryPrev');
    const nextBtn     = qs('#galleryNext');
    const mTitle      = qs('#modalTitle');
    const mCategory   = qs('#modalCategory');
    const mDesc       = qs('#modalDesc');
    const mStack      = qs('#modalStack');
    const mDeploy     = qs('#modalDeploySection');

    if (!modal) return;

    let images = [];
    let current = 0;

    /* ── helpers ── */
    const setImage = (idx) => {
        if (idx < 0) idx = images.length - 1;
        if (idx >= images.length) idx = 0;
        current = idx;

        // Fade transition
        mainImg.classList.add('fade-out');
        setTimeout(() => {
            mainImg.src = images[current];
            mainImg.classList.remove('fade-out');
        }, 200);

        // Counter
        counter.textContent = `${current + 1} / ${images.length}`;

        // Thumbnails active state
        qsa('.modal-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === current);
        });
    };

    /* ── open modal ── */
    const openModal = (card) => {
        const data = card.dataset;
        images = (data.images || '').split(',').map(s => s.trim()).filter(Boolean);
        current = 0;

        // Populate title / category / description
        mTitle.textContent    = data.title    || 'Project';
        mCategory.textContent = data.categoryLabel || 'Project';
        mDesc.textContent     = data.desc     || '';

        // Stack tags
        mStack.innerHTML = '';
        (data.stack || '').split(',').forEach(tech => {
            if (!tech.trim()) return;
            const s = document.createElement('span');
            s.textContent = tech.trim();
            mStack.appendChild(s);
        });

        // Deploy section
        const link = (data.link || '').trim();
        mDeploy.innerHTML = '';
        if (link) {
            // Has deploy link — show "View Project" button
            mDeploy.innerHTML = `
                <p style="font-size:0.8rem;color:var(--text-muted);margin:0;">
                    <i class="fas fa-check-circle" style="color:var(--success);margin-right:4px;"></i>
                    Project sudah di-deploy
                </p>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn-view-project">
                    <i class="fas fa-external-link-alt"></i>
                    <span>View Project</span>
                </a>`;
        } else {
            // No deploy — show undeploy badge
            mDeploy.innerHTML = `
                <div class="deploy-badge-undeploy">
                    <i class="fas fa-box"></i>
                    <div>
                        <strong>Belum di-deploy</strong>
                        Project ini berjalan secara lokal dan belum di-publish ke server.
                    </div>
                </div>`;
        }

        // Build thumbnails
        thumbsWrap.innerHTML = '';
        images.forEach((src, i) => {
            const div = document.createElement('div');
            div.className = `modal-thumb ${i === 0 ? 'active' : ''}`;
            div.innerHTML = `<img src="${src}" alt="Screenshot ${i+1}" loading="lazy">`;
            div.addEventListener('click', () => setImage(i));
            thumbsWrap.appendChild(div);
        });

        // Set first image
        mainImg.src = images[0] || '';
        counter.textContent = `1 / ${images.length}`;

        // Hide nav arrows if only one image
        const showNav = images.length > 1;
        prevBtn.style.display = showNav ? '' : 'none';
        nextBtn.style.display = showNav ? '' : 'none';

        // Open
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => closeBtn.focus(), 100);
    };

    /* ── close modal ── */
    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => {
            mainImg.src = '';
            thumbsWrap.innerHTML = '';
        }, 400);
    };

    /* ── events ── */
    // Open from "Lihat Detail" button (card body)
    on(document, 'click', (e) => {
        const btn = e.target.closest('.btn-open-modal');
        if (btn) {
            const card = btn.closest('.portfolio-card');
            if (card) openModal(card);
        }
    });

    // Open when clicking the overlay on the image
    on(document, 'click', (e) => {
        const overlay = e.target.closest('.portfolio-overlay-3d');
        if (overlay) {
            const card = overlay.closest('.portfolio-card');
            if (card) openModal(card);
        }
    });

    on(closeBtn, 'click', closeModal);
    on(backdrop, 'click', closeModal);
    on(prevBtn,  'click', () => setImage(current - 1));
    on(nextBtn,  'click', () => setImage(current + 1));

    // Keyboard
    on(document, 'keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape')      closeModal();
        if (e.key === 'ArrowLeft')   setImage(current - 1);
        if (e.key === 'ArrowRight')  setImage(current + 1);
    });

    // Touch swipe on main image
    let touchStartX = 0;
    on(mainImg, 'touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    on(mainImg, 'touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            dx < 0 ? setImage(current + 1) : setImage(current - 1);
        }
    }, { passive: true });
})();
