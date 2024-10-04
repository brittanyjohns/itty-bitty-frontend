import { IonCard, IonIcon, IonItem, useIonViewWillEnter } from "@ionic/react";
import { logoFacebook } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router-dom";

interface UserHomeProps {
  userName: string;
  trialDaysLeft?: number;
  freeAccount?: boolean;
  tokens?: number;
}

const UserHome: React.FC<UserHomeProps> = ({
  userName,
  trialDaysLeft,
  freeAccount,
  tokens,
}) => {
  const history = useHistory();
  useIonViewWillEnter(() => {});

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to SpeakAnyWay!
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          Empowering Communication Through Technology
        </h2>
      </div>

      <h3 className="text-lg text-gray-700 my-4">
        Hi {userName}, we're thrilled to have you here!
      </h3>

      {freeAccount && (
        <section className="mb-6 text-center">
          {trialDaysLeft && trialDaysLeft > 0 ? (
            <div
              className="text-lg p-4 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 w-full md:w-3/4 mx-auto cursor-pointer"
              onClick={() => history.push("/upgrade")}
            >
              <span className="font-semibold block mb-2">
                Free Trial: {trialDaysLeft} Days Left
              </span>
              <p>
                Enjoy premium features of SpeakAnyWay. Click to upgrade and
                continue unlocking all the tools!
              </p>
            </div>
          ) : (
            <div
              className="text-lg p-4 bg-red-100 text-red-900 rounded-lg hover:bg-red-200 w-full md:w-3/4 mx-auto cursor-pointer"
              onClick={() => history.push("/upgrade")}
            >
              <span className="font-semibold block mb-2">Trial Expired</span>
              <p>Upgrade to continue accessing premium features.</p>
            </div>
          )}
        </section>
      )}

      <div className="px-2 w-full md:w-3/4 mx-auto">
        <IonCard className="mb-4 p-4 shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Getting Started
          </h4>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>
              <strong>Personalize Your Experience:</strong>
              <ul className="list-inside list-disc pl-4 mt-2">
                <li
                  className="hover:underline cursor-pointer text-blue-700"
                  onClick={() => history.push("/settings")}
                >
                  Customize your profile and preferences.
                </li>
                <li
                  className="hover:underline cursor-pointer text-blue-700"
                  onClick={() => history.push("/boards")}
                >
                  Create a new communication board.
                </li>
                <li
                  className="hover:underline cursor-pointer text-blue-700"
                  onClick={() => history.push("/images")}
                >
                  Search or upload images.
                </li>
              </ul>
            </li>
          </ul>
        </IonCard>

        <section className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Features Overview
          </h4>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>
              <strong>Communication Boards:</strong> Choose from a variety of
              pre-made boards.
            </li>
            <li
              className="hover:underline cursor-pointer text-blue-700"
              onClick={() => history.push("/boards/new")}
            >
              Scenario Board Creator: Create boards for specific scenarios.
            </li>
            <li>
              <strong>Multiple Voice Options:</strong> Customize voice output
              for your boards.
            </li>
          </ul>
        </section>

        <section className="mb-4 p-4">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Stay Connected
          </h4>
          <p className="text-md text-gray-700">
            Follow us on social media for updates:{" "}
            <a href="https://www.facebook.com/speakanywayaac" className="m-2">
              <IonIcon
                size="large"
                icon={logoFacebook}
                className="text-blue-600"
              />
            </a>
          </p>
        </section>

        <section className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h4>
          <p className="text-md text-gray-700">
            Contact support:{" "}
            <a href="mailto:hello@speakanyway.com" className="text-blue-700">
              hello@speakanyway.com
            </a>
          </p>
        </section>

        <footer className="text-center my-4">
          <p className="text-md text-gray-700">
            Happy Communicating,
            <br />
            The SpeakAnyWay Team
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserHome;
