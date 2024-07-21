
export interface MenuLink {
  endpoint: string;
  name: string;
  slug?: string;
  icon?: string;
  id: number;
}
import {
  gridOutline,
  fastFoodOutline,
  imageOutline,
  logInOutline,
  logOutOutline,
  sunnyOutline,
  settingsOutline,
  homeOutline,
  peopleCircleOutline,
  lockClosedOutline,
  pricetagOutline,
  bookOutline,
} from "ionicons/icons";
import { set } from "react-hook-form";
const menuLinks: MenuLink[] = [
  
  {
    endpoint: '/home',
    name: 'Home',
    slug: 'home',
    icon: homeOutline,
    id: 0
  },
  {endpoint: '/pricing',
  name: 'Pricing',
  slug: 'pricing',
  icon: pricetagOutline,
  id: 16
  },

  {
    endpoint: '/about',
    name: 'About',
    slug: 'about',
    icon: bookOutline,
    id: 17

  },
  {
    endpoint: '/boards',
    name: 'Boards',
    slug: 'boards',
    icon: gridOutline,
    id: 1
  },
  {
    endpoint: '/menus',
    name: 'Menus',
    slug: 'menus',
    icon: fastFoodOutline,
    id: 2
  },
  {
    endpoint: '/images',
    name: 'Images',
    slug: 'images',
    icon: imageOutline,
    id: 3
  },
  {
    endpoint: '/child-accounts',
    name: 'Child Accounts',
    slug: 'child-accounts',
    icon: peopleCircleOutline,
    id: 0
  },
  {
    endpoint: '/sign-in',
    name: 'Sign In',
    slug: 'sign-in',
    icon: logInOutline,
    id: 7
  },
  {
    endpoint: '/sign-up',
    name: 'Sign Up',
    slug: 'sign-up',
    icon: logInOutline,
    id: 8
  },
  {
    endpoint: '/teams',
    name: 'Teams',
    slug: 'teams',
    icon: peopleCircleOutline,
    id: 10
  },
  {
    endpoint: '/settings',
    name: 'Settings',
    slug: 'settings',
    icon: settingsOutline,
    id: 11
  },
  {
    endpoint: '/predictive',
    name: 'Predictive',
    slug: 'predictive',
    icon: sunnyOutline,
    id: 12
  },
  {
    endpoint: '/admin/dashboard',
    name: 'Admin Dashboard',
    slug: 'admin-dashboard',
    icon: lockClosedOutline,
    id: 14
  },
  {
    endpoint: '/sign-out',
    name: 'Sign Out',
    slug: 'sign-out',
    icon: logOutOutline,
    id: 15
  },
  
];

export const getMenu = () => menuLinks;

export const getMenuLink = (id: number) => menuLinks.find(m => m.id === id);
