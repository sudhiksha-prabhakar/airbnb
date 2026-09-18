import React, { useState } from "react";
import { 
  Building2, 
  Palmtree, 
  Flame, 
  Waves, 
  Mountain, 
  Home, 
  Trees, 
  SlidersHorizontal, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Castle,
  Tent,
  Snowflake,
  Crown
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All", icon: Home },
  { id: "beachfront", label: "Beachfront", icon: Waves },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "cabins", label: "Cabins", icon: Trees },
  { id: "mansions", label: "Mansions", icon: Crown },
  { id: "pools", label: "Amazing pools", icon: Waves },
  { id: "tropical", label: "Tropical", icon: Palmtree },
  { id: "countryside", label: "Countryside", icon: Mountain },
  { id: "tiny", label: "Tiny homes", icon: Home },
  { id: "historical", label: "Historical", icon: Castle },
  { id: "camping", label: "Camping", icon: Tent },
  { id: "arctic", label: "Arctic", icon: Snowflake },
  { id: "luxe", label: "Luxe", icon: Sparkles },
  { id: "design", label: "Iconic cities", icon: Building2 },
];

const CategoryBar = ({ selectedCategory, onSelectCategory, onOpenFilters }) => {
  const scrollRef = React.useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[80px] z-40 bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Categories Scroll Container */}
        <div className="relative flex-1 flex items-center overflow-hidden">
          
          {/* Left Scroll Button */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 z-10 p-1.5 rounded-full bg-white border border-gray-300 shadow-md hover:scale-105 transition hidden sm:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} className="text-gray-700" />
            </button>
          )}

          {/* Categories List */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 sm:px-6 w-full"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 pb-2 transition whitespace-nowrap cursor-pointer group border-b-2 bg-transparent ${
                    isSelected
                      ? "border-black text-black font-semibold"
                      : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                  }`}
                >
                  <Icon 
                    size={24} 
                    className={`transition ${isSelected ? "text-black" : "text-gray-500 group-hover:text-black"}`} 
                  />
                  <span className="text-xs tracking-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 z-10 p-1.5 rounded-full bg-white border border-gray-300 shadow-md hover:scale-105 transition hidden sm:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} className="text-gray-700" />
            </button>
          )}
        </div>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 hover:border-black hover:bg-gray-50 transition cursor-pointer shadow-sm"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>

      </div>
    </div>
  );
};

export default CategoryBar;
