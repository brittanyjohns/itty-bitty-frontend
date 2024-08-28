import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonInput,
  IonItem,
  IonLoading,
  IonTextarea,
  useIonViewWillLeave,
} from "@ionic/react";
import { cropImage, findOrCreateImage } from "../../data/images";
import { useHistory } from "react-router";
import ImagePasteHandler from "../utils/ImagePasteHandler";
import { set } from "d3";

interface ImageCropperProps {
  existingId?: string;
  boardId?: string | null;
  existingLabel?: string | null;
  disableCrop?: boolean;
  existingImageSrc?: string | null;
  setLoading?: (loading: boolean) => void;
  hidePaste?: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  boardId,
  existingId,
  existingLabel,
  disableCrop,
  existingImageSrc,
  setLoading,
  hidePaste,
}) => {
  const imageElementRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>();
  const history = useHistory();
  const [showPaste, setShowPaste] = useState<boolean>(!hidePaste || false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [cropper, setCropper] = useState<Cropper>();
  const [label, setLabel] = useState<string>(existingLabel || "");
  const [fileExtension, setFileExtension] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split(".").pop() || "";
      setFileExtension(fileExtension);
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const dataUrl = event.target!.result as string;
        setImageSrc(dataUrl);

        // Create an image to measure dimensions
        const img = new Image();
        img.onload = () => {
          console.log("Image dimensions: ", img.width, img.height);
          setImageDimensions({ width: img.width, height: img.height });
        };
        img.src = dataUrl;
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePastedFile = (file: File) => {
    const fileExtension = file.name.split(".").pop() || "";
    setFileExtension(fileExtension);
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const dataUrl = event.target!.result as string;
      setImageSrc(dataUrl);

      // Create an image to measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setImageSrc(null);
    setLabel("");
  };

  useEffect(() => {
    console.log("Image existingLabel: ", existingLabel);
    setLabel(existingLabel || "");
  }, [existingLabel]);

  useEffect(() => {
    console.log("Existing ID: ", existingId);
    console.log("> imageSrc: ", imageSrc);
    console.log("> label: ", existingLabel);
    console.log("Existing image source: ", existingImageSrc);
    if (existingImageSrc) {
      console.log("Existing image source: ", existingImageSrc);
      setImageSrc(existingImageSrc);
    }
    if (disableCrop) {
      console.log("Cropping disabled");
      return;
    }
    if (imageSrc && imageElementRef.current) {
      setShowPaste(false);

      const cropperInstance = new Cropper(imageElementRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        responsive: true,
      });
      setCropper(cropperInstance);

      return () => {
        cropperInstance.destroy();
      };
    }
  }, [imageSrc, existingImageSrc]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let createResult;
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL();
      createResult = await handleFormSubmit({ croppedImage, fileExtension });
    } else {
      if (label) {
        const formData = new FormData();
        formData.append("image[label]", label);
        if (existingId) {
          formData.append("image[id]", existingId);
        }

        createResult = await findOrCreateImage(formData, false);
        console.log("Result createResult: ", createResult);
      }
    }
    if (createResult) {
      // if (boardId) {
      //   history.push(`/boards/${boardId}`);
      //   window.location.reload();
      //   return;
      // } else {
      history.push(`/images/${createResult.id}`);
      window.location.reload();
      // }
    } else {
      alert("An error occurred. Please try again.");
    }
  };

  const handleFormSubmit = async (data: {
    croppedImage: string;
    fileExtension: string;
  }) => {
    setShowLoading(true);
    const formData = new FormData();
    const strippedImage = data.croppedImage.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );

    formData.append("cropped_image", strippedImage);
    formData.append("file_extension", data.fileExtension);
    if (existingId && existingLabel) {
      formData.append("image[id]", existingId);
      formData.append("image[label]", existingLabel);
    } else {
      formData.append("image[label]", label);
    }
    const labelToSend = formData.get("image[label]");
    if (!labelToSend) {
      alert("Please provide a label for the image.");
      setShowLoading(false);
      return;
    }

    const result = await cropImage(formData);
    setShowLoading(false);
    console.log(">>Result: ", result);
    return result;
  };

  useIonViewWillLeave(() => {
    imageElementRef.current?.removeAttribute("src");
    if (imageSrc) {
      setImageSrc(null);
    }
    if (label) {
      setLabel("");
    }
  });

  return (
    <div className="w-full md:w-1/2 lg:w-1/2 mx-auto border p-4">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="p-4 m-1">
          {!existingId ? (
            <IonInput
              value={label}
              aria-label="Label"
              placeholder="Enter a label for the image"
              // labelPlacement="stacked"
              required
              onIonChange={(e) => setLabel(e.detail.value!)}
              className="p-2 my-2 pl-2"
            />
          ) : null}

          {showPaste && (
            <div className="flex flex-col items-center mt-8">
              <input
                type="file"
                id="file_field"
                accept="image/*"
                className="cursor-pointer"
                onChange={onFileChange}
              />
            </div>
          )}
        </div>
        {showPaste && (
          <IonCard className="p-4 m-4 border text-center">
            <h2 className="text-xl font-bold">Paste an image</h2>
            <p className="text-sm">Right-click and paste an image here</p>
            <IonItem className="mt-4">
              <ImagePasteHandler setFile={handlePastedFile} />
            </IonItem>
          </IonCard>
        )}
        {imageSrc && (
          <>
            <img
              ref={imageElementRef}
              src={imageSrc}
              alt="Source"
              style={{ display: "none" }}
            />
          </>
        )}
        <IonButtons className="mt-4">
          <IonButton
            type="submit"
            className="mt-4"
            color="secondary"
            fill="outline"
            expand="block"
          >
            Submit
          </IonButton>
          <IonButton
            onClick={handleCancel}
            className="mt-4"
            fill="outline"
            color="danger"
            expand="block"
          >
            Cancel
          </IonButton>
        </IonButtons>
      </form>
      <IonLoading isOpen={showLoading} message="Uploading..." />
    </div>
  );
};

export default ImageCropper;
