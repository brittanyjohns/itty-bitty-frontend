import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { getImages } from '../data/images';
import './main.css';

function Grid() {

    const images = getImages();

    const imageElements = images.map((image, i) => {
        return (
            <IonCol key={i}>
                <img src={image.src} alt={image.label} />
            </IonCol>
        );
    }
    );

    <IonList>
          {messages.map(m => <MessageListItem key={m.id} message={m} />)}
        </IonList>

  return (
    <>
      <IonGrid>
        <IonRow>
            {imageElements}
        </IonRow>
      </IonGrid>

      <IonGrid>
        <IonRow>
          <IonCol>1</IonCol>
          <IonCol>2</IonCol>
          <IonCol>3</IonCol>
          <IonCol>4</IonCol>
          <IonCol>5</IonCol>
          <IonCol>6</IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid>
        <IonRow>
          <IonCol>1</IonCol>
          <IonCol>2</IonCol>
          <IonCol>3</IonCol>
          <IonCol>4</IonCol>
          <IonCol>5</IonCol>
          <IonCol>6</IonCol>
          <IonCol>7</IonCol>
          <IonCol>8</IonCol>
          <IonCol>9</IonCol>
          <IonCol>10</IonCol>
          <IonCol>11</IonCol>
          <IonCol>12</IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}
export default Grid;