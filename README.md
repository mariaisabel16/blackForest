# BlackForest – RoomFlux

React frontend (Vite) + FastAPI backend. Upload a room photo, see detected objects, tweak colors, and apply/delete edits. Frontend shows loading overlays during upload/color/apply/delete. Backend endpoints:
- `POST /room/upload`: returns detections `{label, bbox}` and optional `imageData`.
- `POST /room/apply_color`: accepts `prompt` + `file`, returns `public_url`.
- `POST /room/delete_object`: accepts `prompt` + `file`, returns `public_url`.

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
On Windows, activate with `venv\Scripts\activate`.
