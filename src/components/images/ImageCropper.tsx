import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
  onSubmit: (data: { label: string; croppedImage: string }) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onSubmit }) => {
  const imageElementRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [cropper, setCropper] = useState<Cropper>();
  const [label, setLabel] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setImageSrc(event.target!.result as string);
      };
      setFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (imageSrc && imageElementRef.current) {
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
  }, [imageSrc]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL();

      onSubmit({ label, croppedImage });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="imageUpload">Upload image:</label>
        <input
          type="file"
          accept="image/*"
          id="imageUpload"
          onChange={onFileChange}
        />
      </div>
      <div>
        <label htmlFor="imageLabel">Image Label:</label>
        <input
          type="text"
          id="imageLabel"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      {imageSrc && (
        <>
          <img
            ref={imageElementRef}
            src={imageSrc}
            alt="Source"
            style={{ display: "none" }}
          />
          <div>Cropper loaded. Adjust your image as needed.</div>
        </>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ImageCropper;
