
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Step Up Dance</h3>
            <p className="text-gray-300 mb-4">
              Empowering dancers of all ages and skill levels through expert instruction 
              and a supportive community.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="intro" spy={true} smooth={true} offset={-70} duration={500} className="text-gray-300 hover:text-purple-300 cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link to="batches" spy={true} smooth={true} offset={-70} duration={500} className="text-gray-300 hover:text-purple-300 cursor-pointer">
                  Classes
                </Link>
              </li>
              <li>
                <Link to="trainers" spy={true} smooth={true} offset={-70} duration={500} className="text-gray-300 hover:text-purple-300 cursor-pointer">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="register" spy={true} smooth={true} offset={-70} duration={500} className="text-gray-300 hover:text-purple-300 cursor-pointer">
                  Register
                </Link>
              </li>
              <li>
                <Link to="contact" spy={true} smooth={true} offset={-70} duration={500} className="text-gray-300 hover:text-purple-300 cursor-pointer">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Programs</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-300">Kids Dance</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300">Teen Hip Hop</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300">Adult Contemporary</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300">Professional Ballet</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300">Special Workshops</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-300 not-italic">
              <p>123 Dance Avenue</p>
              <p>Rhythm City, RC 10001</p>
              <p className="mt-2">(555) 123-4567</p>
              <p>info@stepdanceco.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Step Up Dance Company. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-purple-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-purple-300">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
