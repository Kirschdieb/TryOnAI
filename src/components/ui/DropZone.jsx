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
        relative border-2 border-dashed border-cream-300 rounded-xl p-6
        flex flex-col items-center justify-center gap-4
        transition-all duration-200 hover:scale-105 hover:shadow-xl
        cursor-pointer bg-cream-100
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
        <p className="text-gray-600 mb-2">Drag and drop your image here</p>
        <p className="text-sm text-gray-400">or click to browse</p>
      </div>
    </div>
  );
}
