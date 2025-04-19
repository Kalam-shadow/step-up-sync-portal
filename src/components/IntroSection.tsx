
import { Button } from "@/components/ui/button";
import { Link } from "react-scroll";

const IntroSection = () => {
  return (
    <section id="intro" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight">
              Move with Confidence at Step Up Dance
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Discover the joy of dance with our expert instructors and diverse range of classes. 
              From beginners to advanced dancers, we have something for everyone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="register" spy={true} smooth={true} offset={-70} duration={500}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-6 h-auto text-lg">
                  Join a Class
                </Button>
              </Link>
              <Link to="batches" spy={true} smooth={true} offset={-70} duration={500}>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 h-auto text-lg">
                  Explore Programs
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="w-full h-80 md:h-96 lg:h-[500px] bg-purple-200 rounded-xl overflow-hidden">
                {/* This would be replaced with an actual image in a real implementation */}
                <div className="w-full h-full flex items-center justify-center text-purple-500 text-lg">
                  Dance Studio Image
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-xl">
                <p className="font-bold text-purple-600">10+ Dance Styles</p>
                <p className="text-gray-600">Professional Training</p>
              </div>
              <div className="absolute -top-5 -right-5 bg-white p-4 rounded-lg shadow-xl">
                <p className="font-bold text-pink-600">Expert Trainers</p>
                <p className="text-gray-600">Personalized Attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
