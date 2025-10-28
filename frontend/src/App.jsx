import React from "react";
import Compressor from "./components/Compressor";

export default function App(){
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <img src="/ecopixel.png" alt="EcoPixel logo" className="logo"/>
          <span className="brand">EcoPixel</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
      </nav>

      <div className="description">
        <h2>Bienvenido a EcoPixel</h2>
        <p>
          EcoPixel te permite <b>optimizar imágenes</b> fácilmente reduciendo la paleta de colores. 
          Con unos pocos clics podrás obtener una versión más ligera, manteniendo la calidad visual.
        </p>
        <p>
          Ideal para proyectos web, apps móviles y almacenamiento optimizado. 
          Selecciona tu imagen, elige el número de colores y observa la magia de EcoPixel.
        </p>
        <p>
          Podrás comparar los tamaños de la imagen que subiste y la imagen comprimida debajo de estas mismas.
        </p>
      </div>

      <div className="main-content">
        <Compressor/>
      </div>
    </div>
  );
}
