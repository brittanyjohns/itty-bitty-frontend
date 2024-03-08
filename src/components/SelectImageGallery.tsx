import React, { useEffect, useState, useRef } from 'react';
import { IonImg, IonButton, IonSearchbar, IonItem, IonText, IonTitle, IonButtons } from '@ionic/react';
import { Image, SelectImageGalleryProps, findOrCreateImage } from '../data/images';

import '../index.css';

const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({ images, boardId, onImageClick, onLoadMoreImages }) => {
    const [remainingImages, setRemainingImages] = useState<Image[]>(images);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            const imgs = await onLoadMoreImages(page, searchInput);
            setRemainingImages(imgs);
        };
        fetchImages();
    }, [page, searchInput]);

    const handleSearchInput = async (event: CustomEvent) => {
        const query = event.detail.value.toLowerCase();
        setSearchInput(query);
        setPage(1); // Reset to first page on new search
    };

    const handleOnImageClick = (image: Image) => {
        onImageClick(image);
        // Hide image or other logic here
    };

    return (
        <>
            <IonItem>
                <IonSearchbar debounce={1000} onIonInput={handleSearchInput} placeholder="Search"></IonSearchbar>
                {boardId && <IonText>Click an image to add it to the board</IonText>}
            </IonItem>
            <IonButtons class="flex justify-between w-full mb-3">
                <IonButton disabled={page <= 1} onClick={() => setPage(oldPage => Math.max(1, oldPage - 1))}>Prev</IonButton>
                <IonTitle>Page {page}</IonTitle>
                <IonButton onClick={() => setPage(oldPage => oldPage + 1)}>Next</IonButton>
            </IonButtons>
            <div className="my-auto mx-auto grid grid-cols-3 gap-1">
                {remainingImages.map((image) => (
                    <div key={image.id} className='relative w-full hover:cursor-pointer text-center border bg-white rounded-lg h-64' onClick={() => handleOnImageClick(image)}>
                        <IonImg src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                        <span className="font-medium text-xs rounded bg-opacity-90 absolute bottom-0 left-0 right-0 p-0 text-black">
                            {image.label}
                        </span>
                    </div>
                ))}
            </div>
            {remainingImages.length === 0 && <IonText>No images found</IonText>}
        </>
    );
};

export default SelectImageGallery;
