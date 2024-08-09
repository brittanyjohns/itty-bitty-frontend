export interface MenuLink {
  endpoint: string;
  name: string;
  slug: string;
  icon?: string;
  id: number;
  pro?: boolean;
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
  phoneLandscapeOutline,
  callOutline,
  albumsOutline,
  accessibilityOutline,
  layersOutline,
  imagesOutline,
  speedometerOutline,
} from "ionicons/icons";
import { set } from "react-hook-form";
const menuLinks: MenuLink[] = [
  {
    endpoint: "/home",
    name: "Home",
    slug: "home",
    icon: homeOutline,
    id: 0,
  },
  {
    endpoint: "/pricing",
    name: "Pricing",
    slug: "pricing",
    icon: pricetagOutline,
    id: 1,
  },

  {
    endpoint: "/about",
    name: "About Us",
    slug: "about",
    icon: bookOutline,
    id: 2,
  },
  {
    endpoint: "/contact-us",
    name: "Contact Us",
    slug: "contact",
    icon: callOutline,
    id: 21212121,
  },

  {
    endpoint: "/account-dashboard",
    name: "Dashboard",
    slug: "account-dashboard",
    icon: speedometerOutline,
    id: 333333,
  },
  {
    endpoint: "/board-groups",
    name: "Groups",
    slug: "groups",
    pro: true,
    icon: layersOutline,
    id: 3,
  },
  {
    endpoint: "/boards",
    name: "Boards",
    slug: "boards",
    icon: gridOutline,
    id: 4,
  },
  {
    endpoint: "/menus",
    name: "Menus",
    slug: "menus",
    icon: fastFoodOutline,
    pro: true,
    id: 5,
  },
  {
    endpoint: "/images",
    name: "Images",
    slug: "images",
    icon: imagesOutline,
    id: 6,
  },
  {
    endpoint: "/child-accounts",
    name: "Child Accounts",
    slug: "child-accounts",
    icon: accessibilityOutline,
    pro: true,
    id: 33,
  },
  {
    endpoint: "/sign-in",
    name: "Sign In",
    slug: "sign-in",
    icon: logInOutline,
    id: 7,
  },
  {
    endpoint: "/sign-up",
    name: "Sign Up",
    slug: "sign-up",
    icon: logInOutline,
    id: 8,
  },
  {
    endpoint: "/teams",
    name: "Teams",
    slug: "teams",
    pro: true,
    icon: peopleCircleOutline,
    id: 12654654,
  },
  // {
  //   endpoint: "/settings",
  //   name: "Settings",
  //   slug: "settings",
  //   icon: settingsOutline,
  //   id: 9997,
  // },
  {
    endpoint: "/predictive",
    name: "Predictive",
    slug: "predictive",
    icon: sunnyOutline,
    pro: false,
    id: 10,
  },
  {
    endpoint: "/admin/dashboard",
    name: "Admin Dashboard",
    slug: "admin-dashboard",
    icon: lockClosedOutline,
    id: 9998,
  },
  // {
  //   endpoint: "/users/sign-out",
  //   name: "Sign Out",
  //   slug: "sign-out",
  //   icon: logOutOutline,
  //   id: 9999,
  // },
  // {
  //   endpoint: "/child-accounts/sign-out",
  //   name: "Sign Out",
  //   slug: "child-sign-out",
  //   icon: logOutOutline,
  //   id: 9996,
  // },
];

export const getMenu = () => menuLinks;

export const getMenuLink = (id: number) => menuLinks.find((m) => m.id === id);
