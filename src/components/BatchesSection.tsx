
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for batches (would come from API in real implementation)
const batchesData = [
  {
    id: 1,
    name: "Kids Dance",
    description: "Fun, energetic classes designed for children aged 5-12. Focuses on coordination, rhythm, and creativity.",
    ageGroup: "5-12 years",
    schedule: "Mon, Wed 4-5 PM",
    level: "Beginner",
    icon: "👶"
  },
  {
    id: 2,
    name: "Teen Hip Hop",
    description: "Modern hip hop techniques and choreography for teenagers. Develop style, technique, and confidence.",
    ageGroup: "13-19 years",
    schedule: "Tue, Thu 5-6:30 PM",
    level: "Intermediate",
    icon: "🕺"
  },
  {
    id: 3,
    name: "Adult Contemporary",
    description: "Contemporary dance for adults of all skill levels. Focuses on expression, technique, and choreography.",
    ageGroup: "20+ years",
    schedule: "Mon, Fri 7-8:30 PM",
    level: "All Levels",
    icon: "💃"
  },
  {
    id: 4,
    name: "Professional Ballet",
    description: "Advanced ballet training for dancers with previous experience. Refine technique and performance skills.",
    ageGroup: "All ages",
    schedule: "Tue, Thu, Sat 9-11 AM",
    level: "Advanced",
    icon: "🩰"
  }
];

const BatchesSection = () => {
  return (
    <section id="batches" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Our Dance Programs
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Explore our diverse range of dance classes tailored for different age groups and skill levels.
            All classes are led by experienced instructors in our state-of-the-art studios.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {batchesData.map((batch) => (
            <Card key={batch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="text-4xl mb-3">{batch.icon}</div>
                <CardTitle className="text-xl">{batch.name}</CardTitle>
                <CardDescription className="text-gray-500">{batch.level}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{batch.description}</p>
                <div className="text-sm font-medium">
                  <p><span className="text-purple-600">Age:</span> {batch.ageGroup}</p>
                  <p><span className="text-purple-600">Schedule:</span> {batch.schedule}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BatchesSection;
