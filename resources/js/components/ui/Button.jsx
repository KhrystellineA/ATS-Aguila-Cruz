export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) {
  const base = 'px-4 py-2 rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wider border';
  const variants = {
    primary: 'bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white border-purple-600',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-purple-300 border-purple-800 hover:border-purple-600',
    danger: 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 text-white border-red-800',
    ghost: 'hover:bg-gray-800 text-gray-400 border-transparent hover:border-gray-700',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
