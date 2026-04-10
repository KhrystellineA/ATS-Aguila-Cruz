export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500 transition-all text-white placeholder-gray-500 ${
          error ? 'border-red-700' : 'border-purple-800'
        }`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1 border border-red-800 bg-red-900/30 p-1 rounded">{error}</p>}
    </div>
  );
}
