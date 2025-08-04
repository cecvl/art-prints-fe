// use Toaster for brief notifications
import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background",
          title: "text-sm font-medium",
          description: "text-sm opacity-90",
          actionButton: "text-xs",
        },
      }}
    />
  );
}
