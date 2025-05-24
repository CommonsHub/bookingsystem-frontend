
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
      const progressHeight = 80; // Account for progress card height (reduced)
      const elementTop = sectionElement.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = elementTop - headerHeight - progressHeight - 16; // Reduced padding
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-20 z-40 mb-4 sm:top-16 sm:mb-6">
      <Card className="w-full bg-white/95 backdrop-blur-sm border shadow-sm">
        <div className="p-2 sm:p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs sm:text-sm font-semibold">Progress</h2>
            <span className="text-xs text-muted-foreground">
              {completedSections.size}/{sections.length}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="mb-2 h-1.5 sm:h-2" />
          
          <div className="flex flex-wrap gap-1">
            {sections.map((section, index) => {
              const isCompleted = completedSections.has(index);
              const isCurrent = currentSection === index;
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors cursor-pointer hover:opacity-80 ${
                    isCurrent && !isCompleted
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 ring-1 ring-blue-300'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline text-xs">{section}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
