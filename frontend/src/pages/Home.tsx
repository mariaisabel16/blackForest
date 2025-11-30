import { useState } from 'react';
import Header from '../components/Header';
import ObjectCard from '../components/ObjectCard';
import ColorPicker from '../components/ColorPicker';
import type { DetectedObject } from '../../api/backend.ts';
import { applyColor, deleteObject } from '../../api/backend.ts';

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [hue, setHue] = useState(180);
  const [shade, setShade] = useState(60);
  const [objectColors, setObjectColors] = useState<Record<number, { hue: number; shade: number }>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSelectObject = (id: number, opts?: { keepPicker?: boolean }) => {
    setSelectedObject(id);
    if (!opts?.keepPicker) {
      setShowColorPicker(false);
    }
    const stored = objectColors[id];
    if (stored) {
      setHue(stored.hue);
      setShade(stored.shade);
    }
  };

  const handleOpenProperties = (id: number) => {
    handleSelectObject(id, { keepPicker: true });
    setShowColorPicker(true);
  };

  const activeColor = selectedObject !== null ? objectColors[selectedObject] : null;
  const displayHue = activeColor?.hue ?? hue;
  const displayShade = activeColor?.shade ?? shade;

  const updateColor = (newHue: number, newShade: number) => {
    setHue(newHue);
    setShade(newShade);
    if (selectedObject !== null) {
      setObjectColors((prev) => ({
        ...prev,
        [selectedObject]: { hue: newHue, shade: newShade },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header
        onImageReady={setImageUrl}
        onObjectsDetected={(objects) => {
          setDetectedObjects(objects);
          if (objects.length > 0) {
            setSelectedObject(objects[0].id ?? 0);
          }
        }}
      />

      <div className="grid grid-cols-[220px_1fr_240px] gap-4 p-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Detected objects</h2>

          {detectedObjects.length === 0 && (
            <p className="text-gray-500 text-sm">Ningún objeto detectado.</p>
          )}

          <div className="flex flex-col gap-3">
            {detectedObjects.map((obj, i) => (
              <ObjectCard
                key={obj.id ?? i}
                name={obj.name}
                position={obj.position || ''}
                isSelected={(obj.id ?? i) === selectedObject}
                onClick={() => handleSelectObject(obj.id ?? i)}
                onOpenProperties={() => handleOpenProperties(obj.id ?? i)}
                onDelete={async () => {
                  const targetId = obj.id ?? i;
                  const currentImage = imageUrl;
                  if (!currentImage) return;
                  try {
                    const res = await deleteObject({
                      imageUrl: currentImage,
                      position: obj.position || '',
                      name: obj.name || '',
                    });
                    if (res.public_url) {
                      setImageUrl(res.public_url);
                    }
                    setDetectedObjects((prev) => prev.filter((o, idx) => (o.id ?? idx) !== targetId));
                    if (selectedObject === targetId) {
                      setSelectedObject(null);
                      setShowColorPicker(false);
                    }
                  } catch (err) {
                    console.error('Error deleting object', err);
                  }
                }}
              />
            ))}
          </div>
        </div>


        <div className="bg-white rounded-xl shadow p-4">
          {/* IMAGE */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Room"
              className="w-full h-full object-cover"
            />
          )}

          {/* PLACEHOLDER */}
          {!imageUrl && (
            <div className="w-full h-[600px] flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <p className="text-lg font-medium">Room Canvas</p>
              <p className="text-sm">Upload a room photo to begin</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          {showColorPicker && selectedObject !== null ? (
            <ColorPicker
              hue={displayHue}
              shade={displayShade}
              onChange={updateColor}
              onApply={async () => {
                const selected = detectedObjects.find(
                  (obj, idx) => (obj.id ?? idx) === selectedObject
                );
                if (!selected || !imageUrl) return;
                const color = `hsl(${displayHue}, 90%, ${displayShade}%)`;
                try {
                  const res = await applyColor({
                    imageUrl,
                    color,
                    position: selected.position || '',
                    name: selected.name || '',
                  });
                  if (res.public_url) {
                    setImageUrl(res.public_url);
                  }
                } catch (err) {
                  console.error('Error applying color', err);
                }
              }}
            />
          ) : (
            <div className="text-sm text-gray-500">
              Select an object and click on "Edit color" to adjust the color.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
