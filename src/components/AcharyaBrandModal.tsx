import React from "react";
import { AasaanBrandModal } from "./AasaanBrandModal.tsx";

export interface AcharyaBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuestionPaper?: () => void;
  onOpenRubric?: () => void;
  onOpenSyllabusPlanner?: () => void;
  onOpenVault?: () => void;
  onFocusForm?: () => void;
}

export const AcharyaBrandModal: React.FC<AcharyaBrandModalProps> = (props) => {
  return <AasaanBrandModal {...props} />;
};

export default AcharyaBrandModal;
