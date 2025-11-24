"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ok, warn, error as errorSwal, confirm } from "../../utils/alerts"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const GestionUsuarios = () => {
  const [activeMenu, setActiveMenu]      = useState("usuarios")
  const [userData, setUserData]          = useState(null)
  const [usuarios, setUsuarios]          = useState([])         
  const [searchTerm, setSearchTerm]      = useState("")
  const [showEditModal, setShowEditModal]= useState(false)
  const [selectedUser, setSelectedUser]  = useState(null)
  const [editFormData, setEditFormData]  = useState({
    name  : "",
    email : "",
    phone : "",
    mobile: "",
    role  : "cliente",
  })
  const navigate = useNavigate()

  /* ---------- Helpers de API ---------- */
  const token = localStorage.getItem("token")            
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchUsuarios = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/usuarios`, { headers: authHeaders })
      const parsed = data.map(u => ({
        id    : u.id,
        name  : u.nombre_completo,
        email : u.email,
        phone : u.telefono,
        mobile: u.celular,
        role  : u.rol_id === 1 ? "cliente" : u.rol_id === 2 ? "mecanico" : "admin",
      }))
      setUsuarios(parsed)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) handleLogout()
    }
  }

  const updateUsuario = async (id, payload) => {
    const url =
      payload.rol_id !== undefined
        ? `${API_BASE_URL}/usuarios/admin/${id}`
        : `${API_BASE_URL}/usuarios/${id}`

    await axios.put(url, payload, { headers: authHeaders })
  }

  const deleteUsuario = async (id) => {
    await axios.delete(`${API_BASE_URL}/usuarios/${id}`, { headers: authHeaders })
  }

  /* ---------- Comprobación de sesión + carga inicial ---------- */
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser     = localStorage.getItem("currentUser")

    if (!isAuthenticated || !currentUser) {
      navigate("/")
      return
    }

    const user = JSON.parse(currentUser)
    if (user.rol_id !== 3) {
      navigate("/dashboard-cliente")
      return
    }

    setUserData(user)
    fetchUsuarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  /* ---------- Filtros y handlers de formulario ---------- */
  const filteredUsuarios = usuarios.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }

  const handleRoleChange = (role) => {
    setEditFormData({ ...editFormData, role })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!editFormData.name.trim() || !editFormData.email.trim()){
      return warn("Campos obligatorios", "Nombre y correo no puede estar vacíos")
    }

    try {
      /* Mapear a campos esperados por tu backend */
      const payload = {
        nombre_completo: editFormData.name,
        email          : editFormData.email,
        telefono       : editFormData.phone,
        celular        : editFormData.mobile,
      }

      /* Solo admin puede cambiar rol; lo codificamos a rol_id si es distinto */
      const roleMap = { cliente: 1, mecanico: 2, admin: 3 }
      if (selectedUser.role !== editFormData.role) {
        payload.rol_id = roleMap[editFormData.role]
      }

      await updateUsuario(selectedUser.id, payload)
      await fetchUsuarios()
      setShowEditModal(false)
      await ok("Usuario actualizado", "Los cambios se guardaron correctamente")
    } catch (err) {
      console.error(err)
      errorSwal("Error al actualizar", err.response?.data?.message || "Intenta más tarde")
    }
  }

  const handleDeleteUser = async () => {
    const aceptado = await confirm("¿Eliminar usuario?","Esta acción es irreversible")
    if (!aceptado) return

    try {
      await deleteUsuario(selectedUser.id)
      await fetchUsuarios()
      setShowEditModal(false)

      await ok("Usuario eliminado", "La cuenta se eliminó correctamente")       
    } catch (err) {
      console.error(err)
      errorSwal("No se pudo eliminar", err.response?.data?.message || "Error desconocido")
    }
  }

  /* ---------- Navegación y logout ---------- */
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("token")
    navigate("/")
  }

  const handleMenuClick = (menu) => {
    setActiveMenu(menu)
    if (menu === "perfil")    navigate("/dashboard-admin")
    if (menu === "vehiculos") navigate("/gestion-vehiculos")
  }

  const handleEditUser = (usuario) => {
    setSelectedUser(usuario)
    setEditFormData({
      name  : usuario.name,
      email : usuario.email,
      phone : usuario.phone,
      mobile: usuario.mobile,
      role  : usuario.role,
    })
    setShowEditModal(true)
  }

  /* ---------- Render ---------- */
  if (!userData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div>Cargando...</div>
      </div>
    )
  }

  const containerStyle = { display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }

  const sidebarStyle = {
    width: "280px", backgroundColor: "#038C3E", color: "white",
    display: "flex", flexDirection: "column", padding: 0,
  }

  const logoContainerStyle = {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "2rem 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.1)",
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

  const logoStyle           = { width: "100%", height: "100%", objectFit: "contain" }
  const adminLabelStyle     = { fontSize: "1.2rem", fontWeight: 600, color: "white", textAlign: "center", marginBottom: "1rem" }
  const menuSectionStyle    = { flex: 1, padding: "1rem 0" }
  const menuItemStyle       = {
    display: "block", padding: "1rem 1.5rem", color: "white", textDecoration: "none", fontSize: "1rem",
    borderLeft: "4px solid transparent", transition: "all .3s", cursor: "pointer",
  }
  const activeMenuItemStyle = { ...menuItemStyle, backgroundColor: "rgba(255,255,255,0.2)", borderLeftColor: "white", fontWeight: 600 }
  const logoutStyle         = { padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }
  const logoutButtonStyle   = {
    width: "100%", padding: ".75rem", backgroundColor: "transparent", color: "white",
    border: "1px solid rgba(255,255,255,0.3)", borderRadius: ".375rem", cursor: "pointer", fontSize: "1rem", transition: "all 0.3s ease",
  }

  const mainContentStyle = { flex: 1, padding: "3rem", backgroundColor: "#f8f9fa" }
  const headerStyle      = { marginBottom: "2rem" }
  const titleStyle       = { fontSize: "3rem", fontWeight: "bold", color: "#2D3573", margin: "0 0 2rem", letterSpacing: ".02em" }
  const searchContainerStyle = { position: "relative", marginBottom: "2rem", maxWidth: "500px" }
  const searchInputStyle     = {
    width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "1rem",
    border: "2px solid #4ADE80", borderRadius: "25px", backgroundColor: "#4ADE80",
    color: "white", outline: "none",
  }
  const searchIconStyle   = { position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "white", fontSize: "1.2rem" }
  const usersGridStyle    = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", maxWidth: "800px" }
  const userCardStyle     = { backgroundColor: "#2D3573", borderRadius: "25px", padding: "1rem 1.5rem", display: "flex",
                              alignItems: "center", justifyContent: "space-between", color: "white", minHeight: "60px" }
  const userInfoStyle     = { display: "flex", alignItems: "center", gap: ".75rem" }
  const userIconStyle     = { fontSize: "1.5rem" }
  const userNameStyle     = { fontSize: "1rem", fontWeight: 500 }
  const editButtonStyle   = {
    backgroundColor: "transparent", color: "white", border: "1px solid white", borderRadius: "15px",
    padding: ".5rem 1rem", fontSize: ".875rem", fontWeight: 500, cursor: "pointer", transition: "all .3s",
  }

  /* ---- estilos del modal ---- */
  const modalOverlayStyle       = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.7)",
                                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }
  const modalStyle              = { backgroundColor: "white", borderRadius: "1rem", padding: "2rem", width: "100%",
                                    maxWidth: "500px", boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)", position: "relative" }
  const modalHeaderStyle        = { textAlign: "center", marginBottom: "2rem" }
  const modalTitleStyle         = { fontSize: "1.5rem", fontWeight: "bold", color: "#2D3573", margin: "0 0 .5rem" }
  const modalSubtitleStyle      = { fontSize: "1rem", color: "#6b7280" }
  const formGroupStyle          = { marginBottom: "1rem" }
  const inputStyle              = { width: "100%", padding: ".75rem", border: "2px solid #d1d5db",
                                    borderRadius: ".375rem", fontSize: "1rem", outline: "none", transition: "border-color .3s" }
  const roleContainerStyle      = { display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center" }
  const roleOptionStyle         = { display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer" }
  const radioStyle              = { width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #d1d5db",
                                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }
  const radioSelectedStyle      = { ...radioStyle, backgroundColor: "#2D3573", borderColor: "#2D3573" }
  const radioSelectedAdminStyle = { ...radioStyle, backgroundColor: "#038C3E", borderColor: "#038C3E" }
  const radioInnerStyle         = { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "white" }
  const buttonContainerStyle    = { display: "flex", gap: "1rem", justifyContent: "center" }
  const saveButtonStyle         = { padding: ".75rem 2rem", backgroundColor: "#2D3573", color: "white", border: "none",
                                    borderRadius: ".375rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer", transition: "background-color .3s" }
  const deleteButtonStyle       = { padding: ".75rem 2rem", backgroundColor: "#6b7280", color: "white", border: "none",
                                    borderRadius: ".375rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer", transition: "background-color .3s" }

  return (
    <div style={containerStyle}>
      {/* ---------- SIDEBAR ---------- */}
      <div style={sidebarStyle}>
        <div style={logoContainerStyle}>
          <div style={logoCircleStyle}>
            <img
              src="/Logo.png"
              alt="AutoCare Manager"
              style={logoStyle}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI0MCIgZmlsbD0iIzJEMzU3MyIvPjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QUM8L3RleHQ+PC9zdmc+"
              }}
            />
          </div>
          <div style={adminLabelStyle}>Admin</div>
        </div>

        <div style={menuSectionStyle}>
          <div style={activeMenu==="perfil"   ? activeMenuItemStyle:menuItemStyle} onClick={()=>handleMenuClick("perfil")}>Menu Perfil</div>
          <div style={activeMenu==="usuarios" ? activeMenuItemStyle:menuItemStyle} onClick={()=>handleMenuClick("usuarios")}>usuarios</div>
          <div style={activeMenu==="vehiculos"? activeMenuItemStyle:menuItemStyle} onClick={()=>handleMenuClick("vehiculos")}>vehiculos</div>
        </div>

        <div style={logoutStyle}>
          <button
            style={logoutButtonStyle}
            onClick={handleLogout}
            onMouseOver={e=>e.currentTarget.style.backgroundColor="rgba(255,255,255,.1)"}
            onMouseOut ={e=>e.currentTarget.style.backgroundColor="transparent"}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>GESTION DE USUARIOS</h1>
          <div style={searchContainerStyle}>
            <div style={searchIconStyle}>🔍</div>
            <input
              type="text"
              placeholder="Ingresar nombre de usuario"
              style={searchInputStyle}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRID DE USUARIOS */}
        <div style={usersGridStyle}>
          {filteredUsuarios.map((u) => (
            <div key={u.id} style={userCardStyle}>
              <div style={userInfoStyle}>
                <span style={userIconStyle}>👤</span>
                <span style={userNameStyle}>{u.name}</span>
              </div>
              <button
                style={editButtonStyle}
                onClick={() => handleEditUser(u)}
                onMouseOver={(e)=>e.currentTarget.style.backgroundColor="rgba(255,255,255,.1)"}
                onMouseOut={(e)=>e.currentTarget.style.backgroundColor="transparent"}
              >
                EDITAR
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- MODAL EDICIÓN ---------- */}
      {showEditModal && (
        <div style={modalOverlayStyle} onClick={()=>setShowEditModal(false)}>
          <div style={modalStyle} onClick={(e)=>e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>EDITAR USUARIO</h2>
              <p  style={modalSubtitleStyle}>Editar perfil de un usuario</p>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={formGroupStyle}>
                <input
                  type="text" name="name" value={editFormData.name}
                  onChange={handleEditChange} style={inputStyle}
                  placeholder="Nombre completo" required
                />
              </div>
              <div style={formGroupStyle}>
                <input
                  type="email" name="email" value={editFormData.email}
                  onChange={handleEditChange} style={inputStyle}
                  placeholder="Email" required
                />
              </div>
              <div style={formGroupStyle}>
                <input
                  type="tel" name="phone" value={editFormData.phone}
                  onChange={handleEditChange} style={inputStyle}
                  placeholder="Teléfono"
                />
              </div>
              <div style={formGroupStyle}>
                <input
                  type="tel" name="mobile" value={editFormData.mobile}
                  onChange={handleEditChange} style={inputStyle}
                  placeholder="Celular"
                />
              </div>

              {/* Roles */}
              <div style={roleContainerStyle}>
                {["cliente","mecanico","admin"].map(r=>(
                  <div key={r} style={roleOptionStyle} onClick={()=>handleRoleChange(r)}>
                    <div style={
                      editFormData.role===r
                        ? (r==="admin"?radioSelectedAdminStyle:radioSelectedStyle)
                        : radioStyle
                    }>
                      {editFormData.role===r && <div style={radioInnerStyle}/>}
                    </div>
                    <span>{r.charAt(0).toUpperCase()+r.slice(1)}</span>
                  </div>
                ))}
              </div>

              <div style={buttonContainerStyle}>
                <button type="submit"
                  style={saveButtonStyle}
                  onMouseOver={e=>e.currentTarget.style.backgroundColor="#1e2550"}
                  onMouseOut={e=>e.currentTarget.style.backgroundColor="#2D3573"}
                >
                  GUARDAR
                </button>
                <button type="button"
                  style={deleteButtonStyle}
                  onClick={handleDeleteUser}
                  onMouseOver={e=>e.currentTarget.style.backgroundColor="#4b5563"}
                  onMouseOut={e=>e.currentTarget.style.backgroundColor="#6b7280"}
                >
                  Eliminar cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionUsuarios
