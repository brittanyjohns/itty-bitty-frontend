import { updateBoard } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { Board } from "../../data/boards";
import React, { useEffect } from "react";
import { denyAccess } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getSampleVoices } from "../../data/images";
import { useHistory } from "react-router";
import { set } from "d3";
interface BoardFormProps {
  board: Board;
  setBoard: (board: Board) => void;
  onGridSizeChange?: any;
  onSubmit?: any;
}
interface SampleVoiceResponse {
  id: number;
  label: string;
  url: string;
}
const BoardForm: React.FC<BoardFormProps> = ({ board, setBoard }) => {
  const [gridSize, setGridSize] = React.useState<number>(
    board.number_of_columns
  );
  const [smallScreenColumns, setSmallScreenColumns] = React.useState<number>(
    board.small_screen_columns
  );
  const [mediumScreenColumns, setMediumScreenColumns] = React.useState<number>(
    board.medium_screen_columns
  );
  const [largeScreenColumns, setLargeScreenColumns] = React.useState<number>(
    board.large_screen_columns
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [voice, setVoice] = React.useState(board.voice);
  const [toastMessage, setToastMessage] = React.useState("");
  const [showLoading, setShowLoading] = React.useState(false);
  const { currentUser } = useCurrentUser();
  const history = useHistory();

  const [sampleVoices, setSampleVoices] = React.useState<SampleVoiceResponse[]>(
    []
  );

  const fetchSampleVoices = async () => {
    const voices = await getSampleVoices();
    setSampleVoices(voices);
  };

  useEffect(() => {
    fetchSampleVoices();
  }, []);

  const handleColumnSizeChange = (event: CustomEvent) => {
    const columnSize = event.detail.value;
    const columnScreen = (event.target as HTMLInputElement)?.name;
    if (!columnScreen) {
      console.error("No column screen found");
      return;
    }
    if (columnScreen === "large_screen_columns") {
      setLargeScreenColumns(columnSize);
      setBoard({ ...board, large_screen_columns: columnSize });
    }
    if (columnScreen === "medium_screen_columns") {
      setMediumScreenColumns(columnSize);
      setBoard({ ...board, medium_screen_columns: columnSize });
    }
    if (columnScreen === "small_screen_columns") {
      setSmallScreenColumns(columnSize);
      setBoard({ ...board, small_screen_columns: columnSize });
    }
    setGridSize(event.detail.value);
    // handleAfterAction();
  };

  const handleSubmit = async () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    setShowLoading(true);
    const updatingBoard = { ...board, number_of_columns: gridSize };
    // alert("Board saved successfully");

    const savedBoard = await updateBoard(updatingBoard);
    setBoard(savedBoard);
    setShowLoading(false);
    setToastMessage("Board saved successfully");
    setIsOpen(true);
    // window.location.reload();
    // history.push(`/boards/${savedBoard.id}`);
  };

  const gridSizeOptions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  ];

  const voiceOptions = ["alloy", "shimmer", "onyx", "fable", "nova", "echo"];

  const handleVoiceChange = (event: CustomEvent) => {
    const voice = event.detail.value;
    setVoice(voice);
    playSampleVoice(voice);
    const updateBoard = { ...board, voice: event.detail.value };
    setBoard(updateBoard);
  };

  const playSampleVoice = (voice: string) => {
    const file = sampleVoices.find((v: SampleVoiceResponse) => {
      if (v.label.includes(voice)) {
        return v;
      } else {
        console.error("No voice file found", v);
        return null;
      }
    });
    if (!file) {
      console.error("No voice file found");
      return;
    }
    const audio = new Audio(file.url);
    audio.play();
  };

  return (
    <div className="">
      <IonLoading
        message="Please wait while we update your board"
        isOpen={showLoading}
      />

      <IonList>
        <IonItem className="mb-4">
          <IonInput
            label="Name:"
            value={board?.name}
            placeholder="Enter Board Name"
            onIonInput={(e) => setBoard({ ...board, name: e.detail.value! })}
          ></IonInput>
        </IonItem>
        {currentUser?.admin && (
          <IonItem className="mb-4">
            <IonCheckbox
              checked={board?.predefined}
              onIonChange={(e) =>
                setBoard({ ...board, predefined: e.detail.checked })
              }
            />
            <label className="ml-2">Predefined</label>
          </IonItem>
        )}
        <IonItem className="mb-4">
          <IonLabel>Large Screens {"(> 1000px)"}:</IonLabel>
          <IonSelect
            label="Number of Columns:"
            placeholder="Select # of columns"
            name="large_screen_columns"
            className="mr-2"
            onIonChange={handleColumnSizeChange}
            value={largeScreenColumns}
          >
            {gridSizeOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem className="mb-4">
          <IonLabel>Medium Screens {"(< 1000px)"}:</IonLabel>
          <IonSelect
            label="Number of Columns:"
            placeholder="Select # of columns"
            name="medium_screen_columns"
            className="mr-2"
            onIonChange={handleColumnSizeChange}
            value={mediumScreenColumns}
          >
            {gridSizeOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem className="mb-4">
          <IonLabel>Small Screens {"(< 600px)"}:</IonLabel>
          <IonSelect
            label="Number of Columns:"
            placeholder="Select # of columns"
            name="small_screen_columns"
            className="mr-2"
            onIonChange={handleColumnSizeChange}
            value={smallScreenColumns}
          >
            {gridSizeOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonSelect
            label="Voice:"
            placeholder="Select Voice"
            name="voice"
            className="mr-2"
            disabled={denyAccess(currentUser)}
            onIonChange={handleVoiceChange}
            value={voice}
          >
            {voiceOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonButtons className="mt-4">
          <IonButton onClick={handleSubmit} fill="solid" size="large">
            Save
          </IonButton>
        </IonButtons>
      </IonList>
      <IonToast
        isOpen={isOpen}
        message={toastMessage}
        onDidDismiss={() => setIsOpen(false)}
        duration={2000}
      ></IonToast>
    </div>
  );
};

export default BoardForm;
