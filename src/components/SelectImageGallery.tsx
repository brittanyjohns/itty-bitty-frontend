import React, { useEffect, useState, useRef, MouseEventHandler } from 'react';
import { Image, SelectImageGalleryProps } from '../data/images';
import { IonImg, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonButtons, IonTitle } from '@ionic/react';


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
    }

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    <IonSearchbar debounce={1000} onIonInput={handleSearchInput} animated={true} placeholder="Search existing images"></IonSearchbar>
                </IonCardTitle>
                {boardId && <IonCardSubtitle>Click an image to add it to the board</IonCardSubtitle>}
                <IonButtons class="flex justify-between w-full">
                    <IonButton disabled={page <= 1} onClick={() => setPage(oldPage => Math.max(1, oldPage - 1))}>Prev</IonButton>
                    <IonTitle>Page {page}</IonTitle>
                    <IonButton onClick={() => setPage(oldPage => oldPage + 1)}>Next</IonButton>
                </IonButtons>
            </IonCardHeader>
            <IonCardContent>
                <div className="my-auto mx-auto grid grid-cols-3 gap-1" ref={gridRef}>
                    {remainingImages.map((image, i) => (
                        <div className='flex relative w-full hover:cursor-pointer text-center border bg-white rounded-lg h-64' onClick={() => handleOnImageClick(image)} key={image.id} id={`image_${image.id}`}>
                            <IonImg src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                            <span className="font-medium text-xs md:text-sm lg:text-md rounded bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
                                {image.label}
                                <audio>
                                    <source src={image.audio} type="audio/aac" />
                                </audio>
                            </span>
                        </div>
                    ))}
                </div>
                <IonButtons class="flex justify-between w-full mt-3">
                    <IonButton disabled={page <= 1} onClick={() => setPage(oldPage => Math.max(1, oldPage - 1))}>Prev</IonButton>
                    <IonTitle>Page {page}</IonTitle>
                    <IonButton onClick={() => setPage(oldPage => oldPage + 1)}>Next</IonButton>
                </IonButtons>
            </IonCardContent>
        </IonCard>
    );
};

export default SelectImageGallery;
