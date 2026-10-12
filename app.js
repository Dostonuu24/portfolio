/* ═══════════════════════════════════════════════
   CYBERIN PORTFOLIO — app.js
   Matrix Rain Background + Section Navigation + Interactions
═══════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────
// 1. MATRIX RAIN BACKGROUND (Canvas)
// ─────────────────────────────────────────
(function initMatrixRain() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx    = canvas.getContext('2d');

  const chars  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|/\\!@#$%^&*()_+-=;:'.split('');
  const fontSize = 14;
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5, 8, 16, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px Fira Code, monospace';

    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];

      // Leading character — bright
      if (drops[i] * fontSize > canvas.height * 0.9 || Math.random() > 0.98) {
        ctx.fillStyle = '#ffffff';
      } else if (Math.random() > 0.85) {
        ctx.fillStyle = 'rgba(0, 207, 255, 0.8)'; // cyan accent
      } else {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.55)'; // green
      }

      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 45);
})();

// ─────────────────────────────────────────
// 2. SECTION NAVIGATION
// ─────────────────────────────────────────
const sectionMeta = {
  home:       { icon: 'fa-house',       title: 'Asosiy',      color: '#00ff88' },
  kali:       { icon: 'fa-terminal',    title: 'Kali Kodlar',  color: '#00ff88' },
  projects:   { icon: 'fa-cube',        title: 'Loyihalar',   color: '#00cfff' },
  experience: { icon: 'fa-briefcase',   title: 'Tajriba',     color: '#b388ff' },
  contact:    { icon: 'fa-paper-plane', title: 'Aloqa',       color: '#ff006e' },
};

let currentSection = 'home';

function switchSection(name) {
  if (name === currentSection) return;

  // Hide old section
  const old = document.getElementById('section-' + currentSection);
  if (old) old.classList.remove('active');

  // Update nav buttons (desktop)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === name);
  });
  // Update nav buttons (mobile)
  document.querySelectorAll('.m-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === name);
  });

  currentSection = name;

  // Show new section
  const sec = document.getElementById('section-' + name);
  if (sec) {
    sec.classList.add('active');
    sec.style.animation = 'none';
    requestAnimationFrame(() => {
      sec.style.animation = '';
    });
  }

  // Show HUD
  showHUD(name);

  // Close mobile drawer
  closeMobileDrawer();

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// HUD popup
let hudTimer = null;
function showHUD(name) {
  const meta = sectionMeta[name];
  if (!meta) return;

  const hud   = document.getElementById('sectionHUD');
  const icon  = document.getElementById('hudIcon');
  const title = document.getElementById('hudTitle');

  icon.innerHTML  = `<i class="fa-solid ${meta.icon}"></i>`;
  icon.style.color = meta.color;
  title.textContent = meta.title;
  title.style.color = meta.color;

  hud.classList.add('show');

  clearTimeout(hudTimer);
  hudTimer = setTimeout(() => hud.classList.remove('show'), 2200);
}

// Bind desktop nav buttons
document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

// Bind mobile nav buttons
document.querySelectorAll('.m-nav-btn[data-section]').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

// ─────────────────────────────────────────
// 3. MOBILE HAMBURGER MENU
// ─────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');

function closeMobileDrawer() {
  mobileDrawer.classList.remove('open');
  hamburger.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileDrawer.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
});

document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !mobileDrawer.contains(e.target)) {
    closeMobileDrawer();
  }
});

// ─────────────────────────────────────────
// 4. VIEWS COUNTER (visits every page load)
// ─────────────────────────────────────────
(function initViews() {
  const display  = document.getElementById('viewsDisplay');
  const boostTag = document.getElementById('boostTag');

  // Random daily boost
  const dailyBoost = Math.floor(Math.random() * 51) + 50; // 50-100
  if (boostTag) boostTag.textContent = '+' + dailyBoost + ' bugun';

  // Try to fetch from local server
  fetch('/api/views')
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data && data.views) {
        animateCount(display, data.views);
      }
    })
    .catch(() => {
      // fallback static number if GitHub Pages (no server)
      const base = 4200 + Math.floor(Math.random() * 800);
      animateCount(display, base);
    });
})();

function animateCount(el, target) {
  if (!el) return;
  const start    = Math.max(0, target - 120);
  const duration = 1200;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * ease);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

// ─────────────────────────────────────────
// 5. KALI LINUX TERMINAL INTERACTION
// ─────────────────────────────────────────
const termOutput = document.getElementById('termOutput');

function addTermLine(cls, html) {
  if (!termOutput) return;
  const div = document.createElement('div');
  div.className = 't-line ' + cls;
  div.innerHTML = html;
  termOutput.appendChild(div);
  termOutput.scrollTop = termOutput.scrollHeight;
}

// Copy button
document.querySelectorAll('.ki-copy').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const item = btn.closest('.kali-item');
    const code = item.dataset.code;
    navigator.clipboard.writeText(code).then(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.color = '#00ff88';
      showToast('✅ Kod nusxalandi!');
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        btn.style.color = '';
      }, 1500);
    }).catch(() => showToast('❌ Nusxalashda xato'));
  });
});

// Run button — show in terminal
document.querySelectorAll('.ki-run').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const item = btn.closest('.kali-item');
    const code = item.dataset.code;
    const desc = item.dataset.desc;

    addTermLine('cmd', `<span class="t-user">root@kali-senior</span>:<span class="t-path">~</span># ${escHtml(code)}`);
    addTermLine('info', desc);

    // Simulate output
    setTimeout(() => {
      const outputs = [
        'Starting Kali Linux tool... [OK]',
        'Scanning target... 🔍',
        'Results will appear here in a real terminal.',
        'NOTE: Run this command in an actual Kali Linux terminal.',
      ];
      outputs.forEach((line, i) => {
        setTimeout(() => addTermLine('output', line), i * 200);
      });
    }, 300);
  });
});

// Click on item — also run
document.querySelectorAll('.kali-item').forEach(item => {
  item.addEventListener('click', e => {
    if (e.target.closest('.ki-copy') || e.target.closest('.ki-run')) return;
    const code = item.dataset.code;
    addTermLine('cmd', `<span class="t-user">root@kali-senior</span>:<span class="t-path">~</span># ${escHtml(code)}`);
    addTermLine('output', '▶ Terminal simulatsiya: haqiqiy Kali Linux da ishlating.');
    termOutput.scrollTop = termOutput.scrollHeight;
  });
});

// Clear terminal
const clearBtn = document.getElementById('clearTerm');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (termOutput) {
      termOutput.innerHTML = '<div class="t-line welcome"><span class="t-user">root@kali-senior</span>:<span class="t-path">~</span># Terminal tozalandi. Tayyor.</div>';
    }
  });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─────────────────────────────────────────
// 6. CONTACT FORM — Send via Telegram
// ─────────────────────────────────────────
const sendBtn = document.getElementById('sendMsgBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name = (document.getElementById('msgName')?.value || '').trim();
    const text = (document.getElementById('msgText')?.value || '').trim();

    if (!name || !text) {
      showToast('⚠️ Ism va xabarni to\'ldiring!');
      return;
    }

    const msg = encodeURIComponent(`📩 Yangi xabar!\n👤 Kim: ${name}\n💬 Xabar: ${text}`);
    window.open(`https://t.me/ud2402?text=${msg}`, '_blank');
    showToast('✅ Telegram ochildi!');
    document.getElementById('msgName').value = '';
    document.getElementById('msgText').value = '';
  });
}

// ─────────────────────────────────────────
// 7. TOAST NOTIFICATION
// ─────────────────────────────────────────
function showToast(msg) {
  const box = document.getElementById('toastBox');
  if (!box) return;

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  box.appendChild(t);

  setTimeout(() => {
    t.style.transition = 'opacity 0.3s';
    t.style.opacity    = '0';
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// ─────────────────────────────────────────
// 8. NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────
const topNav = document.getElementById('topNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    topNav.style.background = 'rgba(5, 8, 16, 0.97)';
  } else {
    topNav.style.background = 'rgba(5, 8, 16, 0.85)';
  }
}, { passive: true });

// ─────────────────────────────────────────
// 9. KEYBOARD SHORTCUTS
// ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === '1') switchSection('home');
  if (e.key === '2') switchSection('kali');
  if (e.key === '3') switchSection('projects');
  if (e.key === '4') switchSection('experience');
  if (e.key === '5') switchSection('contact');
});

// ─────────────────────────────────────────
// 10. INIT — Show home section on load
// ─────────────────────────────────────────
window.addEventListener('load', () => {
  showHUD('home');
});
