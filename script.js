/* ============================================
   PORTFOLIO INTERACTIVE LOGIC & ANIMATIONS
   Single-page app: every section lives inside
   index.html and is toggled dynamically via
   hash-based navigation (#about, #skills, ...).
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageNavigation();
  initGlobalHandlers();
  initTechBackground();
  initRevealObserver();
  observeReveals();
  observeStats();
  initCardTilt();
  initContactForm();
});

/* ============================================
   0. Single-Page Section Navigation
   ============================================ */
const PAGE_TITLES = {
  hero: 'Sumit Adeppa | Full Stack Engineer',
  about: 'About | Sumit Adeppa',
  skills: 'Skills | Sumit Adeppa',
  experience: 'Experience | Sumit Adeppa',
  projects: 'Projects | Sumit Adeppa',
  certifications: 'Certifications | Sumit Adeppa',
  education: 'Education | Sumit Adeppa',
  contact: 'Contact | Sumit Adeppa'
};

let currentPageId = null;

function initPageNavigation() {
  window.addEventListener('hashchange', handleHashNavigation);
  handleHashNavigation();
}

function handleHashNavigation() {
  const pageId = (window.location.hash || '').replace('#', '');
  activatePage(document.getElementById(pageId) ? pageId : 'hero');
}

function activatePage(pageId) {
  if (!document.getElementById(pageId)) pageId = 'hero';
  if (pageId === currentPageId) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }
  currentPageId = pageId;

  document.querySelectorAll('#main-content > .page').forEach(section => {
    section.classList.toggle('active', section.id === pageId);
  });

  document.title = PAGE_TITLES[pageId] || PAGE_TITLES.hero;
  setActiveNav();
  observeReveals();
  observeStats();
  initCardTilt();
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

/* ============================================
   1. Global Delegated Event Handlers
   ============================================ */
function initGlobalHandlers() {
  document.addEventListener('click', (event) => {
    if (event.target.closest('#themeToggle')) {
      toggleTheme();
      return;
    }

    if (event.target.closest('#menuToggle')) {
      toggleMobileNav();
      return;
    }

    if (event.target.closest('#navOverlay')) {
      closeMobileNav();
      return;
    }

    if (event.target.closest('#hireMeButton')) {
      handleHireMe();
      return;
    }

    if (event.target.closest('#scrollTop')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const codeTab = event.target.closest('.code-tab');
    if (codeTab) {
      activateCodeTab(codeTab);
      return;
    }

    if (event.target.closest('#copyCodeBtn')) {
      copyActiveCode();
      return;
    }

    const filterBtn = event.target.closest('.filter-btn');
    if (filterBtn) {
      applySkillFilter(filterBtn);
      return;
    }

    if (event.target.closest('#copyEmailBtn')) {
      copyEmailAddress();
      return;
    }

    if (event.target.closest('#copyResumeBtn')) {
      openResume();
      return;
    }

    if (event.target.closest('#navMenu .nav-link')) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });

  window.addEventListener('scroll', () => {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 350);
    }
  }, { passive: true });
}

/* ============================================
   1a. Theme Toggle & Persistence
   ============================================ */
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', newTheme === 'dark' ? '#0b0f19' : '#ffffff');
  }
}

// Listen for system theme updates
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'dark' ? '#0b0f19' : '#ffffff');
    }
  }
});

/* ============================================
   1b. Mobile Navigation Toggle
   ============================================ */
function toggleMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!menuToggle || !navMenu) return;

  const isOpen = navMenu.classList.contains('open');
  if (isOpen) {
    closeMobileNav();
  } else {
    navMenu.classList.add('open');
    document.body.classList.add('nav-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    const navOverlay = document.getElementById('navOverlay');
    if (navOverlay) {
      navOverlay.classList.add('active');
    }
  }
}

function closeMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!menuToggle || !navMenu) return;

  navMenu.classList.remove('open');
  document.body.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  const navOverlay = document.getElementById('navOverlay');
  if (navOverlay) {
    navOverlay.classList.remove('active');
  }
}

/* ============================================
   1c. Hire Me CTA Flow
   ============================================ */
function handleHireMe() {
  if (window.location.hash === '#contact') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showToast('Opening the contact form.');
}

/* ============================================
   1d. Hero Interactive Code Window Tabs
   ============================================ */
