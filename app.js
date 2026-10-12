/* ===================================================================
   CYBERIN - SENIOR DEVELOPER LINKEDIN 3D & HACKER PORTFOLIO
   Interactive Engine: Three.js 3D, Card Tilts, Kali Terminal, Robots
=================================================================== */

// ==========================================
// 1. WEB AUDIO SYNTHESIZER (Futuristic Sounds)
// ==========================================
class CyberAudio {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playBeep(freq = 600, duration = 0.08, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playCyberClick() {
    this.playBeep(880, 0.05, 'triangle');
  }

  playHackerSuccess() {
    this.playBeep(523.25, 0.08, 'sine');
    setTimeout(() => this.playBeep(659.25, 0.08, 'sine'), 80);
    setTimeout(() => this.playBeep(783.99, 0.12, 'sine'), 160);
  }
}

const cyberAudio = new CyberAudio();

// ==========================================
// 2. THREE.JS 3D CYBERNETIC BACKGROUND
// ==========================================
function initThreeCyberBackground() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070a12, 0.0016);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  camera.position.y = 80;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. 3D Wireframe Cyber Grid Plane (Horizon Waves)
  const planeGeo = new THREE.PlaneGeometry(1600, 1600, 48, 48);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2.2;
  plane.position.y = -220;
  scene.add(plane);

  // 2. 3D Floating Holographic Cyber Core (Jonli 3D Yadro & Aylanuvchi Halqalar)
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 30, -160);

  // Outer wireframe icosahedron
  const coreGeo = new THREE.IcosahedronGeometry(70, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.32
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreGroup.add(coreMesh);

  // Inner glowing dodecahedron
  const innerCoreGeo = new THREE.DodecahedronGeometry(42, 0);
  const innerCoreMat = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    wireframe: true,
    transparent: true,
    opacity: 0.48
  });
  const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  coreGroup.add(innerCoreMesh);

  // Revolving 3D Cyber Light Rings
  const ringGeo = new THREE.TorusGeometry(105, 1.2, 16, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.45 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.4 });
  const ring2 = new THREE.Mesh(ringGeo, ringMat2);
  ring2.rotation.y = Math.PI / 3.5;
  coreGroup.add(ring2);

  scene.add(coreGroup);

  // 3. 3D Floating Glowing Cyber Particles (Matrix Cyber Dust)
  const particleCount = 750;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x00ff88); // Neon Green
  const color2 = new THREE.Color(0x00e5ff); // Electric Cyan
  const color3 = new THREE.Color(0x8b5cf6); // Cyber Purple

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1400;
    positions[i + 1] = (Math.random() - 0.5) * 900;
    positions[i + 2] = (Math.random() - 0.5) * 1000;

    const chosenColor = Math.random() > 0.6 ? color1 : (Math.random() > 0.5 ? color2 : color3);
    colors[i] = chosenColor.r;
    colors[i + 1] = chosenColor.g;
    colors[i + 2] = chosenColor.b;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 4.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particleSystem);

  // 4. Mouse & Touch Parallax Motion (Telefon va Noutbuk uchun)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.35;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.35;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.35;
      mouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.35;
    }
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Undulate the grid surface
    const pos = planeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.01 + elapsedTime * 1.5) * 9 + Math.cos(v * 0.01 + elapsedTime * 1.2) * 9;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    // Rotate core & rings smoothly
    coreMesh.rotation.y = elapsedTime * 0.25;
    coreMesh.rotation.x = elapsedTime * 0.15;
    innerCoreMesh.rotation.y = -elapsedTime * 0.35;
    innerCoreMesh.rotation.z = elapsedTime * 0.2;
    ring1.rotation.z = elapsedTime * 0.4;
    ring2.rotation.x = -elapsedTime * 0.3;

    // Breathing pulse on the core
    const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.05;
    coreGroup.scale.set(pulseScale, pulseScale, pulseScale);

    // Rotate particles gently
    particleSystem.rotation.y = elapsedTime * 0.04;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

    // Smooth camera lerp
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 0.5;
    camera.position.y = 80 - targetY * 0.3;
    camera.lookAt(0, -40, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ==========================================
// 3. 3D TILT EFFECT ON CARDS (Interactive Physics)
// ==========================================
function init3DTiltCards() {
  const cards = document.querySelectorAll('.card-3d, .project-item-3d');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5; // Max 5.5 deg
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

// ==========================================
// 4. KALI LINUX INTERACTIVE TERMINAL EMULATOR
// ==========================================
const terminalSimulationOutputs = {
  "nmap -sV -sC -T4 -p- target.com": [
    "[+] Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-10",
    "[+] Initiating SYN Stealth Scan against target.com (192.168.1.100)",
    "[+] Discovered open port 22/tcp on target.com (OpenSSH 9.2p1)",
    "[+] Discovered open port 80/tcp on target.com (nginx 1.24.0)",
    "[+] Discovered open port 443/tcp on target.com (nginx 1.24.0 SSL/TLS)",
    "[+] Discovered open port 5432/tcp on target.com (PostgreSQL 16.1)",
    "[+] Nmap scan report: 4 services recognized. 0 vulnerabilities exposed.",
    "[✔] Skanerlash yakunlandi: Barcha portlar xavfsiz holatda!"
  ],
  "sqlmap -u \"http://target.com/item.php?id=1\" --dbs --batch": [
    "[*] starting @ 10:24:12 /sqlmap.py/",
    "[INFO] testing connection to the target URL",
    "[INFO] testing if the target URL content is stable",
    "[INFO] heuristics: GET parameter 'id' appears to be dynamic",
    "[INFO] testing for SQL injection vulnerability...",
    "[INFO] GET parameter 'id' is injectable via boolean-based blind",
    "[+] available databases [4]:",
    "    [*] core_production",
    "    [*] customers_vault",
    "    [*] information_schema",
    "    [*] payments_ledger",
    "[✔] SQLmap: Zaiflik muvaffaqiyatli aniqlandi va audit qilindi."
  ],
  "msfconsole -q": [
    "  + -- --=[ metasploit v6.3.55-dev ]",
    "+ -- --=[ 2384 exploits - 1232 auxiliary - 413 post ]",
    "+ -- --=[ 1385 payloads - 46 encoders - 11 nops ]",
    "msf6 > use exploit/multi/handler",
    "msf6 exploit(handler) > set PAYLOAD linux/x64/meterpreter/reverse_tcp",
    "msf6 exploit(handler) > [*] Meterpreter session 1 opened (192.168.1.5:4444 -> 192.168.1.100:49212)",
    "[✔] Metasploit konsoli ishga tushirildi va sinov muvaffaqiyatli yakunlandi."
  ],
  "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture.cap": [
    "Opening capture.cap",
    "Read 41242 packets.",
    "#  BSSID              ESSID                     Encryption",
    "1  00:14:6C:7E:40:80  CyberSec_HQ               WPA (1 handshake)",
    "Choosing first network as target.",
    "Reading keyfile /usr/share/wordlists/rockyou.txt...",
    "Master Key generated. Testing 14,342,000 keys...",
    "[KEY FOUND!] [ S3cur3P@ssw0rd2026! ]",
    "[✔] Aircrack-ng: WPA2 4-Way Handshake paroli aniqlandi!"
  ],
  "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.100 -t 4": [
    "Hydra v9.5 (c) 2026 by van Hauser / THC - Starting scan",
    "[DATA] max 4 tasks per target, 1 login, 100000 passwords",
    "[STATUS] 320.00 tries/min, 1600 tries in 00:05",
    "[22][ssh] host: 192.168.1.100   login: admin   password: SuperSecretRoot!",
    "1 of 1 target completed, 1 valid password found",
    "[✔] Hydra: SSH autentifikatsiya paroli topildi."
  ],
  "tshark -i eth0 -f \"tcp port 80 or port 443\" -c 100": [
    "Capturing on 'eth0'",
    "  1 0.000000 192.168.1.5 -> 192.168.1.100 TCP 74 54320 > 443 [SYN] Seq=0",
    "  2 0.000842 192.168.1.100 -> 192.168.1.5 TCP 74 443 > 54320 [SYN, ACK] Seq=0",
    "  3 0.000910 192.168.1.5 -> 192.168.1.100 TCP 66 54320 > 443 [ACK] Seq=1",
    "  4 0.002150 192.168.1.5 -> 192.168.1.100 TLSv1.3 517 Client Hello",
    "  5 0.003920 192.168.1.100 -> 192.168.1.5 TLSv1.3 1480 Server Hello",
    "100 packets captured and analyzed.",
    "[✔] TShark: Tarmoq shifrlangan TLS trafigi tekshirildi."
  ],
  "gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt -x php,html,txt": [
    "===============================================================",
    "Gobuster v3.6 - Directory and File Brute Forcing",
    "===============================================================",
    "[+] Url:         http://target.com",
    "[+] Wordlist:    /usr/share/wordlists/dirb/common.txt",
    "===============================================================",
    "/admin                (Status: 301) [Size: 178] [--> http://target.com/admin/]",
    "/api                  (Status: 200) [Size: 42]",
    "/config.php           (Status: 403) [Size: 280]",
    "/.env                 (Status: 403) [Size: 280]",
    "/robots.txt           (Status: 200) [Size: 120]",
    "[✔] Gobuster: Yashirin resurslar muvaffaqiyatli aniqlandi."
  ],
  "john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt": [
    "Loaded 1 password hash (SHA512-crypt [64/64])",
    "Press 'q' or Ctrl-C to abort, almost any other key for status",
    "hacker2026       (admin_hash)",
    "1g 0:00:00:03 DONE (2026-10-10 10:25) 0.3205g/s 4120p/s 4120c/s",
    "Use the '--show' option to display all of the cracked passwords.",
    "[✔] John the Ripper: Parol xeshi dekodlandi!"
  ],
  "nikto -h http://target.com -ssl -Tuning 123b": [
    "- Nikto v2.5.0",
    "+ Target IP:          192.168.1.100",
    "+ Target Hostname:    target.com",
    "+ Target Port:        443",
    "+ SSL Info:           Subject: /CN=target.com, Ciphers: TLS_AES_256_GCM_SHA384",
    "+ Server: nginx/1.24.0",
    "+ The anti-clickjacking X-Frame-Options header is present and secure.",
    "+ The X-Content-Type-Options header is set to 'nosniff'.",
    "+ 0 critical security issues found on web server.",
    "[✔] Nikto: Web server xavfsizlik konfiguratsiyasi tasdiqlandi!"
  ],
  "netdiscover -r 192.168.1.0/24": [
    " Currently scanning: 192.168.1.0/24   |   Screen View: Unique Hosts",
    " 4 Captured ARP Req/Rep packets, from 4 hosts.",
    " _____________________________________________________________________________",
    "   IP            At MAC Address     Count     Len  MAC Vendor / Hostname",
    " -----------------------------------------------------------------------------",
    " 192.168.1.1     00:1a:2b:3c:4d:5e      1      60  Cisco Router Gateway",
    " 192.168.1.100   bc:24:11:ff:88:99      2     120  Linux Production Server",
    " 192.168.1.105   48:2a:e3:10:22:33      1      60  Workstation Alpha",
    "[✔] Netdiscover: Lokal tarmoqdagi barcha faol qurilmalar topildi."
  ]
};

function initKaliTerminal() {
  const terminalOutput = document.getElementById('terminalOutput');
  const clearBtn = document.getElementById('clearTerminalBtn');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cyberAudio.playCyberClick();
      terminalOutput.innerHTML = `
        <div class="term-line welcome"><span class="prompt-user">root@kali-senior</span>:<span class="prompt-path">~</span># echo "Terminal tozalandi. Buyruqni tanlang:"</div>
      `;
    });
  }

  // Handle Run buttons
  document.querySelectorAll('.run-cmd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cyberAudio.playHackerSuccess();
      const parent = btn.closest('.kali-cmd-item');
      const code = parent.getAttribute('data-code');
      runCommandInTerminal(code);
    });
  });

  // Handle Copy buttons
  document.querySelectorAll('.copy-cmd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cyberAudio.playCyberClick();
      const parent = btn.closest('.kali-cmd-item');
      const code = parent.getAttribute('data-code');
      copyToClipboard(code, "Kali Linux buyrug'i nusxalandi! 📋");
    });
  });

  // Clicking command item runs it
  document.querySelectorAll('.kali-cmd-item').forEach(item => {
    item.addEventListener('click', () => {
      cyberAudio.playCyberClick();
      const code = item.getAttribute('data-code');
      runCommandInTerminal(code);
    });
  });
}

