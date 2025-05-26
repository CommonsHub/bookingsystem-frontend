
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const progressPercentage = (completedSections.size / sections.length) * 100;

  // Monitor main header visibility
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 80; // Main header height
      const scrolled = window.scrollY > headerHeight;
      setIsHeaderVisible(!scrolled);
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // Call once on mount
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    const sectionElement = document.querySelector(`[data-wizard-section="${sectionIndex}"]`);
    if (sectionElement) {
      const headerHeight = isHeaderVisible ? 80 : 0; // Adjust based on header visibility
      const progressHeight = 80; // Account for progress card height
      const elementTop = sectionElement.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = elementTop - headerHeight - progressHeight - 16; // Add some padding
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className={`sticky z-40 px-4 sm:px-6 transition-all duration-200 ${
        isHeaderVisible ? 'top-20' : 'top-0'
      }`}
      style={{ 
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Card className="w-full bg-white/95 backdrop-blur-sm border shadow-lg">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Progress</h2>
              <span className="text-sm text-muted-foreground">
                {completedSections.size}/{sections.length}
              </span>
            </div>
            
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 mb-3">
              <div 
                className="h-full transition-all bg-blue-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {sections.map((section, index) => {
                const isCompleted = completedSections.has(index);
                const isCurrent = currentSection === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-all cursor-pointer hover:opacity-80 border ${
                      isCurrent && !isCompleted
                        ? 'bg-blue-50 text-blue-800 border-blue-400 font-bold ring-2 ring-blue-200'
                        : isCompleted
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 font-normal'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200 font-normal'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Circle className={`h-3 w-3 ${isCurrent ? 'text-blue-600' : ''}`} />
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
    </div>
  );
};
