import React, { useEffect, useState, useRef, MouseEventHandler } from 'react';
import { Image, SelectImageGalleryProps, findOrCreateImage } from '../data/images';
import { IonImg, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonButtons, IonTitle } from '@ionic/react';


const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({ images, boardId, onImageClick, onLoadMoreImages, searchInput }) => {
    const [remainingImages, setRemainingImages] = useState<Image[]>(images);
    const [page, setPage] = useState(1);
    // const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            const imgs = await onLoadMoreImages(page, searchInput);
            setRemainingImages(imgs);
        };
        fetchImages();
    }, [page, searchInput]);

    const handleCreateImage = () => {
        console.log('Create Image', searchInput);
        const formData = new FormData();
        formData.append('image[label]', searchInput);
        async function createImage() {
            const img = await findOrCreateImage(formData, false);
            console.log('created image', img);
            setRemainingImages([img]);
        }
        createImage();

    }

    const handleOnImageClick = (image: Image) => {
        onImageClick(image);
    }

    return (
        <div className='h-full'>
            <IonCardHeader>

                {boardId && <IonCardSubtitle className='text-xs text-center'>Click an image to add it to the board</IonCardSubtitle>}
                <IonButtons class="flex justify-between w-full text-center">
                    <IonButton disabled={page <= 1} onClick={() => setPage(oldPage => Math.max(1, oldPage - 1))}>Prev</IonButton>
                    <IonTitle>Page {page}</IonTitle>
                    <IonButton onClick={() => setPage(oldPage => oldPage + 1)}>Next</IonButton>
                </IonButtons>
            </IonCardHeader>
            <IonCardContent>
                <div className="my-auto mx-auto grid grid-cols-3" key={remainingImages.length}>
                    {remainingImages.map((image, i) => (
                        <div className='flex relative w-full hover:cursor-pointer text-center border bg-white rounded-lg min-h-24 m-1' onClick={() => handleOnImageClick(image)} key={image.id} id={`image_${image.id}`}>
                            <IonImg src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                            <div className="font-medium text-xs md:text-sm lg:text-md rounded bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black mt-2">
                                {image.label}
                                <audio>
                                    <source src={image.audio} type="audio/aac" />
                                </audio>
                            </div>
                        </div>
                    ))}
                    {remainingImages.length < 1 && <p className="col-span-3 text-center">No images found</p>}
                    {remainingImages.length < 4 && searchInput.length > 2 &&
                    <IonButton className="col-span-3 text-center mt-3" onClick={handleCreateImage}>Create Image for "{searchInput}"
                    </IonButton>}

                </div>
                {remainingImages.length > 12 &&
                <IonButtons class="flex justify-between w-full mt-3 text-center">
                    <IonButton disabled={page <= 1} onClick={() => setPage(oldPage => Math.max(1, oldPage - 1))}>Prev</IonButton>
                    <IonTitle>Page {page}</IonTitle>
                    <IonButton onClick={() => setPage(oldPage => oldPage + 1)}>Next</IonButton>
                </IonButtons>
                }
            </IonCardContent>
        </div>
    );
};

export default SelectImageGallery;
