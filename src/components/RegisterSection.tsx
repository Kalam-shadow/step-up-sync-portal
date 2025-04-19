
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

// In a real app, these would be fetched from the backend
const batchTypes = ["Kids Dance", "Teen Hip Hop", "Adult Contemporary", "Professional Ballet"];

const RegisterSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    danceExperience: "",
    batchPreference: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log("Form submitted:", formData);
    alert("Registration submitted! We will contact you soon.");
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      danceExperience: "",
      batchPreference: ""
    });
  };

  return (
    <section id="register" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Join Our Dance Family
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Ready to start your dance journey? Register for a class and our team will contact you
            to finalize your enrollment and answer any questions.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Student Registration</CardTitle>
              <CardDescription>
                Please fill in your details to register for a dance class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium">
                      Age
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your Age"
                      required
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="danceExperience" className="text-sm font-medium">
                      Dance Experience (years)
                    </label>
                    <Input
                      id="danceExperience"
                      name="danceExperience"
                      type="number"
                      placeholder="Years of Experience"
                      value={formData.danceExperience}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="batchPreference" className="text-sm font-medium">
                      Preferred Batch
                    </label>
                    <select 
                      id="batchPreference"
                      name="batchPreference"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={formData.batchPreference}
                      onChange={(e) => setFormData(prev => ({ ...prev, batchPreference: e.target.value }))}
                    >
                      <option value="">Select a batch</option>
                      {batchTypes.map((batch, index) => (
                        <option key={index} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                  >
                    Submit Registration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
