import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mouse } from "lucide-react";
import CourseSection from "../components/Courses";

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    window.scrollTo({
      top: 900,
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <div>
      <div className="relative w-full min-h-screen">
        <div className="absolute inset-0 w-full h-full -z-10">
          <img
            src="./clg-img-2.webp"
            alt="main college image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/10"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] leading-none text-white font-extrabold text-center flex flex-col items-start mx-4 sm:ml-6 md:ml-8 lg:ml-10 justify-center h-screen"
        >
          <motion.p
            custom={0}
            variants={textVariants}
            className="leading-[0.9]"
          >
            AMRIT
          </motion.p>
          <motion.p
            custom={0.5}
            variants={textVariants}
            className="leading-[0.9] ml-[1rem] sm:ml-[2rem] md:ml-[2.5rem] lg:ml-[3rem]"
          >
            SCIENCE
          </motion.p>
          <motion.p
            custom={1}
            variants={textVariants}
            className="leading-[0.9] ml-[2rem] sm:ml-[3rem] md:ml-[4rem] lg:ml-[6rem]"
          >
            CAMPUS
          </motion.p>
        </motion.div>

        <div
          onClick={handleScroll}
          className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center gap-2 z-20"
        >
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer"
          >
            <Mouse size={32} className="animate-bounce" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : -10,
            }}
            className="text-xs sm:text-sm font-light tracking-wider whitespace-nowrap"
          >
            Scroll Down
          </motion.p>
        </div>
      </div>
      <div className="flex justify-evenly mt-10">
        <div className="text w-[50%] ml-10">
          <p className="text-6xl text-gray-700 font-bold text-shadow-lg">MR.</p>
          <p className="text-6xl text-gray-700 font-bold text-shadow-lg">
            AMRIT PRASAD PRADHAN
          </p>
          <p className="mt-10 text-2xl text-gray-500">
            Amrit Campus, formally named as Public Science College (PUSCOL) and
            later named as Amrit Science College (ASCOL), after late Mr. Amrit
            Prasad Pradhan. Mr pradhan was born in 1918 at Thamel, Kathmandu. He
            served as headmaster of Jooddha High School in Birgunj for two years
            and later joined at Tri-Chandra College as lecturer in Chemistry. In
            1962, he became founder Principal of Public Science College (present
            Amrit Campus) and began teaching as professor of Chemistry.
          </p>
          <br />
          <p className="text-2xl text-gray-500">
            Late Principal Amrit Prasad Pradhan established Amrit Campus with a
            view to promote the study of Science and Technology in Nepal. The
            campus has benefited greatly from his spirit or enterprise,
            dedication and enthusiasm.
          </p>
        </div>
        <div className="image">
          <img
            src="./amrit-prasad-pradhan.png"
            alt="Mr. Amrit Prasad Pradhan"
          />
        </div>
      </div>
      <CourseSection />
    </div>
  );
};

export default Home;
