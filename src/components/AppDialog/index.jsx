import { useCallback, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, HelpCircle, Info, TriangleAlert, X } from "lucide-react";

import styles from "./styles.module.css";
import { DialogContext } from "./AppDialogContext";

const dialogIcons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
  confirm: HelpCircle,
};

function normalizeDialog(config, type) {
  const options = typeof config === "string" ? { message: config } : config;
  const variant = options.variant || inferVariant(options.message, type);

  return {
    type,
    variant,
    title: options.title || getDefaultTitle(variant, type),
    message: options.message || "",
    confirmLabel: options.confirmLabel || (type === "confirm" ? "Confirmar" : "OK"),
    cancelLabel: options.cancelLabel || "Cancelar",
  };
}

function inferVariant(message = "", type) {
  if (type === "confirm") return "confirm";

  const text = String(message)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (text.includes("sucesso")) return "success";
  if (text.includes("erro") || text.includes("invalido") || text.includes("nao foi possivel")) {
    return "danger";
  }
  if (text.includes("preencha") || text.includes("selecione") || text.includes("informe")) {
    return "warning";
  }

  return "info";
}

function getDefaultTitle(variant, type) {
  if (type === "confirm") return "Confirmar ação";
  if (variant === "success") return "Tudo certo";
  if (variant === "danger") return "Não foi possível concluir";
  if (variant === "warning") return "Atenção";
  return "Aviso";
}

export function AppDialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const closeDialog = useCallback(
    (result) => {
      setDialog((currentDialog) => {
        if (currentDialog?.resolve) {
          currentDialog.resolve(result);
        }

        return null;
      });
    },
    []
  );

  const openDialog = useCallback((config, type = "alert") => {
    const nextDialog = normalizeDialog(config, type);

    return new Promise((resolve) => {
      setDialog({
        ...nextDialog,
        resolve,
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      alert: (config) => openDialog(config, "alert"),
      confirm: (config) => openDialog(config, "confirm"),
    }),
    [openDialog]
  );

  const Icon = dialog ? dialogIcons[dialog.variant] || Info : Info;

  return (
    <DialogContext.Provider value={value}>
      {children}

      {dialog && (
        <div className={styles.backdrop} role="presentation">
          <section
            className={styles.modal}
            role={dialog.type === "confirm" ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby="app-dialog-title"
          >
            <div className={`${styles.iconBox} ${styles[dialog.variant]}`}>
              <Icon size={28} />
            </div>

            <button
              type="button"
              className={styles.closeButton}
              onClick={() => closeDialog(false)}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            <div className={styles.content}>
              <span>{dialog.type === "confirm" ? "Confirmação" : "Mensagem"}</span>
              <h2 id="app-dialog-title">{dialog.title}</h2>
              <p>{dialog.message}</p>
            </div>

            <div className={styles.actions}>
              {dialog.type === "confirm" && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => closeDialog(false)}
                >
                  {dialog.cancelLabel}
                </button>
              )}

              <button
                type="button"
                className={`${styles.primaryButton} ${dialog.variant === "danger" ? styles.dangerButton : ""}`}
                onClick={() => closeDialog(true)}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </DialogContext.Provider>
  );
}
