"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/backgroud-lines";
import { date } from "zod";

export default function Home() {
  const router = useRouter();
  const workInfoData = [
    {
      title: "Algorithm Visualization Made Easy",
      text: "See algorithms come to life with our intuitive visualization tools, making complex concepts easier to understand.",
    },
    {
      title: "Run Your Code Online",
      text: "Compile and execute your Python code online, without the need for any additional setup or installations. ",
    },
    {
      title: "Learn Algorithms with Ease",
      text: "Access a wide range of learning resources, tutorials, and examples to master algorithms at your own pace.",
    },
  ];

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative overflow-scroll flex flex-col gap-4 items-center justify-center px-4 h-[100%] pt-4 scroll-smooth no-scrollbar "
      >
        <div className="home-container h-full bg-none no-scrollbar lg:max-w-[90%] scroll-smooth">
          <div className="home-text-section">
            <div className="flex flex-col items-center justify-center text-center">
              <BackgroundLines className=" flex items-center h-full lg:justify-center w-screen  flex-col px-4 bg-none scroll-smooth">
                <h1 className=" font-bold text-black text-sm sm:text-sm md:text-sm lg:text-xl  leading-tight">
                  Unleash Your Algorithmic Potential with <br />
                </h1>
                <span className="text-5xl font-bold md:text-3xl lg:text-9xl ">
                  VisualizeX
                </span>
                <p className="text-sm sm:text-xl md:text-2xl text-gray-600 mt-4 leading-relaxed">
                  Welcome to VisualizeX, the ultimate platform for learning and
                  developing algorithms.With our <br />
                  integrated algorithm visualizer and online IDE, you can
                  explore, experiment, and master the <br />
                  art of algorithms.
                </p>
                <Button
                  className="mb-2 shadow-lg hover:scale-105"
                  onClick={() => router.replace(`/dashboard`)}
                >
                  Get Started
                </Button>
                {/* <div className="flex">
          <Image src="/images/icons8-algorithm-64.png" alt="Aurora" width={100} height={100}></Image>
         </div> */}

                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <Image
                    width={800}
                    height={800}
                    src="/gifs/homescreen.gif"
                    alt="Algorithm Visualization"
                    className="max-w-xs rounded-lg z-20 mt-4 shadow-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
                  />
                </div>
              </BackgroundLines>
            </div>
          </div>

          <div className="about-text-section flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 gap-8">
            <div className="flex flex-col w-full md:w-1/2 text-left items-start">
              <h1 className="font-bold text-black text-3xl sm:text-4xl md:text-5xl leading-tight">
                Experience the Power of 
                Algorithm Visualization
               
                and Online Coding
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mt-4 leading-relaxed max-w-xl">
              VisualizeX provides a comprehensive web application that combines
              a powerful development environment with interactive tools for
              learning algorithms. With algorithm visualization, an online
              compiler, and a wide range of learning resources, you can enhance
              your coding skills and understand complex algorithms with ease.
            </p>
          </div>

          <div className="work-section-wrapper">
            <div className=" px-6 py-10">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workInfoData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg text-center transition-transform transform hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-col items-center justify-center text-center">
              <h1 className="font-bold text-black text-3xl sm:text-4xl md:text-5xl leading-tight">
                Explore VisualizeX
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mt-4 leading-relaxed">
                Experience the Power of our Integrated Algorithm Visualizer and
                Online IDE
              </p>
              <Button
                className="mb-2 shadow-lg hover:scale-105"
                onClick={() => router.replace(`/onlineIDE`)}
              >
                Run Code
              </Button>
            </div>
          </div>
          <div className="Description-section flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 gap-8 bg-none">
            <div className="flex flex-col w-full md:w-1/2 text-left items-start">
              <h2 className="font-bold text-black text-3xl sm:text-4xl md:text-4xl leading-tight">
                VisualizeX: Empowering Developers with Algorithm Visualization
                and Online IDE
              </h2>
              <p className="text-lg sm:text-xl md:text-1xl text-gray-400 mt-4 leading-relaxed max-w-xl">
                At VisualizeX, our mission is to provide students with a
                comprehensive web application that combines a powerful
                development environment with interactive algorithm visualization
                tools. With our platform, users can easily learn and understand
                complex algorithms through visualizations and run Python code on
                our online compiler. Join us on this journey as we revolutionize
                the way developers learn and implement algorithms.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <img
                src="/images/algorithm-visualizer.png"
                alt="Algorithm Visualization"
                className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
              />
            </div>
          </div>

          <div className="Contact-text-section flex flex-col items-center justify-center text-center">
            <h1 className="font-bold text-3xl sm:text-xl md:text-3xl text-black mt-4 leading-relaxed">
              Contact Us
            </h1>
            <h2 className="font-bold text-lg sm:text-xl md:text-xl text-black mt-4 leading-relaxed">
              If you have any questions or need assistance, feel free to reach
              out to us.
            </h2>
            <div className="contact-form-container flex flex-wrap items-center ">
              <input
                type="text"
                placeholder="yourmail@gmail.com"
                className="flex-grow h-[45px] pl-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:flex-1"
              />
              <Button
                className="ml-2 h-[40px] px-5 shadow-lg rounded-lg text-lg"
                onClick={() => router.replace(`/`)}
              >
                Submit
              </Button>
            </div>
          </div>

          <div className="footer-section flex flex-col md:flex-row items-left justify-between px-6 md:px-16 lg:mt-5 lg:mb-2 py-10 gap-8">
            <div className="flex flex-col sm:items-start ">
              <span className="mb-2 font-bold text-3xl">VisualizeX</span>
              <span className="mb-2 font-bold text-black">Teams:</span>
              <span className="mb-2 text-gray-400">Shreyash Bhosale</span>
              <span className="mb-2 text-gray-400">Eklakh Ansari</span>
            </div>
            <div className="flex flex-col sm:items-start ">
              <span className="mb-2 font-bold text-black">Resources :</span>
              <span className="mb-2 text-gray-400">Sorting Algorithms</span>
              <span className="mb-2 text-gray-400">Why Learn Algorithms</span>
              <span className="mb-2 text-gray-400">Type of Algorithms</span>
              <span className="mb-2 text-gray-400">Learning Resources</span>
              <span className="mb-2 text-gray-400">DSA: Topics</span>
            </div>
            <div className="flex flex-col sm:items-start ">
              <span className="mb-2 text-gray-400">Home</span>
              <span className="mb-2 text-gray-400">Explore</span>
              <span className="mb-2 text-gray-400">Algorithms</span>
              <span className="mb-2 text-gray-400">About Us</span>
              <span className="mb-2 text-gray-400">Contact Us</span>
            </div>
            <div className="flex flex-col sm:items-start">
              <span className="mb-2 text-gray-400">
                @{new Date().getFullYear()} VisualizeX. All rights reserved.
              </span>
              <span className="mb-2 text-gray-400">Terms of Services</span>
              <span className="mb-2 text-gray-400">Privacy Policy</span>
              <span className="mb-2 text-gray-400">Cookie Settings</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
