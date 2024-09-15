// components/ui/Textarea.js

export function Textarea({ className = '', ...props }) {
    return (
        <textarea
            className={`w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
}
