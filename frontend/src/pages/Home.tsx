import { useState } from 'react';
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
  
  // This will be populated from backend API when image is uploaded
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([
    // Mock data - replace with API call
   
  ]);

  const handleSelectObject = (id: number) => {
    setSelectedObject(id);
    const stored = objectColors[id];
    if (stored) {
      setHue(stored.hue);
      setShade(stored.shade);
    }
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
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - AI Detected Objects */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">
            AI Detected Objects
          </h2>
          <div className="space-y-3">
            {detectedObjects.length > 0 ? (
              detectedObjects.map((obj) => (
                <ObjectCard
                  key={obj.id}
                  name={obj.name}
                  thumbnail={obj.imageUrl}
                  isSelected={selectedObject === obj.id}
                  onClick={() => handleSelectObject(obj.id)}
                />
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-8">
                <p>No objects detected yet</p>
                <p className="text-xs mt-2">Upload a room photo to start</p>
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 p-8 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg flex items-center justify-center p-8">
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-lg font-medium">Room Canvas</p>
                  <p className="text-sm">Upload a photo to start editing</p>
                </div>
              </div>
              {selectedObject !== null && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-36 rounded-lg border border-gray-800 shadow-xl transition-colors"
                  style={{ backgroundColor: currentColor, opacity: 0.9 }}
                />
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Object Properties */}
        <aside className="w-72 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">
            Object Properties
          </h2>
          
          <div className="space-y-6">
            <ColorPicker
              hue={displayHue}
              shade={displayShade}
              onChange={updateColor}
            />

          </div>
        </aside>
      </div>
    </div>
  );
}
