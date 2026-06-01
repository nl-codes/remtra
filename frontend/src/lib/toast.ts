import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { createElement, type CSSProperties } from "react";
import { toast, type ToastOptions } from "react-toastify";

const toastColors = {
    error: {
        border: "#7D080A",
        gradient: "linear-gradient(90deg, #7D080A 0%, #0F172A 75%)",
        Icon: CircleX,
    },
    info: {
        border: "#612EC0",
        gradient: "linear-gradient(90deg, #612EC0 0%, #0F172A 75%)",
        Icon: Info,
    },
    success: {
        border: "#087D0A",
        gradient: "linear-gradient(90deg, #087D0A 0%, #0F172A 75%)",
        Icon: CircleCheck,
    },
    warning: {
        border: "#B45E09",
        gradient: "linear-gradient(90deg, #B45E09 0%, #0F172A 75%)",
        Icon: CircleAlert,
    },
} as const;

const defaultToastOptions: ToastOptions = {
    position: "top-right",
    theme: "colored",
};

const getToastStyle = (type: keyof typeof toastColors): CSSProperties => {
    const colors = toastColors[type];

    return {
        alignItems: "center",
        background: colors.gradient,
        border: `2px solid ${colors.border}`,
        borderRadius: 8,
        boxShadow: "0 20px 40px rgb(0 0 0 / 0.32)",
        color: "#f8fafc",
        display: "flex",
        fontFamily:
            '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
        margin: "0 0 12px",
        minHeight: 49,
        padding: "10px 42px 10px 14px",
        minWidth: 254,
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
        whiteSpace: "nowrap",
        wordBreak: "break-word",
    };
};
const getToastIcon = (type: keyof typeof toastColors) => {
    const colors = toastColors[type];

    return createElement(
        "span",
        {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "100%",
                flexShrink: 0,
                border: "3px solid rgba(255, 255, 255, 0.45)",
                boxShadow: `
                    0 4px 10px rgba(0, 0, 0, 0.1),
                    inset 0 2px 4px rgba(255, 255, 255, 0.4)
                `,
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
            },
        },
        createElement(colors.Icon, {
            color: "rgba(255, 255, 255, 0.85)",
            size: 20,
            strokeWidth: 2.5,
        }),
    );
};

const getToastOptions = (
    type: keyof typeof toastColors,
    options?: ToastOptions,
): ToastOptions => {
    return {
        ...defaultToastOptions,
        icon: () => getToastIcon(type),
        style: {
            ...getToastStyle(type),
            ...options?.style,
        },
        ...options,
    };
};

export const appToast = {
    error(message: string, options?: ToastOptions): void {
        toast.error(message, getToastOptions("error", options));
    },
    info(message: string, options?: ToastOptions): void {
        toast.info(message, getToastOptions("info", options));
    },
    success(message: string, options?: ToastOptions): void {
        toast.success(message, getToastOptions("success", options));
    },
    warning(message: string, options?: ToastOptions): void {
        toast.warning(message, getToastOptions("warning", options));
    },
};