function runCommandInTerminal(code) {
  const terminalOutput = document.getElementById('terminalOutput');
  if (!terminalOutput) return;

  // Append user input line
  const cmdLine = document.createElement('div');
  cmdLine.className = 'term-line';
  cmdLine.innerHTML = `<span class="prompt-user">root@kali-senior</span>:<span class="prompt-path">~</span># <strong>${escapeHtml(code)}</strong>`;
  terminalOutput.appendChild(cmdLine);

  // Show running indicator
  const waitLine = document.createElement('div');
  waitLine.className = 'term-line info-output';
  waitLine.textContent = '[*] Buyruq bajarilmoqda... Jarayon tahlil qilinmoqda...';
  terminalOutput.appendChild(waitLine);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  setTimeout(() => {
    waitLine.remove();
    const lines = terminalSimulationOutputs[code] || [
      "[+] Process started in background.",
      "[✔] Buyruq muvaffaqiyatli yakunlandi."
    ];

    lines.forEach((lineText, index) => {
      setTimeout(() => {
        const outDiv = document.createElement('div');
        outDiv.className = 'term-line ' + (lineText.includes('[✔]') ? 'success-output' : 'info-output');
        outDiv.textContent = lineText;
        terminalOutput.appendChild(outDiv);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }, index * 90);
    });
  }, 400);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ==========================================
// 5. TOAST NOTIFICATIONS & CLIPBOARD HELPER
// ==========================================
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function copyToClipboard(text, customToast) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(customToast || "Nusxa olindi! ✅");
  }).catch(() => {
    showToast("Nusxa olindi: " + text);
  });
}

