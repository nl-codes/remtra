import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonStyleProps {
    variant?: ButtonVariant;
    icon?: ReactNode;
    fullWidth?: boolean;
    iconOnly?: boolean;
}

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

interface ButtonLinkProps
    extends Omit<LinkProps, "children" | "className">, ButtonStyleProps {
    children: ReactNode;
    className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "rounded-md bg-action text-primary-background hover:bg-accent disabled:bg-action-disabled disabled:text-primary-background disabled:hover:bg-action-disabled",
    secondary:
        "rounded-md border border-action bg-transparent text-action hover:border-accent hover:text-accent disabled:border-action-disabled disabled:text-action-disabled disabled:hover:border-action-disabled disabled:hover:text-action-disabled",
    tertiary:
        "rounded-none bg-transparent text-action underline decoration-current underline-offset-4 hover:text-accent disabled:text-action-disabled disabled:hover:text-action-disabled",
};

const getButtonClasses = ({
    className,
    fullWidth,
    iconOnly,
    variant,
}: Required<Pick<ButtonStyleProps, "fullWidth" | "iconOnly" | "variant">> & {
    className: string;
}): string => {
    return [
        "inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap py-6 text-base font-medium leading-6 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-background",
        "disabled:cursor-not-allowed",
        iconOnly
            ? "w-8 px-0 no-underline"
            : fullWidth
              ? "w-full px-3"
              : "w-fit px-3",
        variantClasses[variant],
        className,
    ].join(" ");
};

const ButtonContent = ({
    children,
    icon,
}: Pick<ButtonProps, "children" | "icon">) => (
    <>
        {icon ? (
            <span
                aria-hidden="true"
                className="flex shrink-0 items-center justify-center text-current [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-current">
                {icon}
            </span>
        ) : null}
        {children ? <span>{children}</span> : null}
    </>
);

export default function Button({
    children,
    className = "",
    disabled,
    fullWidth = false,
    icon,
    iconOnly = false,
    type = "button",
    variant = "primary",
    ...buttonProps
}: ButtonProps) {
    return (
        <button
            className={getButtonClasses({
                className,
                fullWidth,
                iconOnly,
                variant,
            })}
            disabled={disabled}
            type={type}
            {...buttonProps}>
            <ButtonContent icon={icon}>{children}</ButtonContent>
        </button>
    );
}

export function ButtonLink({
    children,
    className = "",
    fullWidth = false,
    icon,
    iconOnly = false,
    variant = "primary",
    ...linkProps
}: ButtonLinkProps) {
    return (
        <Link
            className={getButtonClasses({
                className,
                fullWidth,
                iconOnly,
                variant,
            })}
            {...linkProps}>
            <ButtonContent icon={icon}>{children}</ButtonContent>
        </Link>
    );
}
