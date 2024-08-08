import { Link } from "react-router-dom"; // Assuming React Router for navigation
import { getIconUrl, getImageUrl } from "../data/utils";
import {
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonToast,
} from "@ionic/react";
import { useState } from "react";
import { BetaRequest, createBetaRequest } from "../data/beta_requests";
import { useHistory } from "react-router-dom";
import "./MainPage.css";
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
    <div className="">
      <div className="">
        <div className="flex flex-col justify-center items-center text-center py-4 lg:py-8 shadow-overlay">
          <h1 className="text-2xl md:text-5xl font-bold text-white mt-4">
            Empower Your Child's Communication
          </h1>
          <p className="mt-4 text-sm md:text-xl text-white">
            Discover the simplicity of SpeakAnyWay.
          </p>
        </div>

        <div className="flex flex-col justify-center items-center text-center gap-4">
          <div className="fixed-bg">
            <div className="h-10 md:h-24 lg:h-32 my-2 md:my-4">
              <IonButton
                onClick={() => history.push("/about")}
                className=""
                color="light"
              >
                Learn More
              </IonButton>

              <IonButton
                onClick={() => history.push("/demo")}
                className=""
                color={"light"}
              >
                Demo
              </IonButton>
            </div>
            <div className="relative h-80 md:h-96 lg:h-96 w-full">
              <div className="p-2 bg-white absolute bottom-0 left-0 right-0 mt-5">
                <IonToast
                  isOpen={isOpen}
                  message={toastMessage}
                  onDidDismiss={() => setIsOpen(false)}
                  duration={2000}
                ></IonToast>
                <p className="text-xl font-bold text-gray-600 text-center my-2">
                  Stay updated on all things SpeakAnyWay!
                </p>
                <p className="text-center text-sm text-gray-600">
                  We're working on mobile apps for Android and iOS{" "}
                </p>
                <p className="mt-2 font-bold">Stay tuned for updates!</p>
                <IonItem className="w-full md:w-2/3 mx-auto border">
                  <IonInput
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onIonInput={(e) => setEmail(e.detail.value || "")} // Assuming Ionic React
                  />

                  <IonButton
                    className="mt-4"
                    onClick={handleSubmitEmail}
                    disabled={!email}
                  >
                    Go
                  </IonButton>
                </IonItem>
              </div>
            </div>
            <div className="relative  h-80 md:h-96 lg:h-96">
              <div className="shadow-overlay text-white px-5">
                <section className="row-span-1 py-4">
                  <div className="container mx-auto px-2">
                    <h2 className="text-4xl font-bold text-center">Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-1 mt-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageContent;
