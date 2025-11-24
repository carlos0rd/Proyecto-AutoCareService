"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ok, warn, error as errorSwal, confirm } from "../../utils/alerts"

const GestionRepuestos = () => {
  const [userData, setUserData] = useState(null)
  const [repuestos, setRepuestos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRepuesto, setSelectedRepuesto] = useState(null)
  const [addFormData, setAddFormData] = useState({
    nombre: "",
    precio_unitario: "",
    categoria_id: "",
    descripcion: "",
    activo: true,
  })
  const [editFormData, setEditFormData] = useState({
    precio_unitario: "",
    activo: true,
  })
  const [filterCategoria, setFilterCategoria] = useState("")
  const [showInactivos, setShowInactivos] = useState(false)
  const [repuestosInactivos, setRepuestosInactivos] = useState([])
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("currentUser")

    if (!isAuthenticated || !currentUser) {
      navigate("/")
      return
    }

    const user = JSON.parse(currentUser)
    // Permitir acceso a mecánicos (rol_id === 2) y admins (rol_id === 3)
    if (user.rol_id !== 2 && user.rol_id !== 3) {
      navigate("/dashboard-cliente")
      return
    }
    setUserData(user)
    fetchRepuestos()
    fetchCategorias()
  }, [navigate])

  // Cargar repuestos inactivos cuando el usuario active el toggle (solo para admins)
  useEffect(() => {
    if (showInactivos && userData && userData.rol_id === 3) {
      // Solo admins pueden ver inactivos
      fetchRepuestos(true)
      fetchRepuestosInactivos()
    } else if (!showInactivos) {
      // Limpiar inactivos cuando se desactiva el toggle
      setRepuestosInactivos([])
      // Recargar solo activos
      fetchRepuestos(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInactivos])

  const token = localStorage.getItem("token")
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchRepuestos = async (includeInactivos = false) => {
    try {
      setLoading(true)
      
      // Construir URL según si se solicitan inactivos (solo para admins)
      let url = `${API_BASE_URL}/repuestos`
      if (includeInactivos && userData?.rol_id === 3) {
        // Para admins, intentar obtener todos los repuestos
        // El backend devuelve todos si es admin y no se especifica activo
        url = `${API_BASE_URL}/repuestos`
      }
      
      const { data } = await axios.get(url, {
        headers: authHeaders,
      })
      
      // Para mecánicos, el backend solo devuelve activos
      // Para admins, podemos recibir todos y separarlos
      if (includeInactivos && userData?.rol_id === 3) {
        // Separar activos e inactivos para admins
        const activos = (data || []).filter((r) => {
          const activo = r.activo
          return activo === 1 || activo === true || activo === "1" || activo === "true"
        })
        const inactivos = (data || []).filter((r) => {
          const activo = r.activo
          return activo === 0 || activo === false || activo === "0" || activo === "false"
        })
        
        setRepuestos(activos)
        setRepuestosInactivos(inactivos)
      } else {
        // Para mecánicos o cuando no se solicitan inactivos, solo mostrar activos
        setRepuestos(data || [])
      }
    } catch (err) {
      console.error("Error al obtener repuestos:", err)
      if (err.response?.status === 401) {
        navigate("/")
      } else {
        errorSwal("Error", "No se pudieron cargar los repuestos")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchRepuestosInactivos = async () => {
    // Solo admins pueden obtener repuestos inactivos
    if (userData?.rol_id !== 3) {
      return
    }

    try {
      // Para admins, intentar obtener todos los repuestos
      // El backend devuelve todos los repuestos si es admin y no se especifica activo
      const { data } = await axios.get(`${API_BASE_URL}/repuestos`, {
        headers: authHeaders,
      })
      
      // Filtrar solo los inactivos
      const inactivos = (data || []).filter((r) => {
        const activo = r.activo
        return activo === 0 || activo === false || activo === "0" || activo === "false"
      })
      
      setRepuestosInactivos(inactivos)
    } catch (err) {
      console.error("Error al obtener repuestos inactivos:", err)
      setRepuestosInactivos([])
    }
  }

  const fetchCategorias = async () => {
    try {
      // Según las rutas del backend, el endpoint es /repuestos/categorias/todas
      const { data } = await axios.get(`${API_BASE_URL}/repuestos/categorias/todas`, {
        headers: authHeaders,
      })
      setCategorias(data || [])
    } catch (err) {
      console.error("Error al obtener categorías:", err)
      // Fallback: intentar extraer categorías de los repuestos existentes
      try {
        const { data: repuestosData } = await axios.get(`${API_BASE_URL}/repuestos`, {
          headers: authHeaders,
        })
        const categoriasUnicas = {}
        repuestosData.forEach((r) => {
          if (r.categoria_id && r.categoria_nombre) {
            if (!categoriasUnicas[r.categoria_id]) {
              categoriasUnicas[r.categoria_id] = {
                id: r.categoria_id,
                nombre: r.categoria_nombre,
                cantidad_repuestos: 0,
              }
            }
            categoriasUnicas[r.categoria_id].cantidad_repuestos++
          }
        })
        setCategorias(Object.values(categoriasUnicas))
      } catch (fallbackErr) {
        console.error("Error en fallback de categorías:", fallbackErr)
        setCategorias([])
      }
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()

    if (!addFormData.nombre.trim() || !addFormData.precio_unitario || !addFormData.categoria_id) {
      return warn("Campos obligatorios", "Nombre, precio y categoría son obligatorios")
    }

    const precio = parseFloat(addFormData.precio_unitario)
    if (isNaN(precio) || precio < 0) {
      return warn("Precio inválido", "El precio debe ser un número mayor o igual a 0")
    }

    try {
      await axios.post(
        `${API_BASE_URL}/repuestos`,
        {
          nombre: addFormData.nombre.trim(),
          precio_unitario: precio,
          categoria_id: parseInt(addFormData.categoria_id),
          descripcion: addFormData.descripcion.trim() || null,
          activo: addFormData.activo ? 1 : 0,
        },
        { headers: authHeaders }
      )

      await ok("Repuesto agregado", "El repuesto se agregó correctamente")
      setShowAddModal(false)
      setAddFormData({
        nombre: "",
        precio_unitario: "",
        categoria_id: "",
        descripcion: "",
        activo: true,
      })
      // Recargar según si estamos mostrando inactivos o no
      fetchRepuestos(showInactivos)
      if (showInactivos) {
        fetchRepuestosInactivos()
      }
    } catch (err) {
      console.error("Error al agregar repuesto:", err)
      errorSwal(
        "Error",
        err.response?.data?.error || "No se pudo agregar el repuesto"
      )
    }
  }

  const handleEditClick = (repuesto) => {
    setSelectedRepuesto(repuesto)
    setEditFormData({
      precio_unitario: repuesto.precio_unitario.toString(),
      activo: repuesto.activo === 1 || repuesto.activo === true,
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!editFormData.precio_unitario) {
      return warn("Campo obligatorio", "El precio es obligatorio")
    }

    const precio = parseFloat(editFormData.precio_unitario)
    if (isNaN(precio) || precio < 0) {
      return warn("Precio inválido", "El precio debe ser un número mayor o igual a 0")
    }

    try {
      await axios.put(
        `${API_BASE_URL}/repuestos/${selectedRepuesto.id}`,
        {
          precio_unitario: precio,
          activo: editFormData.activo,
        },
        { headers: authHeaders }
      )

      await ok("Repuesto actualizado", "Los cambios se guardaron correctamente")
      setShowEditModal(false)
      setSelectedRepuesto(null)
      fetchRepuestos()
    } catch (err) {
      console.error("Error al actualizar repuesto:", err)
      errorSwal(
        "Error",
        err.response?.data?.error || "No se pudo actualizar el repuesto"
      )
    }
  }

  const handleToggleEstado = async (repuesto) => {
    const nuevoEstado = repuesto.activo === 1 || repuesto.activo === true ? false : true
    const confirmText = nuevoEstado
      ? "¿Deseas activar este repuesto?"
      : "¿Deseas desactivar este repuesto?"

    const confirmed = await confirm("Cambiar estado", confirmText)
    if (!confirmed) return

    try {
      await axios.put(
        `${API_BASE_URL}/repuestos/${repuesto.id}`,
        {
          activo: nuevoEstado,
        },
        { headers: authHeaders }
      )

      await ok("Estado actualizado", "El estado del repuesto se actualizó correctamente")
      // Recargar según si estamos mostrando inactivos o no
      fetchRepuestos(showInactivos)
      if (showInactivos) {
        fetchRepuestosInactivos()
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err)
      errorSwal(
        "Error",
        err.response?.data?.error || "No se pudo cambiar el estado del repuesto"
      )
    }
  }

  const handleDelete = async (repuesto) => {
    const confirmed = await confirm(
      "Eliminar repuesto",
      `¿Estás seguro de que deseas eliminar "${repuesto.nombre}"? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return

    try {
      await axios.delete(`${API_BASE_URL}/repuestos/${repuesto.id}`, {
        headers: authHeaders,
      })

      await ok("Repuesto eliminado", "El repuesto se eliminó correctamente")
      // Recargar según si estamos mostrando inactivos o no
      fetchRepuestos(showInactivos)
      if (showInactivos) {
        fetchRepuestosInactivos()
      }
    } catch (err) {
      console.error("Error al eliminar repuesto:", err)
      if (err.response?.status === 403) {
        errorSwal(
          "Sin permisos",
          "Solo los administradores pueden eliminar repuestos. Puedes desactivarlo cambiando su estado."
        )
      } else {
        errorSwal(
          "Error",
          err.response?.data?.error || "No se pudo eliminar el repuesto"
        )
      }
    }
  }

  // Combinar repuestos activos e inactivos según el toggle
  const allRepuestos = showInactivos 
    ? [
        ...repuestos, 
        ...repuestosInactivos.filter(r => !repuestos.find(act => act.id === r.id))
      ]
    : repuestos


  const filteredRepuestos = filterCategoria
    ? allRepuestos.filter((r) => r.categoria_id === parseInt(filterCategoria))
    : allRepuestos

  // Estilos
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  }

  const sidebarStyle = {
    width: "280px",
    backgroundColor: "#22c55e",
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

  const mecanicoLabelStyle = {
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  }

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0",
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

  const filterContainerStyle = {
    marginBottom: "2rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  }

  const selectStyle = {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    backgroundColor: "white",
    cursor: "pointer",
  }

  const tableContainerStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  }

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
    fontWeight: "600",
    color: "#374151",
    fontSize: "0.875rem",
    textTransform: "uppercase",
  }

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  }

  const statusBadgeStyle = (activo) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "500",
    backgroundColor: activo ? "#d1fae5" : "#fee2e2",
    color: activo ? "#065f46" : "#991b1b",
  })

  const actionButtonStyle = {
    padding: "0.5rem 1rem",
    marginRight: "0.5rem",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
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
    maxHeight: "90vh",
    overflowY: "auto",
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

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  }

  const checkboxContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }

  const checkboxStyle = {
    width: "1.25rem",
    height: "1.25rem",
    cursor: "pointer",
  }

  const submitButtonStyle = {
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
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("token")
    navigate("/")
  }

  if (!userData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Cargando...</div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
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
          <div style={mecanicoLabelStyle}>
            {userData?.rol_id === 3 ? "Administrador" : "Mecánico"}
          </div>
        </div>

        <div style={menuSectionStyle}>
          <div
            style={menuItemStyle}
            onClick={() => navigate(userData?.rol_id === 3 ? "/dashboard-admin" : "/dashboard-mecanico")}
            onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            ← Volver al Dashboard
          </div>
          <div
            style={activeMenuItemStyle}
            onClick={() => navigate("/gestion-repuestos")}
          >
            Gestión de Repuestos
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

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Gestión de Repuestos</h1>
          {userData?.rol_id === 3 && (
            <button
              style={buttonStyle}
              onClick={() => setShowAddModal(true)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
            >
              + Agregar Repuesto
            </button>
          )}
        </div>

        {/* Filtros */}
        <div style={filterContainerStyle}>
          <label style={{ fontWeight: "500", color: "#374151" }}>
            Filtrar por categoría:
          </label>
          <select
            style={selectStyle}
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre} ({cat.cantidad_repuestos || 0})
              </option>
            ))}
          </select>
          
          {userData?.rol_id === 3 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "1rem" }}>
              <input
                type="checkbox"
                id="showInactivos"
                checked={showInactivos}
                onChange={(e) => setShowInactivos(e.target.checked)}
                style={checkboxStyle}
              />
              <label 
                htmlFor="showInactivos" 
                style={{ fontWeight: "500", color: "#374151", cursor: "pointer" }}
              >
                Mostrar repuestos inactivos ({repuestosInactivos.length})
              </label>
            </div>
          )}
        </div>

        {/* Tabla de repuestos */}
        <div style={tableContainerStyle}>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>
          ) : filteredRepuestos.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
              No hay repuestos disponibles
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Precio Unitario</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={thStyle}>Estado</th>
                  {userData?.rol_id === 3 && <th style={thStyle}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRepuestos.map((repuesto) => (
                  <tr key={repuesto.id}>
                    <td style={tdStyle}>{repuesto.nombre}</td>
                    <td style={tdStyle}>
                      {repuesto.categoria_nombre || "Sin categoría"}
                    </td>
                    <td style={tdStyle}>
                      ${parseFloat(repuesto.precio_unitario).toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      {repuesto.descripcion || "-"}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(repuesto.activo === 1 || repuesto.activo === true)}>
                        {repuesto.activo === 1 || repuesto.activo === true
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Agregar Repuesto */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <button
              style={closeButtonStyle}
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Agregar Nuevo Repuesto</h2>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Nombre *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={addFormData.nombre}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, nombre: e.target.value })
                  }
                  required
                  placeholder="Ej: Filtro de aceite"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Categoría *</label>
                <select
                  style={inputStyle}
                  value={addFormData.categoria_id}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      categoria_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Precio Unitario *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  value={addFormData.precio_unitario}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      precio_unitario: e.target.value,
                    })
                  }
                  required
                  placeholder="0.00"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  style={textareaStyle}
                  value={addFormData.descripcion}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Descripción del repuesto (opcional)"
                />
              </div>
              <div style={formGroupStyle}>
                <div style={checkboxContainerStyle}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={addFormData.activo}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        activo: e.target.checked,
                      })
                    }
                  />
                  <label style={labelStyle}>Activo</label>
                </div>
              </div>
              <button
                type="submit"
                style={submitButtonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
              >
                Agregar Repuesto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Repuesto */}
      {showEditModal && selectedRepuesto && (
        <div style={modalOverlayStyle} onClick={() => setShowEditModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <button
              style={closeButtonStyle}
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                Editar Repuesto: {selectedRepuesto.nombre}
              </h2>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Precio Unitario *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  value={editFormData.precio_unitario}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      precio_unitario: e.target.value,
                    })
                  }
                  required
                  placeholder="0.00"
                />
              </div>
              <div style={formGroupStyle}>
                <div style={checkboxContainerStyle}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={editFormData.activo}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        activo: e.target.checked,
                      })
                    }
                  />
                  <label style={labelStyle}>Activo</label>
                </div>
              </div>
              <button
                type="submit"
                style={submitButtonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionRepuestos

