import React, { useState } from "react";

export default function Login(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if(!res.ok){
        const err = await res.json();
        setMsg(typeof err.detail === "string" ? err.detail : "Error en login");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      window.location.href = "/";
    }catch(err){
      setMsg("Error de conexión");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box-left">
        <h2>Log in</h2>
        <p className="welcome">Inicia sesión en tu cuenta</p>
        <form onSubmit={handleLogin}>
          <input placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} required/>
          <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button type="submit">Entrar</button>
        </form>
        <div className="links">
          <a href="/signup">¿No tienes cuenta? Crear</a>
        </div>
        {msg && <p className="error">{msg}</p>}
      </div>
      <div className="auth-box-right">
        <h3>Bienvenido a EcoPixel</h3>
        <p>
          EcoPixel es una herramienta para <b>comprimir imágenes</b> utilizando un algoritmo de agrupación de colores. 
          Para utilizar nuestro programa, solo requieres de crear una cuenta con tu nombre de usuario y contraseña.
          sube una imagen, selecciona el número de colores y obtén una versión optimizada en segundos.
        </p>
      </div>
    </div>
  );
}