// ==========================================
// 6. FLOATING CYBER ROBOTS INTERACTION
// ==========================================
function initCyberRobots() {
  const botQuotes = {
    bot1: [
      "Senior Dasturchi tizimi 100% faol! 🛡️",
      "Xavfsizlik devori: Hech qanday zaiflik aniqlanmadi!",
      "High-load arxitektura barqaror ishlamoqda! 🚀"
    ],
    bot2: [
      "Kali Linux terminaliga xush kelibsiz! ⚡",
      "Nmap va SQLmap skriptlari tekshiruvga tayyor!",
      "Paketlar tahlili: Shifrlangan kanal xavfsiz! 🔐"
    ],
    bot3: [
      "10 ta mashhur Kali Linux kodi tayyor! 🐧",
      "Metasploit va Aircrack-ng sinovdan o'tgan!",
      "Men hacker robotiman, buyruqni bosing va ko'ring! 💻"
    ],
    bot4: [
      "Aloqa: +998 95 068 02 24 yoki Telegram! 📲",
      "Instagram: @dostonuu_24 orqali yozishingiz mumkin!",
      "Senior dev siz bilan bog'lanishga tayyor! 🤝"
    ]
  };

  ['bot1', 'bot2', 'bot3', 'bot4'].forEach(botId => {
    const botEl = document.getElementById(botId);
    const bubbleEl = document.getElementById(`${botId}-bubble`);
    if (!botEl || !bubbleEl) return;

    botEl.addEventListener('click', () => {
      cyberAudio.playHackerSuccess();
      const quotes = botQuotes[botId];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      bubbleEl.textContent = randomQuote;
      bubbleEl.style.opacity = '1';
      bubbleEl.style.transform = 'translateY(0)';

      setTimeout(() => {
        bubbleEl.style.opacity = '';
        bubbleEl.style.transform = '';
      }, 4000);
    });
  });
}

