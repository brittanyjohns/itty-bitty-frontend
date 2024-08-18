import {
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonList,
  IonIcon,
} from "@ionic/react";
import { image, trashBinOutline } from "ionicons/icons";
import { Image, deleteAudioFile } from "../../data/images";
interface AudioListProps {
  image: Image;
}

const AudioList: React.FC<AudioListProps> = ({ image }) => {
  console.log("AudioListProps", image?.audio_files);

  const handleDeleteAudioFile = async (
    audio_file_id: string | null | undefined
  ) => {
    console.log("Delete audio file", audio_file_id);
    if (audio_file_id) {
      const response = await deleteAudioFile(image.id, audio_file_id);
      console.log("Delete audio file response", response);
    }
  };

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
                    filename: string | undefined;
                    created_at: string | undefined;
                  },
                  index: any
                ) => (
                  <div
                    key={audio_file.id}
                    className={`p-1 rounded-lg shadow-md border border-gray-200`}
                  >
                    <div className="flex justify-between">
                      <IonLabel className="text-xs md:text-sm lg:text-md">
                        {audio_file.voice} - {audio_file.filename} -{" "}
                        {audio_file.created_at}
                      </IonLabel>
                      <IonIcon
                        icon={trashBinOutline}
                        color="danger"
                        className="cursor-pointer"
                        onClick={() => {
                          console.log("Delete audio file", audio_file.id);
                          handleDeleteAudioFile(audio_file.id);
                        }}
                      />
                    </div>
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
