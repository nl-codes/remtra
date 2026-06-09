import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonStyleProps {
    variant?: ButtonVariant;
    icon?: ReactNode;
    fullWidth?: boolean;
    iconOnly?: boolean;
    border?: boolean;
}

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

interface ButtonLinkProps
    extends Omit<LinkProps, "children" | "className">, ButtonStyleProps {
    children?: ReactNode;
    className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "rounded-md bg-action text-primary-background hover:bg-accent disabled:bg-action-disabled disabled:text-primary-background disabled:hover:bg-action-disabled",
    secondary:
        "rounded-md bg-transparent text-action hover:text-accent disabled:text-action-disabled disabled:hover:text-action-disabled",
    tertiary:
        "rounded-none bg-transparent text-action underline decoration-current underline-offset-4 hover:text-accent disabled:text-action-disabled disabled:hover:text-action-disabled",
};

const getButtonClasses = ({
    className,
    border,
    fullWidth,
    iconOnly,
    variant,
}: Required<
    Pick<ButtonStyleProps, "border" | "fullWidth" | "iconOnly" | "variant">
> & {
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
        variant === "secondary" && border
            ? "border border-action hover:border-accent disabled:border-action-disabled disabled:hover:border-action-disabled"
            : "",
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
    border = true,
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
                border,
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
    border = true,
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
                border,
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
