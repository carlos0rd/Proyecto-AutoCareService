"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
const fmt = iso =>
  iso ? new Date(iso).toLocaleDateString("es-ES", { timeZone: "UTC" }) : "";

const ServiciosCliente = () => {
  const [activeMenu, setActiveMenu] = useState("vehiculos")
  const [userData, setUserData] = useState(null)
  const [vehiculoData, setVehiculoData] = useState(null)
  const [reparacionData, setReparacionData] = useState(null)
  const navigate = useNavigate()
  const { vehiculoId, reparacionId } = useParams()
  const [servicios, setServicios] = useState([])


  useEffect(() => {
    /* 1️⃣ verificación de sesión ---------------------------------------- */
    const token = localStorage.getItem("token")
    const currentUser = localStorage.getItem("currentUser")
    if (!token || !currentUser) {
      navigate("/")
      return
    }

    setUserData(JSON.parse(currentUser))

    /* 2️⃣ pedir la reparación → nos da también el vehículo -------------- */
    fetch(`${import.meta.env.VITE_API_URL}/reparaciones/${reparacionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("No se encontró la reparación")
        return res.json()
      })
      .then(reparacion => {
        setReparacionData(reparacion)

        // construimos la info mínima del vehículo
        setVehiculoData({
          id: reparacion.vehiculo_id,
          marca: reparacion.marca,
          modelo: reparacion.modelo,
          placa: reparacion.placa,
        })

        /* 3️⃣ ya conocemos la reparación, pedimos sus servicios ---------- */
        return fetch(
          `${import.meta.env.VITE_API_URL}/api/servicios/reparacion/${reparacionId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
      })
      .then(res => {
        if (!res.ok) throw new Error("No se encontraron servicios válidos")
        return res.json()
      })
      .then(setServicios)          // guarda el array (vacío o con objetos)
      .catch(err => {
        console.error("Error al cargar servicios:", err.message)
        navigate(`/reparaciones-cliente/${vehiculoId}`)
      })
  }, [vehiculoId, reparacionId, navigate])



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
    backgroundColor: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  }

  const logoStyle = {
    width: "80px",
    height: "80px",
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
    padding: "2rem",
    backgroundColor: "#f8f9fa",
  }

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: "#2D3573",
    textDecoration: "none",
    fontSize: "1rem",
    marginBottom: "1rem",
    cursor: "pointer",
  }

  const headerStyle = {
    marginBottom: "2rem",
  }

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const subtitleStyle = {
    fontSize: "1.25rem",
    color: "#6b7280",
    margin: "0 0 0.5rem 0",
  }

  const infoRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
  }

  const sectionTitleStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#374151",
    margin: "2rem 0 1.5rem 0",
  }

  const servicioCardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    position: "relative",
  }

  const servicioTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const servicioDescriptionStyle = {
    fontSize: "1rem",
    color: "#4B5563",
    margin: "0 0 1rem 0",
  }

  const servicioDetailStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0.25rem 0",
  }

  const statusContainerStyle = {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    textAlign: "right",
  }

  const getStatusStyle = (status) => {
    let color = "#2D3573" // Default blue

    if (status.toLowerCase().includes("rechazado")) {
      color = "#DC2626" // Red for rejected
    } else if (status.toLowerCase().includes("pendiente")) {
      color = "#F59E0B" // Yellow for pending
    } else if (status.toLowerCase().includes("finalizado")) {
      color = "#10B981" // Green for completed
    } else if (status.toLowerCase().includes("curso")) {
      color = "#3B82F6" // Blue for in progress
    }

    return {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: color,
      marginBottom: "0.5rem",
    }
  }

  const valorStyle = {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#374151",
  }

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")

    // Redirigir al login
    navigate("/")
  }

  const handleMenuClick = (menu) => {
    if (menu === "perfil") {
      navigate("/dashboard-cliente")
    } else if (menu === "vehiculos") {
      navigate("/vehiculos-cliente")
    } else {
      setActiveMenu(menu)
    }
  }

  // Si no hay datos del usuario, vehículo o reparación, mostrar loading
  if (!userData || !vehiculoData || !reparacionData) {
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
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiMyRDM1NzMiLz4KPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0X2FuY2hvcj0ibWlkZGxlIj5BQzwvdGV4dD4KPC9zdmc+"
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
        {/* Back Button */}
        <div style={backButtonStyle} onClick={() => navigate(`/reparaciones-cliente/${vehiculoId}`)}>
          &lt; {vehiculoData.marca} {vehiculoData.modelo}
        </div>

        <div style={headerStyle}>
          <h1 style={titleStyle}>Reparación #{reparacionData.id}</h1>
          <p style={subtitleStyle}>
            {vehiculoData.marca} {vehiculoData.modelo}
          </p>
          <p style={subtitleStyle}>Placa: {vehiculoData.placa}</p>

          {/* 🔧 usa los nombres correctos + formateo */}
          <div style={infoRowStyle}>
            <span>Fecha de Inicio: {fmt(reparacionData.fecha_inicio)}</span>
            <span>Fecha de Finalización: {fmt(reparacionData.fecha_fin)}</span>
          </div>
        </div>

        {/* Sección de Fotos Antes y Después */}
        {(reparacionData.imagen_antes || reparacionData.imagen_despues) && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={sectionTitleStyle}>Fotos de la Reparación</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem"
            }}>
              {/* Foto Antes */}
              {reparacionData.imagen_antes && (
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                  <h3 style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.75rem",
                    textAlign: "center"
                  }}>
                    Antes de la Reparación
                  </h3>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${reparacionData.imagen_antes}`}
                    alt="Antes de la reparación"
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "0.375rem",
                      border: "2px solid #e5e7eb"
                    }}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                </div>
              )}

              {/* Foto Después */}
              {reparacionData.imagen_despues && (
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                  <h3 style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.75rem",
                    textAlign: "center"
                  }}>
                    Después de la Reparación
                  </h3>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${reparacionData.imagen_despues}`}
                    alt="Después de la reparación"
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "0.375rem",
                      border: "2px solid #e5e7eb"
                    }}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Servicios Section */}
        <h2 style={sectionTitleStyle}>Servicios</h2>

        {/* Lista de Servicios */}
        {servicios.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No hay servicios registrados para esta reparación.</p>
        ) : (
          servicios.map((servicio, index) => (
            servicio && (
              <div key={index} style={servicioCardStyle}>
                <h3 style={servicioTitleStyle}>{servicio.nombre_servicio}</h3>
                <p style={servicioDescriptionStyle}>Descripción: {servicio.descripcion}</p>
                <p style={servicioDetailStyle}>Inicio: {servicio.fecha_inicio}</p>
                <p style={servicioDetailStyle}>Fin: {servicio.fecha_fin}</p>
                <div style={statusContainerStyle}>
                  <p style={valorStyle}>Valor: ${servicio.precio}</p>
                </div>
              </div>
            )
          ))
        )}

      </div>
    </div>
  )
}

export default ServiciosCliente
