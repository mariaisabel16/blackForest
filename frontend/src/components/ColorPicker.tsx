import { useRef, type MouseEvent as ReactMouseEvent } from 'react';

interface ColorPickerProps {
  hue: number;
  shade: number;
  onChange: (hue: number, shade: number) => void;
  onApply?: () => void;
}

export default function ColorPicker({ hue, shade, onChange, onApply }: ColorPickerProps) {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const minMarkerOffset = 12;
  const maxMarkerOffset = 70;

  const currentColor = `hsl(${hue}, 90%, ${shade}%)`;
  const shadeOffset = minMarkerOffset + ((100 - shade) / 100) * (maxMarkerOffset - minMarkerOffset);

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const updateFromWheelPosition = (clientX: number, clientY: number) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    const normalizedHue = (angleDeg + 360) % 360;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = clamp(distance, minMarkerOffset, maxMarkerOffset);
    const shadeFromRadius = Math.round(
      clamp(100 - ((clampedDistance - minMarkerOffset) / (maxMarkerOffset - minMarkerOffset)) * 100, 10, 90)
    );

    onChange(normalizedHue, shadeFromRadius);
  };

  const handleWheelMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateFromWheelPosition(e.clientX, e.clientY);

    const handleMove = (moveEvent: MouseEvent) => {
      updateFromWheelPosition(moveEvent.clientX, moveEvent.clientY);
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">Color</h3>
      <div className="space-y-4">
        {/* Color Wheel */}
        <div
          ref={wheelRef}
          onMouseDown={handleWheelMouseDown}
          className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner cursor-crosshair select-none"
        >
          <div
            className="w-full h-full"
            style={{
              background: `conic-gradient(
                from 0deg,
                #ff0000 0deg,
                #ffff00 60deg,
                #00ff00 120deg,
                #00ffff 180deg,
                #0000ff 240deg,
                #ff00ff 300deg,
                #ff0000 360deg
              )`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle, white 0%, transparent 70%)`,
              }}
            />
          </div>
          <div
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full shadow-lg"
            style={{
              transform: `translate(-50%, -50%) rotate(${hue}deg) translateY(-${shadeOffset}px)`,
              backgroundColor: currentColor,
              border: '2px solid #111827',
            }}
          />
        </div>

        {/* Color Slider */}
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => onChange(Number(e.target.value), shade)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
            accentColor: currentColor,
          }}
        />

        {/* Shade Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Shade</span>
            <span>{shade}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={shade}
            onChange={(e) => onChange(hue, Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(${hue}, 90%, 10%), hsl(${hue}, 90%, 50%), hsl(${hue}, 90%, 90%))`,
              accentColor: currentColor,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Current Color</span>
          <div
            className="w-8 h-8 rounded-md border border-gray-200"
            style={{ backgroundColor: currentColor }}
          />
        </div>
      </div>

      {onApply && (
        <button
          className="mt-6 w-full h-10 rounded-md bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
          onClick={onApply}
        >
          Apply color
        </button>
      )}
    </div>
  );
}
