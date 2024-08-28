import { useEffect, useState } from "react";
import { ImageResult, imageSearch, saveImageResult } from "../../data/search";
import { useHistory } from "react-router";
import { IonButton, IonLoading, IonText } from "@ionic/react";
import React from "react";
import { Image } from "../../data/images";
import ImageCropper from "../images/ImageCropper";
import { set } from "d3";

const ImageSearchComponent = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const inputRef = React.createRef<HTMLInputElement>();
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<ImageResult[]>([]);
  const [newImageSrc, setNewImageSrc] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<Image>();
  const [newImageLabel, setNewImageLabel] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query || query === "") {
      alert("Please enter a search query");
      return;
    }
    setLoading(true);
    console.log("Searching for: ", query);
    const imgResult = await imageSearch(query);
    setLoading(false);
    console.log("Image Search Result: ", imgResult);
    setImages(imgResult);
    return imgResult;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setNewImageSrc(newImage?.src || null);
    console.log("use effectNew Image: ", newImage);
  }, [newImage]);

  const handleClick = async (imageResult: ImageResult) => {
    setLoading(true);
    const imgUrl = imageResult.link;
    setNewImageSrc(imgUrl);
    setNewImageLabel(query);
    // const result = await saveImageResult(imageResult, query);
    const result = "test";
    setLoading(false);
    console.log("Saved Image: ", result);
    if (result) {
      // setNewImage(result);
      // alert("Image saved successfully");
      reset();
      // history.push(`/images/${result.id}`);
    } else {
      alert("Failed to save image");
    }
  };

  const handleInput = (inputStr: string) => {
    console.log("Input: ", inputStr);
    setQuery(inputStr);
  };

  const reset = () => {
    setImages([]);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div>
      <IonLoading isOpen={loading} />
      <input
        type="text"
        value={query}
        ref={inputRef}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for images"
      />
      <IonButton type="submit" onClick={() => handleSearch(query)}>
        Search
      </IonButton>
      <div className="grid grid-cols-3 gap-4">
        {images &&
          images.map((img, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleClick(img)}
            >
              <img key={index} src={img.thumbnail} alt={img.title} />
              <a href={img.link} target="_blank" rel="noreferrer">
                {img.title}
              </a>
            </div>
          ))}
      </div>

      {newImageSrc && (
        <ImageCropper
          existingImageSrc={newImageSrc}
          existingLabel={newImageLabel}
          setLoading={setLoading}
          hidePaste={true}
        />
      )}
    </div>
  );
};

export default ImageSearchComponent;
