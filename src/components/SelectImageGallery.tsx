import React, { useEffect, useState, useRef } from 'react';
import { Image, SelectImageGalleryProps } from '../data/images';
import { IonImg, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonButtons } from '@ionic/react';

import '../index.css'
import { addImageToBoard } from '../data/boards';
const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({ images, boardId, getMoreImages }) => {
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

        const imgs = getMoreImages(page, query);
        return imgs;
    }

    const resizeGrid = () => {
        const currentGrid = gridRef.current ? gridRef.current as HTMLElement : null;

        if (currentGrid) {
            const imagesCount = currentGrid.children.length || 0;
            const sqrt = Math.sqrt(imagesCount);
            const rows = Math.ceil(sqrt);
            let cols = Math.round(sqrt);

            const adjustedHeight = `calc(100vh - 60px - 32px)`;
            const adjustedWidth = `calc(100vw - 100px - 32px)`;

            currentGrid.style.width = adjustedWidth;
            currentGrid.style.height = adjustedHeight;
            currentGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            currentGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
        } else {
            console.error('Grid container not found');
        }
    }

    const handleImageClick = (image: Image) => {
        if (!image) return;
        addImageToBoard(boardId, image.id);
        window.location.reload();
    };

    const handleSearch = (event: CustomEvent) => {
        let query = '';
        const target = event.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        setPage(1);
        getMoreImages(1, query);
    }

    useEffect(() => {
        setRemainingImages(images);
    }, [images]);

    useEffect(() => {
        resizeGrid();
    }, []);

    useEffect(() => {
        loadMore();
      }, [page]);

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    Search existing images
                </IonCardTitle>
                <IonCardSubtitle>Click the image to add it to your board.</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
            <IonSearchbar debounce={1000} onIonInput={handleSearch} animated={true} placeholder="Animated"></IonSearchbar>

                <IonButtons class="flex justify-between w-full">
                    <IonButton onClick={() => previousPage()}>Prev</IonButton>
                    <IonButton onClick={() => nextPage()}>Next</IonButton>
                </IonButtons>
            </IonCardContent>
            <div className="my-auto mx-auto h-[calc(100vh-30px-32px)] w-[calc(100vw-190px-32px)] grid grid-cols-3 gap-1" ref={gridRef}>
                {remainingImages.map((image, i) => (
                    <div className='flex relative w-full hover:cursor-pointer text-center' onClick={() => handleImageClick(image)} key={image.id}>
                        <IonImg src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-md rounded bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
                            {image.label}
                            <audio>
                                <source src={image.audio} type="audio/aac" />
                            </audio>
                        </span>
                    </div>
                ))}
            </div>
        </IonCard>
    );
};

export default SelectImageGallery;
