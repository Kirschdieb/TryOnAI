export default function Card({ children, onClick, className = '' }) {
  const baseClasses = 'bg-cream-100 rounded-xl shadow-md p-4 transition-all duration-200';
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
