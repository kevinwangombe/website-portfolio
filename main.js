'use strict';
// Initialize Lucide icons
lucide.createIcons();
// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// Mobile Mobile Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle icon between menu and x
    if (navLinks.classList.contains('active')) {
        menuBtn.innerHTML = '<i data-lucide="x"></i>';
    } else {
        menuBtn.innerHTML = '<i data-lucide="menu"></i>';
    }
    lucide.createIcons();
});
// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
    });
});
// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust for fixed navbar height
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
// Scroll Reveal Animation & Skill Bars Animation
const revealElements = document.querySelectorAll('.section-padding');
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Check if skills section is intersecting to animate bars
            if (entry.target.classList.contains('skills') || entry.target.id === 'skills') {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                });
            }
            
            // Unobserve after revealing to animate only once
            observer.unobserve(entry.target);
        }
    });
};
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};
const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});