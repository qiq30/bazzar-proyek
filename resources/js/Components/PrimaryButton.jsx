export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`inline-flex items-center justify-center rounded-lg font-semibold text-white 
                        transition ease-in-out duration-150 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
                        ${className}`}
        >
            {children}
        </button>
    );
}
