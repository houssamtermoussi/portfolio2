const STORAGE_KEY = 'portfolio-lang';

export const translations = {
  fr: {
    meta: {
      title: 'Houssam Termoussi — Développeur logiciel',
      description:
        'Portfolio de Houssam Termoussi, développeur logiciel : PHP, Laravel, Python, Go, Vue.js, React, Next.js, Flutter.',
    },
    nav: {
      home: 'Accueil',
      about: 'À propos',
      stack: 'Stack',
      projects: 'Projets',
      contact: 'Contact',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    hero: {
      tag: 'DISPONIBLE POUR DE NOUVEAUX PROJETS',
      desc: 'Je conçois et développe des applications web & mobiles robustes, du back-end jusqu’au dernier pixel.',
      ctaProjects: 'Voir mes projets',
      ctaContact: 'Me contacter',
      scroll: 'SCROLL',
      player: 'PLAYER 1 — READY',
    },
    about: {
      title: 'À propos',
      p1: 'Salut ! Moi c’est <strong>Houssam Termoussi</strong>, <mark>développeur logiciel</mark> passionné par la construction de produits numériques.',
      p2: 'Côté back-end je travaille avec <strong>PHP / Laravel</strong>, <strong>Python</strong> et <strong>Go</strong> ; côté front avec <strong>Vue.js</strong>, <strong>React</strong>, <strong>Next.js</strong> et <strong>Svelte</strong>. Je développe aussi des applications mobiles avec <strong>Flutter</strong> et <strong>React Native</strong>.',
      p3: 'Je vis dans le terminal sous <strong>Linux</strong>, je versionne tout avec <strong>Git</strong>, et je choisis la bonne base de données selon le besoin : <strong>MySQL</strong>, <strong>MongoDB</strong> ou <strong>PostgreSQL</strong>.',
      statTech: 'technologies',
      statPlatforms: 'plateformes : web, mobile, API',
      termRole: 'software developer — full-stack & mobile',
      termUptime: 'toujours en train d’apprendre',
    },
    stack: {
      title: 'Stack',
      hint: '↻ GLISSE POUR TOURNER',
    },
    projects: {
      title: 'Projets',
    },
    contact: {
      title: 'Contact',
      big: 'UN PROJET ?<br /><span>PARLONS-EN.</span>',
    },
    footer: {
      top: '▲ HAUT',
      coin: 'INSERT COIN TO CONTINUE',
    },
    skills: {
      backend: 'Backend',
      frontend: 'Frontend',
      mobile: 'Mobile',
      databases: 'Bases de données',
      tools: 'Outils & OS',
    },
    roles: [
      'développeur logiciel',
      'artisan laravel',
      'builder react & vue',
      'codeur go & python',
      'dev mobile flutter',
      'amateur de linux',
    ],
    projectItems: [
      {
        type: 'Gestion opticien',
        desc: 'Application de gestion pour opticien : clients, ordonnances, stock de montures et verres, ventes et facturation.',
      },
      {
        type: 'Chat temps réel',
        desc: 'Application de chat en temps réel : salons, messages privés et présence des utilisateurs en direct.',
      },
      {
        type: 'Réservation cinéma',
        desc: 'Plateforme de réservation de places de cinéma : séances, choix des sièges sur plan de salle et billets.',
      },
      {
        type: 'App mobile',
        desc: 'Application mobile de gestion du temps et de projets : tâches, suivi du temps passé et planning.',
      },
    ],
  },
  en: {
    meta: {
      title: 'Houssam Termoussi — Software Developer',
      description:
        'Portfolio of Houssam Termoussi, software developer: PHP, Laravel, Python, Go, Vue.js, React, Next.js, Flutter.',
    },
    nav: {
      home: 'Home',
      about: 'About',
      stack: 'Stack',
      projects: 'Projects',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      tag: 'AVAILABLE FOR NEW PROJECTS',
      desc: 'I design and build robust web & mobile applications, from the back-end to the last pixel.',
      ctaProjects: 'View my projects',
      ctaContact: 'Get in touch',
      scroll: 'SCROLL',
      player: 'PLAYER 1 — READY',
    },
    about: {
      title: 'About',
      p1: 'Hi! I’m <strong>Houssam Termoussi</strong>, a <mark>software developer</mark> passionate about building digital products.',
      p2: 'On the back-end I work with <strong>PHP / Laravel</strong>, <strong>Python</strong> and <strong>Go</strong>; on the front with <strong>Vue.js</strong>, <strong>React</strong>, <strong>Next.js</strong> and <strong>Svelte</strong>. I also build mobile apps with <strong>Flutter</strong> and <strong>React Native</strong>.',
      p3: 'I live in the terminal on <strong>Linux</strong>, version everything with <strong>Git</strong>, and pick the right database for the job: <strong>MySQL</strong>, <strong>MongoDB</strong> or <strong>PostgreSQL</strong>.',
      statTech: 'technologies',
      statPlatforms: 'platforms: web, mobile, API',
      termRole: 'software developer — full-stack & mobile',
      termUptime: 'always learning',
    },
    stack: {
      title: 'Stack',
      hint: '↻ DRAG TO ROTATE',
    },
    projects: {
      title: 'Projects',
    },
    contact: {
      title: 'Contact',
      big: 'GOT A PROJECT?<br /><span>LET’S TALK.</span>',
    },
    footer: {
      top: '▲ TOP',
      coin: 'INSERT COIN TO CONTINUE',
    },
    skills: {
      backend: 'Backend',
      frontend: 'Frontend',
      mobile: 'Mobile',
      databases: 'Databases',
      tools: 'Tools & OS',
    },
    roles: [
      'software developer',
      'laravel artisan',
      'react & vue builder',
      'go & python coder',
      'flutter mobile dev',
      'linux enjoyer',
    ],
    projectItems: [
      {
        type: 'Optician management',
        desc: 'Management app for opticians: clients, prescriptions, frame and lens inventory, sales and invoicing.',
      },
      {
        type: 'Real-time chat',
        desc: 'Real-time chat application: rooms, private messages and live user presence.',
      },
      {
        type: 'Cinema booking',
        desc: 'Cinema seat booking platform: showtimes, seat selection on a floor plan, and tickets.',
      },
      {
        type: 'Mobile app',
        desc: 'Mobile time and project management app: tasks, time tracking and planning.',
      },
    ],
  },
};

export function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'fr' || saved === 'en') return saved;
  return 'en';
}

export function getT(lang) {
  return translations[lang] || translations.en;
}

export function setStoredLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}
