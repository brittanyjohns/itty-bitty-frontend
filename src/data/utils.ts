// function getImageUrl(name: string, ent: string) {
//     return new URL(`../assets/images/${name}.${ent}`, import.meta.url).href;
//   }
//   function getIconUrl(name: string, ent: string) {
//     return new URL(`../assets/icons/${name}.${ent}`, import.meta.url).href;
//   }

export const getImageUrl = (name: string, ent: string) => {
    return new URL(`../assets/images/${name}.${ent}`, import.meta.url).href;
}

export const getIconUrl = (name: string, ent: string) => {
    return new URL(`../assets/icons/${name}.${ent}`, import.meta.url).href;
}