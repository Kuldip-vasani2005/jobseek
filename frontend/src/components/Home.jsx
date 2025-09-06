import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './heroSection'
import CategoryCarousel from './categoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'
import useGetAllJobs from '../hooks/useGetAllJobs'

const Home = () => {
  useGetAllJobs(); // Custom hook to fetch all jobs

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home
