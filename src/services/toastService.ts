import { toast } from "react-toastify"

export type ToastPosition = "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
export type ToastOptions = {
    position: ToastPosition;
    autoClose?: number;
}
export const toastService = {
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, {
            position: options?.position ?? "top-right",
            autoClose: options?.autoClose ?? 4000,
        });
    },

    warning: (message: string, options?: ToastOptions) => {
        toast.warning(message, {
            position: options?.position ?? "top-right",
            autoClose: options?.autoClose ?? 4000,
        });
    },

    error: (message: string, options?: ToastOptions) => {
        toast.error(message, {
            position: options?.position ?? "top-right",
            autoClose: options?.autoClose ?? 4000,
        });
    },
}