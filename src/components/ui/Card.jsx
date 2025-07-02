export default function Card({ children, onClick, className = '' }) {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg';
  const interactiveClasses = onClick ? 'cursor-pointer hover:translate-y-[-2px] hover:border-purple-200' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
}
