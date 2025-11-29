interface ObjectCardProps {
  name: string;
  thumbnail?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ObjectCard({ 
  name, 
  thumbnail, 
  isSelected = false,
  onClick 
}: ObjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-50 rounded-xl p-3 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-violet-500 bg-violet-50' : 'hover:bg-gray-100'
      }`}
    >
      <div className="w-full h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-500">{name}</span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <div className="flex gap-2">
          <button 
            className="w-6 h-6 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            🔄
          </button>
          <button 
            className="w-6 h-6 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            ✓
          </button>
          <button 
            className="w-6 h-6 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            🔒
          </button>
        </div>
      </div>
    </div>
  );
}
