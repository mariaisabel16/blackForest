import Button from './Button';
import { uploadFile } from '../../api/backend.ts';

export default function Header() {

  const handleClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const result = await uploadFile(file);
        console.log("RESULT:", result);
        alert(result.msg);
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
          Upload room photo
        </Button>
        <Button variant="primary" icon="📷">
          Add objects
        </Button>
      </div>
    </header>
  );
}
