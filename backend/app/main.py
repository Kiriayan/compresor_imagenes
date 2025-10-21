from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from . import kmeans_utils
from .auth import init_db, create_user, authenticate_user, create_access_token

# Inicializar base de datos
init_db()

app = FastAPI(title="KMeans Image Compressor API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic para usuario
class User(BaseModel):
    username: str
    password: str

# Registro
@app.post("/signup")
def signup(user: User):
    ok = create_user(user.username, user.password)
    if not ok:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    return {"message": "Usuario creado"}

# Login
@app.post("/login")
def login(user: User):
    if not authenticate_user(user.username, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# Compresión de imagen
@app.post("/compress")
async def compress_image(no_colors: int = 16, file: UploadFile = File(...)):
    if no_colors < 1 or no_colors > 256:
        raise HTTPException(status_code=400, detail="No. de colores inválido (1-256)")
    contents = await file.read()
    try:
        compressed_bytes = kmeans_utils.compress_image_bytes(contents, no_colors)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")
    return StreamingResponse(io.BytesIO(compressed_bytes), media_type="image/jpeg")
