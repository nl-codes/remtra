import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

interface FormInputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "onChange"
> {
    error?: string;
    icon: ReactNode;
    label: string;
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    trailingAction?: ReactNode;
}

function FormInput({
    error,
    icon,
    label,
    trailingAction,
    ...inputProps
}: FormInputProps) {
    const inputPadding = trailingAction ? "pr-12" : "pr-3";

    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </span>
            <span className="relative block">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    {icon}
                </span>
                <input
                    className={`h-11 w-full rounded-xl border border-border-divider bg-primary-background pl-10 ${inputPadding} text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20`}
                    {...inputProps}
                />
                {trailingAction}
            </span>
            {error ? (
                <span className="mt-2 block text-sm text-accent">{error}</span>
            ) : null}
        </label>
    );
}

export default FormInput;
