import { Link } from "react-router-dom"; // Assuming React Router for navigation
import { getIconUrl, getImageUrl } from "../data/utils";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonInput,
  IonItem,
  IonToast,
} from "@ionic/react";
import { useState } from "react";
import { BetaRequest, createBetaRequest } from "../data/beta_requests";
import { useHistory } from "react-router-dom";
import "./MainPage.css";
import SignUpForm from "../components/utils/SignUpForm";
import Footer from "../components/utils/Footer";
interface MainPageContentProps {
  ipAddr: string;
}

const MainPageContent = ({ ipAddr }: MainPageContentProps) => {
  const history = useHistory();
  const steps = [
    {
      title: "Customize and Share Communication Boards",
      description:
        "Create personalized communication boards by uploading your own images or selecting from our curated library. Collaborate and share boards with educators and therapists to foster a supportive community, ensuring a unified approach to development and learning.",
    },
    {
      title: "Flexible Usage and Real-Time Sync",
      description:
        "Use your custom boards digitally on any device or print them for physical interaction. Enjoy real-time synchronization across devices, allowing parents to update boards and settings instantly, which are reflected on the child's device immediately.",
    },
    {
      title: "Empower Through Interactive Communication",
      description:
        "Enhance your child's ability to express themselves with voice output and interactive touch features. Watch as SpeakAnyWay boosts their confidence and communication skills in an educational and engaging manner.",
    },
    {
      title: "Parental Control and Accessibility",
      description:
        "Easily set up and manage your child’s account with full parental controls. Adjust board configurations or content from anywhere, ensuring your child has access to the most effective communication tools as their needs evolve.",
    },
  ];

  const features = [
    {
      id: 1,
      title: "Custom Boards",
      description: "Create custom communication boards with ease.",
    },
    {
      id: 2,
      title: "AI-Generated Images",
      description: "Leverage AI for perfect image matches.",
    },
    {
      id: 3,
      title: "Scenario-based Boards",
      description: "Create boards for specific scenarios.",
    },
    {
      id: 4,
      title: "Menu Conversion",
      description: "Convert text menus into image boards.",
    },
    {
      id: 5,
      title: "More Coming Soon",
      description: "Stay tuned for innovative communication tools.",
    },
  ];

  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmitEmail = () => {
    console.log("Email submitted: ", email);
    const betaRequest: BetaRequest = { email, ip: ipAddr }; // Create a betaRequest object
    createBetaRequest(betaRequest) // Pass the betaRequest object as an argument
      .then((response: any) => {
        console.log("Beta request submitted successfully: ", response);
        // Handle success
      })
      .catch((error: any) => {
        console.error("Error submitting beta request: ", error);
        // Handle error
      });

    setEmail(""); // Clear the email input field
    setToastMessage("Thank you for joining the beta! We'll be in touch soon.");
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2500);
    window.location.href = "/sign-up?email=" + email;
  };

  return (
    <div className="relative lower-fixed-bg">
      <div className="w-full md:w-11/12 lg:w-11/12 mx-auto">
        <div className="flex flex-col justify-center items-center text-center py-4 lg:py-8">
          <h1 className="text-2xl md:text-5xl font-bold text-white mt-4">
            Empower Your Child's Communication
          </h1>
          <p className="mt-4 text-sm md:text-xl text-white">
            Discover the simplicity of SpeakAnyWay.
          </p>
        </div>

        <div className="">
          <div className="xfixed-bg rounded-lg shadow-lg xbg-white bg-opacity-95 p-4 md:p-8 lg:p-8 mt-4">
            <div className="flex justify-center items-center p-4">
              <IonButton
                onClick={() => history.push("/about")}
                className="mr-3"
                color="light"
                size="large"
              >
                Learn More
              </IonButton>

              <IonButton
                onClick={() => history.push("/demo")}
                className="ml-3"
                color={"light"}
                size="large"
              >
                Demo
              </IonButton>
            </div>
            {/* <div className="relative h-80 md:h-96 lg:h-96 w-11/12 md:w-1/2 lg:w-1/2 mx-auto">
              <div className="p-0 bg-white bg-opacity-95 absolute bottom-45 left-0 right-0 mt-5 shadow-xl  p-4  rounded-lg">
                <IonToast
                  isOpen={isOpen}
                  message={toastMessage}
                  onDidDismiss={() => setIsOpen(false)}
                  duration={2000}
                ></IonToast>
                <p className="text-xl font-bold text-center my-2">
                  Stay updated on all things SpeakAnyWay!
                </p>
                <p className="text-center text-lg font-md mb-4">
                  We're working on mobile apps for Android and iOS{" "}
                </p>

                <IonInput
                  type="email"
                  value={email}
                  label="Email"
                  labelPlacement="floating"
                  fill="outline"
                  className="mt-2"
                  onIonInput={(e) => setEmail(e.detail.value || "")} // Assuming Ionic React
                />

                <IonButton
                  className="font-bold mt-2 py-3 w-full md:w-1/2 lg:w-1/2 mx-auto"
                  size="large"
                  expand="block"
                  color="success"
                  type="submit"
                  onClick={handleSubmitEmail}
                  disabled={!email}
                >
                  Go
                </IonButton>
              </div>
            </div> */}
            <div className="h-40 md:h-20"></div>

            <div className=" h-80 md:h-96 lg:h-96 mt-5">
              <div className="shadow-overlay text-white p-4 md:p-8 lg:p-8 bg-opacity-90 rounded-lg">
                <section className="">
                  <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {features.map((feature, index) => (
                        <Link
                          key={feature.id}
                          to="/faq"
                          className="bg-white rounded-lg shadow p-4 text-center"
                        >
                          <img
                            src={getImageUrl(`feature_${index + 1}`, "webp")}
                            alt={feature.title}
                            className="h-40 object-cover rounded-md mx-auto"
                          />
                          <h3 className="mt-2 font-semibold text-lg text-purple-600">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="h-40 md:h-20"></div>
          </div>
        </div>
      </div>
      <div className=" h-80 md:h-96 lg:h-96 ">
        {/* <div className="h-60"></div> */}

        {/* <div className=" h-60">
          <SignUpForm plan="free" />
        </div> */}

        <div className=""></div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default MainPageContent;
