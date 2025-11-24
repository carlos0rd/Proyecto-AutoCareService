"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ok, warn, error as errorSwal, confirm } from "../../utils/alerts"

const GestionVehiculos = () => {
  /* ---------- ESTADOS ---------- */
  const [activeMenu, setActiveMenu] = useState("vehiculos")
  const [userData, setUserData] = useState(null)
  const [vehiculos, setVehiculos] = useState([])   
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState(null)
  const [editFormData, setEditFormData] = useState({
    modelo: "",
    marca: "",
    año: "",
    color: "",
    placa: "",
  })

  const navigate = useNavigate()

  /* ---------- CARGA INICIAL & AUTENTICACIÓN ---------- */
  useEffect(() => {
    const token       = localStorage.getItem("token")
    const currentUser = localStorage.getItem("currentUser")

    if (!token || !currentUser) { navigate("/"); return }

    const parsedUser = JSON.parse(currentUser)
    if (parsedUser.rol_id !== 3) { navigate("/dashboard-cliente"); return }

    setUserData(parsedUser)
    fetchVehiculos(token)
  }, [navigate])

  /* ---------- OBTENER VEHÍCULOS ---------- */
  const fetchVehiculos = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/vehiculos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      // El backend devuelve { data: [...] }
      setVehiculos(res.data.data || [])
    } catch (err) {
      console.error("Error cargando vehículos:", err)
    }
  }

  /* ---------- FILTRO DE BÚSQUEDA ---------- */
  const filteredVehiculos = vehiculos.filter(
    (v) =>
      v.marca .toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  /* ---------- MODAL: EDITAR ---------- */
  const handleEditVehiculo = (v) => {
    setSelectedVehiculo(v)
    setEditFormData({
      modelo: v.modelo,
      marca : v.marca,
      año   : v.anio?.toString() || "",
      color : v.color,
      placa : v.placa,
    })
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if(
      !editFormData.modelo.trim() ||
      !editFormData.marca.trim()  ||
      !editFormData.año.trim()
    ) {
      return warn("Campos obligatorios", "Modelo, marca y año no pueden quedar vacíos")
    }

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:3000/vehiculos/${selectedVehiculo.id}`,
        {
          modelo: editFormData.modelo,
          marca : editFormData.marca,
          anio  : editFormData.año,   
          color : editFormData.color,
          placa : editFormData.placa,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      await ok("Vehículo actualizado", "Los cambios se guardaron correctamente")
      setShowEditModal(false)
      fetchVehiculos(token)
    } catch (err) {
      console.error("Error al actualizar:", err)
      errorSwal("Error al actualizar", 
                err.response?.data?.message || "Intenta más tarde")
    }
  }

  const handleDeleteVehiculo = async () => {
    const aceptado = await confirm("¿Eliminar este vehículo?", "Esta acción es irreversible")
    if (!aceptado) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `http://localhost:3000/vehiculos/${selectedVehiculo.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      await ok("Vehículo eliminado", "El vehículo se eliminó correctamente")
      setShowEditModal(false)
      fetchVehiculos(token)
    } catch (err) {
      console.error(err)
      errorSwal("No se pudo eliminar",
                err.response?.data?.message || "Error desconocido")
    }
  }

  /* ---------- NAVEGACIÓN / LOGOUT ---------- */
  const handleMenuClick = (menu) => {
    setActiveMenu(menu)
    if (menu === "perfil")   navigate("/dashboard-admin")
    if (menu === "usuarios") navigate("/gestion-usuarios")
  }
  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  /* ---------- MOSTRAR CARGANDO ---------- */
  if (!userData) return <div style={{textAlign:"center",marginTop:"4rem"}}>Cargando...</div>

  const containerStyle = { display:"flex", minHeight:"100vh", backgroundColor:"#f5f5f5" }
  const sidebarStyle   = { width:"280px", backgroundColor:"#038C3E", color:"white", display:"flex", flexDirection:"column" }
  const logoContainerStyle = { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.1)" }
  const logoCircleStyle    = { width: "120px",height: "120px",borderRadius: "50%",overflow: "hidden",display: "flex",alignItems: "center",justifyContent: "center", }
  const logoStyle          = { width:"100%", height:"100%", objectFit:"contain" }
  const adminLabelStyle    = { fontSize:"1.2rem", fontWeight:"600", textAlign:"center", marginBottom:"1rem" }
  const menuSectionStyle   = { flex:1, padding:"1rem 0" }
  const menuItemStyle      = { display:"block", padding:"1rem 1.5rem", color:"white", fontSize:"1rem", borderLeft:"4px solid transparent", cursor:"pointer" }
  const activeMenuItemStyle= { ...menuItemStyle, backgroundColor:"rgba(255,255,255,0.2)", borderLeft:"4px solid white", fontWeight:"600" }
  const logoutStyle        = { padding:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.1)" }
  const logoutButtonStyle  = { width:"100%", padding:"0.75rem", backgroundColor:"transparent", color:"white", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"0.375rem", cursor:"pointer", fontSize: "1rem",  transition: "all 0.3s ease",}

  const mainContentStyle   = { flex:1, padding:"3rem", backgroundColor:"#f8f9fa" }
  const headerStyle        = { marginBottom:"2rem" }
  const titleStyle         = { fontSize:"3rem", fontWeight:"bold", color:"#2D3573", margin:"0 0 2rem 0", letterSpacing:"0.02em" }

  const searchContainerStyle={ position:"relative", marginBottom:"2rem", maxWidth:"500px" }
  const searchInputStyle   = { width:"100%", padding:"1rem 1rem 1rem 3rem", fontSize:"1rem", border:"2px solid #4ADE80", borderRadius:"25px", backgroundColor:"#4ADE80", color:"white", outline:"none" }
  const searchIconStyle    = { position:"absolute", left:"1rem", top:"50%", transform:"translateY(-50%)", color:"white", fontSize:"1.2rem" }

  const vehiculosGridStyle = { display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"1rem", maxWidth:"800px" }
  const vehiculoCardStyle  = { backgroundColor:"#2D3573", borderRadius:"25px", padding:"1rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", color:"white", minHeight:"60px" }
  const vehiculoInfoStyle  = { display:"flex", alignItems:"center", gap:"0.75rem" }
  const vehiculoIconStyle  = { fontSize:"1.5rem" }
  const vehiculoNameStyle  = { fontSize:"1rem", fontWeight:"500" }
  const editButtonStyle    = { backgroundColor:"transparent", color:"white", border:"1px solid white", borderRadius:"15px", padding:"0.5rem 1rem", fontSize:"0.875rem", cursor:"pointer" }

  const modalOverlayStyle  = { position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.7)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000 }
  const modalStyle         = { backgroundColor:"white", borderRadius:"1rem", padding:"2rem", width:"100%", maxWidth:"500px", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)" }
  const inputStyle         = { width:"100%", padding:"0.75rem", border:"2px solid #d1d5db", borderRadius:"0.375rem", fontSize:"1rem", outline:"none", marginBottom:"1rem" }
  const buttonContainerStyle={ display:"flex", gap:"1rem", justifyContent:"center", marginTop:"2rem" }
  const saveButtonStyle    = { padding:"0.75rem 2rem", backgroundColor:"#2D3573", color:"white", border:"none", borderRadius:"0.375rem", fontSize:"1rem", fontWeight:"600", cursor:"pointer" }
  const deleteButtonStyle  = { padding:"0.75rem 2rem", backgroundColor:"#6b7280", color:"white", border:"none", borderRadius:"0.375rem", fontSize:"1rem", fontWeight:"600", cursor:"pointer" }

  /* ----------------- UI ----------------- */
  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={logoContainerStyle}>
          <div style={logoCircleStyle}><img src="/Logo.png" alt="Logo" style={logoStyle} /></div>
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
            onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>GESTION DE VEHICULOS</h1>
          <div style={searchContainerStyle}>
            <div style={searchIconStyle}>🔍</div>
            <input type="text" placeholder="Ingresar marca de vehiculo" style={searchInputStyle} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div style={vehiculosGridStyle}>
          {filteredVehiculos.map(v=>(
            <div key={v.id} style={vehiculoCardStyle}>
              <div style={vehiculoInfoStyle}>
                <span style={vehiculoIconStyle}>🚗</span>
                <span style={vehiculoNameStyle}>{v.marca} {v.modelo}</span>
              </div>
              <button style={editButtonStyle} onClick={()=>handleEditVehiculo(v)}>EDITAR</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showEditModal && (
        <div style={modalOverlayStyle} onClick={()=>setShowEditModal(false)}>
          <div style={modalStyle} onClick={(e)=>e.stopPropagation()}>
            <h2 style={{textAlign:"center", marginBottom:"1rem"}}>EDITAR VEHICULO</h2>
            <form onSubmit={handleEditSubmit}>
              {["modelo","marca","año","color","placa"].map((field)=>(
                <input key={field} name={field} value={editFormData[field]} onChange={handleEditChange} placeholder={field.charAt(0).toUpperCase()+field.slice(1)} style={inputStyle} required />
              ))}
              <div style={buttonContainerStyle}>
                <button type="submit" style={saveButtonStyle}>GUARDAR</button>
                <button type="button" style={deleteButtonStyle} onClick={handleDeleteVehiculo}>Eliminar vehiculo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionVehiculos
