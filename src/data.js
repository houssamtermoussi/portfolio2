export const profile = {
  firstName: 'Houssam',
  lastName: 'Termoussi',
  role: 'Software Developer',
};

// Icônes : slugs de https://simpleicons.org
export const skillGroups = [
  {
    key: 'backend',
    items: [
      { name: 'PHP', icon: 'php' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Python', icon: 'python' },
      { name: 'Go', icon: 'go' },
      { name: 'Rust', icon: 'rust' },
    ],
  },
  {
    key: 'frontend',
    items: [
      { name: 'Vue.js', icon: 'vuedotjs' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextdotjs' },
      { name: 'Svelte', icon: 'svelte' },
    ],
  },
  {
    key: 'mobile',
    items: [
      { name: 'Flutter', icon: 'flutter' },
      { name: 'React Native', icon: 'react' },
    ],
  },
  {
    key: 'databases',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'MySQL', icon: 'mysql' },
    ],
  },
  {
    key: 'tools',
    items: [
      { name: 'Linux', icon: 'linux' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Docker', icon: 'docker' },
    ],
  },
];

export const projects = [
  {
    title: 'Optika soft',
    tags: ['Laravel', 'React', 'MySQL', 'Svelte'],
  },
  {
    title: 'GoChat',
    tags: ['Go', 'WebSocket'],
  },
  {
    title: 'H-Cinema',
    tags: ['Laravel', 'Vue.js', 'PostgreSQL', 'Svelte'],
  },
  {
    title: 'TurboPlanner',
    tags: ['Flutter'],
  },
];

export const contacts = [
  { label: 'email', value: 'houssamtermoussi@gmail.com', href: 'mailto:houssamtermoussi@gmail.com' },
  { label: 'github', value: 'github.com/houssamtermoussi', href: 'https://github.com/houssamtermoussi' },
];
