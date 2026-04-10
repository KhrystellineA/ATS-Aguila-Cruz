export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-lg border-2 border-purple-700 glow-purple w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gradient tracking-wider">{title.toUpperCase()}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-purple-400 transition-colors text-2xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
