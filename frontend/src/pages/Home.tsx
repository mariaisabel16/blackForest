import { useState } from 'react';
import Header from '../components/Header';
import ObjectCard from '../components/ObjectCard';
import ColorPicker from '../components/ColorPicker';
import type { DetectedObject } from '../../api/backend.ts';
import { applyColor, deleteObject } from '../../api/backend.ts';
import { uploadFile } from '../../api/backend.ts';

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [hue, setHue] = useState(180);
  const [shade, setShade] = useState(60);
  const [objectColors, setObjectColors] = useState<Record<number, { hue: number; shade: number }>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isApplyingColor, setIsApplyingColor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        onImageUpload={async (file) => {
          try {
            setIsUploading(true);
            const result = await uploadFile(file);
            const displayImage = result.imageData || URL.createObjectURL(file);
            setImageUrl(displayImage);

            const apiObjects = Array.isArray(result.objects) ? result.objects : [];
            const mapped: DetectedObject[] | undefined = apiObjects.map((obj, idx) => ({
              id: idx + 1,
              name: obj.label,
              position: obj.bbox,
            }));

            // Desambiguar objetos repetidos agregando posición relativa basada en centros normalizados
            if (mapped && mapped.length > 0) {
              const counts = mapped.reduce<Record<string, number>>((acc, obj) => {
                acc[obj.name] = (acc[obj.name] || 0) + 1;
                return acc;
              }, {});

              const centers = mapped.map((obj) => {
                const parts = obj.position.split(',').map((p) => Number(p.trim()));
                if (parts.length < 4 || parts.some((n) => Number.isNaN(n))) return { cx: 0, cy: 0 };
                const [x1, y1, x2, y2] = parts;
                return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 };
              });

              const minX = Math.min(...centers.map((c) => c.cx));
              const maxX = Math.max(...centers.map((c) => c.cx));
              const minY = Math.min(...centers.map((c) => c.cy));
              const maxY = Math.max(...centers.map((c) => c.cy));
              const denomX = maxX - minX || 1;
              const denomY = maxY - minY || 1;

              const describePosition = (idx: number): string => {
                const { cx, cy } = centers[idx];
                const nx = (cx - minX) / denomX;
                const ny = (cy - minY) / denomY;
                const horiz = nx < 0.33 ? 'left' : nx > 0.66 ? 'right' : 'center';
                const vert = ny < 0.33 ? 'top' : ny > 0.66 ? 'bottom' : 'middle';
                if (vert === 'middle' && horiz === 'center') return 'center';
                return `${vert}-${horiz}`;
              };

              mapped.forEach((obj, idx) => {
                if ((counts[obj.name] || 0) > 1) {
                  obj.name = `${obj.name} (${describePosition(idx)})`;
                }
              });
            }

            setDetectedObjects(mapped && mapped.length > 0 ? mapped : []);
          } catch (err) {
            console.error('Error uploading image', err);
          } finally {
            setIsUploading(false);
          }
        }}
      />

      <div className="grid grid-cols-[220px_1fr_240px] gap-4 p-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Detected objects</h2>

          {detectedObjects.length === 0 && (
            <p className="text-gray-500 text-sm">No object detected.</p>
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
                    setIsDeleting(true);
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
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              />
            ))}
          </div>
        </div>


        <div className="bg-white rounded-xl shadow p-4 flex items-start justify-center">
          {/* IMAGE */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Room"
              className="max-h-[75vh] w-auto max-w-full object-contain"
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
                  setIsApplyingColor(true);
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
                } finally {
                  setIsApplyingColor(false);
                }
              }}
            />
          ) : (
            <div className="text-sm text-gray-500">
              Select an object and click on "Edit color" to adjust the color.
            </div>
          )}
          {isApplyingColor && (
            <div className="mt-4 text-xs text-gray-500">
              Applying color, please wait...
            </div>
          )}
        </div>
      </div>
      {(isApplyingColor || isUploading || isDeleting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white rounded-lg shadow-xl px-6 py-4 text-sm font-semibold text-gray-700 border border-gray-200">
            {isApplyingColor && 'Applying color, please wait...'}
            {isUploading && 'Uploading image, please wait...'}
            {isDeleting && 'Deleting object, please wait...'}
          </div>
        </div>
      )}
    </div>
  );
}
