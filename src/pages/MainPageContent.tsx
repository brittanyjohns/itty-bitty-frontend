import React from "react";
import { Link } from "react-router-dom"; // Assuming React Router for navigation

const MainPageContent = () => {
  const steps = [
    {
      title: "Create a Board",
      description:
        "Upload your images or choose from our library to create personalized communication boards.",
    },
    {
      title: "Print or Use Digitally",
      description:
        "Print your board or use it digitally on a tablet or smartphone.",
    },
    {
      title: "Communicate",
      description:
        "Use the board to communicate with your child, and watch their confidence grow.",
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

  return (
    <div className="container p-4 bg-white bg-opacity-50 mx-auto shadow-lg">
      <div
        className="hero_main1 bg-cover bg-center min-h-48 md:min-h-96"
        style={{ backgroundImage: "url('/public/images/hero_main1.webp')" }}
      >
        <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-50">
          <h1 className="text-2xl md:text-5xl font-bold text-white">
            Empower Your Child's Communication
          </h1>
          <p className="mt-4 text-sm md:text-lg text-white">
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
                to="/register"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg sm:mt-5"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="container mx-auto mt-4 px-1 py-5">
            <h2 className="text-2xl font-bold text-center text-black">
              Join the Beta
            </h2>
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <section className="row-span-1 py-8 bg-white">
          <div className="container mx-auto px-2">
            <h2 className="text-4xl font-bold text-center  text-black">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
              {features.map((feature, index) => (
                <Link
                  key={feature.id}
                  to="/faq"
                  className="bg-white rounded-lg shadow p-4 text-center"
                >
                  <img
                    src={`/public/images/feature_${index + 1}.webp`}
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
        <section className="col-span-1 py-3 bg-white">
          <div className="container mx-auto px-2">
            <h2 className="text-4xl font-bold text-center mb-4 text-black">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <img
                    src={`/public/icons/round_itty_bitty_logo_1.png`}
                    alt={`Step ${index + 1}`}
                    className="mx-auto h-20 w-20"
                  />
                  <h3 className="mt-4 font-semibold text-xl text-purple-600">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="mt-2 text-md text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="col-span-1 py-3 bg-white">
          <div className="container mx-auto px-2">
            <h2 className="text-4xl font-bold text-center mb-4">
              Try it for yourself!
            </h2>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainPageContent;
