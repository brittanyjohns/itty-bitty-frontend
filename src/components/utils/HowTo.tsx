import React from "react";
{
  /* <IonCard className="mb-4 p-4 shadow-md">
    <h4 className="text-xl font-semibold text-gray-800 mb-4">
    Getting Started
    </h4>
    <div className="space-y-4">
    <IonItem
        button
        onClick={() => history.push("/preset")}
        className="text-grey-700"
    >
        <IonIcon icon={caretForwardOutline} slot="start" />
        <p>Preset Boards for Quick Access</p>
    </IonItem>
    <IonItem
        button
        onClick={() => history.push("/boards")}
        className="text-grey-700"
    >
        <IonIcon icon={caretForwardOutline} slot="start" />
        <p>Communication Boards</p>
    </IonItem>
    <IonItem
        button
        onClick={() => history.push("/boards/new")}
        className="text-grey-700"
    >
        <IonIcon icon={caretForwardOutline} slot="start" />
        <p>Scenario Board Creator</p>
    </IonItem>
    <IonItem
        button
        onClick={() => history.push("/settings")}
        className="text-grey-700"
    >
        <IonIcon icon={caretForwardOutline} slot="start" />
        <p>Settings</p>
    </IonItem>
    </div>
</IonCard> */
}
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router";
function HowTo() {
  const history = useHistory();
  return (
    <IonAccordionGroup>
      <IonAccordion value="first">
        <IonItem slot="header" color="light">
          <IonLabel>Preset Boards for Quick, Easy Access</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/preset")}
            >
              <strong>Core Vocabulary:</strong> Commonly used words and phrases.
            </li>
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/boards")}
            >
              <strong>Basic Communication:</strong> Boards for basic
              communication.
            </li>
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/boards")}
            >
              <strong>Scenario Boards:</strong> Boards for holidays, events,
              routines and more.
            </li>
          </ul>
        </div>
      </IonAccordion>
      <IonAccordion value="second">
        <IonItem slot="header" color="light">
          <IonLabel>Create & Customize Communication Boards</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/boards")}
            >
              <strong>From Scratch:</strong> Create a board from scratch. Add
              images, text, and audio.
            </li>
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/boards/new")}
            >
              <strong>Scenario Board Creator:</strong> Create boards for
              specific scenarios. Tell us about your scenario, age range, and
              number of images, etc. and we'll create a board for you.
            </li>
            <li className="hover:underline cursor-pointer text-grey-700">
              <strong>Get suggestions:</strong> Build your board with the help
              of our word suggestion tool.
            </li>
          </ul>
        </div>
      </IonAccordion>
      <IonAccordion value="third">
        <IonItem slot="header" color="light">
          <IonLabel>Manage Child Accounts & Permissions</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/child-accounts")}
            >
              <strong>Manage child accounts:</strong> Create, edit, and delete
              child accounts.
            </li>
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/settings")}
            >
              <strong>Set permissions:</strong> Control what your child can
              access.
            </li>
          </ul>
        </div>
      </IonAccordion>
      <IonAccordion value="fourth">
        <IonItem slot="header" color="light">
          <IonLabel>Multiple Voice Options</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/settings")}
            >
              <strong>Change your voice:</strong> Select from multiple voice
              options.
            </li>
            <li className="hover:underline cursor-pointer text-grey-700">
              <strong> Upload your own:</strong> Record your own voice or use
              the audio of your choice.
            </li>
          </ul>
        </div>
      </IonAccordion>
      <IonAccordion value="fifth">
        <IonItem slot="header" color="light">
          <IonLabel>Build Your Perfect Experience</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/settings")}
            >
              <strong>Personalize your experience:</strong> Change the layout,
              grid sizes, and more.
            </li>
            <li
              className="hover:underline cursor-pointer text-grey-700"
              onClick={() => history.push("/settings")}
            >
              <strong>App Settings:</strong> Change app settings, like voice
              output, language, and more.
            </li>
          </ul>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  );
}
export default HowTo;
