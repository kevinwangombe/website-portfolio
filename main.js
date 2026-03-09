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

// Fetch GitHub Projects
async function fetchGitHubProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    try {
        const response = await fetch('https://api.github.com/users/kevinwangombe/repos?sort=updated&per_page=15');
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const repos = await response.json();
        
        // Filter out non-project repos (e.g., config repo or the portfolio itself)
        const excludedRepos = ['kevinwangombe', 'website-portfolio'];
        const projects = repos.filter(repo => !excludedRepos.includes(repo.name) && !repo.fork).slice(0, 6);
        
        if (projects.length > 0) {
            // Clear existing static projects fallback
            projectsGrid.innerHTML = '';
            
            projects.forEach(project => {
                // Determine tech stack (GitHub primary language)
                const techArray = [project.language || 'Code'];
                const techSpans = techArray.map(tech => `<span>${tech}</span>`).join('');
                
                // Better formatting for project names
                const formattedName = project.name
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                
                const cardHTML = `
                <div class="project-card glass-panel">
                  <div class="project-content" style="display: flex; flex-direction: column; height: 100%;">
                    <h3 class="project-title">${formattedName}</h3>
                    <p class="project-desc" style="flex-grow: 1;">
                      ${project.description || 'A web development project built by Kevin.'}
                    </p>
                    <div class="project-tech">
                      ${techSpans}
                    </div>
                    <div class="project-links">
                      <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" aria-label="Github">
                        <i data-lucide="github"></i>
                      </a>
                      ${project.homepage ? `
                      <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" aria-label="External link">
                        <i data-lucide="external-link"></i>
                      </a>` : ''}
                    </div>
                  </div>
                </div>
                `;
                projectsGrid.insertAdjacentHTML('beforeend', cardHTML);
            });
            
            // Re-initialize Lucide icons for the new dynamically added icons
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        // On error, the static HTML projects remain as a fallback
    }
}

document.addEventListener('DOMContentLoaded', fetchGitHubProjects);