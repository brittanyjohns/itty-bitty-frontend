import React, { useEffect } from "react";

interface ImagePasteHandlerProps {
  setFile: (file: File) => void;
}

const ImagePasteHandler: React.FC<ImagePasteHandlerProps> = ({ setFile }) => {
  useEffect(() => {
    const handlePaste = (evt: ClipboardEvent) => {
      const clipboardItems = evt.clipboardData?.items;
      if (!clipboardItems) {
        alert(
          "Failed to paste image - no clipboard items found. Please refresh the page and try again."
        );
        return;
      }

      const items = Array.from(clipboardItems).filter((item) =>
        /^image\//.test(item.type)
      );
      if (items.length === 0) {
        alert("Failed to paste image - no image found in clipboard.");
        return;
      }

      const item = items[0];
      const blob = item.getAsFile();
      if (!blob) {
        alert(
          "Failed to paste image - unable to convert clipboard item to file"
        );
        return;
      }

      const imageEle = document.getElementById("preview") as HTMLImageElement;
      imageEle.style.display = "block";
      if (imageEle) {
        imageEle.src = URL.createObjectURL(blob);
      } else {
        console.error("Image element not found");
      }

      console.log("imageEle", imageEle);

      const file = new File([blob], "file name", {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
      const container = new DataTransfer();
      container.items.add(file);
      const fileField = document.querySelector(
        "#file_field"
      ) as HTMLImageElement;

      if (fileField) {
        fileField.src = URL.createObjectURL(file);
      }
      console.log("fileField.src", fileField.src);
      setFile(file);
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="w-full mx-auto h-48 bg-gray-200 flex items-center justify-center">
      <img id="preview" alt="Preview" style={{ display: "none" }} />
    </div>
  );
};

export default ImagePasteHandler;
