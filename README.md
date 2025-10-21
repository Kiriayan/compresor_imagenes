# KMeans Image Compressor 

## Backend
```
cd backend
python -m venv .venv
.venv\Scripts\activate   # en Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000/docs

## Frontend
```
cd frontend
npm install
npm run dev
```

App: http://localhost:5173
