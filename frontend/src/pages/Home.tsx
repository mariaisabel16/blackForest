import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ObjectCard from '../components/ObjectCard';
import ColorPicker from '../components/ColorPicker';

interface DetectedObject {
  id: number;
  name: string;
  imageUrl: string;
  confidence?: number;
}

export default function Home() {
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [hue, setHue] = useState(180);
  const [shade, setShade] = useState(60);
  const [objectColors, setObjectColors] = useState<Record<number, { hue: number; shade: number }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchDetections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/detections');
        if (!response.ok) throw new Error('No se pudo obtener detecciones');

        const contentType = response.headers.get('content-type') || '';
        // Si el servidor devolvió HTML (p.ej. sin uploads), no mostramos error en UI; solo vaciamos la lista.
        if (!contentType.includes('application/json')) {
          await response.text();
          setDetectedObjects([]);
          return;
        }

        const data = await response.json();
        const objects = (data?.objects as DetectedObject[]) ?? [];
        setDetectedObjects(objects);
        if (objects.length > 0) {
          setSelectedObject(objects[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetections();
  }, []);

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
    setShowProperties(true);
    setShowColorPicker(true);
  };

  const activeColor = selectedObject !== null ? objectColors[selectedObject] : null;
  const displayHue = activeColor?.hue ?? hue;
  const displayShade = activeColor?.shade ?? shade;
  const currentColor = `hsl(${displayHue}, 90%, ${displayShade}%)`;

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

  // Function to fetch detected objects from backend
  // const fetchDetectedObjects = async (imageFile: File) => {
  //   const formData = new FormData();
  //   formData.append('image', imageFile);
  //   
  //   const response = await fetch('/api/detect-objects', {
  //     method: 'POST',
  //     body: formData,
  //   });
  //   
  //   const data = await response.json();
  //   setDetectedObjects(data.objects);
  // };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header onImageReady={setImageUrl} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - AI Detected Objects */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">
            AI Detected Objects
          </h2>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-400 text-sm py-8">Cargando objetos...</div>
            ) : detectedObjects.length > 0 ? (
              detectedObjects.map((obj) => (
                <ObjectCard
                  key={obj.id}
                  name={obj.name}
                  thumbnail={obj.imageUrl}
                  isSelected={selectedObject === obj.id}
                  onClick={() => handleSelectObject(obj.id)}
                  onOpenProperties={() => handleOpenProperties(obj.id)}
                />
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-8">
                <p>No objects detected yet</p>
                <p className="text-xs mt-2">Upload a room photo to start</p>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 break-words">
                {error}
              </div>
            )}
          </div>

          {/* Generated previews from Flux */}
          {detectedObjects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Generated previews</h3>
              <div className="grid grid-cols-2 gap-2">
                {detectedObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`border rounded-lg overflow-hidden ${selectedObject === obj.id ? 'ring-2 ring-violet-500' : ''}`}
                    onClick={() => handleSelectObject(obj.id)}
                  >
                    {obj.imageUrl ? (
                      <img
                        src={obj.imageUrl}
                        alt={obj.name}
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-[11px] text-gray-500">
                        {obj.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center Canvas */}
        <main className="flex p-8">

          <div className="w-full h-full flex justify-center items-start">

            {/* CANVAS FRAME */}
            <div className="w-full h-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">

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

          </div>

        </main>

        {selectedObject !== null && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-64 h-36 rounded-lg border border-gray-800 shadow-xl transition-colors"
            style={{ backgroundColor: currentColor, opacity: 0.9 }}
          />
        )}


        {/* Right Sidebar - Object Properties */}
        {detectedObjects.length > 0 && showProperties && (
          <aside className="w-72 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-900 mb-6">
              Object Properties
            </h2>
            <div className="space-y-4">
          
              {showColorPicker && selectedObject !== null && (
                <ColorPicker
                  hue={displayHue}
                  shade={displayShade}
                  onChange={updateColor}
                />
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
