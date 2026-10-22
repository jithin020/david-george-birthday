/* ════════════════════════════════════════════════════
   DAVID GEORGE · FIRST BIRTHDAY — script.js
   Antigravity
════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. PRELOADER
───────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('preloader');
    loader.classList.add('gone');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    initParticles();
  }, 1900);
});


/* ─────────────────────────────────────────
   2. NAVBAR SCROLL EFFECT
───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });


/* ─────────────────────────────────────────
   3. SCROLL REVEAL ANIMATION
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────
   4. PARTICLE CANVAS (Gold Stars)
───────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const GLYPHS = ['✦', '✧', '⋆', '·', '✦', '⋆'];
  const COUNT = 60;

  const particles = Array.from({ length: COUNT }, () => mkParticle(true));

  function mkParticle(randomY = false) {
    return {
      x:      Math.random() * (W || 1200),
      y:      randomY ? Math.random() * (H || 800) : (H || 800) + 20,
      size:   Math.random() * 11 + 4,
      glyph:  GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      alpha:  Math.random() * 0.35 + 0.05,
      drift:  (Math.random() - 0.5) * 0.35,
      rise:   Math.random() * 0.45 + 0.12,
      phase:  Math.random() * Math.PI * 2,
      speed:  0.018 + Math.random() * 0.018,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.phase += p.speed;
      const alpha = p.alpha * (0.55 + 0.45 * Math.sin(p.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#C8973F';
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.glyph, p.x, p.y);

      p.x += p.drift + Math.sin(p.phase * 0.5) * 0.2;
      p.y -= p.rise;

      if (p.y < -20 || p.x < -40 || p.x > W + 40) {
        Object.assign(p, mkParticle(false));
        p.x = Math.random() * W;
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}


/* ─────────────────────────────────────────
   5. COUNTDOWN TIMER  (25 Oct 2026, 12:00)
───────────────────────────────────────── */
const EVENT_DATE = new Date('2026-10-25T12:00:00');

const elD = document.getElementById('d');
const elH = document.getElementById('h');
const elM = document.getElementById('m');
const elS = document.getElementById('s');

function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function animateFlip(el, newVal) {
  if (el.textContent === newVal) return;
  el.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
  el.style.transform  = 'translateY(-6px)';
  el.style.opacity    = '0';
  setTimeout(() => {
    el.textContent    = newVal;
    el.style.transform = 'translateY(6px)';
    setTimeout(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity   = '1';
    }, 30);
  }, 250);
}

function updateClock() {
  const diff = EVENT_DATE - new Date();
  if (diff <= 0) {
    [elD, elH, elM, elS].forEach(el => { el.textContent = '00'; });
    return;
  }
  animateFlip(elD, pad(Math.floor(diff / 86400000)));
  animateFlip(elH, pad(Math.floor((diff % 86400000) / 3600000)));
  animateFlip(elM, pad(Math.floor((diff % 3600000) / 60000)));
  animateFlip(elS, pad(Math.floor((diff % 60000) / 1000)));
}
updateClock();
setInterval(updateClock, 1000);


/* ─────────────────────────────────────────
   6. RSVP MODAL
───────────────────────────────────────── */
const modal    = document.getElementById('rsvpModal');
const backdrop = document.getElementById('rsvpBackdrop');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus first field
  setTimeout(() => { document.getElementById('guestName').focus(); }, 400);
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

['openRsvp', 'navRsvp', 'openRsvp2'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
});

document.getElementById('closeRsvp').addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ─────────────────────────────────────────
   7. RSVP FORM → WhatsApp
───────────────────────────────────────── */
document.getElementById('rsvpForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = document.getElementById('guestName').value.trim();
  const response = document.getElementById('guestResponse').value;
  const guests   = document.getElementById('guestCount').value;
  const note     = document.getElementById('guestMessage').value.trim();

  const responseLabel = {
    attending: 'Joyfully attending 🎉',
    unable:    'Unable to attend',
    maybe:     'Not sure yet',
  }[response] || response;

  const msg =
`🎂 *David George's First Birthday — RSVP*

👤 *Name:* ${name}
✅ *Response:* ${responseLabel}
👥 *Guests:* ${guests} guest${guests === '1' ? '' : 's'}
📅 *Date:* Sunday, 25 October 2026 · 12:00 PM
📍 *Venue:* Hotel Grand Courtyard, Pala${note ? `\n\n💌 *Note:* ${note}` : ''}

_Sent from David George's birthday website_ 🌟`;

  window.open(
    `https://wa.me/918848020524?text=${encodeURIComponent(msg)}`,
    '_blank', 'noopener'
  );

  // Brief confirmation effect
  const btn = e.target.querySelector('.modal-btn');
  const orig = btn.textContent;
  btn.textContent = '✓ OPENING WHATSAPP…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
    closeModal();
    e.target.reset();
  }, 2200);
});


