import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../redux/jobSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Mobile Developer",
    "QA Engineer",
    "Cybersecurity Specialist",
    "Cloud Architect",
    "AI/ML Engineer",
    "Business Analyst",
    "System Administrator",
    "Database Administrator",
    "Network Engineer",
  ];

  const searchJobHandler = (query) => {
    if (!query) return;
    dispatch(setSearchedQuery(query.toLowerCase().trim()));
    navigate("/browse");
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto my-14 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Title */}
      <motion.h2
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🔥 Popular Categories
      </motion.h2>

      <Carousel>
        <CarouselContent>
          {categories.map((cat, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotateX: 8,
                  rotateY: -8,
                  boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center"
              >
                <Button
                  onClick={() => searchJobHandler(cat)}
                  className="w-full max-w-[220px] rounded-full px-6 py-3 font-semibold shadow-lg 
                             bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                             text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 
                             transition-all duration-500"
                >
                  {cat}
                </Button>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 🔥 Custom colored arrows */}
        <CarouselPrevious className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-pink-500 hover:to-purple-500 hover:text-white shadow-md rounded-full" />
        <CarouselNext className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-pink-500 hover:to-purple-500 hover:text-white shadow-md rounded-full" />
      </Carousel>
    </motion.div>
  );
};

export default CategoryCarousel;