// ==========================================
// 7. USER PHOTO UPLOAD & PREVIEW SYSTEM
// ==========================================
function initPhotoUpload() {
  const trigger = document.getElementById('avatarUploadTrigger');
  const fileInput = document.getElementById('userPhotoInput');
  const avatarImg = document.getElementById('userAvatarImg');
  const syncedAvatars = document.querySelectorAll('.synced-avatar');

  // Load persisted photo if exists in localStorage (custom upload), otherwise use profile.jpg
  const savedPhoto = localStorage.getItem('cyberin_user_photo');
  if (savedPhoto && avatarImg && !savedPhoto.includes('unsplash')) {
    avatarImg.src = savedPhoto;
    syncedAvatars.forEach(img => img.src = savedPhoto);
  } else if (avatarImg) {
    avatarImg.src = './profile.jpg';
    syncedAvatars.forEach(img => img.src = './profile.jpg');
  }

  if (trigger && fileInput) {
    trigger.addEventListener('click', () => {
      cyberAudio.playCyberClick();
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        avatarImg.src = dataUrl;
        syncedAvatars.forEach(img => img.src = dataUrl);
        try {
          localStorage.setItem('cyberin_user_photo', dataUrl);
        } catch (err) {
          // If image is larger than 5MB localStorage limit
        }
        cyberAudio.playHackerSuccess();
        showToast("Rasm muvaffaqiyatli o'rnatildi! 📸");
      };
      reader.readAsDataURL(file);
    });
  }
}

