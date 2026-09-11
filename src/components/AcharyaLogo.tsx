import React from "react";
import { AasaanLogo } from "./AasaanLogo.tsx";

export interface AcharyaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const AcharyaLogo: React.FC<AcharyaLogoProps> = (props) => {
  return <AasaanLogo {...props} />;
};

export default AcharyaLogo;
