import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryBanners from '../components/CategoryBanners';
import ProcessSection from '../components/ProcessSection';
import OurResinsSection from '../components/OurResinsSection';
import VideoGallerySection from '../components/VideoGallerySection';
import CompleteSystemSection from '../components/CompleteSystemSection';
import TransformationSection from '../components/TransformationSection';
import PigmentsFinishesSection from '../components/PigmentsFinishesSection';
import SpacesSolutionsSection from '../components/SpacesSolutionsSection';
import WhyChooseVizeSection from '../components/WhyChooseVizeSection';
import EducationResourcesSection from '../components/EducationResourcesSection';
import FeaturedCalloutsSection from '../components/FeaturedCalloutsSection';
import ProjectGallerySection from '../components/ProjectGallerySection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="homepage-root">
      <Header />
      <main>
        <HeroSection />
        <CategoryBanners />
        <ProcessSection />
        <OurResinsSection />
        <VideoGallerySection />
        <CompleteSystemSection />
        <PigmentsFinishesSection />
        <SpacesSolutionsSection />
        <TransformationSection />
        <WhyChooseVizeSection />
        <EducationResourcesSection />
        <FeaturedCalloutsSection />
        <ProjectGallerySection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

