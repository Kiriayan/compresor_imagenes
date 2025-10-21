import React, { useEffect, useState } from "react";
import Compressor from "./components/Compressor";

export default function App(){
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(()=>{
    if(!token){
      window.location.href = "/login";
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <header>
        <h1>K-Means Image Compressor</h1>
        <div>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>
      <main>
        <Compressor token={token} />
      </main>
    </div>
  );
}