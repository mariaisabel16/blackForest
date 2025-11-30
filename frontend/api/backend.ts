export const API_BASE_URL = "http://localhost:8000";

export interface DetectedObject {
  id?: number;
  name: string;
  position: string;
}

export interface UploadResponse {
  status?: string;
  filename?: string;
  msg?: string;
  imageData?: string;
  objects: { label: string; bbox: string }[];
}

export interface ApplyColorPayload {
  imageUrl: string;
  color: string;
  position: string;
  name: string;
}

export interface ApplyColorResponse {
  status?: string;
  public_url?: string;
  cost?: number;
}

export async function applyColor(data: ApplyColorPayload): Promise<ApplyColorResponse> {
  const fileBlob = await fetch(data.imageUrl).then((r) => r.blob());
  const formData = new FormData();
  const prompt = `${data.name} at ${data.position} color ${data.color}`;
  formData.append('prompt', prompt);
  formData.append('file', fileBlob, 'image.png');

  const res = await fetch(`${API_BASE_URL}/room/apply_color`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('No se pudo aplicar el color');
  }

  return res.json();
}

export interface DeleteObjectPayload {
  imageUrl: string;
  position: string;
  name: string;
}

export interface DeleteObjectResponse {
  status?: string;
  public_url?: string;
  cost?: number;
}

export async function deleteObject(data: DeleteObjectPayload): Promise<DeleteObjectResponse> {
  const fileBlob = await fetch(data.imageUrl).then((r) => r.blob());
  const formData = new FormData();
  const prompt = `${data.name} at ${data.position}`;
  formData.append('prompt', prompt);
  formData.append('file', fileBlob, 'image.png');

  const res = await fetch(`${API_BASE_URL}/room/delete_object`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('No se pudo eliminar el objeto');
  }

  return res.json();
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/room/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("No se pudo subir la imagen");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    // Si el backend responde directamente un array, lo normalizamos a { objects: [...] }
    if (Array.isArray(data)) {
      return { objects: data };
    }
    return data;
  }

  // Fallback: el backend devolvió binario (ej. JPEG). Lo convertimos a data URI.
  const blob = await response.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return {
    status: "ok",
    filename: file.name,
    msg: "archivo recibido",
    imageData: dataUrl,
    objects: [],
  };
}
