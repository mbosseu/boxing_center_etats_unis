document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Hamburger Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Highlight current active page in navigation
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            // Check if current path ends with href or if it's the root path and href is index.html
            if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });

    // 4. Scroll Reveal Animation using IntersectionObserver and CSS classes
    const revealElements = document.querySelectorAll('.card, .img-card, .feature-info, .feature-img-wrapper, .price-card, .schedule-table-wrapper');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        // Add reveal class to all target elements
        revealElements.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        // Trigger observer on next frame to avoid flash
        requestAnimationFrame(() => {
            revealElements.forEach(el => revealObserver.observe(el));
        });
    }

    // 5. Contact Form handling (if on contact page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // basic visual feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi en cours...';
            
            setTimeout(() => {
                // Show success message
                submitBtn.style.backgroundColor = '#28a745';
                submitBtn.style.borderColor = '#28a745';
                submitBtn.style.color = '#fff';
                submitBtn.innerHTML = '✓ Message envoyé !';
                
                // Reset form
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                    submitBtn.innerHTML = originalText;
                }, 3000);
            }, 1500);
        });
    }

    // 6. Sticky Scroll Media Switcher
    const slides = document.querySelectorAll('.content-slide');
    const stickyImages = document.querySelectorAll('.sticky-img');
    
    if (slides.length > 0 && stickyImages.length > 0) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.getAttribute('data-target');
                    
                    // Deactivate all images
                    stickyImages.forEach(img => img.classList.remove('active'));
                    
                    // Activate target image
                    const activeImg = document.getElementById(targetId);
                    if (activeImg) {
                        activeImg.classList.add('active');
                    }
                    
                    // Visual active feedback on slide text (dim inactive slides on desktop)
                    if (window.innerWidth > 992) {
                        slides.forEach(s => s.style.opacity = '0.25');
                        entry.target.style.opacity = '1';
                    } else {
                        slides.forEach(s => s.style.opacity = '1');
                    }
                }
            });
        }, {
            root: null,
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        });

        slides.forEach(slide => slideObserver.observe(slide));
    }

    // 7. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});
