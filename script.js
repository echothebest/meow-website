function initStarfield(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((w * h) / 8000);
    for(let i = 0; i < count; i++){
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);
  function tick(){
    ctx.clearRect(0, 0, w, h);
    for(const s of stars){
      s.x += s.vx; s.y += s.vy;
      if(s.x < 0) s.x = w; if(s.x > w) s.x = 0;
      if(s.y < 0) s.y = h; if(s.y > h) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,182,217,${s.a})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

function playIntro(){
  const overlay = document.getElementById('intro-overlay');
  const body = document.getElementById('terminal-body');
  const skip = document.getElementById('skip-intro');
  if(!overlay || !body) return;

  if(sessionStorage.getItem('meow-intro-played') === '1'){
    overlay.remove();
    document.body.style.overflow = '';
    return;
  }

  const lines = [
    'loading the meow client...',
    'loading',
    'starting...',
    'client loaded.',
    'print(hi user.)',
    'hi user.'
  ];
  const CHAR_MS = 35;
  const LINE_PAUSE = 150;
  const OK_PAUSE = 250;
  let i = 0;
  let skipped = false;

  function typeLine(text, cb){
    const lineEl = document.createElement('div');
    lineEl.className = 'line';
    const textSpan = document.createElement('span');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '\u00A0';
    lineEl.appendChild(textSpan);
    lineEl.appendChild(cursor);
    body.appendChild(lineEl);

    let pos = 0;
    const interval = setInterval(() => {
      if(skipped){ clearInterval(interval); return; }
      textSpan.textContent += text[pos++];
      if(pos >= text.length){
        clearInterval(interval);
        cursor.remove();
        const ok = document.createElement('span');
        ok.className = 'ok';
        ok.textContent = '[ OK ]';
        lineEl.appendChild(ok);
        setTimeout(cb, LINE_PAUSE);
      }
    }, CHAR_MS);
  }

  function next(){
    if(skipped){ finish(); return; }
    if(i >= lines.length){ setTimeout(finish, OK_PAUSE); return; }
    typeLine(lines[i++], next);
  }

  function finish(){
    sessionStorage.setItem('meow-intro-played', '1');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    let n = 0;
    const gl = setInterval(() => {
      overlay.style.filter = n % 2 ? 'hue-rotate(15deg) contrast(1.4)' : 'none';
      if(++n > 4){
        clearInterval(gl);
        overlay.style.filter = 'none';
        setTimeout(() => overlay.remove(), 500);
      }
    }, 60);
  }

  skip.addEventListener('click', e => {
    e.preventDefault();
    skipped = true;
    finish();
  });

  document.body.style.overflow = 'hidden';
  next();
}

function initNav(){
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

function initReveal(){
  const els = document.querySelectorAll('.card, .section-title');
  if(!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNav();
  initReveal();
  if(document.getElementById('intro-overlay')) playIntro();
});