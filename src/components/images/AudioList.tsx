import {
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonList,
  IonIcon,
} from "@ionic/react";
import {
  image,
  imagesOutline,
  starOutline,
  starSharp,
  trashBinOutline,
} from "ionicons/icons";
import { Image, deleteAudioFile, setCurrentAudio } from "../../data/images";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/UserContext";
interface AudioListProps {
  image: Image;
  afterDeleteAudioFile: (response: any) => void;
  afterSetCurrentAudio?: (response: any) => void;
}

const AudioList: React.FC<AudioListProps> = ({
  image,
  afterDeleteAudioFile,
  afterSetCurrentAudio,
}) => {
  const [audioFiles, setAudioFiles] = useState(image.audio_files);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser?.admin) {
      setAudioFiles(image.audio_files);
    } else {
      setAudioFiles(image.custom_audio_files);
    }
  }, [currentUser, image]);
  const handleDeleteAudioFile = async (
    audio_file_id: string | null | undefined
  ) => {
    if (audio_file_id) {
      const response = await deleteAudioFile(image.id, audio_file_id);
      afterDeleteAudioFile(response);
    }
  };

  const setAudioFileAsCurrent = async (
    audio_file_id: string | null | undefined
  ) => {
    if (audio_file_id) {
      const formData = new FormData();
      formData.append("audio_file_id", audio_file_id);
      const response = await setCurrentAudio(image.id, formData);
      if (afterSetCurrentAudio) {
        afterSetCurrentAudio(response);
      }
    }
  };

  return (
    <div>
      {image && image.audio_files && image.audio_files.length > 0 && (
        <div className="w-full md:w-5/6 mx-auto text-center">
          <IonLabel className="font-bold text-sm md:text-md lg:text-lg">
            Audio Files
          </IonLabel>
          <IonList>
            {/* This needs pulled out into a separate component */}
            {audioFiles &&
              audioFiles.map(
                (
                  audio_file: {
                    id: string | null | undefined;
                    url: string | undefined;
                    voice: string | undefined;
                    filename: string | undefined;
                    created_at: string | undefined;
                    current: boolean | undefined;
                  },
                  index: any
                ) => (
                  <div
                    key={index}
                    className={`p-1 rounded-lg shadow-md border border-gray-200`}
                  >
                    <div className="flex justify-between">
                      <IonLabel className="text-xs md:text-sm lg:text-md">
                        {audio_file.id}: {audio_file.voice} -{" "}
                        {audio_file.filename} - {audio_file.created_at}
                        {audio_file.current && (
                          <IonIcon
                            icon={starSharp}
                            color="primary"
                            size="large"
                          />
                        )}
                      </IonLabel>
                      {!audio_file.current && (
                        <>
                          <IonIcon
                            icon={trashBinOutline}
                            color="danger"
                            className="cursor-pointer"
                            onClick={() => {
                              handleDeleteAudioFile(audio_file.id);
                            }}
                          />
                          <IonIcon
                            icon={starOutline}
                            color="dark"
                            className="cursor-pointer"
                            onClick={() => {
                              console.log(
                                "Set audio file as current",
                                audio_file.id
                              );
                              setAudioFileAsCurrent(audio_file.id);
                            }}
                          />
                        </>
                      )}
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
