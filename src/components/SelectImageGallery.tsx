import React, { useEffect, useState, useRef, MouseEventHandler } from 'react';
import { Image, SelectImageGalleryProps } from '../data/images';
import { IonImg, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonButtons } from '@ionic/react';

import '../index.css'
const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({ images, boardId, onImageClick, onLoadMoreImages }) => {
    const gridRef = useRef(null);
    const [remainingImages, setRemainingImages] = useState<Image[]>(images);
    const [page, setPage] = useState(1);

    const nextPage = () => {
        setPage(page + 1);
    }

    const previousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    const loadMore = async (query?: string) => {
        setRemainingImages(images);
        if (!query) {
            query = ''
        }

        const imgs = onLoadMoreImages(page, query);
        return imgs;
    }

    const handleSearch = (event: CustomEvent) => {
        let query = '';
        const target = event.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        setPage(1);
        onLoadMoreImages(1, query);
    }

    const handleOnImageClick = (image: Image) => {
        console.log('Image clicked: event ', event);
        const targetElement = document.getElementById(`image_${image.id}`);
        const parentElement = targetElement?.parentElement as HTMLElement;
        parentElement.classList.add('hidden');
        onImageClick(image);
    }

    useEffect(() => {
        setRemainingImages(images);
    }, [images]);

    useEffect(() => {
        // resizeGrid();
        console.log("gridRef", gridRef.current);
    }, []);

    useEffect(() => {
        loadMore();
      }, [page]);

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                <IonSearchbar debounce={1000} onIonInput={handleSearch} animated={true} placeholder="Search existing images"></IonSearchbar>

                </IonCardTitle>
                {boardId && <IonCardSubtitle>Click an image to add it to the board</IonCardSubtitle>}
            </IonCardHeader>
            <IonCardContent>
                <IonButtons class="flex justify-between w-full">
                    <IonButton onClick={() => previousPage()}>Prev</IonButton>
                    <IonButton onClick={() => nextPage()}>Next</IonButton>
                </IonButtons>
            </IonCardContent>
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
                    <IonButton onClick={() => previousPage()}>Prev</IonButton>
                    <IonButton onClick={() => nextPage()}>Next</IonButton>
                </IonButtons>
            </IonCardContent>
        </IonCard>
    );
};

export default SelectImageGallery;
