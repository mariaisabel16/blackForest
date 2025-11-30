import Button from './Button';
import { uploadFile } from '../../api/backend.ts';
import type { UploadResponse, DetectedObject } from '../../api/backend.ts';

export default function Header({
  onImageReady,
  onObjectsDetected,
}: {
  onImageReady: (url: string) => void;
  onObjectsDetected: (objects: DetectedObject[]) => void;
}) {
  const handleClick = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const result = await uploadFile(file);
      // Usa la imagen que devuelva el backend; si no viene, usa el archivo local
      const displayImage = result.imageData || URL.createObjectURL(file);
      onImageReady(displayImage);

      const apiObjects = Array.isArray(result.objects) ? result.objects : [];
      const mapped: DetectedObject[] | undefined = apiObjects.map((obj, idx) => ({
        id: idx + 1,
        name: obj.label,
        position: obj.bbox,
      }));

      onObjectsDetected(mapped && mapped.length > 0 ? mapped : []);
    };

    input.click();
  };
  

  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 4L4 10V22L16 28L28 22V10L16 4Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M16 4V16M16 16L4 10M16 16L28 10M16 16V28"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-gray-900">RoomFlux</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="secondary"
          onClick={handleClick}
        >
          Upload photo
        </Button>
      </div>
    </header>
  );
}
