// Import necessary components and hooks
import React, { useEffect, useState } from "react";
import { IonInput, IonButton, IonLoading, IonIcon } from "@ionic/react";
import { createImage } from "../../data/images";
import { useHistory } from "react-router";
import { Board } from "../../data/boards";
import { camera } from "ionicons/icons";
// import "./FileUploadForm.css"; // Assuming you have an external CSS file

interface FileUploadFormProps {
  board: Board | undefined;
  onCloseModal: any;
  showLabel: boolean;
  existingLabel?: string;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  board,
  onCloseModal,
  showLabel,
  existingLabel,
}) => {
  const [label, setLabel] = useState(existingLabel || "");
  // const [shouldDisable, setShouldDisable] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const hideLabel = showLabel ? false : true;
  const [file, setFile] = useState<File | null>(null);
  const history = useHistory();

  // useEffect(() => {
  //   setShouldDisable(existingLabel ? false : true);
  // }, [existingLabel]);

  const uploadPhoto = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!label) return;
    // setShouldDisable(true);
    const formData = new FormData();
    if (file) {
      formData.append("image[docs][image]", file);
    }
    formData.append("image[label]", label);
    if (board?.id) {
      formData.append("board[id]", board.id);
    }

    setShowLoading(true);
    const result = await createImage(formData, board?.id);
    setShowLoading(false);

    if (result && result.id) {
      onCloseModal();
      history.push(board ? `/boards/${board.id}` : `/images/${result.id}`);
      window.location.reload();
    } else {
      console.error("Error:", result.error);
    }
  };

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = ev.target.files ? ev.target.files[0] : null;
    setFile(newFile);
  };

  return (
    <form
      onSubmit={uploadPhoto}
      encType="multipart/form-data"
      className="upload-form"
    >
      <IonLoading isOpen={showLoading} message={"Uploading your image..."} />
      {!hideLabel && (
        <IonInput
          value={label}
          onIonChange={(e) => setLabel(e.detail.value!)}
          type="text"
          labelPlacement="floating"
          label="Image Label"
          placeholder="Enter new image label"
          required
        />
      )}
      <div className="upload-section">
        <input
          type="file"
          onChange={onFileChange}
          className="file-input"
          required
        />
        <IonButton expand="block" type="submit">
          <IonIcon slot="start" icon={camera} />
          {showLabel ? "Save Image" : "Upload Image"}
        </IonButton>
      </div>
    </form>
  );
};

export default FileUploadForm;
