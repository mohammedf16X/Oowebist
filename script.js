// ===== Global Variables =====
let currentLanguage = 'ar';
let currentTheme = 'dark';

// ===== DOM Elements =====
const loadingScreen = document.getElementById('loading-screen');
const burgerIcon = document.getElementById('burger-icon');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const themeSelector = document.getElementById('theme-selector');
const languageSelector = document.getElementById('language-selector');
const androidHacksCard = document.querySelector('.android-hacks');
const deltaModal = document.getElementById('delta-modal');
const closeDeltaModal = document.getElementById('close-delta-modal');
const loaderText = document.getElementById('loader-text');

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
  initializeWebsite();
});

function initializeWebsite() {
  // Initialize loading screen with typing effect
  initializeLoadingScreen();
  
  // Initialize AOS
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
  
  // Initialize ScrollReveal
  ScrollReveal().reveal('.hero-content', {
    delay: 300,
    distance: '50px',
    origin: 'bottom'
  });
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize GSAP animations
  initializeGSAPAnimations();
  
  // Load saved settings
  loadSettings();
  
  // Hide loading screen after animations
  setTimeout(() => {
    hideLoadingScreen();
  }, 3000);
}

function initializeLoadingScreen() {
  const loadingText = 'مرحباً بك في D7ME';
  
  // Check if Typed.js is available
  if (typeof Typed !== 'undefined') {
    // Typed.js effect for loading text
    new Typed('#loader-text', {
      strings: [loadingText],
      typeSpeed: 100,
      backSpeed: 50,
      loop: false,
      showCursor: true,
      cursorChar: '|'
    });
  } else {
    // Fallback: simple text display
    if (loaderText) {
      loaderText.textContent = loadingText;
    }
  }
}

function hideLoadingScreen() {
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => {
      loadingScreen.style.display = 'none';
    }
  });
}

function initializeEventListeners() {
  // Burger menu events
  burgerIcon.addEventListener('click', toggleSideMenu);
  closeMenu.addEventListener('click', closeSideMenu);
  overlay.addEventListener('click', closeSideMenu);
  
  // Menu navigation events
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      navigateToPage(page);
      closeSideMenu();
    });
  });
  
  // Settings events
  themeSelector.addEventListener('change', changeTheme);
  languageSelector.addEventListener('change', changeLanguage);
  
  // Android hacks card event
  if (androidHacksCard) {
    androidHacksCard.addEventListener('click', showDeltaModal);
  }
  
  // Modal events
  if (closeDeltaModal) {
    closeDeltaModal.addEventListener('click', hideDeltaModal);
  }
  
  // Close modal when clicking outside
  if (deltaModal) {
    deltaModal.addEventListener('click', (e) => {
      if (e.target === deltaModal) {
        hideDeltaModal();
      }
    });
  }
  
  // Keyboard events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSideMenu();
      hideDeltaModal();
    }
  });
}

function initializeGSAPAnimations() {
  // Create timeline for page entrance
  const tl = gsap.timeline({ delay: 3.5 });
  
  // Animate main title
  tl.from('.main-title', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  })
  .from('.warning-box', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.5")
  .from('.discord-link', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.3")
  .from('.footer', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out"
  }, "-=0.2");
  
  // Floating animation for warning icon
  gsap.to('.warning-icon', {
    y: -10,
    duration: 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  });
  
  // Glow effect for brand name
  gsap.to('.brand-name', {
    textShadow: "0 0 20px var(--primary-green)",
    duration: 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  });
}

function toggleSideMenu() {
  const isOpen = sideMenu.classList.contains('open');
  
  if (isOpen) {
    closeSideMenu();
  } else {
    openSideMenu();
  }
}

function openSideMenu() {
  burgerIcon.classList.add('open');
  sideMenu.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Animate menu items
  gsap.from('.menu-item', {
    x: 50,
    opacity: 0,
    duration: 0.3,
    stagger: 0.1,
    ease: "power2.out"
  });
}

