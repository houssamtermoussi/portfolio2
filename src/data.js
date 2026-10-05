export const profile = {
  firstName: 'Houssam',
  lastName: 'Termoussi',
  role: 'Software Developer',
  roles: [
    'software developer',
    'laravel artisan',
    'react & vue builder',
    'go & python coder',
    'flutter mobile dev',
    'linux enjoyer',
  ],
};

// Icônes : slugs de https://simpleicons.org
export const skillGroups = [
  {
    title: 'Backend',
    items: [
      { name: 'PHP', icon: 'php' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Python', icon: 'python' },
      { name: 'Go', icon: 'go' },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'Vue.js', icon: 'vuedotjs' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextdotjs' },
      { name: 'Tailwind', icon: 'tailwindcss' },
    ],
  },
  {
    title: 'Mobile',
    items: [{ name: 'Flutter', icon: 'flutter' }],
  },
  {
    title: 'Bases de données',
    items: [
      { name: 'Supabase', icon: 'supabase' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'MySQL', icon: 'mysql' },
    ],
  },
  {
    title: 'Outils & OS',
    items: [
      { name: 'Linux', icon: 'linux' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
    ],
  },
];

// Projets d'exemple : remplace-les par tes vrais projets
export const projects = [
  {
    title: 'Opticia',
    type: 'Gestion opticien',
    desc: 'Application de gestion pour opticien : clients, ordonnances, stock de montures et verres, ventes et facturation.',
    tags: ['Laravel', 'React', 'MySQL', 'Tailwind'],
  },
  {
    title: 'GoChat',
    type: 'Chat temps réel',
    desc: 'Application de chat en temps réel : salons, messages privés et présence des utilisateurs en direct.',
    tags: ['Go', 'WebSocket'],
  },
  {
    title: 'CineSeat',
    type: 'Réservation cinéma',
    desc: 'Plateforme de réservation de places de cinéma : séances, choix des sièges sur plan de salle et billets.',
    tags: ['Laravel', 'Vue.js', 'PostgreSQL', 'Tailwind'],
  },
  {
    title: 'TimeFlow',
    type: 'App mobile',
    desc: 'Application mobile de gestion du temps et de projets : tâches, suivi du temps passé et planning.',
    tags: ['Flutter'],
  },
];

// Remplace par tes vrais liens
export const contacts = [
  { label: 'email', value: 'houssamtermoussi@gmail.com', href: 'mailto:houssamtermoussi@gmail.com' },
  { label: 'github', value: 'github.com/houssamtermoussi', href: 'https://github.com/houssamtermoussi' },
  { label: 'linkedin', value: 'linkedin.com/in/houssamtermoussi', href: 'https://www.linkedin.com/in/houssamtermoussi' },
];