// ==========================================
// 8. DIRECT TELEGRAM QUICK MESSAGE FORM
// ==========================================
function initQuickMessageForm() {
  const sendBtn = document.getElementById('sendDirectMsgBtn');
  const senderInput = document.getElementById('quickMsgSender');
  const msgInput = document.getElementById('quickMsgText');

  if (sendBtn && senderInput && msgInput) {
    sendBtn.addEventListener('click', () => {
      const sender = senderInput.value.trim();
      const text = msgInput.value.trim();

      if (!text) {
        showToast("Iltimos, xabar matnini yozing!");
        return;
      }

      cyberAudio.playHackerSuccess();
      const formattedMessage = `Assalomu alaykum Senior Dasturchi!%0A%0A👤 Kimdan: ${encodeURIComponent(sender || "Noma'lum mijoz")}%0A📝 Xabar: ${encodeURIComponent(text)}`;
      const tgUrl = `https://t.me/ud2402?text=${formattedMessage}`;
      
      showToast("Telegramga yo'naltirilmoqda... ✈️");
      setTimeout(() => {
        window.open(tgUrl, '_blank');
      }, 500);
    });
  }
}

// ==========================================
// 9. LINKEDIN POST MODAL
// ==========================================
function initPostModal() {
  const openBtn = document.getElementById('openPostModal');
  const modal = document.getElementById('postModal');
  const closeBtn = document.getElementById('closePostModal');
  const publishBtn = document.getElementById('publishPostBtn');
  const postText = document.getElementById('modalPostText');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      cyberAudio.playCyberClick();
      modal.classList.add('active');
      if (postText) postText.focus();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      cyberAudio.playCyberClick();
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (publishBtn && postText) {
    publishBtn.addEventListener('click', () => {
      const content = postText.value.trim();
      if (!content) {
        showToast("Iltimos, post matnini kiriting!");
        return;
      }

      cyberAudio.playHackerSuccess();
      modal.classList.remove('active');
      postText.value = '';
      showToast("Yangi fikr / post muvaffaqiyatli chop etildi! 🚀");
    });
  }
}

// ==========================================
// 10. GLOBAL SEARCH FILTER (Kali Codes & Projects)
// ==========================================
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const kaliItems = document.querySelectorAll('.kali-cmd-item');
    const projectItems = document.querySelectorAll('.project-item-3d');

    kaliItems.forEach(item => {
      const code = item.getAttribute('data-code').toLowerCase();
      const desc = (item.getAttribute('data-desc') || '').toLowerCase();
      const title = item.querySelector('.cmd-tool-name').textContent.toLowerCase();

      if (code.includes(query) || desc.includes(query) || title.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    projectItems.forEach(proj => {
      const text = proj.textContent.toLowerCase();
      if (text.includes(query)) {
        proj.style.display = 'block';
      } else {
        proj.style.display = 'none';
      }
    });
  });

  // Hotkey Ctrl + K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
      cyberAudio.playCyberClick();
    }
  });
}

// ==========================================
// 11. AUDIO & MATRIX TOGGLES
// ==========================================
function initToggles() {
  const soundBtn = document.getElementById('soundToggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      cyberAudio.enabled = !cyberAudio.enabled;
      const icon = soundBtn.querySelector('i');
      if (cyberAudio.enabled) {
        icon.className = 'fa-solid fa-volume-high';
        cyberAudio.playCyberClick();
        showToast("Ovoz effektlari yoqildi 🔊");
      } else {
        icon.className = 'fa-solid fa-volume-xmark';
        showToast("Ovoz effektlari o'chirildi 🔇");
      }
    });
  }

  const matrixBtn = document.getElementById('matrixRainToggle');
  if (matrixBtn) {
    matrixBtn.addEventListener('click', () => {
      cyberAudio.playCyberClick();
      const grid = document.querySelector('.cyber-grid-overlay');
      if (grid) {
        grid.style.display = grid.style.display === 'none' ? 'block' : 'none';
        showToast("Matritsa to'ri holati o'zgartirildi ⚡");
      }
    });
  }
}

