import { useCallback } from 'react';

export default function DropZone({ onFileSelect, className = '' }) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0] || e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file); // Pass the raw File object
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`
        relative border-2 border-dashed border-gray-200 rounded-2xl p-8
        flex flex-col items-center justify-center gap-4
        transition-all duration-300 hover:border-purple-300 hover:bg-purple-50
        cursor-pointer bg-gray-50
        ${className}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleDrop}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium mb-2">Drag and drop your image here</p>
        <p className="text-sm text-gray-400">or click to browse</p>
      </div>
    </div>
  );
}
