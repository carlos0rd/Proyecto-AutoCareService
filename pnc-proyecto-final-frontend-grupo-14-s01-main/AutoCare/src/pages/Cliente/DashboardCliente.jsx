"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ok, warn, error as errorSwal } from "../../utils/alerts"

const DashboardCliente = () => {
  const [activeMenu, setActiveMenu] = useState("perfil")
  const [userData, setUserData] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [mantenimientosProximos, setMantenimientosProximos] = useState([])
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mobile: "",
  })
  const [newPassword, setNewPassword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("currentUser")

    if (!isAuthenticated || !currentUser) {
      // Si no está autenticado, redirigir al login
      navigate("/")
      return
    }

    // Cargar datos del usuario
    const user = JSON.parse(currentUser)
    setUserData(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      mobile: user.mobile,
    })

    // Cargar mantenimientos próximos
    const token = localStorage.getItem("token")
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/reparaciones/mantenimientos-proximos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return [];
          }
          return res.json();
        })
        .then(data => {
          setMantenimientosProximos(data || []);
        })
        .catch(err => {
          console.error("Error cargando mantenimientos:", err);
          setMantenimientosProximos([]);
        })
    }

   // console.log(user);
  }, [navigate])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if(!editFormData.name.trim() || !editFormData.email.trim()) {
      return warn("Campos obligatorios", "Nombre y correo no pueden quedar vaciós")
    }

    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser.id;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_completo: editFormData.name,
          email: editFormData.email,
          telefono: editFormData.phone,
          celular: editFormData.mobile
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al actualizar")
      }

      await ok("Perfil actualizado", "Los cambios se guardaron correctamente")

      // Actualizar localStorage y estado local
      const updatedUser = {
        ...currentUser,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        mobile: editFormData.mobile
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setShowEditModal(false);
    } catch (err) {
      console.error(err)
      errorSwal("No se pudo actualizar", err.message)
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return warn("Contraseña muy corta", "Debe tener al menos 6 caracteres")
    }

    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser.id;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/cambiar-contrasena/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nuevaContrasena: newPassword
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al cambiar contraseña")
      }

      await ok("Contraseña cambiada", "Tu nueva contraseña ya está activa")
      setNewPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      console.error(err)
      errorSwal("Error al cambiar contraseña", err.message)
    }
  };

  const handleMenuClick = (menu) => {
    if (menu === "vehiculos") {
      navigate("/vehiculos-cliente")
    } else if (menu === "facturas") {
      navigate("/facturas-cliente")
    } else if (menu === "cotizaciones") {
      navigate("/cotizaciones-cliente")
    } else {
      setActiveMenu(menu)
    }
  }

  // Estilos inline para asegurar que funcione sin Tailwind
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  }

  const sidebarStyle = {
    width: "280px",
    backgroundColor: "#2D3573",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  }

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  }

  const logoCircleStyle = {
    width: "120px",
    height: "120px",
    //backgroundColor: "white",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    //padding: "1rem",
  }

  const logoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }

  const menuSectionStyle = {
    flex: 1,
    padding: "1rem 0",
  }

  const menuTitleStyle = {
    padding: "1rem 1.5rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "0.5rem",
  }

  const menuItemStyle = {
    display: "block",
    padding: "1rem 1.5rem",
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    borderLeft: "4px solid transparent",
    transition: "all 0.3s ease",
    cursor: "pointer",
  }

  const activeMenuItemStyle = {
    ...menuItemStyle,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderLeftColor: "white",
    fontWeight: "600",
  }

  const logoutStyle = {
    padding: "1.5rem",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  }

  const logoutButtonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  }

  const mainContentStyle = {
    flex: 1,
    padding: "3rem",
    backgroundColor: "#f8f9fa",
  }

  const headerStyle = {
    marginBottom: "2rem",
  }

  const nameStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
    letterSpacing: "0.02em",
  }

  const subtitleStyle = {
    fontSize: "1.5rem",
    color: "#374151",
    margin: "0 0 2rem 0",
  }

  const sectionStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  }

  const sectionTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "1.5rem",
  }

  const infoItemStyle = {
    marginBottom: "1rem",
    fontSize: "1rem",
    color: "#374151",
  }

  const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  }

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2D3573",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }

  // Estilos para los modales
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "2rem",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    position: "relative",
  }

  const modalHeaderStyle = {
    marginBottom: "1.5rem",
  }

  const modalTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const modalSubtitleStyle = {
    fontSize: "1rem",
    color: "#6b7280",
  }

  const closeButtonStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#6b7280",
  }

  const formGroupStyle = {
    marginBottom: "1rem",
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
  }

  const saveButtonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2D3573",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1rem",
  }

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")

    // Redirigir al login
    navigate("/")
  }

  // Si no hay datos del usuario, mostrar loading
  if (!userData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div>Cargando...</div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Logo */}
        <div style={logoContainerStyle}>
          <div style={logoCircleStyle}>
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

        {/* Menu */}
        <div style={menuSectionStyle}>
          <div style={menuTitleStyle}>Cliente</div>

          <div
            style={activeMenu === "vehiculos" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("vehiculos")}
          >
            Menu vehículos
          </div>

          <div
            style={activeMenu === "cotizaciones" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("cotizaciones")}
          >
            Cotizaciones
          </div>

          <div
            style={activeMenu === "facturas" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("facturas")}
          >
            Facturas
          </div>

          <div
            style={activeMenu === "perfil" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("perfil")}
          >
            Menu Perfil
          </div>
        </div>

        {/* Logout */}
        <div style={logoutStyle}>
          <button
            style={logoutButtonStyle}
            onClick={handleLogout}
            onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={nameStyle}>{userData?.name?.toUpperCase() || "Usuario"}</h1>
          <h2 style={subtitleStyle}>Menú Perfil</h2>
        </div>

        {/* Notificación de Mantenimientos Próximos */}
        {mantenimientosProximos.length > 0 && (
          <div style={{
            backgroundColor: "#fef3c7",
            border: "2px solid #fbbf24",
            borderLeft: "6px solid #f59e0b",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem"
            }}>
              <span style={{ fontSize: "2rem" }}>🔔</span>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#92400e",
                margin: 0
              }}>
                Recordatorio de Mantenimiento
              </h3>
            </div>
            <p style={{
              fontSize: "1rem",
              color: "#78350f",
              marginBottom: "1rem"
            }}>
              Tienes {mantenimientosProximos.length} {mantenimientosProximos.length === 1 ? 'vehículo' : 'vehículos'} con mantenimiento programado para hoy o mañana:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {mantenimientosProximos.map((mant) => {
                const fecha = new Date(mant.fecha_proximo_mantenimiento);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaMant = new Date(fecha);
                fechaMant.setHours(0, 0, 0, 0);
                const esHoy = fechaMant.getTime() === hoy.getTime();
                
                return (
                  <div key={mant.id} style={{
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #fbbf24"
                  }}>
                    <div style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#92400e",
                      marginBottom: "0.5rem"
                    }}>
                      {esHoy ? "⏰ Hoy" : "📅 Mañana"} - {mant.marca} {mant.modelo} ({mant.placa})
                    </div>
                    <div style={{
                      fontSize: "0.875rem",
                      color: "#78350f"
                    }}>
                      <strong>Reparación #{mant.id}:</strong> {mant.tipo_reparacion}
                    </div>
                    <div style={{
                      fontSize: "0.875rem",
                      color: "#78350f",
                      marginTop: "0.25rem"
                    }}>
                      <strong>Fecha programada:</strong> {fecha.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Información Personal */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Información Personal:</h3>
          <div style={infoItemStyle}>
            <strong>Nombre:</strong> {userData.name}
          </div>
          <div style={infoItemStyle}>
            <strong>Email:</strong> {userData.email}
          </div>
          <div style={infoItemStyle}>
            <strong>Teléfono:</strong> {userData.phone}
          </div>
          <div style={infoItemStyle}>
            <strong>Celular:</strong> {userData.mobile}
          </div>
        </div>

        {/* Editar Información */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Editar Información</h3>
          <div style={buttonContainerStyle}>
            <button
              style={buttonStyle}
              onClick={() => setShowEditModal(true)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
            >
              Editar información personal
            </button>
            <button
              style={buttonStyle}
              onClick={() => setShowPasswordModal(true)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
            >
              Cambiar mi contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Perfil */}
      {showEditModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button style={closeButtonStyle} onClick={() => setShowEditModal(false)}>
              ×
            </button>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Editar Perfil</h2>
              <p style={modalSubtitleStyle}>Editar la información personal de su perfil</p>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={formGroupStyle}>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Email"
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Teléfono"
                />
              </div>
              <div style={formGroupStyle}>
                <input
                  type="tel"
                  name="mobile"
                  value={editFormData.mobile}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Celular"
                />
              </div>
              <button
                type="submit"
                style={saveButtonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button style={closeButtonStyle} onClick={() => setShowPasswordModal(false)}>
              ×
            </button>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Cambio de Contraseña</h2>
              <p style={modalSubtitleStyle}>
                ¿Olvidaste tu contraseña? Ingrese los detalles a continuación para recuperar sus credenciales
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div style={formGroupStyle}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="Nueva Contraseña"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                style={saveButtonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
              >
                Cambiar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardCliente
