// LiveVibe Website JavaScript

class LiveVibeWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupMobileMenu();
        this.setupMapDemo();
        this.setupScrollEffects();
    }

    setupThemeToggle() {
        // Check for saved theme preference or default to 'dark'
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Add a subtle animation
                themeToggle.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }

    setupEventListeners() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Download buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.textContent.includes('Download')) {
                btn.addEventListener('click', this.handleDownload);
            }
        });

        // CTA buttons
        document.querySelectorAll('[data-action="demo"]').forEach(btn => {
            btn.addEventListener('click', this.handleDemo);
        });
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
            });
        }
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .section-header, .business-text').forEach(el => {
            observer.observe(el);
        });

        // Animate crowd meter on load
        setTimeout(() => {
            this.animateCrowdMeter();
        }, 1000);
    }

    animateCrowdMeter() {
        const crowdFill = document.querySelector('.crowd-fill');
        if (crowdFill) {
            crowdFill.style.width = '0%';
            setTimeout(() => {
                crowdFill.style.width = '85%';
            }, 500);
        }
    }

    setupMapDemo() {
        const mapVenues = document.querySelectorAll('.map-venue');
        
        mapVenues.forEach((venue, index) => {
            // Add random movement animation
            venue.style.animation = `float ${4 + index}s ease-in-out infinite`;
            venue.style.animationDelay = `${index * 0.5}s`;

            // Add click interaction
            venue.addEventListener('click', () => {
                this.showVenueDetails(venue);
            });

            // Add hover effects
            venue.addEventListener('mouseenter', () => {
                venue.style.transform = 'scale(1.1)';
            });

            venue.addEventListener('mouseleave', () => {
                venue.style.transform = 'scale(1)';
            });
        });

        // Update crowd numbers periodically
        setInterval(() => {
            this.updateCrowdNumbers();
        }, 5000);
    }

    updateCrowdNumbers() {
        const venues = [
            { id: '1', min: 100, max: 150 },
            { id: '2', min: 50, max: 90 },
            { id: '3', min: 20, max: 50 }
        ];

        venues.forEach(venue => {
            const element = document.querySelector(`[data-venue="${venue.id}"] .venue-count`);
            if (element) {
                const newCount = Math.floor(Math.random() * (venue.max - venue.min + 1)) + venue.min;
                this.animateNumberChange(element, parseInt(element.textContent), newCount);
            }
        });
    }

    animateNumberChange(element, from, to) {
        const duration = 1000;
        const steps = 20;
        const stepValue = (to - from) / steps;
        let current = from;
        let step = 0;

        const interval = setInterval(() => {
            current += stepValue;
            step++;
            
            if (step >= steps) {
                current = to;
                clearInterval(interval);
            }
            
            element.textContent = Math.round(current);
        }, duration / steps);
    }

    showVenueDetails(venue) {
        const venueId = venue.dataset.venue;
        const venueData = {
            '1': { name: 'The Edison', type: 'Nightclub', crowd: 'Very Busy', price: '$$$' },
            '2': { name: 'Perch LA', type: 'Rooftop Bar', crowd: 'Moderate', price: '$$$$' },
            '3': { name: 'Seven Grand', type: 'Whiskey Bar', crowd: 'Chill', price: '$$$' }
        };

        const data = venueData[venueId];
        if (data) {
            this.showModal(`
                <h3>${data.name}</h3>
                <p>${data.type} • ${data.crowd}</p>
                <div class="venue-details">
                    <span>Price: ${data.price}</span>
                    <span>Distance: 0.3 mi</span>
                </div>
                <button class="btn-primary" onclick="this.closest('.modal').remove()">Get Directions</button>
            `);
        }
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.closest('.modal').remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                ${content}
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }
            .modal-content {
                position: relative;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: var(--shadow-xl);
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-secondary);
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .venue-details {
                display: flex;
                justify-content: space-between;
                margin: 1rem 0;
                padding: 0.5rem;
                background: var(--bg-tertiary);
                border-radius: var(--radius-sm);
                font-size: 0.9rem;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    setupScrollEffects() {
        let lastScroll = 0;
        const nav = document.querySelector('.nav');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Hide/show navbar on scroll
            if (currentScroll <= 0) {
                nav.classList.remove('scroll-up');
                nav.classList.remove('scroll-down');
            } else if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
                nav.classList.remove('scroll-up');
                nav.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
                nav.classList.remove('scroll-down');
                nav.classList.add('scroll-up');
            }

            lastScroll = currentScroll;

            // Parallax effect for hero
            const hero = document.querySelector('.hero');
            if (hero && currentScroll < window.innerHeight) {
                const scrolled = currentScroll;
                const parallax = scrolled * 0.5;
                hero.style.transform = `translateY(${parallax}px)`;
            }
        });

        // Add scroll classes to nav
        const scrollStyles = document.createElement('style');
        scrollStyles.textContent = `
            .nav.scroll-down {
                transform: translateY(-100%);
            }
            .nav.scroll-up {
                transform: translateY(0);
            }
            .nav {
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(scrollStyles);
    }

    handleDownload(e) {
        e.preventDefault();
        const button = e.target.closest('button');
        const isIOS = button.textContent.includes('iOS');
        
        // Show download modal or redirect
        const downloadUrl = isIOS ? 
            'https://apps.apple.com/app/livevibe' : 
            'https://play.google.com/store/apps/details?id=com.livevibe';
        
        // For demo purposes, show a modal
        window.liveVibeApp.showModal(`
            <h3>Download LiveVibe</h3>
            <p>You're about to download LiveVibe for ${isIOS ? 'iOS' : 'Android'}.</p>
            <div style="margin: 1rem 0;">
                <img src="assets/qr-code.png" alt="QR Code" style="max-width: 150px; height: auto;" onerror="this.style.display='none'">
            </div>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
                Scan the QR code or click the button below to download.
            </p>
            <a href="${downloadUrl}" class="btn-primary" target="_blank">
                Open App Store
            </a>
        `);
    }

    handleDemo(e) {
        e.preventDefault();
        
        window.liveVibeApp.showModal(`
            <h3>Watch Demo</h3>
            <p>See how LiveVibe transforms your nightlife experience.</p>
            <div style="margin: 1.5rem 0;">
                <div style="background: var(--bg-tertiary); border-radius: var(--radius-md); padding: 2rem; text-align: center;">
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width: 60px; height: 60px; color: var(--primary-blue); margin-bottom: 1rem;">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <p>Video demo coming soon!</p>
                </div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
                In the meantime, download the app to experience it yourself.
            </p>
            <button class="btn-primary" onclick="this.closest('.modal').remove()">
                Close
            </button>
        `);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.liveVibeApp = new LiveVibeWebsite();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations when page becomes visible
        if (window.liveVibeApp) {
            window.liveVibeApp.animateCrowdMeter();
        }
    }
});

// Add custom cursor effect for interactive elements
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    cursorElement.style.left = e.clientX - 10 + 'px';
    cursorElement.style.top = e.clientY - 10 + 'px';
    cursorElement.style.opacity = '1';
});

// Hide cursor when leaving the page
document.addEventListener('mouseleave', () => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.opacity = '0';
    }
});

// Add performance monitoring
if ('performance' in window && 'timing' in window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`LiveVibe website loaded in ${loadTime}ms`);
        }, 0);
    });
}
