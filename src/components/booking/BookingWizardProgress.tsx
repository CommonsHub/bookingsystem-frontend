
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";

interface BookingWizardProgressProps {
  currentSection: number;
  completedSections: Set<number>;
  sections: string[];
}

export const BookingWizardProgress = ({ 
  currentSection, 
  completedSections, 
  sections 
}: BookingWizardProgressProps) => {
  const progressPercentage = (completedSections.size / sections.length) * 100;

  return (
    <Card className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Booking Progress</h2>
          <span className="text-sm text-muted-foreground">
            {completedSections.size} of {sections.length} sections completed
          </span>
        </div>
        
        <Progress value={progressPercentage} className="mb-3" />
        
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                completedSections.has(index)
                  ? 'bg-green-100 text-green-700'
                  : currentSection === index
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {completedSections.has(index) ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
              <span>{section}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
