import React, { useState } from "react";

export default function Compressor({ token }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [noColors, setNoColors] = useState(16);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);

  const API = "http://localhost:8000";

  const handleSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOriginalSize(f.size); // peso original
    setCompressedUrl(null);
    setCompressedSize(null);
  };

  const handleCompress = async () => {
    if (!file) return alert("Selecciona una imagen primero");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("no_colors", noColors);
      const res = await fetch(`${API}/compress?no_colors=${noColors}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Error al comprimir");
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
      setCompressedSize(blob.size); // peso comprimido
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = "imagen_comprimida.jpg";
    a.click();
  };

  return (
    <div className="compressor">
      <div className="controls">
        <label className="btn btn-upload">
          Seleccionar imagen
          <input
            type="file"
            accept="image/*"
            onChange={handleSelect}
            style={{ display: "none" }}
          />
        </label>

        <label className="label-inline">
          <span>Número de colores:</span>
          <input
            type="number"
            min="1"
            max="256"
            value={noColors}
            onChange={(e) => setNoColors(Number(e.target.value))}
          />
        </label>

        <button onClick={handleCompress} disabled={loading || !file} className="btn btn-compress">
          {loading ? "Comprimiendo..." : "Comprimir imagen"}
        </button>

        <button
          onClick={handleDownload}
          disabled={!compressedUrl}
          className={`btn btn-download ${!compressedUrl ? "disabled" : ""}`}
        >
          Descargar
        </button>
      </div>

      <div className="images-row">
        <div className="img-card">
          <h3>Imagen original</h3>
          <div className="img-box">
            {preview ? (
              <img src={preview} alt="original" />
            ) : (
              <div className="placeholder">Sin imagen</div>
            )}
          </div>
          {originalSize && (
            <p className="info">Tamaño: {originalSize.toLocaleString()} bytes</p>
          )}
        </div>

        <div className="img-card">
          <h3>Imagen comprimida</h3>
          <div className="img-box">
            {compressedUrl ? (
              <img src={compressedUrl} alt="comprimida" />
            ) : (
              <div className="placeholder">Aquí aparecerá la comprimida</div>
            )}
          </div>
          {compressedSize && (
            <p className="info">Tamaño: {compressedSize.toLocaleString()} bytes</p>
          )}
        </div>
      </div>
    </div>
  );
}
