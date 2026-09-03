/* ==========================================================================
   Main JavaScript - UI/UX & Scroll Animations Engine - PREMIUM ULTRA PRO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Theme Toggle with smooth transition
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  const savedTheme = localStorage.getItem('cv_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('cv_theme', 'dark');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('cv_theme', 'light');
    }
  });

  // 2. Mobile Navigation Toggle with animation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
        document.body.style.overflow = 'hidden';
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
        document.body.style.overflow = '';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }

  // 3. Scroll Progress Bar & Back to Top & Active Nav Link & Scrolled Header & Parallax
  const navbar = document.querySelector('.navbar');
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroSection = document.querySelector('.hero');
  const heroImageCard = document.querySelector('.hero-image-card');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Header scrolled state with scale
        if (navbar) {
          if (scrollTop > 40) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }

        // Scroll progress with glow
        if (progressBar && docHeight > 0) {
          const progressPercent = (scrollTop / docHeight) * 100;
          progressBar.style.width = `${progressPercent}%`;
        }

        // Back to top button visibility
        if (backToTopBtn) {
          if (scrollTop > 350) {
            backToTopBtn.classList.add('show');
          } else {
            backToTopBtn.classList.remove('show');
          }
        }

        // Active Nav link highlight
        let current = '';
        const scrollPosition = scrollTop + 200;
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });

        // Parallax for hero image (subtle)
        if (heroImageCard && scrollTop < 800) {
          const parallaxY = scrollTop * 0.15;
          const parallaxRotate = scrollTop * 0.01;
          heroImageCard.style.transform = `translateY(${parallaxY * 0.3}px) perspective(1000px) rotateY(${-parallaxRotate}deg)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Magnetic hover for buttons
  document.querySelectorAll('.btn, .btn-header-wa').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // 3D Tilt for hero card on mouse move
  if (heroImageCard) {
    const heroWrapper = document.querySelector('.hero-image-wrapper');
    if (heroWrapper) {
      heroWrapper.addEventListener('mousemove', (e) => {
        const rect = heroWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateY = (x / rect.width) * 12;
        const rotateX = -(y / rect.height) * 12;
        heroImageCard.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(20px) scale(1.02)`;
      });
      heroWrapper.addEventListener('mouseleave', () => {
        heroImageCard.style.transform = '';
      });
    }
  }

  // Animated Counter for stats
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          // Extract number
          const numMatch = text.match(/([\d.]+)/);
          if (numMatch) {
            const target = parseFloat(numMatch[1]);
            const isPercent = text.includes('%');
            const suffix = isPercent ? '%' : (text.includes('+') ? '' : '');
            const prefix = text.includes('+') ? '+' : '';
            let current = 0;
            const duration = 1400;
            const startTime = performance.now();
            function update(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              current = target * eased;
              if (isPercent) {
                el.textContent = current.toFixed(2) + '%';
              } else if (target % 1 === 0) {
                el.textContent = prefix + Math.round(current) + (text.includes('سنة') ? ' سنة' : '');
              } else {
                el.textContent = prefix + current.toFixed(1);
              }
              if (progress < 1) requestAnimationFrame(update);
              else el.textContent = text; // restore original
            }
            requestAnimationFrame(update);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }
  // Delay to ensure content-manager rendered
  setTimeout(animateCounters, 800);
  window.animateCounters = animateCounters;

  // 4. Scroll Reveal Animations Engine (IntersectionObserver) - Enhanced
  let revealObserver;

  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-right, .reveal-left, .reveal-up, .reveal-zoom');

    if ('IntersectionObserver' in window) {
      if (revealObserver) {
        revealObserver.disconnect();
      }

      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // If it's a skill card, trigger progress bar fill with delay
            const progressFill = entry.target.querySelector('.skill-progress-fill');
            if (progressFill) {
              const targetWidth = progressFill.getAttribute('data-width') || progressFill.style.width;
              if (targetWidth) {
                setTimeout(() => {
                  progressFill.style.width = targetWidth;
                }, 200);
              }
            }

            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          el.classList.add('revealed');
          const progressFill = el.querySelector('.skill-progress-fill');
          if (progressFill) {
            const targetWidth = progressFill.getAttribute('data-width') || progressFill.style.width;
            if (targetWidth) setTimeout(()=> progressFill.style.width = targetWidth, 300);
          }
        } else {
          revealObserver.observe(el);
        }
      });
    } else {
      revealElements.forEach(el => el.classList.add('revealed'));
    }
  }

  window.reobserveScrollReveals = initScrollReveals;
  initScrollReveals();

  // Keyboard accessibility for reveal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });

  // 5. Lightbox Modal for Gallery Images - with zoom animation
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function bindLightboxEvents() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        if (imgSrc && lightboxModal && lightboxImg) {
          lightboxImg.src = imgSrc;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
          // Animate in
          lightboxImg.style.transform = 'scale(0.9)';
          lightboxImg.style.opacity = '0';
          setTimeout(() => {
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
          }, 10);
        }
      });
    });
  }

  bindLightboxEvents();
  window.bindLightboxEvents = bindLightboxEvents;

  if (lightboxClose && lightboxModal) {
    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // 6. Print Button Handling - preload every image first so nothing
  // prints blank (lazy/below-fold images), then open print dialog.
  async function ensureImagesReady() {
    const imgs = [...document.querySelectorAll('img')];
    await Promise.race([
      Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        try { img.loading = 'eager'; } catch (e) {}
        return new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
          const src = img.getAttribute('src');
          if (src) img.src = src;
          else res();
        });
      })),
      new Promise(res => setTimeout(res, 2500))
    ]);
  }
  const printButtons = document.querySelectorAll('.trigger-print');
  printButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      await ensureImagesReady();
      btn.disabled = false;
      window.print();
    });
  });

  // 6b. Prepare page for print: reveal everything, fill skill bars,
  // reset gallery train transform so print CSS grid applies cleanly.
  // (RAF loop re-applies transform on next frame after printing.)
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal-right, .reveal-left, .reveal-up, .reveal-zoom')
      .forEach(el => {
        el.classList.add('revealed');
        const fill = el.querySelector('.skill-progress-fill');
        if (fill) {
          const w = fill.getAttribute('data-width');
          if (w) fill.style.width = w;
        }
      });
    document.querySelectorAll('.skill-progress-fill').forEach(fill => {
      const w = fill.getAttribute('data-width');
      if (w) fill.style.width = w;
    });
    const track = document.getElementById('bind-gallery');
    if (track) track.style.transform = 'none';
  });

  // 7. Smooth scroll offset for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // 8. Add loaded class for initial animations
  setTimeout(() => document.body.classList.add('loaded'), 100);

  // 9. Gallery Train - RAF infinite scroll with item recycling (never resets)
  // Robust vs async render: gallery items are injected by content-manager AFTER fetch,
  // so tick must survive empty track + re-measure when items arrive.
  const trainTrack = document.getElementById('bind-gallery');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const wrapper = document.querySelector('.gallery-carousel-wrapper');

  if (trainTrack && wrapper) {
    let offset = 0;
    let paused = false;
    let speedMultiplier = 1;
    const baseSpeed = 0.6;
    let itemWidth = 360;

    function getGap() {
      const w = wrapper.offsetWidth;
      if (w <= 480) return 0.75 * 16;
      if (w <= 768) return 0.85 * 16;
      return 1.25 * 16;
    }

    function measureItemWidth() {
      const first = trainTrack.children[0];
      if (!first) return false;
      const w = first.offsetWidth;
      if (!w) return false;
      itemWidth = w + getGap();
      return true;
    }

    function setFixedWidth() {
      const count = trainTrack.children.length;
      if (count > 0 && itemWidth > 0) {
        trainTrack.style.width = (count * itemWidth) + 'px';
      }
    }

    function refreshMeasurements() {
      if (measureItemWidth()) setFixedWidth();
    }

    function tick() {
      try {
        const count = trainTrack.children.length;
        if (count === 0) {
          offset = 0;
        } else if (!paused) {
          offset += baseSpeed * speedMultiplier;
          // Forward: first item fully off left edge -> move to end
          if (offset >= itemWidth) {
            const el = trainTrack.children[0];
            if (el) {
              trainTrack.removeChild(el);
              trainTrack.appendChild(el);
              offset -= itemWidth;
            } else {
              offset = 0;
            }
          }
          // Reverse: moved past right edge -> move last to front
          else if (offset < 0) {
            const last = trainTrack.children[count - 1];
            if (last) {
              trainTrack.removeChild(last);
              trainTrack.insertBefore(last, trainTrack.children[0]);
              offset += itemWidth;
            } else {
              offset = 0;
            }
          }
          trainTrack.style.transform = `translateX(-${offset}px)`;
        }
      } catch (err) {
        offset = 0;
      }
      requestAnimationFrame(tick);
    }

    // Start loop immediately (survives empty track), measure when items arrive
    requestAnimationFrame(tick);
    // Re-measure on: next frames, DOM injection, images load, resize
    requestAnimationFrame(refreshMeasurements);
    setTimeout(refreshMeasurements, 500);
    setTimeout(refreshMeasurements, 1500);
    window.addEventListener('load', refreshMeasurements);
    window.addEventListener('resize', refreshMeasurements);
    if ('MutationObserver' in window) {
      const mo = new MutationObserver(refreshMeasurements);
      mo.observe(trainTrack, { childList: true });
    }

    // Pause on hover / touch
    wrapper.addEventListener('mouseenter', () => { paused = true; });
    wrapper.addEventListener('mouseleave', () => { paused = false; });
    wrapper.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    wrapper.addEventListener('touchend', () => {
      setTimeout(() => { paused = false; }, 1200);
    }, { passive: true });

    // Pause when out of viewport
    const trainObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { paused = !e.isIntersecting; });
    }, { threshold: 0.05 });
    trainObserver.observe(wrapper);

    // Button controls - temporarily speed up
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        speedMultiplier = -3;
        trainTrack.style.filter = 'brightness(1.08)';
        setTimeout(() => { speedMultiplier = 1; trainTrack.style.filter = ''; }, 1200);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        speedMultiplier = 4;
        trainTrack.style.filter = 'brightness(1.08)';
        setTimeout(() => { speedMultiplier = 1; trainTrack.style.filter = ''; }, 1200);
      });
    }
  }
});
