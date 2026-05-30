import { useContext } from "react";

import { DialogContext } from "./AppDialogContext";

export function useAppDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useAppDialog deve ser usado dentro de AppDialogProvider.");
  }

  return context;
}
