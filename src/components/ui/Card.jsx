export default function Card({ children, onClick, className = '' }) {
  const baseClasses = 'bg-white rounded-xl shadow-md p-4 transition-all duration-200 border border-gray-100';
  const interactiveClasses = onClick ? 'cursor-pointer hover:translate-y-[-4px] hover:shadow-lg' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
}
