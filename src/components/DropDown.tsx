import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Option } from '../misc/types';

// DropdownContext type
interface DropdownContextType {
  openDropdown: number | null;
  setOpenDropdown: (index: number | null) => void;
}

// Creating the context
const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

// Provider component to hold global state
interface DropdownProviderProps {
  children: ReactNode;
}

const DropdownProvider: React.FC<DropdownProviderProps> = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};

// Custom hook to use the dropdown context
const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
};

// Dropdown component with your custom styles
interface DropdownProps {
  options: Option[];
  placeholder: string;
  index: number;
  onSelect: (option: Option) => void;
  className?: string;
  value?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, placeholder, index, onSelect, value, className = '' }) => {
  const { openDropdown, setOpenDropdown } = useDropdown();
  const [selected, setSelected] = useState<Option | null>(null);
  useEffect(() => {
    if (value) {
      const option = options.find((option) => option.value === value);
      if (option) {
        setSelected(option);
      }
    }
  })
  const isOpen = openDropdown === index;

  const handleToggle = () => {
    setOpenDropdown(isOpen ? null : index);
  };

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpenDropdown(null); // Close dropdown after selection
    onSelect(option);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full px-4 py-2 text-base border-2 
        hover:bg-highlightColor/70
        transition-all duration-200 ease-out
        border-secondaryColor2 rounded-lg bg-highlightColor/60 text-white placeholder-textColor3/50 shadow focus:outline-none"
      >
        {selected ? selected.label : placeholder}
        <span className="ml-2">▼</span>
      </button>


        <div
        className={`absolute z-10 right-0 w-fit min-w-full mt-2 origin-top-right bg-highlightColor/80 border border-gray-300 rounded-md shadow-lg 
          transition-all duration-200 ease-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0 opacity-0'}`}
      >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="block w-full px-4 py-2 text-left text-base hover:backdrop-brightness-110 transition-all duration-200"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
    </div>
  );
};
export { DropdownProvider, Dropdown };