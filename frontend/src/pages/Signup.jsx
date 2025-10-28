import React, { useState } from "react";

export default function Signup(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if(!res.ok){
        const err = await res.json();
        setMsg(typeof err.detail === "string" ? err.detail : "Error en registro");
        return;
      }
      window.location.href = "/login";
    }catch(err){
      setMsg("Error de conexión");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box-left">
        <h2>EcoPixel</h2>
        <p className="welcome">Crea tu cuenta</p>
        <form onSubmit={handleSignup}>
          <input placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} required/>
          <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button type="submit">Crear</button>
        </form>
        <div className="links">
          <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
        {msg && <p className="error">{msg}</p>}
      </div>
      <div className="auth-box-right">
        <h3>Bienvenido a EcoPixel</h3>
        <p>
          Con EcoPixel puedes reducir el tamaño de tus imágenes sin perder calidad visual, 
          aplicando técnicas inteligentes de agrupación de colores.
        </p>
      </div>
    </div>
  );
}