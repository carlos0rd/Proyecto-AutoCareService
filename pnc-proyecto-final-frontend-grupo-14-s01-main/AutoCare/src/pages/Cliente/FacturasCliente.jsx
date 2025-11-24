"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { obtenerFacturas, descargarFacturaPDF } from "../../api/facturas"
import { ok, error as errorSwal } from "../../utils/alerts"

const FacturasCliente = () => {
  const [activeMenu, setActiveMenu] = useState("facturas")
  const [userData, setUserData] = useState(null)
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const currentUser = localStorage.getItem("currentUser")

    if (!token || !currentUser) {
      navigate("/")
      return
    }

    setUserData(JSON.parse(currentUser))
    cargarFacturas()
  }, [navigate])

  const cargarFacturas = async () => {
    try {
      setLoading(true)
      const data = await obtenerFacturas()
      setFacturas(data)
    } catch (err) {
      console.error("Error loading invoices:", err)
      errorSwal("Error", err.message || "No se pudieron cargar las facturas")
    } finally {
      setLoading(false)
    }
  }

  const handleDescargarPDF = async (facturaId, numeroFactura) => {
    try {
      setDownloadingId(facturaId)
      const blob = await descargarFacturaPDF(facturaId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `factura-${numeroFactura}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      await ok("Descarga exitosa", "La factura se ha descargado correctamente")
    } catch (err) {
      console.error("Error downloading PDF:", err)
      errorSwal("Error", err.message || "No se pudo descargar la factura")
    } finally {
      setDownloadingId(null)
    }
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

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("token")
    navigate("/")
  }

  // Estilos inline
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

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const subtitleStyle = {
    fontSize: "1.5rem",
    color: "#374151",
    margin: "0 0 2rem 0",
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

  const theadStyle = {
    backgroundColor: "#2D3573",
    color: "white",
  }

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    fontSize: "0.875rem",
    fontWeight: "600",
    textTransform: "uppercase",
  }

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "0.875rem",
    color: "#374151",
  }

  const statusBadgeStyle = (status) => {
    const isPaid = status === "Pagado"
    return {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: isPaid ? "#10b981" : "#f59e0b",
      color: "white",
    }
  }

  const downloadButtonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#2D3573",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }

  const emptyStateStyle = {
    padding: "4rem 2rem",
    textAlign: "center",
    color: "#6b7280",
  }

  const emptyStateTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  }

  const loadingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4rem",
    fontSize: "1.125rem",
    color: "#6b7280",
  }

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
          <h1 style={titleStyle}>Facturas</h1>
          <h2 style={subtitleStyle}>Historial de facturas de servicios</h2>
        </div>

        {/* Table Container */}
        <div style={tableContainerStyle}>
          {loading ? (
            <div style={loadingStyle}>Cargando facturas...</div>
          ) : facturas.length === 0 ? (
            <div style={emptyStateStyle}>
              <h3 style={emptyStateTitleStyle}>No hay facturas disponibles</h3>
              <p>No se han generado facturas para tus vehículos aún.</p>
            </div>
          ) : (
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  <th style={thStyle}>Número de Factura</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Vehículo</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td style={tdStyle}>{factura.numero_factura}</td>
                    <td style={tdStyle}>
                      {new Date(factura.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td style={tdStyle}>{factura.vehiculo}</td>
                    <td style={tdStyle}>
                      ${factura.total.toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(factura.status)}>
                        {factura.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={downloadButtonStyle}
                        onClick={() => handleDescargarPDF(factura.id, factura.numero_factura)}
                        disabled={downloadingId === factura.id}
                        onMouseOver={(e) => {
                          if (downloadingId !== factura.id) {
                            e.target.style.backgroundColor = "#1e2550"
                          }
                        }}
                        onMouseOut={(e) => {
                          if (downloadingId !== factura.id) {
                            e.target.style.backgroundColor = "#2D3573"
                          }
                        }}
                      >
                        {downloadingId === factura.id ? "Descargando..." : "Descargar PDF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default FacturasCliente

