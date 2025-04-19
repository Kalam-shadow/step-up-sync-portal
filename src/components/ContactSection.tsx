
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Have questions about our classes or want to learn more about Step Up Dance? 
            Reach out to us and our team will get back to you soon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="contactName" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="contactName" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="contactEmail" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactSubject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="contactSubject" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactMessage" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="contactMessage" placeholder="Your message..." rows={4} />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>123 Dance Avenue, Rhythm City, RC 10001</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>(555) 123-4567</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✉️</span>
                  <span>info@stepdanceco.com</span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Studio Hours</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Monday-Friday:</span> 9:00 AM - 9:00 PM</p>
                <p><span className="font-medium">Saturday:</span> 10:00 AM - 6:00 PM</p>
                <p><span className="font-medium">Sunday:</span> 12:00 PM - 5:00 PM</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200">FB</a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200">IG</a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200">TW</a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200">YT</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
