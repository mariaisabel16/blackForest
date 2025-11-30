interface ObjectCardProps {
  name: string;
  position: string;
  isSelected?: boolean;
  onClick?: () => void;
  onOpenProperties?: () => void;
  onDelete?: () => void;
}

export default function ObjectCard({
  name,
  position,
  isSelected = false,
  onClick,
  onOpenProperties,
  onDelete,
}: ObjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-50 rounded-xl p-3 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-violet-500 bg-violet-50' : 'hover:bg-gray-100'
      }`}
    >

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <div className="flex items-center gap-2">
          <button
            className="px-2 h-7 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors text-[11px] font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProperties?.();
            }}
          >
            Edit color
          </button>
          <button
            className="w-7 h-7 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center justify-center hover:bg-red-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            aria-label="Eliminar objeto"
            title="Eliminar objeto"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