function activateCodeTab(tab) {
  const tabs = document.querySelectorAll('.code-tab');
  const blocks = document.querySelectorAll('.code-block');
  const targetId = `tab-${tab.getAttribute('data-tab')}`;

  tabs.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  blocks.forEach(b => b.classList.remove('active'));

  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const targetBlock = document.getElementById(targetId);
  if (targetBlock) {
    targetBlock.classList.add('active');
  }
}

function copyText(text, successMsg) {
  const fallbackCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (error) {
      showToast('Copy failed. Please copy manually.');
    }
    document.body.removeChild(textarea);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

function copyActiveCode() {
  const activeBlock = document.querySelector('.code-block.active');
  if (!activeBlock) return;

  copyText(activeBlock.innerText, 'Code snippet copied to clipboard!');
}

/* ============================================
   1e. Skills Category Filter
   ============================================ */
let filterToken = 0;

function applySkillFilter(btn) {
  const filter = btn.getAttribute('data-filter');
  const token = ++filterToken;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  skillCards.forEach(card => {
    const category = card.getAttribute('data-category');

    if (filter === 'all' || category === filter) {
      card.style.display = 'block';
      card.style.opacity = '1';
    } else {
      card.style.opacity = '0';
      setTimeout(() => {
        if (token === filterToken) card.style.display = 'none';
      }, 200);
    }
  });
}

/* ============================================
   1f. Copy Email & Resume Actions
   ============================================ */
function copyEmailAddress() {
  copyText('adeppasumit4@gmail.com', 'Email address copied to clipboard!');
}

function openResume() {
  window.open('https://drive.google.com/file/d/15KnMczp1u-ZQ8ILBBcM-Otft38t8LAHF/view?usp=sharing', '_blank');
}

/* ============================================
   1h. Contact Form (Web3Forms)
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  let lastSubmitTime = 0;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = document.getElementById('formSubmitBtn');
    const status = document.getElementById('formStatus');
    const botcheck = form.querySelector('input[name="botcheck"]');
    if (!submitBtn || !status) return;
    if (botcheck && botcheck.checked) return;

    const now = Date.now();
    if (now - lastSubmitTime < 20000) {
      status.textContent = 'Please wait a few seconds before sending another message.';
      status.className = 'form-note error';
      return;
    }
    lastSubmitTime = now;

    const accessKeyInput = form.querySelector('input[name="access_key"]');
    if (!accessKeyInput || !accessKeyInput.value || accessKeyInput.value.includes('YOUR_ACCESS_KEY')) {
      status.textContent = 'Form is not configured yet. Please email me directly at adeppasumit4@gmail.com.';
      status.className = 'form-note error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    status.textContent = 'Sending your message...';
    status.className = 'form-note';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        status.textContent = 'Message sent successfully! I will get back to you soon.';
        status.className = 'form-note success';
        form.reset();
        showToast('Message sent successfully!');
      } else {
        throw new Error(result.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      status.textContent = 'Something went wrong. Please try again or email me directly at adeppasumit4@gmail.com.';
      status.className = 'form-note error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
}

/* ============================================
   1g. Toast Notification Utility
   ============================================ */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 3000);
}

/* ============================================
   2. Floating Technology Icons Background
   ============================================ */
