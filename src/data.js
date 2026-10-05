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
    title: 'ShopCraft',
    type: 'E-commerce',
    desc: 'Plateforme e-commerce complète : catalogue, panier, paiement en ligne et back-office d’administration.',
    tags: ['Laravel', 'Vue.js', 'MySQL', 'Tailwind'],
    demo: '#',
    repo: '#',
  },
  {
    title: 'PulseBoard',
    type: 'Dashboard SaaS',
    desc: 'Dashboard temps réel avec authentification, analytics et gestion d’équipes.',
    tags: ['Next.js', 'React', 'Supabase', 'Tailwind'],
    demo: '#',
    repo: '#',
  },
  {
    title: 'GoTrack API',
    type: 'API / Microservice',
    desc: 'API REST haute performance pour le suivi de livraisons, avec workers concurrents.',
    tags: ['Go', 'MongoDB', 'Linux'],
    demo: '#',
    repo: '#',
  },
  {
    title: 'FitPixel',
    type: 'App mobile',
    desc: 'Application mobile cross-platform de suivi sportif avec synchronisation cloud.',
    tags: ['Flutter', 'Supabase', 'Python'],
    demo: '#',
    repo: '#',
  },
];

// Remplace par tes vrais liens
export const contacts = [
  { label: 'email', value: 'houssamtermoussi@gmail.com', href: 'mailto:houssamtermoussi@gmail.com' },
  { label: 'github', value: 'github.com/houssamtermoussi', href: 'https://github.com/houssamtermoussi' },
  { label: 'linkedin', value: 'linkedin.com/in/houssamtermoussi', href: 'https://www.linkedin.com/in/houssamtermoussi' },
];
