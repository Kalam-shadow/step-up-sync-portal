
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBatches } from "@/hooks/useBatches";
import { Skeleton } from "@/components/ui/skeleton";

const BatchesSection = () => {
  const { data: batches, isLoading, error } = useBatches();

  if (isLoading) {
    return (
      <section id="batches" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="batches" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center text-red-600">
          Failed to load batches. Please try again later.
        </div>
      </section>
    );
  }

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
          {batches?.map((batch) => (
            <Card key={batch.BatchID} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{batch.Name}</CardTitle>
                <CardDescription className="text-gray-500">{batch.Level}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{batch.Description}</p>
                <div className="text-sm font-medium">
                  <p><span className="text-purple-600">Schedule:</span> {batch.Schedule}</p>
                  <p><span className="text-purple-600">Trainer:</span> {batch.TrainerName}</p>
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
