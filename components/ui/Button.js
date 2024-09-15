// components/ui/Button.js

export function Button({ variant = 'solid', size = 'md', className = '', ...props }) {
    const baseStyles =
        'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeStyles = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2',
    };
    const variantStyles = {
        solid:
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
        outline:
            'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-blue-500 disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-50',
        ghost:
            'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:ring-blue-500 disabled:text-gray-400 disabled:bg-transparent',
    };

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
}
