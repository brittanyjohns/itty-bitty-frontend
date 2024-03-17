export interface MenuLink {
  endpoint: string;
  name: string;
  slug?: string;
  id: number;
}

const menuLinks: MenuLink[] = [
  {
    endpoint: '/dashboard',
    name: 'Dashboard',
    slug: 'dashboard',
    id: 0
  },
  {
    endpoint: '/boards',
    name: 'Boards',
    slug: 'boards',
    id: 1
  },
  {
    endpoint: '/menus',
    name: 'Menus',
    slug: 'menus',
    id: 2
  },
  {
    endpoint: '/images',
    name: 'Images',
    slug: 'images',
    id: 3
  },
  {
    endpoint: '/sign-in',
    name: 'Sign In',
    slug: 'sign-in',
    id: 7
  },
  {
    endpoint: '/sign-up',
    name: 'Sign Up',
    slug: 'sign-up',
    id: 8
  },
  {
    endpoint: '/sign-out',
    name: 'Sign Out',
    slug: 'sign-out',
    id: 9
  },
  {
    endpoint: '/settings',
    name: 'Settings',
    slug: 'settings',
    id: 10
  }
];

export const getMenu = () => menuLinks;

export const getMenuLink = (id: number) => menuLinks.find(m => m.id === id);
