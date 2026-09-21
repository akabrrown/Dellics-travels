/* ===================================
   DELLICS EDUCATION CONSULT - SCRIPT
   =================================== */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('hidden');
      }, 1800);
    });
  }

  // ===== SET CURRENT YEAR =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== STICKY HEADER =====
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ===== MOBILE NAV / HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('nav-list');

  function closeMobileNav() {
    navList.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Close all open dropdowns
    navList.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
      dd.classList.remove('open');
    });
  }

  if (hamburger && navList) {
    // Toggle hamburger menu
    hamburger.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (!isOpen) {
        navList.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
          dd.classList.remove('open');
        });
      }
    });

    // Mobile dropdown toggles — tap arrow to expand/collapse submenu
    navList.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const parentLi = this.closest('.nav-dropdown');
        if (!parentLi) return;
        // Act as toggle on tablet & mobile
        if (window.innerWidth <= 1024) {
          // Close other open dropdowns
          navList.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
            if (dd !== parentLi) dd.classList.remove('open');
          });
          parentLi.classList.toggle('open');
        }
      });
    });

    // Close mobile menu when a destination/non-dropdown link is clicked
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        // Don't close if clicking main nav-link of a dropdown (let user open submenu)
        const parentLi = this.closest('.nav-dropdown');
        if (parentLi && this.classList.contains('nav-link') && window.innerWidth <= 1024) {
          // On mobile: clicking the main Services/Destinations link navigates + closes
          closeMobileNav();
          return;
        }
        closeMobileNav();
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (navList.classList.contains('open') && !navList.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileNav();
      }
    });
  }

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function setActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sTop = section.offsetTop - 80;
      if (window.scrollY >= sTop) current = section.getAttribute('id');
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  // ===== AOS (ANIMATE ON SCROLL) =====
  function initAOS() {
    const aosElements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    aosElements.forEach(function (el) { observer.observe(el); });
  }
  initAOS();

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(current);
    }, duration / steps);
  }
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ===== TESTIMONIALS SLIDER =====
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (track && dotsContainer && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let cardsVisible = 3;
    let autoplayTimer;
    let isDragging = false;
    let startX = 0;
    let dragThreshold = 50;

    function getCardsVisible() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - cardsVisible);
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const max = getMaxIndex();
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.slider-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      cardsVisible = getCardsVisible();
      const max = getMaxIndex();
      current = Math.min(Math.max(index, 0), max);
      const cardWidth = cards[0].offsetWidth + 28; // gap
      track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';
      updateDots();
    }

    function next() { goTo(current + 1 > getMaxIndex() ? 0 : current + 1); }
    function prev() { goTo(current - 1 < 0 ? getMaxIndex() : current - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, 4500);
    }
    function stopAutoplay() { clearInterval(autoplayTimer); }

    prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    nextBtn.addEventListener('click', function () { next(); startAutoplay(); });

    // Touch/drag
    track.addEventListener('mousedown', function (e) { isDragging = true; startX = e.clientX; stopAutoplay(); });
    track.addEventListener('touchstart', function (e) { isDragging = true; startX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
    document.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.clientX - startX;
      if (diff < -dragThreshold) next();
      else if (diff > dragThreshold) prev();
      startAutoplay();
    });
    document.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.changedTouches[0].clientX - startX;
      if (diff < -dragThreshold) next();
      else if (diff > dragThreshold) prev();
      startAutoplay();
    });

    // Init
    buildDots();
    startAutoplay();

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        cardsVisible = getCardsVisible();
        buildDots();
        goTo(Math.min(current, getMaxIndex()));
      }, 200);
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // header height
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== HERO PARTICLES =====
  function createParticles() {
    const hero = document.querySelector('.hero-bg');
    if (!hero) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.style.cssText = [
        'position:absolute',
        'width:' + (Math.random() * 5 + 2) + 'px',
        'height:' + (Math.random() * 5 + 2) + 'px',
        'border-radius:50%',
        'background:rgba(255,107,0,' + (Math.random() * 0.4 + 0.1) + ')',
        'left:' + (Math.random() * 100) + '%',
        'top:' + (Math.random() * 100) + '%',
        'animation:particleFloat ' + (Math.random() * 8 + 6) + 's ease-in-out infinite ' + (Math.random() * 4) + 's'
      ].join(';');
      hero.appendChild(p);
    }
    // Inject keyframes once
    if (!document.getElementById('particle-style')) {
      const style = document.createElement('style');
      style.id = 'particle-style';
      style.textContent = '@keyframes particleFloat { 0%,100%{transform:translate(0,0) scale(1);opacity:0.6} 25%{transform:translate(20px,-30px) scale(1.2);opacity:1} 75%{transform:translate(-15px,20px) scale(0.8);opacity:0.4} }';
      document.head.appendChild(style);
    }
  }
  createParticles();

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    function validateField(input) {
      const errorEl = input.parentElement.querySelector('.form-error');
      const value = input.value.trim();
      let error = '';
      if (input.hasAttribute('required') && !value) {
        error = 'This field is required.';
      } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address.';
      } else if (input.type === 'tel' && value && !/^[\+\d\s\-\(\)]{7,}$/.test(value)) {
        error = 'Please enter a valid phone number.';
      } else if (input.id === 'firstName' && value && value.length < 2) {
        error = 'Name must be at least 2 characters.';
      }
      if (errorEl) errorEl.textContent = error;
      input.classList.toggle('error', !!error);
      return !error;
    }

    // Real-time validation
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(this); });
      field.addEventListener('input', function () {
        if (this.classList.contains('error')) validateField(this);
      });
    });

    // WhatsApp submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('input[required], select[required]').forEach(function (field) {
        if (!validateField(field)) valid = false;
      });
      if (!valid) return;

      const btn = document.getElementById('form-submit-btn');
      const btnText = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');
      btn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';

      // Collect form data
      const firstName = contactForm.querySelector('#firstName').value.trim();
      const lastName = contactForm.querySelector('#lastName').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const phone = contactForm.querySelector('#phone').value.trim();
      const destination = contactForm.querySelector('#destination').value;
      const service = contactForm.querySelector('#service').value;
      const message = contactForm.querySelector('#message').value.trim();

      // Format WhatsApp message
      let whatsappMessage = 'Hello Dellics Education Consult!%0A%0A';
      whatsappMessage += '*New Consultation Request*%0A';
      whatsappMessage += '=========================%0A%0A';
      whatsappMessage += '*Name:* ' + firstName + ' ' + lastName + '%0A';
      whatsappMessage += '*Email:* ' + email + '%0A';
      whatsappMessage += '*Phone:* ' + phone + '%0A';
      
      if (destination) {
        const destinationText = contactForm.querySelector('#destination option[value="' + destination + '"]').text;
        whatsappMessage += '*Destination:* ' + destinationText + '%0A';
      }
      
      if (service) {
        const serviceText = contactForm.querySelector('#service option[value="' + service + '"]').text;
        whatsappMessage += '*Service:* ' + serviceText + '%0A';
      }
      
      if (message) {
        whatsappMessage += '%0A*Message:*%0A' + message + '%0A';
      }
      
      whatsappMessage += '%0A=========================%0A';
      whatsappMessage += 'Sent from Dellics Education Consult website';

      // Redirect to WhatsApp
      setTimeout(function () {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        window.open('https://wa.me/233552054174?text=' + whatsappMessage, '_blank');
        contactForm.reset();
      }, 1000);
    });

    // Email submission
    const emailBtn = document.getElementById('email-submit-btn');
    if (emailBtn) {
      emailBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let valid = true;
        contactForm.querySelectorAll('input[required], select[required]').forEach(function (field) {
          if (!validateField(field)) valid = false;
        });
        if (!valid) return;

        const btnText = emailBtn.querySelector('.btn-text');
        const btnLoading = emailBtn.querySelector('.btn-loading');
        emailBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        // Collect form data
        const firstName = contactForm.querySelector('#firstName').value.trim();
        const lastName = contactForm.querySelector('#lastName').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const phone = contactForm.querySelector('#phone').value.trim();
        const destination = contactForm.querySelector('#destination').value;
        const service = contactForm.querySelector('#service').value;
        const message = contactForm.querySelector('#message').value.trim();

        // Format email body
        let emailBody = 'Hello Dellics Education Consult,\n\n';
        emailBody += 'New Consultation Request\n';
        emailBody += '=========================\n\n';
        emailBody += 'Name: ' + firstName + ' ' + lastName + '\n';
        emailBody += 'Email: ' + email + '\n';
        emailBody += 'Phone: ' + phone + '\n';
        
        if (destination) {
          const destinationText = contactForm.querySelector('#destination option[value="' + destination + '"]').text;
          emailBody += 'Destination: ' + destinationText + '\n';
        }
        
        if (service) {
          const serviceText = contactForm.querySelector('#service option[value="' + service + '"]').text;
          emailBody += 'Service: ' + serviceText + '\n';
        }
        
        if (message) {
          emailBody += '\nMessage:\n' + message + '\n';
        }
        
        emailBody += '\n=========================\n';
        emailBody += 'Sent from Dellics Education Consult website';

        // Open email client
        setTimeout(function () {
          emailBtn.disabled = false;
          btnText.style.display = 'inline';
          btnLoading.style.display = 'none';
          const mailtoLink = 'mailto:info@dellicstravels.com?subject=New Consultation Request - ' + firstName + ' ' + lastName + '&body=' + encodeURIComponent(emailBody);
          window.location.href = mailtoLink;
          contactForm.reset();
        }, 1000);
      });
    }
  }

  // ===== SERVICE CARD HOVER EFFECT =====
  document.querySelectorAll('.service-card, .dest-card, .step-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease';
    });
  });

  // ===== TRUST STRIP PAUSE ON HOVER =====
  const trustLogos = document.querySelector('.trust-logos');
  if (trustLogos) {
    trustLogos.addEventListener('mouseenter', function () {
      this.style.animationPlayState = 'paused';
    });
    trustLogos.addEventListener('mouseleave', function () {
      this.style.animationPlayState = 'running';
    });
  }

  // ===== HEADER SHADOW ON SCROLL =====
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;
    if (header) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });
  // Restore header on top
  window.addEventListener('scroll', function () {
    if (header && window.scrollY < 10) header.style.transform = 'translateY(0)';
  }, { passive: true });

  // Add transition to header
  if (header) header.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s';

  // ===== FAQ ACCORDION INTERACTION =====
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      if (!item) return;
      const isActive = item.classList.contains('active');
      // Optional: close other open items
      document.querySelectorAll('.faq-item.active').forEach(function (other) {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });

  // ===== HOMEPAGE STUDENT DASHBOARD TABS =====
  const dashTabs = document.querySelectorAll('.dash-tab');
  const dashPanes = document.querySelectorAll('.dash-tab-pane');
  if (dashTabs.length && dashPanes.length) {
    dashTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const targetId = this.getAttribute('data-dash-tab');
        if (!targetId) return;

        dashTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        dashPanes.forEach(function (p) {
          p.classList.remove('active');
        });

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  console.log('%c🎓 Dellics Education Consult %c Guiding Futures. Building Success.', 'background:#0D1B5E;color:#FF6B00;font-weight:bold;padding:8px 12px;border-radius:4px 0 0 4px', 'background:#FF6B00;color:#fff;font-weight:bold;padding:8px 12px;border-radius:0 4px 4px 0');
});

