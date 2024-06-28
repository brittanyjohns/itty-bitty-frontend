import { Link } from "react-router-dom"; // Assuming React Router for navigation
import { getIconUrl, getImageUrl } from "../data/utils";
import { IonButton, IonInput, IonItem, IonToast } from "@ionic/react";
import { useState } from "react";
import { BetaRequest, createBetaRequest } from "../data/beta_requests";
interface MainPageContentProps {
  ipAddr: string;
}
const MainPageContent = ({ ipAddr }: MainPageContentProps) => {
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
    <div className="container p-1 bg-white bg-opacity-50 mx-auto shadow-lg">
      <div
        className="hero_main1 bg-cover bg-center min-h-48 md:min-h-96"
        style={{ backgroundImage: `url(${getImageUrl("hero_main1", "webp")})` }}
      >
        <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-50">
          <h1 className="text-2xl md:text-5xl font-bold text-white">
            Empower Your Child's Communication
          </h1>
          <p className="mt-4 text-sm md:text-xl text-white">
            Discover the simplicity of SpeakAnyWay.
          </p>
        </div>
      </div>
      <div className="mt-5 text-center">
        <section className="p-1 rounded-sm bg-white">
          <div className="container mx-auto px-1">
            <div className="mt-4 space-x-2 space-y-2">
              <Link
                to="/demo"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Learn More
              </Link>
              <Link
                to="/faq"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                FAQs
              </Link>
            </div>
            <div className="mt-1 text-center">
              <Link
                to="/demo"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg sm:mt-5"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="container mx-auto mt-4 p-4 shadow-lg w-2/3 md:w-1/2">
            <h2 className="text-2xl font-bold text-center">Join the Beta</h2>
            <IonItem>
              <IonInput
                type="email"
                value={email}
                placeholder="Enter your email"
                className="w-full"
                onIonChange={(e) => setEmail(e.detail.value || "")} // Assuming Ionic React
              />
              <IonButton className="" onClick={handleSubmitEmail}>
                Join Beta
              </IonButton>
              <IonToast
                isOpen={isOpen}
                message={toastMessage}
                onDidDismiss={() => setIsOpen(false)}
                duration={2000}
              ></IonToast>
            </IonItem>
            <p className="text-lg text-gray-600 my-4 text-center">
              Enter your email to join the beta & get early access to all of the
              most recent features.
            </p>
            <p className="text-center text-sm text-gray-600">
              We're working on mobile apps for Android and iOS{" "}
              <span className="font-bold"> Stay tuned for updates!</span>
            </p>
            <div className="w-full">{/* Form component goes here */}</div>
          </div>
        </section>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-1">
        <section className="row-span-1 py-4 bg-white">
          <div className="container mx-auto px-2">
            <h2 className="text-4xl font-bold text-center  text-black">
              Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1 mt-8">
              {features.map((feature, index) => (
                <Link
                  key={feature.id}
                  to="/faq"
                  className="bg-white rounded-lg shadow p-4 text-center"
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
        <section className="col-span-1 p-4 bg-white">
          <div className="container mx-auto px-2">
            <h2 className="text-4xl font-bold text-center mb-4 text-black">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="">
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
        </section>
      </div>
    </div>
  );
};

export default MainPageContent;
