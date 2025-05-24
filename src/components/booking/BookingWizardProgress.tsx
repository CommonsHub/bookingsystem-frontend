
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

  const scrollToSection = (sectionIndex: number) => {
    const sectionElement = document.querySelector(`[data-wizard-section="${sectionIndex}"]`);
    if (sectionElement) {
      const headerHeight = 80; // Account for main header height
      const elementTop = sectionElement.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = elementTop - headerHeight;
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card className="w-full bg-white border shadow-sm mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Booking Progress</h2>
          <span className="text-sm text-muted-foreground">
            {completedSections.size} of {sections.length} sections completed
          </span>
        </div>
        
        <Progress value={progressPercentage} className="mb-4" />
        
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => {
            const isCompleted = completedSections.has(index);
            const isCurrent = currentSection === index && !isCompleted;
            
            return (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-colors cursor-pointer hover:opacity-80 ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : isCurrent
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 ring-2 ring-blue-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>{section}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
