import {
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonList,
} from "@ionic/react";
import { image } from "ionicons/icons";
import { Key } from "react";
import { Image } from "../../data/images";
interface AudioListProps {
  image: Image;
}

const AudioList: React.FC<AudioListProps> = ({ image }) => {
  console.log("AudioListProps", image?.audio_files);

  return (
    <div>
      {image && image.audio_files && image.audio_files.length > 0 && (
        <div className="w-full md:w-5/6 mx-auto text-center">
          <IonLabel className="font-bold text-sm md:text-md lg:text-lg">
            Click an image to display it for the word: "{image.label}"
          </IonLabel>
          <IonList>
            {/* This needs pulled out into a separate component */}
            {image?.audio_files &&
              image.audio_files.map(
                (
                  audio_file: {
                    id: Key | null | undefined;
                    url: string | undefined;
                    voice: string | undefined;
                  },
                  index: any
                ) => (
                  <div
                    key={audio_file.id}
                    className={`p-1 rounded-lg shadow-md border border-gray-200`}
                  >
                    <IonLabel className="text-xs md:text-sm lg:text-md">
                      {audio_file.voice}
                    </IonLabel>
                    <audio controls>
                      <source src={audio_file.url} type="audio/aac" />
                    </audio>
                  </div>
                )
              )}
          </IonList>
        </div>
      )}
    </div>
  );
};

export default AudioList;
