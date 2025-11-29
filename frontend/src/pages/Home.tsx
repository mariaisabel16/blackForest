import { useState } from 'react';
import Header from '../components/Header';
import Toggle from '../components/Toggle';
import ObjectCard from '../components/ObjectCard';

interface DetectedObject {
  id: number;
  name: string;
  imageUrl: string;
  confidence?: number;
}

export default function Home() {
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  
  // This will be populated from backend API when image is uploaded
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([
    // Mock data - replace with API call
   
  ]);

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
                  onClick={() => setSelectedObject(obj.id)}
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
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-lg font-medium">Room Canvas</p>
                  <p className="text-sm">Upload a photo to start editing</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Object Properties */}
        <aside className="w-72 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">
            Object Properties
          </h2>
          
          <div className="space-y-6">
            {/* Color Picker */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-6">Color</h3>
              <div className="space-y-4">
                {/* Color Wheel */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner">
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
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-900 rounded-full shadow-lg" />
                </div>

                {/* Color Slider */}
                <input
                  type="range"
                  min="0"
                  max="360"
                  defaultValue="180"
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
                  }}
                />
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
