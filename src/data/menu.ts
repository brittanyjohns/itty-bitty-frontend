
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
  id: 1
  },

  {
    endpoint: '/about',
    name: 'About',
    slug: 'about',
    icon: bookOutline,
    id: 2

  },
  {
    endpoint: '/boards',
    name: 'Boards',
    slug: 'boards',
    icon: gridOutline,
    id: 3
  },
  {
    endpoint: '/menus',
    name: 'Menus',
    slug: 'menus',
    icon: fastFoodOutline,
    id: 4
  },
  {
    endpoint: '/images',
    name: 'Images',
    slug: 'images',
    icon: imageOutline,
    id: 5
  },
  {
    endpoint: '/child-accounts',
    name: 'Child Accounts',
    slug: 'child-accounts',
    icon: peopleCircleOutline,
    id: 33
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
    id: 12
  },
  {
    endpoint: '/settings',
    name: 'Settings',
    slug: 'settings',
    icon: settingsOutline,
    id: 9997
  },
  {
    endpoint: '/predictive',
    name: 'Predictive',
    slug: 'predictive',
    icon: sunnyOutline,
    id: 10
  },
  {
    endpoint: '/admin/dashboard',
    name: 'Admin Dashboard',
    slug: 'admin-dashboard',
    icon: lockClosedOutline,
    id: 9998
  },
  {
    endpoint: '/users/sign-out',
    name: 'Sign Out',
    slug: 'sign-out',
    icon: logOutOutline,
    id: 9999
  },
  {
    endpoint: '/child-accounts/sign-out',
    name: 'Sign Out',
    slug: 'child-sign-out',
    icon: logOutOutline,
    id: 9996
  }
  
];

export const getMenu = () => menuLinks;

export const getMenuLink = (id: number) => menuLinks.find(m => m.id === id);
