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

  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
    }, 2000);
  };

  return (
    <div className="bg-black">
      <div
        className="hero_main1 bg-auto bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: `url(${getImageUrl("hero_main1", "webp")})`,
        }}
      >
        <div className="flex flex-col justify-center items-center text-center py-8 bg-black bg-opacity-80  pb-15">
          <h1 className="text-2xl md:text-5xl font-bold text-white mt-4">
            Empower Your Child's Communication
          </h1>
          <p className="mt-4 text-sm md:text-xl text-white">
            Discover the simplicity of SpeakAnyWay.
          </p>
          <div className="container mx-auto px-1 mt-4">
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
        </div>

        <div className="container mx-auto px-2 mb-4">
          <div className="my-5 text-center">
            <section className="rounded-sm">
              <div className="container mx-auto mb-4 p-2 shadow-lg w-2/3  bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold ">Join the Beta</h2>
                <IonItem className="flex flex-col items-center mb-4">
                  <IonInput
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    // fill="solid"
                    onIonInput={(e) => setEmail(e.detail.value || "")} // Assuming Ionic React
                  />

                  <IonButton
                    className="mt-4"
                    // size="large"
                    onClick={handleSubmitEmail}
                    disabled={!email}
                  >
                    Join Beta
                  </IonButton>
                </IonItem>
                <IonToast
                  isOpen={isOpen}
                  message={toastMessage}
                  onDidDismiss={() => setIsOpen(false)}
                  duration={2000}
                ></IonToast>
                <p className="text-xl font-bold text-gray-600 text-center">
                  Be the first to experience SpeakAnyWay!
                </p>
                <p className="text-center text-sm text-gray-600">
                  We're working on mobile apps for Android and iOS{" "}
                </p>
                <p className="mt-2 font-bold"> Stay tuned for updates!</p>
                <div className="w-full">{/* Form component goes here */}</div>
              </div>
            </section>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-1 gap-1 bg-black text-white bg-opacity-50">
            <section className="row-span-1 py-4">
              <div className="container mx-auto px-2">
                <h2 className="text-4xl font-bold text-center ">Features</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-1 mt-4">
                  {features.map((feature, index) => (
                    <Link
                      key={feature.id}
                      to="/faq"
                      className="bg-white rounded-lg shadow py-4 text-center"
                    >
                      <img
                        src={getImageUrl(`feature_${index + 1}`, "webp")}
                        // src={`/src/assets/images/feature_${index + 1}.webp`}
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
            {/* <section className="row-span-1 py-4">
              <div className="container mx-auto px-2">
                <h2 className="text-4xl font-bold text-center mb-4">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {steps.map((step, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4">
                      <img
                        // src={`src/assets/icons/round_itty_bitty_logo_1.png`}
                        src={getIconUrl(`round_itty_bitty_logo_1`, "png")}
                        alt={`Step ${index + 1}`}
                        className="mx-auto h-20 w-20"
                      />
                      <h3 className="mt-4 font-semibold text-xl text-purple-600 text-center">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="mt-2 text-md text-gray-600 text-justify">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageContent;
