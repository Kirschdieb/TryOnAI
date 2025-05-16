export default function Button({ children, disabled, onClick, variant = 'primary', className = '' }) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-lavender text-white hover:bg-opacity-90',
    secondary: 'bg-cream-300 text-gray-800 hover:bg-cream-400',
    outline: 'border-2 border-lavender text-lavender hover:bg-lavender hover:text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
