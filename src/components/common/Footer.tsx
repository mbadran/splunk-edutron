import React from "react";
import { APP_VERSION } from "@/utils/constants";

interface FooterProps {
  isHomepage?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isHomepage = false }) => {
  const backgroundClass = isHomepage
    ? "bg-gray-800/90 backdrop-blur-md border-gray-600/30"
    : "bg-gray-800 backdrop-blur-md border-gray-600";
  const textColorClass = isHomepage ? "text-white/95" : "text-white";

  return (
    <footer className="py-3 text-center text-gray-300 text-sm mt-auto">
      <div
        className={`${backgroundClass} rounded-lg mx-auto inline-block px-4 py-2 border shadow-lg`}
      >
        <span className={`${textColorClass} font-medium`}>
          v{APP_VERSION} • one small step • @mohammba + @beivers
        </span>
      </div>
    </footer>
  );
};

export default Footer;