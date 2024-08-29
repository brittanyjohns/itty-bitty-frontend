import { useEffect, useState, useRef } from "react";
import { ImageResult, imageSearch } from "../../data/search";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLoading,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React from "react";
import { Image } from "../../data/images";
import ImageCropper from "../images/ImageCropper";
import { set } from "d3";
import { searchCircleSharp, searchSharp } from "ionicons/icons";
import { useCurrentUser } from "../../contexts/UserContext";
import { labelForScreenSize } from "../../data/utils";

const ImageSearchComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<ImageResult[]>([]);
  const [newImageSrc, setNewImageSrc] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>("clipart");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [nextStartIndex, setNextStartIndex] = useState<number>(0);
  const { smallScreen, mediumScreen, largeScreen } = useCurrentUser();

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a search query");
      return;
    }

    setLoading(true);
    const params = {
      q: query,
      imgType: imageType,
      start: nextStartIndex, // Pagination, starts from 1
      num: 10,
    };

    try {
      const imgResult = await imageSearch(query, params);
      if (!imgResult) {
        alert("No images found");
        return;
      }
      console.log("Image Search Result: ", imgResult);
      // setImages((prevImages) => [...prevImages, ...imgResult]); // Append new results
      setImages(imgResult);
      setNextStartIndex(imgResult[0].startIndex);
    } catch (error) {
      console.error("Image Search Error: ", error);
      alert("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setNewImageSrc(newImageLabel ? newImageSrc : null);
  }, [newImageSrc, newImageLabel]);

  const handleClick = async (imageResult: ImageResult) => {
    setLoading(true);
    try {
      const imgUrl = imageResult.link;
      setNewImageSrc(imgUrl);
      setNewImageLabel(query);
      console.log("Image URL: ", imgUrl);
      // const result = await saveImageResult(imageResult, query);
      const result = true;
      if (result) {
        resetSearch();
        // alert("Image saved successfully");
      } else {
        alert("Failed to save image");
      }
    } catch (error) {
      console.error("Save Image Error: ", error);
      alert("Failed to save image");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setQuery("");
    setImages([]);
    setPageNumber(1);
  };

  const handleInput = (inputStr: string) => {
    setQuery(inputStr);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setImages([]); // Reset images on new search
      setPageNumber(1); // Reset to first page
      handleSearch();
    }
  };

  const loadMoreImages = () => {
    setPageNumber((prevPage) => prevPage + 1); // Increment page number
    handleSearch(); // Load more images
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
      handleSearch();
    }
  };

  const nextPage = () => {
    setPageNumber((prevPage) => prevPage + 1);
    handleSearch();
  };

  const imageTypes = [
    "clipart",
    "face",
    "lineart",
    "stock",
    "photo",
    "animated",
  ];

  return (
    <div>
      <IonLoading isOpen={loading} />

      <div className="flex justify-center items-center m-1">
        <div className="w-full md:w-1/2 flex items-center">
          <input
            type="text"
            value={query}
            ref={inputRef}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for images"
          />
          <IonButton
            type="submit"
            className="mx-1"
            onClick={() => {
              setImages([]);
              setPageNumber(1);
              handleSearch();
            }}
          >
            <IonIcon icon={searchSharp} />
          </IonButton>
        </div>
        <IonSelect
          value={imageType}
          placeholder="Image Type"
          labelPlacement="stacked"
          label="Image Type"
          className="w-full md:w-1/4"
          selectedText={imageType}
          onIonChange={(e) => setImageType(e.detail.value)}
        >
          {imageTypes.map((type, index) => (
            <IonSelectOption key={index} value={type}>
              {type}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      {images.length > 0 && (
        <>
          <p className="text-center">Page {pageNumber}</p>

          <IonButtons className="flex justify-between my-4">
            <IonButton fill="outline" onClick={previousPage}>
              Prev Page
            </IonButton>
            <IonButton fill="outline" onClick={resetSearch}>
              Reset Search
            </IonButton>
            <IonButton fill="outline" onClick={nextPage}>
              Next Page
            </IonButton>
          </IonButtons>
        </>
      )}
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleClick(img)}
          >
            <img src={img.thumbnail} alt={img.title} />
            <a href={img.link} target="_blank" rel="noreferrer">
              {labelForScreenSize(
                img.title,
                200,
                smallScreen,
                mediumScreen,
                largeScreen
              )}
            </a>
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <IonButtons className="flex justify-between my-4">
          <IonButton fill="outline" onClick={previousPage}>
            Prev Page
          </IonButton>
          <IonButton fill="outline" onClick={resetSearch}>
            Reset Search
          </IonButton>
          <IonButton fill="outline" onClick={nextPage}>
            Next Page
          </IonButton>
        </IonButtons>
      )}

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