// ===================================================================
// 12. DYNAMIC REAL-TIME PROFILE VIEWS COUNTER
// (Har bir odam ko'rganda, telefon va noutbukdan kirganda global oshadi)
// ===================================================================
async function initDailyViewsCounter() {
  const viewsEl = document.getElementById('profileViewsCount');
  const badgeEl = document.getElementById('dailyViewsBadge');
  if (!viewsEl) return;

  let totalViews = 4180;

  try {
    const res = await fetch('/api/views');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.views === 'number') {
        totalViews = data.views;
      }
    } else {
      totalViews = incrementLocalCounter();
    }
  } catch (e) {
    totalViews = incrementLocalCounter();
  }

  if (badgeEl) {
    badgeEl.textContent = "+1 yangi ko'rish";
    badgeEl.title = "Har bir ochilganda barcha qurilmalarda avtomatik oshadi";
  }

  animateCounter(viewsEl, totalViews - 1, totalViews, 1200);
}

function incrementLocalCounter() {
  let count = parseInt(localStorage.getItem('cyberin_global_views') || '4180', 10);
  count += 1;
  localStorage.setItem('cyberin_global_views', count.toString());
  return count;
}

function animateCounter(element, start, end, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    element.textContent = current.toLocaleString('en-US');
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString('en-US');
    }
  }
  requestAnimationFrame(step);
}

// ===================================================================
// 13. IPHONE LIQUID MENU DOCK CONTROLS & POPUP HUD
// (Menyudan menyuga o'tganda qalqib chiquvchi oyna)
// ===================================================================
const menuSectionInfo = {
  "feed-section": {
    title: "Asosiy Sahifa",
    subtitle: "Senior Dasturchi profili va umumiy ma'lumotlar",
    icon: "fa-solid fa-house-chimney"
  },
  "kali-section": {
    title: "Kali Linux Kodlari",
    subtitle: "10 ta mashhur buyruq va jonli terminal",
    icon: "fa-solid fa-terminal"
  },
  "projects-section": {
    title: "Senior Loyihalar",
    subtitle: "Yuqori yuklamali FinTech va kiberxavfsizlik arxitekturasi",
    icon: "fa-solid fa-cube"
  },
  "experience-section": {
    title: "Kasbiy Tajriba",
    subtitle: "Lead Software & Security Architect faoliyati",
    icon: "fa-solid fa-briefcase"
  },
  "contact-section": {
    title: "Aloqa Markazi",
    subtitle: "Telefonlar: +998 95 068 02 24 | Telegram & Instagram",
    icon: "fa-solid fa-paper-plane"
  }
};

let hudTimeout = null;

function showSectionHUD(targetKey) {
  const hud = document.getElementById('menuPopupHUD');
  const titleEl = document.getElementById('menuPopupTitle');
  const subEl = document.getElementById('menuPopupSubtitle');
  const iconEl = document.getElementById('menuPopupIcon');
  if (!hud) return;

  const info = menuSectionInfo[targetKey] || {
    title: "Bo'lim yuklandi",
    subtitle: "Muvaffaqiyatli o'tildi",
    icon: "fa-solid fa-compass"
  };

  if (titleEl) titleEl.textContent = info.title;
  if (subEl) subEl.textContent = info.subtitle;
  if (iconEl) iconEl.innerHTML = `<i class="${info.icon}"></i>`;

  hud.classList.add('active');

  if (hudTimeout) clearTimeout(hudTimeout);
  hudTimeout = setTimeout(() => {
    hud.classList.remove('active');
  }, 2800);
}

function initLiquidNav() {
  const navItems = document.querySelectorAll('.nav-item-3d');
  const closeBtn = document.getElementById('menuPopupCloseBtn');
  const hud = document.getElementById('menuPopupHUD');

  if (closeBtn && hud) {
    closeBtn.addEventListener('click', () => {
      hud.classList.remove('active');
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const targetKey = item.getAttribute('data-target') || '';
      cyberAudio.playHackerSuccess();
      showSectionHUD(targetKey);
    });
  });
}

// ==========================================
// INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeCyberBackground();
  init3DTiltCards();
  initKaliTerminal();
  initCyberRobots();
  initPhotoUpload();
  initQuickMessageForm();
  initPostModal();
  initGlobalSearch();
  initToggles();
  initDailyViewsCounter();
  initLiquidNav();
});

