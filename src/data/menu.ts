export interface MenuLink {
  endpoint: string;
  name: string;
  slug?: string;
  id: number;
}

const menuLinks: MenuLink[] = [
  {
    endpoint: '/boards/new',
    name: 'New Board',
    slug: 'new-board',
    id: 0
  },
  {
    endpoint: '/images/new',
    name: 'New Image',
    slug: 'new-image',
    id: 1
  },
  {
    endpoint: '/images',
    name: 'Images',
    slug: 'images',
    id: 2
  },
  {
    endpoint: '/boards',
    name: 'Boards',
    slug: 'boards',
    id: 3
  },
  {
    endpoint: '/sign-in',
    name: 'Sign In',
    slug: 'sign-in',
    id: 4
  },
  {
    endpoint: '/sign-up',
    name: 'Sign Up',
    slug: 'sign-up',
    id: 5
  },
  {
    endpoint: '/sign-out',
    name: 'Sign Out',
    slug: 'sign-out',
    id: 6
  },
  {
    endpoint: '/dashboard',
    name: 'Dashboard',
    slug: 'dashboard',
    id: 7
  }
];

export const getMenu = () => menuLinks;

export const getMenuLink = (id: number) => menuLinks.find(m => m.id === id);
