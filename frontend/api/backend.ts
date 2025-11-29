const API_BASE_URL = "http://localhost:8000";

export async function uploadFile(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/room/upload`, {
        method: "POST",
        body: formData,
    });

    return await response.blob();
}
