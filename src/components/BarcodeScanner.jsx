import { useState, useRef, useCallback } from 'react';

export default function BarcodeScanner({ onClose, onScan }) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const submitCode = useCallback(() => {
    const code = manualCode.trim();
    if (!code) return;
    setError(null);
    onScan(code);
    setManualCode('');
  }, [manualCode, onScan]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold mb-2">Barcode</h2>
        <p className="text-sm text-slate-500 mb-4">
          Enter barcode manually or use a USB barcode scanner (focus the field and scan).
        </p>
        <input
          ref={inputRef}
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitCode()}
          placeholder="Scan or type barcode"
          className="w-full px-4 py-3 border border-surface-200 rounded-lg font-mono text-lg"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={submitCode}
            className="flex-1 py-2 rounded-lg bg-brand-600 text-white font-medium"
          >
            Use barcode
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-surface-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
