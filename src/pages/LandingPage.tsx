import React from "react";
import { IonButton, IonButtons } from "@ionic/react";
import { getImageUrl } from "../data/utils";
import "./LandingPage.css";
import { useHistory } from "react-router";
import SignUpForm from "../components/utils/SignUpForm";
import InlineSignUp from "../components/utils/InlineSignUp";

const LandingPage: React.FC = () => {
  const history = useHistory();
  return (
    <div className="relative lower-fixed-bg">
      <div className="w-full md:w-11/12 lg:w-11/12 mx-auto">
        <div className="flex flex-col justify-center items-center text-center py-4 lg:py-8 shadow-overlay rounded-lg">
          <h1 className="text-2xl md:text-5xl font-bold text-white mt-4">
            Empower Your Child's Communication
          </h1>
          <p className="my-4 text-md md:text-2xl text-white">
            Discover the simplicity of SpeakAnyWay.
          </p>
          <IonButtons className="mt-4 mb-4">
            <IonButton
              onClick={() => history.push("/about")}
              color="light"
              fill="outline"
              size="default"
              className="mr-3"
            >
              Learn More
            </IonButton>
            <IonButton
              onClick={() => history.push("/sign-up")}
              color="light"
              fill="outline"
              size="default"
            >
              Sign Up
            </IonButton>
          </IonButtons>
        </div>

        <div className="xfixed-bg rounded-lg shadow-lg xbg-white bg-opacity-95 p-4 md:p-8 lg:p-8 mt-2">
          <div className="flex justify-center items-center p-4">
            {/* <InlineSignUp plan="free" /> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="pb-6 pt-6 px-6 bg-black text-white bg-opacity-85 blur-box"
      >
        <h2 className="text-4xl font-bold text-center mb-8">Features</h2>
        <h3 className="text-xl md:text-2xl md:text-2xl font-serif font-bold mb-4 pb-2 text-center">
          Multiple ways of creating a communication board
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <img
            src={getImageUrl(`image_5`, "webp")}
            alt="Communication board creation"
            className="h-80 object-contain hover:object-scale-down rounded-lg shadow-md mx-auto"
          />

          <div className="text-white p-1 rounded-lg shadow-md">
            <ul className="list-none">
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">By hand:</p>
                <p className="text-sm">
                  &nbsp;- Add words one at a time.{" "}
                  <span className="text-sm block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Customize the board to your liking!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">From a word list:</p>{" "}
                <p className="text-sm">
                  &nbsp;- Input a list of words to create images from.
                  <span className="text-sm block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Perfect for importing from other sources!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">From a scenario:</p>{" "}
                <p className="text-sm">
                  &nbsp;- Describe any event, routine, or activity to create a
                  board.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Great for creating boards on the fly!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">From a menu:</p>{" "}
                <p className="text-sm">
                  &nbsp;- Upload a menu to create a custom board instantly!
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Order with confidence!
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customizable Communication Boards */}
      <section
        id="custom-boards"
        className="pb-12 pt-6 px-6 bg-black text-white bg-opacity-85 blur-box"
      >
        <h3 className="text-xl md:text-2xl md:text-2xl font-serif font-bold mb-4 pb-2 text-center">
          Customizable Communication Boards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Placeholder for image 3 */}
          <img
            src={getImageUrl(`image_1`, "webp")}
            alt="Communication board creation"
            className="h-80 object-contain hover:object-scale-down rounded-lg shadow-md mx-auto"
          />

          <div className="text-white p-1 rounded-lg shadow-md">
            <ul className="list-none">
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">Fits any screen size:</p>
                <p className="text-sm">
                  &nbsp;- Easily adapts to mobile, tablet, and desktop displays.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Optimized for all devices!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Resizable cells for emphasis:
                </p>
                <p className="text-sm">
                  &nbsp;- Adjust the size of cells to highlight important
                  information.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Prioritize content as you see fit!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Six natural-sounding voices:
                </p>
                <p className="text-sm">
                  &nbsp;- Choose from a variety of voices that sound just like
                  real people.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Perfect for clear, accessible communication!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Colored cells based on part of speech:
                </p>
                <p className="text-sm">
                  &nbsp;- Differentiate words by their grammatical roles using
                  color-coded cells.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Enhance understanding and recognition of
                    language!
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Image Features */}
      <section
        id="custom-boards"
        className="pb-12 pt-6 px-6 bg-black text-white bg-opacity-85 blur-box"
      >
        <h3 className="text-xl md:text-2xl md:text-2xl font-serif font-bold mb-4 pb-2 text-center">
          Easily Add Images to Your Boards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="text-white p-1 rounded-lg shadow-md">
            <ul className="list-none ml-2">
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Search with built-in Google image search:
                </p>
                <p className="text-sm">
                  &nbsp;- Quickly find relevant images using the integrated
                  Google search.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Get results instantly, right from the app!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">Upload your own images:</p>
                <p className="text-sm">
                  &nbsp;- Add personal images to customize your boards even
                  further.
                  <span className="text-sm block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Perfect for adding a personal touch to any
                    board!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Generate images from text using AI:
                </p>
                <p className="text-sm">
                  &nbsp;- Turn text descriptions into stunning images with
                  advanced AI technology.
                  <span className="text-sm block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Create custom visuals in seconds!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Browse our library of images:
                </p>
                <p className="text-sm">
                  &nbsp;- Access a curated collection of images to enhance your
                  content.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Find the perfect image for any situation!
                  </span>
                </p>
              </li>
            </ul>
          </div>

          {/* Placeholder for image 4 */}
          <img
            src={getImageUrl(`image_2`, "webp")}
            alt="Communication board creation"
            className="h-80 object-contain hover:object-scale-down rounded-lg shadow-md mx-auto"
          />
        </div>
      </section>

      {/* Child Accounts */}
      <section
        id="custom-boards"
        className="pb-12 pt-6 px-6 bg-black text-white bg-opacity-85 blur-box"
      >
        <h3 className="text-xl md:text-2xl md:text-2xl font-serif font-bold mb-4 pb-2 text-center">
          Child Account Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Placeholder for image 5 */}
          <img
            src={getImageUrl(`image_6`, "webp")}
            alt="Communication board creation"
            className="h-80 object-contain hover:object-scale-down rounded-lg shadow-md mx-auto"
          />
          <div className="text-white p-1 rounded-lg shadow-md">
            <ul className="list-none">
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Create and manage child accounts:
                </p>
                <p className="text-sm">
                  &nbsp;- Set up individual accounts for your children, allowing
                  them to have personalized settings and boards.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Perfect for managing multiple users under one
                    parent account!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Share boards and monitor progress:
                </p>
                <p className="text-sm">
                  &nbsp;- Effortlessly share communication boards with your
                  child and keep track of their progress.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Stay connected and engaged in their learning
                    journey!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  View usage statistics and word patterns:
                </p>
                <p className="text-sm">
                  &nbsp;- Gain insights into how your child is using the app
                  with detailed statistics and word usage patterns.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Track progress and adjust boards for optimal
                    learning!
                  </span>
                </p>
              </li>
              <li className="mt-2 p-2 rounded-lg shadow-md border">
                <p className="font-bold text-lg">
                  Manage everything from the parent account:
                </p>
                <p className="text-sm">
                  &nbsp;- Control and monitor all aspects of the child accounts
                  from one central parent dashboard.
                  <span className="text-md block font-semibold ml-3 italic mt-1">
                    &nbsp;&nbsp; Simplified management with full oversight!
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Subscription Details */}
      <section
        id="subscription"
        className="py-12 px-4 bg-white text-black bg-opacity-95"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Subscription Options</h3>
          <p className="mb-4">
            Start with a free trial and choose between monthly or yearly
            subscriptions. Cancel anytime!
          </p>
          <IonButton
            color="light"
            size="large"
            onClick={() => history.push("/pricing")}
          >
            Get Started
          </IonButton>
        </div>
        <div className="flex justify-center items-center p-4">
          <InlineSignUp plan="free" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} SpeakAnyWay. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
