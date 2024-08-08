import { IonItem, IonInput, IonButton } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";

interface UserHomeProps {
  userName: string;
  ipAddr: string;
}

const UserHome: React.FC<UserHomeProps> = ({ userName, ipAddr }) => {
  const history = useHistory();
  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Welcome to SpeakAnyWay!</h1>
      <h2 className="text-2xl font-semibold mb-2">
        Empowering Communication, One Click at a Time
      </h2>
      <h3 className="text-xl mb-6">
        Hi {userName}, we're thrilled to have you here!
      </h3>

      <section className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Getting Started</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Personalize Your Experience:</strong>
            <ul className="list-disc list-inside ml-6">
              <li
                onClick={() => history.push("/settiings")}
                className="cursor-pointer hover:underline"
              >
                Customize your profile and preferences.
              </li>
              <li
                onClick={() => history.push("/boards/new")}
                className="cursor-pointer hover:underline"
              >
                Create a new communication board.
              </li>
              <li
                onClick={() => history.push("/images")}
                className="cursor-pointer hover:underline"
              >
                Search for images or upload your own.
              </li>
            </ul>
          </li>
          <li>
            <strong>Explore SpeakAnyWay:</strong>
            <ul className="list-disc list-inside ml-6">
              <li>Discover a wide range of communication boards.</li>
              <li>Try out the Menu Board Creator and AI Image Generation.</li>
            </ul>
          </li>
          <li>
            <a
              href="https://www.facebook.com/speakanywayaac"
              className="font-semibold hover:underline"
              target="_blank"
            >
              <strong>Join Our Facebook Community:</strong>
            </a>
            <ul className="list-disc list-inside ml-6">
              <li>Connect with other users and share your experiences.</li>
              <li>Access helpful tips and support from fellow members.</li>
              <li></li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Your Tools</h4>
        <ul className="list-disc list-inside space-y-2 ml-6">
          <li>
            <strong>Communication Boards:</strong> Choose from a variety of
            pre-made boards.
          </li>
          <li
            onClick={() => history.push("/boards/new")}
            className="cursor-pointer hover:underline text-blue-700"
          >
            <strong>Scenario Board Creator:</strong> Create boards for specific
            scenarios.
          </li>
          <li>
            <strong>Multiple Voice Options:</strong> Choose from a variety of
            natural-sounding voices.
          </li>
          <li
            onClick={() => history.push("/menus/new")}
            className="cursor-pointer hover:underline text-blue-700"
          >
            <strong>Menu Conversion:</strong> Convert text menus into image
            boards.
          </li>
          <li>
            <strong>AI-Generated Images:</strong> Leverage AI for perfect image
            matches.
          </li>
          <li>
            <strong>Customizable Settings:</strong> Personalize your experience
            with custom settings.
          </li>
          <li>
            <strong>More Coming Soon:</strong> Stay tuned for innovative
            communication tools.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Tips for Success</h4>
        <ul className="list-disc list-inside space-y-2 ml-6">
          <li>
            <strong>Frequent Use:</strong> The more you use SpeakAnyWay, the
            easier it gets!
          </li>
          <li>
            <strong>Feedback:</strong> We value your feedback. Let us know how
            we can improve!
          </li>
          <li>
            <strong>Support:</strong> Need help? Check out{" "}
            <span
              onClick={() => history.push("/help")}
              className="cursor-pointer hover:underline text-blue-700"
            >
              our FAQs
            </span>{" "}
            or contact us at{" "}
            <a
              href="mailto:hello@speakanyway.com"
              className="text-blue-500 underline"
            >
              hello@speakanyway.com
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Stay Connected</h4>
        <p>
          Follow us on social media for updates, tips, and stories from our
          community:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-6">
          <li>
            <a
              href="https://www.facebook.com/speakanywayaac"
              className="text-blue-500 underline"
            >
              Facebook
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Ready to Get Started?</h4>
        <p>
          Explore the app and discover all the ways SpeakAnyWay can enhance your
          communication experience!
        </p>
      </section>

      <footer className="text-center mt-8">
        <p>
          Happy Communicating,
          <br />
          The SpeakAnyWay Team
        </p>
      </footer>
    </div>
  );
};

export default UserHome;
