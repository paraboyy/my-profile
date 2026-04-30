// =====================
// DARK MODE TOGGLE
// =====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon('dark');
}

// Listen to system theme changes
prefersDark.addListener((e) => {
    if (e.matches && !localStorage.getItem('theme')) {
        document.body.classList.add('dark-mode');
        updateThemeIcon('dark');
    }
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon(isDarkMode ? 'dark' : 'light');
});

// =====================
// NAVIGATION & SCROLL
// =====================
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// =====================
// PORTFOLIO FILTERS
// =====================
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItemsFilter = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItemsFilter.forEach(item => {
            // Reset animation
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.8s ease';
            }, 10);

            if (filterValue === 'all') {
                item.style.display = 'block';
            } else {
                const category = item.getAttribute('data-category');
                if (category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// =====================
// INTERSECTION OBSERVER
// =====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.skill-card, .portfolio-item, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// =====================
// PARALLAX EFFECT
// =====================
window.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 5;
        const rotateY = (centerX - x) / 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

// Reset floating card on mouse leave
document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.floating-card').forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// =====================
// SCROLL TO TOP BUTTON
// =====================
const createScrollToTopBtn = () => {
    const btn = document.createElement('button');
    btn.classList.add('scroll-to-top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 20px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
    `;

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'translateY(-5px)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
};

createScrollToTopBtn();

// =====================
// ACTIVE NAV LINK ON SCROLL
// =====================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(current => {
        const sectionTop = current.offsetTop;
        const sectionHeight = current.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${current.getAttribute('id')}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
});

// =====================
// COUNTER ANIMATION
// =====================
const animateCounters = () => {
    const stats = document.querySelectorAll('.stat-card h3');
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                const increment = finalValue / 50;
                let current = 0;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        target.textContent = finalValue === 100 ? '100%' : finalValue + '+';
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(current) + (finalValue === 100 ? '%' : '+');
                    }
                }, 30);

                target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        observerStats.observe(stat);
    });
};

document.addEventListener('DOMContentLoaded', animateCounters);

// =====================
// TYPING EFFECT
// =====================
const createTypingEffect = () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let index = 0;
    const speed = 50;

    const typeWriter = () => {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    };

    // Start typing after a short delay
    setTimeout(typeWriter, 500);
};

window.addEventListener('load', createTypingEffect);

// =====================
// SMOOTH SCROLL BEHAVIOR
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =====================
// PORTFOLIO ITEM CLICK
// =====================
const portfolioItemsClick = document.querySelectorAll('.portfolio-item');
portfolioItemsClick.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.cursor = 'pointer';
    });
});

// =====================
// FORM VALIDATION (untuk future use)
// =====================
const validateForm = (formData) => {
    let isValid = true;
    
    if (!formData.name || formData.name.trim() === '') {
        isValid = false;
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        isValid = false;
    }
    
    if (!formData.message || formData.message.trim() === '') {
        isValid = false;
    }
    
    return isValid;
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// =====================
// PAGE LOAD ANIMATION
// =====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

// =====================
// MOBILE HAMBURGER MENU
// =====================
const hamburgerBtn = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.flexDirection = 'column';
        navMenu.style.backgroundColor = 'white';
        navMenu.style.padding = '1rem 2rem';
        navMenu.style.gap = '1rem';
        navMenu.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.style.display = 'none';
        });
    });
}

// =====================
// UTILITY FUNCTIONS
// =====================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// =====================
// CONSOLE MESSAGE
// =====================
console.log('%c👋 Welcome to Adhim Satya Nugraha Portfolio', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cUI/UX Designer | Full Stack Developer | Creative Developer', 'font-size: 14px; color: #8b5cf6;');
console.log('%cLet\'s create something amazing together! 🚀', 'font-size: 12px; color: #10b981;');
