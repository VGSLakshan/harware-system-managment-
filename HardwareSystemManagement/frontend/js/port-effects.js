// Port Authority Hardware Management System - Main JS

document.addEventListener("DOMContentLoaded", () => {
  console.log("Port Authority HW Management System loaded");
  
  // Initialize Navbar Effects
  initNavbar();
  
  // Animate elements on scroll
  initScrollAnimations();
  
  // Initialize stats counter
  initStatsCounter();
  
  // Load any necessary data
  loadInitialData();
});

// Initialize Navbar Effects
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  // Change navbar style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Initialize scroll position on page load
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }
}

// Animate elements on scroll
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  const checkPosition = () => {
    animatedElements.forEach(element => {
      const position = element.getBoundingClientRect();
      
      // If element is in viewport
      if(position.top < window.innerHeight - 100) {
        element.classList.add('active');
      }
    });
  };
  
  // Check positions on load
  setTimeout(checkPosition, 200);
  
  // Check positions on scroll
  window.addEventListener('scroll', checkPosition);
  
  // Add animation classes to elements
  document.querySelectorAll('.feature-card').forEach(card => {
    card.classList.add('scroll-animate');
  });
  
  document.querySelectorAll('.section-header h2, .section-header p, .port-divider').forEach(el => {
    el.classList.add('scroll-animate');
  });
}

// Initialize stats counter
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  stats.forEach(stat => {
    const targetValue = stat.textContent;
    let startValue = 0;
    
    // Check if target value contains special characters
    if (targetValue.includes('+') || targetValue.includes('%') || targetValue.includes('/')) {
      const numericPart = parseInt(targetValue);
      const suffix = targetValue.replace(/[0-9]/g, '');
      
      // Start animation when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateValue(stat, 0, numericPart, 2000, suffix);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(stat);
    }
  });
}

// Animate counter from start to end value
function animateValue(element, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Load initial data
function loadInitialData() {
  // You can add any initial data loading here
  console.log("Initial data loaded");
}

// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href') !== "#") {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });
});