function initTechBackground() {
  const techContainer = document.querySelector('.page-tech-background');
  if (!techContainer) return;

  const config = {
    desktopCount: 28,
    tabletCount: 16,
    mobileCount: 8,
    desktopSize: [140, 220],
    tabletSize: [100, 160],
    mobileSize: [80, 120],
    minOpacity: 0.20,
    maxOpacity: 0.36,
    minDuration: 22,
    maxDuration: 40,
    maxDrift: 36,
    motionEase: 0.08,
    refreshInterval: 22000,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const techIconsData = [
    { label: 'HTML5', icon: 'fa-brands fa-html5', color: '#d04926' },
    { label: 'CSS3', icon: 'fa-brands fa-css3-alt', color: '#2563eb' },
    { label: 'JavaScript', icon: 'fa-brands fa-js', color: '#f7df1e' },
    { label: 'Java', icon: 'fa-brands fa-java', color: '#5382a1' },
    { label: 'Spring Boot', icon: 'fa-solid fa-seedling', color: '#6db33f' },
    { label: 'React', icon: 'fa-brands fa-react', color: '#61dafb' },
    { label: 'MySQL', icon: 'fa-solid fa-database', color: '#00758f' },
    { label: 'Git', icon: 'fa-brands fa-git-alt', color: '#f05032' },
    { label: 'GitHub', icon: 'fa-brands fa-github', color: '#ffffff' },
    { label: 'Docker', icon: 'fa-brands fa-docker', color: '#2496ed' },
    { label: 'Kubernetes', icon: 'fa-solid fa-network-wired', color: '#326ce5' },
    { label: 'AWS', icon: 'fa-brands fa-aws', color: '#ff9900' },
    { label: 'Linux', icon: 'fa-brands fa-linux', color: '#f8fafc' },
    { label: 'VS Code', icon: 'fa-brands fa-visual-studio-code', color: '#007acc' },
    { label: 'IntelliJ IDEA', icon: 'fa-solid fa-code', color: '#7f58af' },
    { label: 'REST API', icon: 'fa-solid fa-network-wired', color: '#8b5cf6' },
    { label: 'Node.js', icon: 'fa-brands fa-node-js', color: '#43853d' }
  ];

  const isMobile = () => window.matchMedia('(max-width: 480px)').matches;
  const isTablet = () => window.matchMedia('(max-width: 992px)').matches;
  const getViewportMode = () => (isMobile() ? 'mobile' : isTablet() ? 'tablet' : 'desktop');
  const getIconCount = () => {
    const mode = getViewportMode();
    return mode === 'mobile' ? config.mobileCount : mode === 'tablet' ? config.tabletCount : config.desktopCount;
  };

  const getSizeRange = () => {
    const mode = getViewportMode();
    return mode === 'mobile' ? config.mobileSize : mode === 'tablet' ? config.tabletSize : config.desktopSize;
  };

  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const createDrift = () => ({ x: randomBetween(-config.maxDrift, config.maxDrift), y: randomBetween(-config.maxDrift, config.maxDrift) });
  const motion = { x: 0, y: 0, targetX: 0, targetY: 0, cursorX: 0, cursorY: 0, active: false };
  let animationFrame = null;
  let techIcons = [];
  let currentMode = getViewportMode();

  function buildIcons() {
    techContainer.innerHTML = '';
    const count = getIconCount();
    const [minSize, maxSize] = getSizeRange();

    const icons = Array.from({ length: count }, () => {
      const index = Math.floor(Math.random() * techIconsData.length);
      return techIconsData[index];
    });

    icons.forEach((tech) => {
      const icon = document.createElement('span');
      icon.className = 'tech-icon';
      icon.dataset.depth = (0.24 + Math.random() * 0.7).toFixed(2);
      icon.setAttribute('aria-hidden', 'true');

      const left = randomBetween(4, 96);
      const top = randomBetween(8, 92);
      const size = randomBetween(minSize, maxSize);
      const opacity = randomBetween(config.minOpacity, config.maxOpacity);
      const rotate = randomBetween(-22, 22);
      const duration = randomBetween(config.minDuration, config.maxDuration);
      const delay = randomBetween(0, 8);
      const drift = createDrift();

      icon.style.setProperty('--left', `${left}%`);
      icon.style.setProperty('--top', `${top}%`);
      icon.style.setProperty('--size', `${size}px`);
      icon.style.setProperty('--opacity', opacity.toFixed(3));
      icon.style.setProperty('--rotate', rotate.toFixed(2));
      icon.style.setProperty('--animation-duration', `${duration}s`);
      icon.style.setProperty('--animation-delay', `${delay}s`);
      icon.style.setProperty('--drift-x', `${drift.x.toFixed(2)}px`);
      icon.style.setProperty('--drift-y', `${drift.y.toFixed(2)}px`);
      icon.style.setProperty('--parallax-x', '0px');
      icon.style.setProperty('--parallax-y', '0px');
      icon.style.setProperty('--scale', '1');
      icon.style.setProperty('--tech-color', tech.color);
      icon.dataset.leftPos = left.toFixed(2);
      icon.dataset.topPos = top.toFixed(2);

      icon.innerHTML = `<span class="tech-icon-shape"><i class="${tech.icon}" aria-hidden="true"></i></span>`;
      techContainer.appendChild(icon);
    });

    techIcons = Array.from(techContainer.querySelectorAll('.tech-icon'));
  }

  function updateDrift() {
    techIcons.forEach((icon) => {
      const driftX = randomBetween(-config.maxDrift, config.maxDrift);
      const driftY = randomBetween(-config.maxDrift, config.maxDrift);
      icon.style.setProperty('--drift-x', `${driftX.toFixed(2)}px`);
      icon.style.setProperty('--drift-y', `${driftY.toFixed(2)}px`);
    });
  }

  function updateMotion() {
    motion.x += (motion.targetX - motion.x) * config.motionEase;
    motion.y += (motion.targetY - motion.y) * config.motionEase;

    techIcons.forEach((icon) => {
      const depth = Number(icon.dataset.depth) || 0.44;
      const parallaxX = motion.x * 20 * depth;
      const parallaxY = motion.y * 18 * depth;
      icon.style.setProperty('--parallax-x', `${parallaxX.toFixed(2)}px`);
      icon.style.setProperty('--parallax-y', `${parallaxY.toFixed(2)}px`);

      if (motion.active) {
        const leftPercent = Number(icon.dataset.leftPos);
        const topPercent = Number(icon.dataset.topPos);
        const centerX = (leftPercent / 100) * window.innerWidth;
        const centerY = (topPercent / 100) * window.innerHeight;
        const distance = Math.hypot(motion.cursorX - centerX, motion.cursorY - centerY);
        const influence = clamp(1 - distance / 240, 0, 0.22);
        const scale = 1 + influence * 0.16;
        icon.style.setProperty('--scale', scale.toFixed(3));
      } else {
        icon.style.setProperty('--scale', '1');
      }
    });
  }

  function animateBackground() {
    updateMotion();
    animationFrame = window.requestAnimationFrame(animateBackground);
  }

  function handlePointerMove(event) {
    motion.cursorX = event.clientX;
    motion.cursorY = event.clientY;
    motion.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    motion.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    motion.active = true;
  }

  function resetMotion() {
    motion.targetX = 0;
    motion.targetY = 0;
    motion.active = false;
  }

  function updateVisibility() {
    const paused = document.hidden || config.reducedMotion;
    techContainer.dataset.motionState = paused ? 'paused' : 'running';
    if (paused) {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    } else if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(animateBackground);
    }
  }

  function debounce(fn, wait) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function handleResize() {
    const mode = getViewportMode();
    if (mode !== currentMode) {
      currentMode = mode;
      buildIcons();
    }
  }

  buildIcons();
  updateVisibility();
  window.setInterval(updateDrift, config.refreshInterval);

  document.addEventListener('mousemove', handlePointerMove);
  document.addEventListener('mouseleave', resetMotion);
  document.addEventListener('visibilitychange', updateVisibility);
  window.addEventListener('blur', updateVisibility);
  window.addEventListener('focus', updateVisibility);
  window.addEventListener('resize', debounce(handleResize, 260));
}

/* ============================================
   3. Scroll Reveal Observer
   ============================================ */
let revealObserver = null;

function initRevealObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
}

function observeReveals() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ============================================
   4. Animated Stats Counter
   ============================================ */
let statsAnimated = false;

function observeStats() {
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats || statsAnimated) return;

  statsAnimated = true;
  const statNums = heroStats.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(num => {
          const target = +num.getAttribute('data-target');
          let count = 0;
          const speed = target / 30;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              num.innerText = `${Math.ceil(count)}+`;
              setTimeout(updateCount, 40);
            } else {
              num.innerText = `${target}+`;
            }
          };
          updateCount();
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(heroStats);
}

/* ============================================
   5. Single-Page Active Nav Highlight
   ============================================ */
function setActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  const activePage = currentPageId || 'hero';

  navLinks.forEach(link => {
    const targetPage = link.getAttribute('href').replace('#', '');
    const isActive = targetPage === activePage;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/* ============================================
   6. 3D Tilt Micro-Animations
   ============================================ */
const tiltBound = new WeakSet();

function initCardTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.project-card, .cert-card, .info-card').forEach(card => {
    if (tiltBound.has(card)) return;
    tiltBound.add(card);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -4;
      const tiltY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
