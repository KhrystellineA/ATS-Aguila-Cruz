export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-800 text-purple-300 border-purple-700',
    success: 'bg-green-900/30 text-green-400 border-green-800',
    warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    danger: 'bg-red-900/30 text-red-400 border-red-800',
    info: 'bg-blue-900/30 text-blue-400 border-blue-800',
  };
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${variants[variant]} tracking-wider`}>
      {children}
    </span>
  );
}
