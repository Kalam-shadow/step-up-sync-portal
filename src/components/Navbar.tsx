
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 shadow-md backdrop-blur-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Step Up Dance
          </h1>
        </div>
        
        <div className="hidden md:flex space-x-8 items-center">
          <ScrollLink 
            to="intro" 
            spy={true} 
            smooth={true} 
            offset={-70} 
            duration={500} 
            className="text-gray-800 hover:text-purple-600 cursor-pointer transition-colors"
          >
            Home
          </ScrollLink>
          <ScrollLink 
            to="batches" 
            spy={true} 
            smooth={true} 
            offset={-70} 
            duration={500}
            className="text-gray-800 hover:text-purple-600 cursor-pointer transition-colors"
          >
            Batches
          </ScrollLink>
          <ScrollLink 
            to="trainers" 
            spy={true} 
            smooth={true} 
            offset={-70} 
            duration={500}
            className="text-gray-800 hover:text-purple-600 cursor-pointer transition-colors"
          >
            Trainers
          </ScrollLink>
          <ScrollLink 
            to="register" 
            spy={true} 
            smooth={true} 
            offset={-70} 
            duration={500}
            className="text-gray-800 hover:text-purple-600 cursor-pointer transition-colors"
          >
            Register
          </ScrollLink>
          <ScrollLink 
            to="contact" 
            spy={true} 
            smooth={true} 
            offset={-70} 
            duration={500}
            className="text-gray-800 hover:text-purple-600 cursor-pointer transition-colors"
          >
            Contact
          </ScrollLink>
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white ml-4"
            asChild
          >
            <RouterLink to="/admin">Login</RouterLink>
          </Button>
        </div>

        <div className="md:hidden">
          {/* Mobile menu button would go here but we'll keep it simple for now */}
          <Button 
            variant="ghost" 
            className="text-gray-800"
          >
            ☰
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
