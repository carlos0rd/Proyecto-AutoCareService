"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import LoginImage from "../../assets/login-img.png"
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../../config/api";


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: password })
      });
  
      const data = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(data.error || "Credenciales incorrectas");
      }
      
      const { token } = data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
  
      const meRes = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!meRes.ok) throw new Error("No se pudo obtener el perfil");
  
      const perfil = await meRes.json();  // {nombre_completo, email, telefono, celular, rol_id}
      //console.log(perfil);
      localStorage.setItem("currentUser", JSON.stringify({
        id: perfil.id,
        name: perfil.nombre_completo,  
        email: perfil.email,
        phone: perfil.telefono ?? "",
        mobile: perfil.celular ?? "",
        rol_id: perfil.rol_id
      }));
  
      if (perfil.rol_id === 1)      navigate("/dashboard-cliente");
      else if (perfil.rol_id === 2 ) navigate("/dashboard-mecanico");
      else if (perfil.rol_id === 3) navigate("/dashboard-admin");
      else                          navigate("/");
  
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    }
  
    setLoading(false);
  };


  // Estilos inline para asegurar que funcione sin Tailwind
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: "1rem",
  }

  const cardStyle = {
    width: "100%",
    maxWidth: "1200px",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
    display: "flex",
    minHeight: "600px",
  }

  const leftSectionStyle = {
    width: "50%",
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    position: "relative",
    zIndex: 10,
  }

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "2.5rem",
    flexWrap: "nowrap",
  }

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: 0,
  }

  const logoContainerStyle = {
    borderRadius: "50%",
    //padding: "0.5rem",
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }

  const logoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    maxWidth: "400px",
  }

  const labelStyle = {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "1.5rem",
  }

  const inputStyle = {
    width: "100%",
    height: "3rem",
    padding: "0 1rem",
    backgroundColor: "#F5F7F9",
    border: "2px solid #282F66",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    color: "#374151",
  }

  const passwordContainerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  }

  const eyeButtonStyle = {
    position: "absolute",
    right: "0.75rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0.25rem",
  }

  const buttonStyle = {
    width: "150px",
    height: "3rem",
    backgroundColor: loading ? "#6b7280" : "#282F66",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const errorStyle = {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    padding: "0.5rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "0.375rem",
  }

  const credentialsStyle = {
    backgroundColor: "#f0f9ff",
    border: "1px solid #0ea5e9",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  }

  const linkTextStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "center",
    marginTop: "1rem",
  }

  const linkStyle = {
    color: "#2D3573",
    textDecoration: "none",
    fontWeight: "500",
  }

  const rightSectionStyle = {
    width: "50%",
    position: "relative",
    backgroundImage:`url(${LoginImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    clipPath: "polygon(25% 0, 100% 0%, 100% 100%, 0% 100%)",
  }

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    clipPath: "polygon(0% 0%, 25% 0%, 0% 100%)",
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Lado Izquierdo */}
        <div style={leftSectionStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Bienvenidos</h1>
            <div style={logoContainerStyle}>
              <img
                src="/Logo.png"
                alt="AutoCare Manager"
                style={logoStyle}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiMyRDM1NzMiLz4KPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BQzwvdGV4dD4KPC9zdmc+"
                }}
              />
            </div>
          </div>

          <form onSubmit={handleLogin} style={formStyle}>
            <p style={labelStyle}>Ingresar credenciales para iniciar sesión</p>   
            <input
              type="email"
              placeholder="Email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button type="button" style={eyeButtonStyle} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <button
              type="submit"
              style={buttonStyle}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#1e2550")}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#282F66")}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p style={linkTextStyle}>
              ¿Aún no te has registrado?{" "}
              <Link to="/Register" style={linkStyle}>
                Regístrate
              </Link>
            </p>
          </form>
        </div>

        {/* Lado Derecho */}
        <div style={rightSectionStyle}>
          <div style={overlayStyle} />
        </div>
      </div>
    </div>
  )
}

export default Login