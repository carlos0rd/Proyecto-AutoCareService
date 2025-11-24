"use client"

import { useState } from "react"
import RegImage from "../../assets/register-img.png"
import { useNavigate } from "react-router-dom"
import { ok, warn, error as errorSwal } from "../../utils/alerts"
import { API_URL } from "../../config/api"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    mobile: "",
  })
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  if(formData.password !== formData.confirmPassword){
    return warn("Contraseñas distintas", "Verifica e intentalo de nuevo");
  }

  const payload = {
    nombre_completo: formData.name,
    email          : formData.email,
    contrasena     : formData.password,
    telefono       : formData.phone,
    celular        : formData.mobile
  };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      await ok('¡Registro completado!', 'Usuario creado con éxito');
      navigate("/");
    } else {
      const mensaje = data?.message || `Error del servidor (${response.status}), cuenta existente`;
      errorSwal("Error en el registro", mensaje);
    }
  } catch (error) {
    console.error(error);
    errorSwal("Error de conexión: ", error.message);
  }
};

  // Estilos inline como fallback si Tailwind no funciona
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  const formSectionStyle = {
    width: "50%",
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2D3573",
    marginBottom: "1rem",
  }

  const subtitleStyle = {
    fontSize: "1.125rem",
    color: "#6b7280",
    marginBottom: "2rem",
  }

  const inputStyle = {
    width: "100%",
    height: "3rem",
    padding: "0 1rem",
    backgroundColor: "#F5F7F9",
    border: "2px solid #282F66",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    marginBottom: "1rem",
  }

  const buttonStyle = {
    backgroundColor: "#282F66",
    color: "white",
    padding: "0.75rem 2rem",
    borderRadius: "0.375rem",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1rem",
  }

  const imageSectionStyle = {
    width: "50%",
    position: "relative",
    backgroundImage:`url(${RegImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    clipPath: "polygon(25% 0, 100% 0%, 100% 100%, 0% 100%)",
  }

  return (
    <div style={containerStyle} className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div style={cardStyle} className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden flex">
        {/* Lado Izquierdo - Formulario */}
        <div style={formSectionStyle} className="w-1/2 p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 style={titleStyle} className="text-4xl font-bold mb-4 text-blue-900">
              Crear una cuenta nueva
            </h1>
            <p style={subtitleStyle} className="text-gray-600 text-lg mb-8">
              Crea una cuenta para poder seguir nuestros servicios.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                className="w-full h-12 px-4 bg-gray-50 border-2 border-blue-900 rounded-md mb-4"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                className="w-full h-12 px-4 bg-gray-50 border-2 border-blue-900 rounded-md mb-4"
                required
              />

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  className="flex-1 h-12 px-4 bg-gray-50 border-2 border-blue-900 rounded-md"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme su contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  className="flex-1 h-12 px-4 bg-gray-50 border-2 border-blue-900 rounded-md"
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  className="flex-1 h-12 px-4 bg-gray-50 border-2 border-blue-900 rounded-md"
                />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Celular"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  className="flex-1 h-12 px-4 bg-gray-50 border-2 border-blue-900 rounded-md"
                />
              </div>

              <button
                type="submit"
                style={buttonStyle}
                className="bg-blue-900 text-white px-8 py-3 rounded-md font-semibold hover:opacity-90"
              >
                Crear Cuenta
              </button>

              <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
                ¿Ya tienes una cuenta?{" "}
                <a href="/" style={{ color: "#2D3573", textDecoration: "none" }}>
                  Iniciar sesión
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Lado Derecho - Imagen */}
        <div style={imageSectionStyle} className="w-1/2 relative">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "white",
              clipPath: "polygon(0% 0%, 25% 0%, 0% 100%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Register
