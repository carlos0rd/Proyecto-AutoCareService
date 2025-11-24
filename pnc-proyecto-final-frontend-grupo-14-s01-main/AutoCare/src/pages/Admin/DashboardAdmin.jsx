"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ok, warn, error as errorSwal } from "../../utils/alerts"

const API_URL = import.meta.env.VITE_API_URL

const DashboardAdmin = () => {
  /* --------------------------- state --------------------------- */
  const [activeMenu, setActiveMenu] = useState("perfil")
  const [userData, setUserData] = useState(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [editFormData, setEditFormData] = useState({
    name:   "",
    email:  "",
    phone:  "",
    mobile: "",
  })
  const [newPassword, setNewPassword] = useState("")

  const navigate = useNavigate()

  /* --------------------------- auth guard --------------------------- */
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser     = localStorage.getItem("currentUser")

    if (!isAuthenticated || !currentUser) {
      navigate("/")
      return
    }

    const user = JSON.parse(currentUser)

    /* ✅ Identificamos ADMIN por rol_id === 3 */
    if (user.rol_id !== 3) {
      navigate("/dashboard-cliente")
      return
    }

    setUserData(user)
    setEditFormData({
      name:   user.name,
      email:  user.email,
      phone:  user.phone,
      mobile: user.mobile,
    })
  }, [navigate])

  /* --------------------------- helpers --------------------------- */
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  })

  /* --------------------------- eventos --------------------------- */
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* ----------- PERFIL: PUT /usuarios/:id ----------- */
  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      return warn("Campos obligatorios", "Nombre y correo no pueden quedar vacíos");
    }

    try {
      const res = await fetch(
        `${API_URL}/usuarios/${userData.id}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            nombre_completo: editFormData.name,
            email:           editFormData.email,
            telefono:        editFormData.phone,
            celular:         editFormData.mobile,
          }),
        },
      )

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al actualizar");
      }

      const updatedUser = {
        ...userData,
        name:   editFormData.name,
        email:  editFormData.email,
        phone:  editFormData.phone,
        mobile: editFormData.mobile,
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUserData(updatedUser)
      setShowEditModal(false)
      await ok("Perfil actualizado", "Los cambios se guardaron correctamente")
    } catch (err) {
      console.error(err)
      errorSwal("Hubo un problema al actualizar tu perfil")
    }
  }

  /* ----- CONTRASEÑA: PUT /usuarios/cambiar-contrasena/:id ----- */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      return warn("Contraseña demasiado corta", "Debe tener al menos 6 caracteres");
    }

    try {
      const res = await fetch(
        `${API_URL}/usuarios/cambiar-contrasena/${userData.id}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ nuevaContrasena: newPassword }),
        },
      )

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al cambiar la contraseña");
      }

      setNewPassword("")
      setShowPasswordModal(false)
      await ok("¡Contraseña cambiada!", "Tu nueva contraseña ya está activa");
    } catch (err) {
      console.error(err)
      errorSwal("Error al cambiar contraseña", err.message);
    }
  }

  const handleMenuClick = (menu) => {
    if (menu === "usuarios")      navigate("/gestion-usuarios")
    else if (menu === "vehiculos")navigate("/gestion-vehiculos")
    else if (menu === "repuestos")navigate("/gestion-repuestos-admin")
    else                          setActiveMenu(menu)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("token")
    navigate("/")
  }

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  }

  const sidebarStyle = {
    width: "280px",
    backgroundColor: "#038C3E",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  }

  const logoContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem 1rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  }

  const logoCircleStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const logoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }

  const adminLabelStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: "1rem",
  }

  const menuSectionStyle = {
    flex: 1,
    padding: "1rem 0",
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
    backgroundColor: "transparent",
  }

  const activeMenuItemStyle = {
    ...menuItemStyle,
    backgroundColor: "rgba(255,255,255,0.2)",
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

  /* --------------------------- render --------------------------- */
  if (!userData) {
    return (
      <div style={{ display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh" }}>
        <div>Cargando...</div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* ---------- Sidebar ---------- */}
      <div style={sidebarStyle}>
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
          <div style={adminLabelStyle}>Admin</div>
        </div>

        <div style={menuSectionStyle}>
          <div
            style={activeMenu === "perfil" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("perfil")}
          >
            Menu Perfil
          </div>
          <div
            style={activeMenu === "usuarios" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("usuarios")}
          >
            usuarios
          </div>
          <div
            style={activeMenu === "vehiculos" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("vehiculos")}
          >
            vehiculos
          </div>
          <div
            style={activeMenu === "repuestos" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("repuestos")}
          >
            Repuestos
          </div>
        </div>

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

      {/* ---------- Main Content ---------- */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={nameStyle}>{userData.name.toUpperCase()}</h1>
          <h2 style={subtitleStyle}>Menú Perfil</h2>
        </div>

        {/* Información Personal */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Información Personal:</h3>
          <div style={infoItemStyle}><strong>Nombre:</strong>  {userData.name}</div>
          <div style={infoItemStyle}><strong>Email:</strong>   {userData.email}</div>
          <div style={infoItemStyle}><strong>Teléfono:</strong>{userData.phone || "—"}</div>
          <div style={infoItemStyle}><strong>Celular:</strong> {userData.mobile || "—"}</div>
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

      {/* ---------- Modal Edición Perfil ---------- */}
      {showEditModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button style={closeButtonStyle} onClick={() => setShowEditModal(false)}>×</button>
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

      {/* ---------- Modal Cambio Contraseña ---------- */}
      {showPasswordModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button style={closeButtonStyle} onClick={() => setShowPasswordModal(false)}>×</button>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Cambio de Contraseña</h2>
              <p style={modalSubtitleStyle}>
                ¿Olvidaste tu contraseña? Ingrese los detalles a continuación para recuperarla
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

export default DashboardAdmin
