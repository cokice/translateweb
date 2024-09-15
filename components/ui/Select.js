// components/ui/Select.js

export function Select({ children, className = '', ...props }) {
    return (
        <select
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}
