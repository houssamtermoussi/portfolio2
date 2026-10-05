import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile, skillGroups, projects, contacts } from './data.js';
import { createHeroScene } from './scenes/hero.js';
import { createSkillsSphere } from './scenes/skills.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const allSkills = skillGroups.flatMap((g) => g.items.map((i) => i.name));

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function renderMarquee() {
  const items = allSkills.map((s) => `<span>${escapeHtml(s.toUpperCase())}</span><span class="star">✦</span>`).join('');
  document.getElementById('marquee').innerHTML = items + items;
}

function renderSkillGroups() {
  document.getElementById('stack-groups').innerHTML = skillGroups
    .map(
      (group) => `
      <div class="group" data-reveal>
        <h3 class="group__title">${escapeHtml(group.title)}</h3>
        <ul class="chips">
          ${group.items
            .map(
              (item) => `
            <li class="chip">
              <img src="https://cdn.simpleicons.org/${item.icon}/531069" alt="" width="18" height="18" loading="lazy" />
              ${escapeHtml(item.name)}
            </li>`,
            )
            .join('')}
        </ul>
      </div>`,
    )
    .join('');
}

function renderProjects() {
  document.getElementById('projects-grid').innerHTML = projects
    .map(
      (p, i) => `
      <article class="project" data-reveal>
        <div class="win project__inner" data-tilt>
          <div class="win__bar">
            <span>project_${String(i + 1).padStart(2, '0')}.exe</span>
            <div class="win__btns"><i></i><i></i><i></i></div>
          </div>
          <div class="project__screen">
            <span class="project__sun"></span>
            <span class="project__index">${String(i + 1).padStart(2, '0')}</span>
            <span class="project__type">${escapeHtml(p.type)}</span>
          </div>
          <div class="win__body">
            <h3 class="project__title">${escapeHtml(p.title)}</h3>
            <p class="project__desc">${escapeHtml(p.desc)}</p>
            <ul class="tags">${p.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
          </div>
        </div>
      </article>`,
    )
    .join('');
}

function renderContacts() {
  document.getElementById('contact-links').innerHTML = contacts
    .map(
      (c) => `
      <li>
        <a href="${escapeHtml(c.href)}" ${c.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
          <span class="k">${escapeHtml(c.label)}</span>→ ${escapeHtml(c.value)}
        </a>
      </li>`,
    )
    .join('');
}

function splitChars() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map((ch) => `<span class="char" aria-hidden="true">${ch}</span>`).join('');
  });
}

function runLoader() {
  const loader = document.getElementById('loader');
  const done = () => {
    loader.remove();
    document.body.classList.remove('is-loading');
  };

  if (reduceMotion) {
    done();
    return Promise.resolve();
  }

  const linesEl = loader.querySelector('.loader__lines');
  const bar = loader.querySelector('.loader__bar');
  const pct = loader.querySelector('[data-pct]');
  const blocks = Array.from({ length: 20 }, () => bar.appendChild(document.createElement('span')));
  const lines = [
    'HT-BIOS v2.6  (C) 2026 HOUSSAM TERMOUSSI',
    'MEMORY TEST ................ 640K OK',
    'LOADING BACKEND  : PHP LARAVEL PYTHON GO',
    'LOADING FRONTEND : VUE REACT NEXT TAILWIND',
    'MOUNTING /dev/flutter /dev/linux ...... OK',
    'STARTING 3D ENGINE .......... OK',
    'WELCOME, VISITOR.',
  ];

  return new Promise((resolve) => {
    const progress = { v: 0 };
    const tl = gsap.timeline();
    lines.forEach((line, i) => {
      tl.call(() => (linesEl.textContent += `${i ? '\n' : ''}> ${line}`), null, i * 0.26);
    });
    tl.to(
      progress,
      {
        v: 100,
        duration: lines.length * 0.26,
        ease: 'none',
        onUpdate() {
          const v = Math.round(progress.v);
          pct.textContent = `${v}%`;
          const on = Math.round((v / 100) * blocks.length);
          blocks.forEach((b, i) => b.classList.toggle('on', i < on));
        },
      },
      0,
    );
    tl.to(loader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.7,
      ease: 'steps(8)',
      delay: 0.25,
      onStart: resolve,
      onComplete: done,
    });
  });
}

function playIntro(hero) {
  gsap.to(hero.state, { intro: 1, duration: reduceMotion ? 0 : 2.4, ease: 'power2.out' });
  if (reduceMotion) return;

  gsap
    .timeline({ delay: 0.2 })
    .from('.hero__tag', { y: -20, opacity: 0, duration: 0.5, ease: 'steps(5)' })
    .fromTo(
      '.hero__line .char',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'steps(5)', stagger: 0.045 },
      '-=0.2',
    )
    .from('.hero__role', { x: -30, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('.hero__desc', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('.hero__cta .btn', { y: 20, opacity: 0, duration: 0.4, ease: 'steps(4)', stagger: 0.1 }, '-=0.2')
    .from('.hero__hud > *', { opacity: 0, duration: 0.4, stagger: 0.1 }, '-=0.2');
}

function setupTyping() {
  const el = document.getElementById('typed');
  const words = profile.roles;
  let w = 0;
  let c = words[0].length;
  let deleting = false;

  const step = () => {
    const word = words[w];
    if (!deleting && c < word.length) {
      el.textContent = word.slice(0, ++c);
      setTimeout(step, 75);
    } else if (!deleting) {
      deleting = true;
      setTimeout(step, 1800);
    } else if (c > 0) {
      el.textContent = word.slice(0, --c);
      setTimeout(step, 35);
    } else {
      deleting = false;
      w = (w + 1) % words.length;
      setTimeout(step, 300);
    }
  };
  setTimeout(step, 3500);
}

function setupScrollEffects(hero) {
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => (hero.state.scroll = self.progress),
  });

  if (reduceMotion) return;

  gsap.to('.hero__content', {
    yPercent: -25,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.utils.toArray('.section__title').forEach((title) => {
    gsap.from(title, {
      x: -60,
      opacity: 0,
      duration: 0.6,
      ease: 'steps(6)',
      scrollTrigger: { trigger: title, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const pop = el.dataset.reveal === 'pop';
    gsap.from(el, {
      ...(pop ? { scale: 0.85, ease: 'steps(5)', duration: 0.5 } : { y: 50, ease: 'power3.out', duration: 0.8 }),
      opacity: 0,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.utils.toArray('.chips').forEach((list) => {
    gsap.from(list.children, {
      y: 14,
      opacity: 0,
      duration: 0.3,
      ease: 'steps(3)',
      stagger: 0.06,
      scrollTrigger: { trigger: list, start: 'top 90%' },
    });
  });

  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => (el.textContent = Math.round(obj.v)),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

function setupNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

  document.querySelectorAll('[data-link]').forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });
}

function setupTilt() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translate(-4px, -4px)`;
    });
    card.addEventListener('pointerleave', () => (card.style.transform = ''));
  });
}

renderMarquee();
renderSkillGroups();
renderProjects();
renderContacts();
splitChars();
document.getElementById('year').textContent = new Date().getFullYear();

const hero = createHeroScene(document.getElementById('hero-canvas'), { reduceMotion });
createSkillsSphere(document.getElementById('skills-canvas'), allSkills);

setupNav();
setupTilt();
setupScrollEffects(hero);
setupTyping();

runLoader().then(() => playIntro(hero));
