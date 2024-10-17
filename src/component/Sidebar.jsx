import React from "react";
import { 
  BitcoinIconsContactsFilled, 
  MaterialSymbolsLightSchool, 
  TwemojiSportsMedal, 
  MingcuteSuitcase2Fill 
} from "../assets/icons";

const sections = [
  { label: "Contact Information", icon: <BitcoinIconsContactsFilled />, index: 0 },
  { label: "Schooling Information", icon: <MaterialSymbolsLightSchool />, index: 1 },
  { label: "Employment Details", icon: <MingcuteSuitcase2Fill />, index: 2 },
  { label: "Hobbies and Interests", icon: <TwemojiSportsMedal />, index: 3 },
];

const Sidebar = ({ onSectionChange }) => (
  <div className="bg-white p-6 h-screen fixed">
    <nav className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Personal</h2>
      <ul className="space-y-6">
        {sections.map(({ label, icon, index }) => (
          <li key={index}>
            <button
              className="flex items-center text-sm font-semibold text-gray-800 hover:text-black transition-colors space-x-2"
              onClick={() => onSectionChange(index)}
            >
              {icon}
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export default Sidebar;
