import React from "react";
import Hero from "../components/Hero";
import ServicesGrid from "../components/ServicesGrid";
import BlogSection from "../components/BlogSection";
import TestimonialCarousel from "../components/TestimonialCarousel";
import Footer from "../components/Footer";
import PricingPlans from "../components/PricingPlans";

const HomePage = () => {
  return (
    <>
      <section id="home">
        <Hero />
      </section>

      <section id="services">
        <ServicesGrid />
      </section>

      <section id="plans">
        <PricingPlans />
      </section>

      <section id="blogs">
        <BlogSection />
      </section>

      <section id="testimonials">
        <TestimonialCarousel />
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
