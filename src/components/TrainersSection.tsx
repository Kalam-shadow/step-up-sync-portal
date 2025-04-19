
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for trainers (would come from API in real implementation)
const trainersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialization: "Contemporary & Modern Dance",
    bio: "Sarah is a renowned contemporary dancer with over 10 years of professional experience in both teaching and performing.",
    experience: "10+ years",
    education: "MFA in Dance, Juilliard School"
  },
  {
    id: 2,
    name: "Michael Chen",
    specialization: "Hip Hop & Street Dance",
    bio: "Michael has choreographed for multiple award-winning dance crews and specializes in urban dance styles.",
    experience: "8 years",
    education: "BFA in Dance, UCLA"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    specialization: "Ballet & Classical Dance",
    bio: "Former principal dancer with the National Ballet, Elena brings classical technique and performance excellence to her teaching.",
    experience: "15+ years",
    education: "Royal Ballet School"
  },
  {
    id: 4,
    name: "David Williams",
    specialization: "Jazz & Musical Theatre",
    bio: "With Broadway experience and a background in jazz dance, David trains dancers for both stage and commercial performances.",
    experience: "12 years",
    education: "BFA in Musical Theatre, NYU Tisch"
  }
];

const TrainersSection = () => {
  return (
    <section id="trainers" className="py-16 md:py-24 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Meet Our Expert Trainers
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our instructors bring years of professional experience and passion to every class,
            ensuring you receive the highest quality dance education.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainersData.map((trainer) => (
            <Card key={trainer.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
              <div className="h-48 bg-purple-200 overflow-hidden">
                {/* This would be replaced with an actual trainer image in a real implementation */}
                <div className="w-full h-full flex items-center justify-center text-purple-500 text-lg">
                  Trainer Photo
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">{trainer.name}</CardTitle>
                <CardDescription className="text-pink-500 font-medium">{trainer.specialization}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{trainer.bio}</p>
                <div className="text-sm">
                  <p><span className="font-medium">Experience:</span> {trainer.experience}</p>
                  <p><span className="font-medium">Education:</span> {trainer.education}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
