export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({
    label,
    error,
    className = '',
    ...props
}: InputProps) {
    const inputClass = `ide-input ${error ? 'ide-input--error' : ''} ${className}`;

    return (
        <div className="ide-input-wrapper">
            {label && (
                <label className="ide-input-label">
                    {label}
                </label>
            )}
            <input
                className={inputClass}
                {...props}
            />
            {error && (
                <span className="ide-input-error-text">
                    {error}
                </span>
            )}
        </div>
    );
}