/* ─────────────────────────────────────────
   8. ADD TO CALENDAR (.ics download)
───────────────────────────────────────── */
document.getElementById('addCalendar').addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//David George First Birthday//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:davidgeorge-bday-2026@birthday',
    'DTSTART:20261025T120000',
    'DTEND:20261025T160000',
    'SUMMARY:🎂 David George\'s First Birthday!',
    'DESCRIPTION:Join us to celebrate David George\'s First Birthday!\\n' +
      'Parents: Jithin Jose & Dona Maria Saju\\n' +
      'Jeremiah 1:5 – Before I formed you in the womb I knew you.',
    'LOCATION:Hotel Grand Courtyard\\, Pala\\, Kerala',
    'GEO:9.7096471;76.6771547',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: David George\'s Birthday is tomorrow! 🎈',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'david-george-birthday.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


/* ─────────────────────────────────────────
   9. BACKGROUND MUSIC  (Web Audio — Happy Birthday)
───────────────────────────────────────── */
class BirthdayMelody {
  constructor() {
    this.actx        = null;
    this.master      = null;
    this.playing     = false;
    this.noteIdx     = 0;
    this.nextNoteAt  = 0;
    this.timerId     = null;
    this.bpm         = 72;
    this.beat        = 60 / this.bpm;     // seconds per beat
    this.lookahead   = 0.12;              // how far ahead to schedule (s)
    this.interval    = 28;               // scheduler tick (ms)

    // Happy Birthday melody: [frequency Hz, duration in beats]
    // 0 Hz = rest
    this.melody = [
      [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [523.25, 1.0], [493.88, 2.0],
      [0, 0.5],
      [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [587.33, 1.0], [523.25, 2.0],
      [0, 0.5],
      [392.00, 0.75], [392.00, 0.25], [784.00, 1.0], [659.25, 1.0], [523.25, 1.0], [493.88, 1.0], [440.00, 2.0],
      [0, 0.5],
      [698.46, 0.75], [698.46, 0.25], [659.25, 1.0], [523.25, 1.0], [587.33, 1.0], [523.25, 2.0],
      [0, 3.0],
    ];
  }

  _init() {
    this.actx   = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.actx.createGain();
    this.master.gain.value = 0.07;
    this.master.connect(this.actx.destination);
  }

  _scheduleNote(freq, when, dur) {
    if (freq === 0) return;
    const osc  = this.actx.createOscillator();
    const gain = this.actx.createGain();
    osc.connect(gain);
    gain.connect(this.master);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(1.0, when + 0.06);
    gain.gain.linearRampToValueAtTime(0.65, when + dur * 0.5);
    gain.gain.linearRampToValueAtTime(0, when + dur - 0.05);
    osc.start(when);
    osc.stop(when + dur);
  }

  _scheduler() {
    while (this.nextNoteAt < this.actx.currentTime + this.lookahead) {
      const [freq, beats] = this.melody[this.noteIdx];
      const dur = beats * this.beat;
      this._scheduleNote(freq, this.nextNoteAt, dur);
      this.nextNoteAt += dur;
      this.noteIdx = (this.noteIdx + 1) % this.melody.length;
    }
    this.timerId = setTimeout(() => this._scheduler(), this.interval);
  }

  start() {
    if (!this.actx) this._init();
    if (this.actx.state === 'suspended') this.actx.resume();
    this.playing    = true;
    this.noteIdx    = 0;
    this.nextNoteAt = this.actx.currentTime + 0.1;
    this._scheduler();
  }

  stop() {
    this.playing = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (this.master) {
      this.master.gain.linearRampToValueAtTime(0, this.actx.currentTime + 0.4);
      setTimeout(() => this.actx && this.actx.suspend(), 450);
    }
  }

  toggle() {
    if (this.playing) { this.stop(); return false; }
    else              { this.start(); return true;  }
  }
}

const melody   = new BirthdayMelody();
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

musicBtn.addEventListener('click', () => {
  const isPlaying = melody.toggle();
  musicBtn.classList.toggle('playing', isPlaying);
  musicIcon.textContent = isPlaying ? '♫' : '♪';
});
