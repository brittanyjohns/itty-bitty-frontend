import { MenuLink } from "./menu";

export const getImageUrl = (name: string, ent: string) => {
  return new URL(`../assets/images/${name}.${ent}`, import.meta.url).href;
};

export const getIconUrl = (name: string, ent: string) => {
  return new URL(`../assets/icons/${name}.${ent}`, import.meta.url).href;
};

export const getVideoUrl = (name: string, ent: string) => {
  return new URL(`../assets/videos/${name}.${ent}`, import.meta.url).href;
};

export const getDemoUrl = (name: string, ent: string = "mp4") => {
  return new URL(`../assets/demos/${name}.${ent}`, import.meta.url).href;
};

export const playAudioList = async (audioList: string[]) => {
  for (let i = 0; i < audioList.length; i++) {
    const audioSrc = audioList[i];
    const audio = new Audio(audioSrc);
    try {
      await audio.play();
      await new Promise((resolve) => (audio.onended = resolve));
    } catch (error) {
      console.log("Error playing audio:", error);
      audio.muted = true;
      audio.play();
    }
  }
};

const placeholderCache: { [key: string]: string } = {};

export const generatePlaceholderImage = (text: string): string => {
  if (placeholderCache[text]) {
    return placeholderCache[text];
  }

  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#CCCCCC";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "20px Arial";
    context.fillStyle = "#000000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const dataUrl = canvas.toDataURL("image/png");
  placeholderCache[text] = dataUrl; // Cache the generated placeholder
  return dataUrl;
};

import { getMenu } from "./menu";

// export const getFilterList = (currentUser?: any, currentAccount?: any) => {
//   const filterList = useCallback((): MenuLink[] => {
//     const links = getMenu();
//     const adminLinks = [
//       "home",
//       "sign-out",
//       "boards",
//       "child-accounts",
//       "images",
//       "menus",
//       "teams",
//       "predictive",
//       "settings",
//       "admin-dashboard",
//     ];
//     const professionalLinks = [
//       "home",
//       "sign-out",
//       "boards",
//       "child-accounts",
//       "images",
//       "settings",
//     ];
//     const professionalProLinks = [
//       "home",
//       "sign-out",
//       "boards",
//       "child-accounts",
//       "images",
//       "menus",
//       "predictive",
//       "settings",
//     ];
//     const proLinks = [
//       "home",
//       "sign-out",
//       "boards",
//       "child-accounts",
//       "images",
//       "menus",
//       "predictive",
//       "settings",
//     ];
//     const freeLinks = [
//       "home",
//       "sign-out",
//       "boards",
//       "child-accounts",
//       "images",
//       "menus",
//       "predictive",
//       "settings",
//     ];
//     const signedOutLinks = [
//       "sign-in",
//       "sign-up",
//       "forgot-password",
//       "home",
//       "pricing",
//       "about",
//     ];
//     const childAccountLinks = ["home", "child-boards", "child-sign-out"];

//     if (currentUser) {
//       if (currentUser.role === "admin") {
//         return links.filter((link) => adminLinks.includes(link.slug ?? ""));
//       }
//       if (currentUser.plan_type === "free") {
//         return links.filter((link) => freeLinks.includes(link.slug ?? ""));
//       }
//       if (currentUser.plan_type === "free") {
//         return links.filter((link) => proLinks.includes(link.slug ?? ""));
//       }
//       if (
//         currentUser.plan_type === "professional plus" ||
//         currentUser.plan_type === "premium"
//       ) {
//         return links.filter((link) =>
//           professionalProLinks.includes(link.slug ?? "")
//         );
//       }
//       return links.filter((link) => freeLinks.includes(link.slug ?? ""));
//     } else if (currentAccount) {
//       return links.filter((link) =>
//         childAccountLinks.includes(link.slug ?? "")
//       );
//     } else {
//       return links.filter((link) => signedOutLinks.includes(link.slug ?? ""));
//     }
//   }, [currentUser, currentAccount]);
//   return filterList;
// };

import { User } from "../data/users";
import { ChildAccount } from "../data/child_accounts";

export const getFilterList = (
  currentUser?: User | null,
  currentAccount?: ChildAccount | null
): MenuLink[] => {
  const links = getMenu();
  const adminLinks = [
    "home",
    "groups",
    "dashboard",
    "sign-out",
    "boards",
    "child-accounts",
    "images",
    "menus",
    "teams",
    "predictive",
    "settings",
    "admin-dashboard",
  ];
  const professionalLinks = [
    "home",
    "groups",
    "dashboard",
    "sign-out",
    "boards",
    "child-accounts",
    "images",
    "settings",
  ];
  const professionalProLinks = [
    "home",
    "groups",
    "dashboard",
    "sign-out",
    "boards",
    "child-accounts",
    "images",
    "menus",
    "predictive",
    "settings",
  ];
  const proLinks = [
    "home",
    "groups",
    "dashboard",
    "sign-out",
    "boards",
    "child-accounts",
    "images",
    "menus",
    "predictive",
    "settings",
  ];
  const freeLinks = [
    "home",
    "groups",
    "dashboard",
    "sign-out",
    "boards",
    "child-accounts",
    "images",
    "menus",
    "predictive",
    "settings",
  ];
  const signedOutLinks = [
    "child-sign-in",
    "user/sign-in",
    "sign-up",
    "forgot-password",
    "home",
    "pricing",
    "about",
    "contact",
  ];
  const childAccountLinks = [
    // "home",
    "account-dashboard",
    "child-boards",
    "child-groups",
    "child-sign-out",
  ];

  if (currentUser) {
    if (currentUser.role === "admin") {
      return links.filter((link) => adminLinks.includes(link.slug ?? ""));
    }
    if (currentUser.plan_type === "free") {
      return links.filter((link) => freeLinks.includes(link.slug ?? ""));
    }
    if (currentUser.plan_type === "pro") {
      return links.filter((link) => proLinks.includes(link.slug ?? ""));
    }
    if (
      currentUser.plan_type === "professional plus" ||
      currentUser.plan_type === "premium"
    ) {
      return links.filter((link) =>
        professionalProLinks.includes(link.slug ?? "")
      );
    }
    return links.filter((link) => freeLinks.includes(link.slug ?? ""));
  } else if (currentAccount) {
    return links.filter((link) => childAccountLinks.includes(link.slug ?? ""));
  } else {
    return links.filter((link) => signedOutLinks.includes(link.slug ?? ""));
  }
};

export const canTrack = () => {
  const trackingConsent = document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracking_consent="));
  return trackingConsent && trackingConsent.split("=")[1] === "true";
};

export const canUseCookies = () => {
  const cookiesConsent = document.cookie
    .split("; ")
    .find((row) => row.startsWith("cookies_consent="));
  return cookiesConsent && cookiesConsent.split("=")[1] === "true";
};

export const checkCurrentUserTokens = (
  currentUser: User,
  numberOfTokens: number = 1
) => {
  if (
    currentUser &&
    currentUser.tokens &&
    currentUser.tokens >= numberOfTokens
  ) {
    return true;
  }
  return false;
};