function closeSideMenu() {
  burgerIcon.classList.remove('open');
  sideMenu.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function navigateToPage(pageName) {
  // Hide all pages
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // Animate page entrance
    gsap.from(targetPage.children, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
  }
}

function changeTheme() {
  currentTheme = themeSelector.value;
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Save to localStorage
  localStorage.setItem('d7me-theme', currentTheme);
  
  // Animate theme change
  gsap.to('body', {
    duration: 0.3,
    ease: "power2.inOut"
  });
}

function changeLanguage() {
  currentLanguage = languageSelector.value;
  
  // Update document direction and language
  if (currentLanguage === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }
  
  // Update all translatable elements
  updateTranslations();
  
  // Save to localStorage
  localStorage.setItem('d7me-language', currentLanguage);
  
  // Animate language change
  gsap.to('[data-ar], [data-en]', {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      gsap.to('[data-ar], [data-en]', {
        opacity: 1,
        duration: 0.2
      });
    }
  });
}

function updateTranslations() {
  const elements = document.querySelectorAll(
    '[data-ar], [data-en], .main-title, .warning-text, .discord-btn span, .footer p, .brand-name, .page-title, .card-title, .card-description, .version-badge span, .modal-body h3'
  );
  
  elements.forEach(element => {
    const arText = element.getAttribute('data-ar');
    const enText = element.getAttribute('data-en');
    
    if (currentLanguage === 'ar' && arText) {
      element.textContent = arText;
    } else if (currentLanguage === 'en' && enText) {
      element.textContent = enText;
    }

    // Special handling for brand name
    if (element.classList.contains('brand-name')) {
      element.textContent = currentLanguage === 'ar' ? '© دحمي' : '© D7ME';
    }
  });
  
  // Update page title
  document.title = currentLanguage === 'ar' ? 'D7ME - سيرفر دحمي الرسمي' : 'D7ME - Official Server';
}

function showDeltaModal() {
  deltaModal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Animate modal entrance
  gsap.from('.modal-content', {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    ease: "back.out(1.7)"
  });
}

function hideDeltaModal() {
  deltaModal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function loadSettings() {
  // Load theme
  const savedTheme = localStorage.getItem('d7me-theme');
  if (savedTheme) {
    currentTheme = savedTheme;
    themeSelector.value = currentTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
  
  // Load language
  const savedLanguage = localStorage.getItem('d7me-language');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
    languageSelector.value = currentLanguage;
    
    if (currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
    
    updateTranslations();
  }
}

// ===== Scroll Animations =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero-section');
  
  if (parallax) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Trigger specific animations based on element
      if (entry.target.classList.contains('hack-card')) {
        gsap.from(entry.target, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    }
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.hack-card, .warning-box, .discord-btn').forEach(el => {
  observer.observe(el);
});

// ===== Mouse Movement Effects =====
document.addEventListener('mousemove', (e) => {
  const cursor = { x: e.clientX, y: e.clientY };
  
  // Parallax effect for background elements
  const moveX = (cursor.x - window.innerWidth / 2) * 0.01;
  const moveY = (cursor.y - window.innerHeight / 2) * 0.01;
  
  // Apply subtle parallax to elements
  const parallaxElements = document.querySelectorAll('.hero-content, .hack-card');
  parallaxElements.forEach(el => {
    gsap.to(el, {
      x: moveX,
      y: moveY,
      duration: 1,
      ease: "power2.out"
    });
  });
});

// ===== Performance Optimization =====
// Debounce function for resize events
function debounce(func, wait) {
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

// Handle window resize
const handleResize = debounce(() => {
  // Refresh AOS on resize
  AOS.refresh();
  
  // Update GSAP animations for new viewport
  gsap.set('.hero-content', { clearProps: 'all' });
}, 250);

window.addEventListener('resize', handleResize);

// ===== Error Handling =====
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
});

// ===== Additional Animations =====
// Add hover effects for interactive elements
document.querySelectorAll('.hack-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  });
});

// Add click ripple effect
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

// Apply ripple effect to buttons
document.querySelectorAll('.discord-btn, .download-btn').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.6);
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

