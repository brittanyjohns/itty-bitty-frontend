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

  const placeholderCache: { [key: string]: string } = {};

 export const generatePlaceholderImage = (text: string): string => {
    if (placeholderCache[text]) {
      return placeholderCache[text];
    }
  
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const context = canvas.getContext('2d');
  
    if (context) {
      context.fillStyle = '#CCCCCC';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = '20px Arial';
      context.fillStyle = '#000000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }
  
    const dataUrl = canvas.toDataURL('image/png');
    placeholderCache[text] = dataUrl;  // Cache the generated placeholder
    return dataUrl;
  };
  