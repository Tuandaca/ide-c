export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseClass = 'ide-button';
    const variantClass = `ide-button--${variant}`;
    const sizeClass = `ide-button--${size}`;
    const disabledClass = disabled ? 'ide-button--disabled' : '';

    const classes = [baseClass, variantClass, sizeClass, disabledClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={classes}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
