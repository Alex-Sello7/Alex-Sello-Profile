document.addEventListener('DOMContentLoaded', function () {

  // ===== CINEMATIC LOADER =====
  const loadingScreen = document.getElementById('loadingScreen');
  const loaderPct = document.getElementById('loaderPct');
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 4 + 1, 99);
    if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
  }, 60);

  window.addEventListener('load', function () {
    clearInterval(pctTimer);
    if (loaderPct) loaderPct.textContent = '100%';
    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 400);
  });

  // ===== HERO CANVAS (Performance Optimized) =====
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W, H, t = 0, animId = null, frameCount = 0;
    let isVisible = true;

    function resizeCanvas() {
      W = heroCanvas.width = heroCanvas.offsetWidth;
      H = heroCanvas.height = heroCanvas.offsetHeight;
    }

    function waveColor(index, total, t, alpha) {
      const paletteDeg = [190, 198, 208, 218, 200, 185, 20, 195];
      const sat = [80, 75, 70, 68, 78, 82, 90, 72];
      const lit = [65, 60, 55, 58, 62, 68, 60, 56];
      const i = index % paletteDeg.length;
      const hShift = Math.sin(t * 0.4 + index * 0.5) * 10;
      return `hsla(${paletteDeg[i] + hShift}, ${sat[i]}%, ${lit[i]}%, ${alpha})`;
    }

    function drawScene() {
      if (!ctx || !W || !H) return;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W * 0.7, H);
      bg.addColorStop(0, '#020a14');
      bg.addColorStop(0.5, '#050f1c');
      bg.addColorStop(1, '#030810');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W * 0.62, cy = H * 0.48;
      const numRibbons = 10;

      for (let r = numRibbons; r >= 0; r--) {
        const progress = r / numRibbons;
        const phaseOffset = progress * Math.PI * 2.8 + t * 0.45;
        const radiusX = W * (0.18 + progress * 0.15);
        const radiusY = H * (0.27 + progress * 0.1);
        const thickness = 14 + Math.sin(progress * Math.PI) * 25;
        const pts = [];

        for (let i = 0; i <= 48; i++) {
          const angle = (i / 48) * Math.PI * 2;
          pts.push({
            x: cx + Math.cos(angle) * radiusX + Math.cos(angle * 1.8 + phaseOffset * 0.7) * W * 0.04,
            y: cy + Math.sin(angle) * radiusY + Math.sin(angle * 2.5 + phaseOffset) * H * 0.055
          });
        }

        const alpha = 0.08 + Math.sin(progress * Math.PI) * 0.2;
        const grad = ctx.createLinearGradient(cx - radiusX, cy, cx + radiusX, cy);
        grad.addColorStop(0, waveColor(r, numRibbons, t, alpha * 0.5));
        grad.addColorStop(0.3, waveColor(r + 2, numRibbons, t, alpha));
        grad.addColorStop(0.6, waveColor(r + 4, numRibbons, t, alpha * 1.1));
        grad.addColorStop(1, waveColor(r + 6, numRibbons, t, alpha * 0.5));

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      t += 0.045;
    }

    function loop() {
      if (!isVisible || document.hidden) {
        animId = null;
        return;
      }
      frameCount++;
      if (frameCount % 2 === 0) drawScene();
      animId = requestAnimationFrame(loop);
    }

    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        isVisible = e.isIntersecting;
        if (isVisible && !animId) loop();
      });
    }, { threshold: 0.1 });
    heroObserver.observe(heroCanvas.parentElement);

    resizeCanvas();
    drawScene();

    let resizeTimer;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resizeCanvas(); drawScene(); if (isVisible && !animId) loop(); }, 150);
    });
  }

  // ===== SECTION PULSE CANVASES (Performance Optimized) =====
  (function () {
    const SECTIONS = [
      { selector: '.about-section', theme: 'light', corner: 'topRight' },
      { selector: '.skills-section', theme: 'dark', corner: 'topLeft' },
      { selector: '.experience-section', theme: 'light', corner: 'bottomRight' },
      { selector: '.projects-section', theme: 'light', corner: 'bottomLeft' },
      { selector: '.education-section', theme: 'dark', corner: 'topRight' },
      { selector: '.certificates-section', theme: 'light', corner: 'center' },
    ];

    function darkColor(index, total, t, alpha) {
      const hues = [190, 200, 210, 195, 185, 205];
      const h = hues[index % hues.length];
      return `hsla(${h + Math.sin(t * 0.3 + index) * 8}, 75%, 58%, ${alpha})`;
    }

    function lightColor(index, total, t, alpha) {
      const hues = [200, 210, 195, 205, 215, 190];
      const h = hues[index % hues.length];
      return `hsla(${h + Math.sin(t * 0.3 + index) * 6}, 65%, 45%, ${alpha})`;
    }

    function initPulse(sectionEl, theme, corner) {
      const canvas = sectionEl.querySelector('[data-section-canvas]');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let W, H, t = 0, animId = null, frameCount = 0, isVisible = false;

      function resize() {
        W = canvas.width = sectionEl.offsetWidth;
        H = canvas.height = sectionEl.offsetHeight;
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          isVisible = e.isIntersecting;
          if (isVisible && !animId) loop();
        });
      }, { threshold: 0.1 });
      observer.observe(sectionEl);

      function getOrigin() {
        switch (corner) {
          case 'topRight': return { cx: W * 0.88, cy: H * 0.12 };
          case 'topLeft': return { cx: W * 0.12, cy: H * 0.12 };
          case 'bottomRight': return { cx: W * 0.88, cy: H * 0.88 };
          case 'bottomLeft': return { cx: W * 0.12, cy: H * 0.88 };
          default: return { cx: W * 0.50, cy: H * 0.50 };
        }
      }

      function draw() {
        if (!ctx || !W || !H) return;
        ctx.clearRect(0, 0, W, H);
        const { cx, cy } = getOrigin();
        const numRibbons = 8;
        const isLight = theme === 'light';
        const colorFn = isLight ? lightColor : darkColor;

        for (let r = numRibbons; r >= 0; r--) {
          const progress = r / numRibbons;
          const phaseOffset = progress * Math.PI * 2.6 + t * 0.42;
          const radiusX = W * (0.12 + progress * 0.2);
          const radiusY = H * (0.16 + progress * 0.12);
          const thickness = 8 + Math.sin(progress * Math.PI) * 18;
          const pts = [];

          for (let i = 0; i <= 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            pts.push({
              x: cx + Math.cos(angle) * radiusX + Math.cos(angle * 1.6 + phaseOffset * 0.6) * W * 0.03,
              y: cy + Math.sin(angle) * radiusY + Math.sin(angle * 2.2 + phaseOffset) * H * 0.04,
            });
          }

          const baseAlpha = isLight ? 0.03 + Math.sin(progress * Math.PI) * 0.07 : 0.06 + Math.sin(progress * Math.PI) * 0.18;
          const grad = ctx.createLinearGradient(cx - radiusX, cy, cx + radiusX, cy);
          grad.addColorStop(0, colorFn(r, numRibbons, t, baseAlpha * 0.4));
          grad.addColorStop(0.5, colorFn(r + 2, numRibbons, t, baseAlpha));
          grad.addColorStop(1, colorFn(r + 4, numRibbons, t, baseAlpha * 0.4));

          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.closePath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = thickness;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
        t += 0.08;
      }

      function loop() {
        if (!isVisible || document.hidden) {
          animId = null;
          return;
        }
        frameCount++;
        if (frameCount % 2 === 0) draw();
        animId = requestAnimationFrame(loop);
      }

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
      });

      resize();
    }

    SECTIONS.forEach(({ selector, theme, corner }) => {
      const el = document.querySelector(selector);
      if (el) initPulse(el, theme, corner);
    });
  })();

  // ===== AOD SCROLL ANIMATION SYSTEM (Performance Optimized) =====
  const aodEls = document.querySelectorAll('[data-aod]');
  const aodObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const delay = parseInt(el.dataset.aodDelay || 0);
      if (entry.isIntersecting) {
        setTimeout(() => {
          el.classList.add('aod-in');
          el.classList.remove('aod-out');
        }, delay);
      } else {
        el.classList.remove('aod-in');
        el.classList.add('aod-out');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  aodEls.forEach(el => aodObserver.observe(el));

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      if (scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  }
  window.addEventListener('scroll', throttle(onScroll, 80), { passive: true });

  // ===== HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const message = document.getElementById('message')?.value;
      if (name && email && message) {
        showAlert("Thanks for your message! I'll get back to you soon.", 'success');
        contactForm.reset();
      } else {
        showAlert('Please fill in all fields.', 'error');
      }
    });
  }

  // ===== CHATBOX =====
  const chatButton = document.getElementById('chatButton');
  const chatContainer = document.getElementById('chatContainer');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const WHATSAPP_NUMBER = '27720786569';

  if (chatButton && chatContainer && chatClose && chatInput && chatSend && chatMessages && typingIndicator) {

    function addMessage(text, type) {
      const div = document.createElement('div');
      div.classList.add('message', type);
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = `<div class="message-content">${text}</div><div class="message-time">${time}</div>`;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;
      addMessage(message, 'sent');
      chatInput.value = '';
      typingIndicator.classList.add('active');
      chatInput.disabled = true;
      chatSend.disabled = true;
      setTimeout(() => {
        typingIndicator.classList.remove('active');
        addMessage("Thanks for your message! I'll get back to you shortly. 👋", 'received');
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.focus();
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      }, 1500);
    }

    chatButton.addEventListener('click', e => {
      e.stopPropagation();
      chatContainer.classList.add('active');
      setTimeout(() => chatInput.focus(), 300);
    });
    chatClose.addEventListener('click', e => { e.stopPropagation(); chatContainer.classList.remove('active'); });
    chatSend.addEventListener('click', e => { e.stopPropagation(); sendMessage(); });
    chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });
    document.addEventListener('click', e => {
      if (chatContainer.classList.contains('active') &&
        !chatContainer.contains(e.target) && !chatButton.contains(e.target)) {
        chatContainer.classList.remove('active');
      }
    });
    chatContainer.addEventListener('click', e => e.stopPropagation());

    setTimeout(() => {
      if (chatMessages.children.length === 1) {
        addMessage("Please note, this feature is still in progress. I'll be adding more functionality soon!", 'received');
      }
    }, 1000);
  }

  // ===== CURRENT YEAR =====
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== ONLINE/OFFLINE =====
  window.addEventListener('online', () => showAlert('You are back online!', 'success'));
  window.addEventListener('offline', () => showAlert('You are offline. Some features may not be available.', 'error'));
});

// ===== UTILITIES =====
function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

window.showAlert = function (message, type) {
  const existing = document.querySelector('.alert');
  if (existing) existing.remove();
  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${type}`;
  alertEl.style.display = 'flex';
  alertEl.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close" aria-label="Close"><i class="fas fa-times"></i></button>`;
  document.body.appendChild(alertEl);
  setTimeout(() => alertEl.classList.add('show'), 10);
  alertEl.querySelector('.alert-close').addEventListener('click', () => {
    alertEl.classList.remove('show');
    setTimeout(() => alertEl.remove(), 300);
  });
  setTimeout(() => {
    if (alertEl.parentNode) { alertEl.classList.remove('show'); setTimeout(() => alertEl.remove(), 300); }
  }, 5000);
};

window.closeAlert = function () {
  const alertEl = document.getElementById('alert');
  if (alertEl) {
    alertEl.classList.remove('show');
    setTimeout(() => alertEl.style.display = 'none', 300);
  }
};

window.addEventListener('error', e => {
  if (e.message && e.message.includes('ResizeObserver')) e.preventDefault();
});
window.addEventListener('unhandledrejection', e => e.preventDefault());