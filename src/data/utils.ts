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