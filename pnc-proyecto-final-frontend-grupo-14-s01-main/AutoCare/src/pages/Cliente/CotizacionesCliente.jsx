"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import { ok, error as errorSwal } from "../../utils/alerts"

const CotizacionesCliente = () => {
  const [activeMenu, setActiveMenu] = useState("cotizaciones")
  const [userData, setUserData] = useState(null)
  const [cotizaciones, setCotizaciones] = useState([])
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
    cargarCotizaciones()
  }, [navigate])

  const cargarCotizaciones = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      // Obtener todas las reparaciones del cliente
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reparaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Error al obtener reparaciones")

      const reparaciones = await response.json()

      // Filtrar solo las que NO están finalizadas
      const reparacionesActivas = reparaciones.filter(
        (rep) => rep.status && rep.status.toLowerCase() !== "finalizado"
      )

      // Para cada reparación, obtener sus servicios completos
      const cotizacionesCompletas = await Promise.all(
        reparacionesActivas.map(async (reparacion) => {
          try {
            // Obtener servicios de la reparación
            const serviciosRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/servicios/reparacion/${reparacion.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )

            if (!serviciosRes.ok) return { ...reparacion, servicios: [] }

            const servicios = await serviciosRes.json()

            // Obtener detalles completos de cada servicio (con repuestos)
            const serviciosCompletos = await Promise.all(
              servicios.map(async (servicio) => {
                try {
                  const servicioCompletoRes = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/servicios/${servicio.id}/completo`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  )

                  // Si no tiene acceso (403) o error, usar servicio básico (sin detalle de repuestos)
                  if (!servicioCompletoRes.ok) {
                    // Retornar servicio básico con estructura compatible
                    return {
                      ...servicio,
                      repuestos: [],
                      mano_obra: null,
                      total_repuestos: 0,
                    }
                  }

                  return await servicioCompletoRes.json()
                } catch (err) {
                  // En caso de error, usar servicio básico
                  console.error(`Error obteniendo servicio ${servicio.id}:`, err)
                  return {
                    ...servicio,
                    repuestos: [],
                    mano_obra: null,
                    total_repuestos: 0,
                  }
                }
              })
            )

            return {
              ...reparacion,
              servicios: serviciosCompletos,
            }
          } catch (err) {
            console.error(`Error obteniendo servicios de reparación ${reparacion.id}:`, err)
            return { ...reparacion, servicios: [] }
          }
        })
      )

      setCotizaciones(cotizacionesCompletas)
    } catch (err) {
      console.error("Error loading quotes:", err)
      errorSwal("Error", err.message || "No se pudieron cargar las cotizaciones")
    } finally {
      setLoading(false)
    }
  }

  const generarPDF = async (cotizacion) => {
    try {
      setDownloadingId(cotizacion.id)
      
      const token = localStorage.getItem("token")
      
      // Otener los detalles completos de los servicios con repuestos
      const serviciosConRepuestos = await Promise.all(
        (cotizacion.servicios || []).map(async (servicio) => {
          // Si ya tiene repuestos, usarlo directamente
          if (servicio.repuestos && servicio.repuestos.length > 0) {
            return servicio
          }
          
          // Intentar obtener el servicio completo
          try {
            const servicioCompletoRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/servicios/${servicio.id}/completo`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (servicioCompletoRes.ok) {
              return await servicioCompletoRes.json()
            }
          } catch (err) {
            console.error(`Error obteniendo servicio completo ${servicio.id}:`, err)
          }
          
          // Si no se pudo obtener, retornar el servicio básico
          return servicio
        })
      )
      
      // Actualizar la cotización con los servicios que tienen repuestos
      const cotizacionActualizada = {
        ...cotizacion,
        servicios: serviciosConRepuestos,
      }
      
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let yPos = margin

      // Función auxiliar para agregar nueva página si es necesario
      const checkNewPage = (requiredSpace = 20) => {
        if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage()
          yPos = margin
        }
      }

      // Encabezado
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("COTIZACIÓN", pageWidth / 2, yPos, { align: "center" })
      yPos += 10

      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(`Número de Cotización: #${cotizacionActualizada.id}`, margin, yPos)
      yPos += 7

      const fecha = new Date(cotizacionActualizada.fecha_inicio).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      doc.text(`Fecha: ${fecha}`, margin, yPos)
      yPos += 7

      doc.text(`Estado: ${cotizacionActualizada.status}`, margin, yPos)
      yPos += 10

      // Información del vehículo
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Información del Vehículo", margin, yPos)
      yPos += 8

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text(`Vehículo: ${cotizacionActualizada.modelo || "N/A"}`, margin, yPos)
      yPos += 6
      doc.text(`Placa: ${cotizacionActualizada.placa || "N/A"}`, margin, yPos)
      yPos += 6
      doc.text(`Cliente: ${cotizacionActualizada.cliente || "N/A"}`, margin, yPos)
      yPos += 10

      // Descripción de la reparación
      if (cotizacionActualizada.descripcion) {
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Descripción de la Reparación", margin, yPos)
        yPos += 8

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        const descLines = doc.splitTextToSize(cotizacionActualizada.descripcion, pageWidth - 2 * margin)
        descLines.forEach((line) => {
          checkNewPage(6)
          doc.text(line, margin, yPos)
          yPos += 6
        })
        yPos += 5
      }

      // Servicios
      if (cotizacionActualizada.servicios && cotizacionActualizada.servicios.length > 0) {
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Servicios y Repuestos", margin, yPos)
        yPos += 10

        let totalGeneral = 0

        cotizacionActualizada.servicios.forEach((servicio, index) => {
          checkNewPage(30)

          // Nombre del servicio
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text(`${index + 1}. ${servicio.nombre_servicio}`, margin, yPos)
          yPos += 7

          // Descripción del servicio
          if (servicio.descripcion) {
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            const servDescLines = doc.splitTextToSize(servicio.descripcion, pageWidth - 2 * margin)
            servDescLines.forEach((line) => {
              checkNewPage(6)
              doc.text(line, margin, yPos)
              yPos += 5
            })
            yPos += 3
          }

          // Calcular mano de obra y repuestos
          const precioServicio = Number(servicio.precio || 0)
          const totalRepuestos = Number(servicio.total_repuestos || 0)
          const manoObra = Number(servicio.mano_obra || servicio.costo_mano_obra || (precioServicio - totalRepuestos))
          
          // Repuestos
          if (servicio.repuestos && servicio.repuestos.length > 0) {
            // Mostrar repuestos detallados
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text("Repuestos:", margin + 10, yPos)
            yPos += 6

            servicio.repuestos.forEach((repuesto) => {
              checkNewPage(6)
              const cantidad = Number(repuesto.cantidad || 1)
              const precioUnitario = Number(repuesto.precio_unitario || 0)
              const subtotal = cantidad * precioUnitario

              doc.setFont("helvetica", "normal")
              const nombreRepuesto = repuesto.nombre || "Repuesto sin nombre"
              doc.text(
                `  • ${nombreRepuesto}`,
                margin + 15,
                yPos
              )
              yPos += 5
              
              checkNewPage(5)
              doc.text(
                `    Cantidad: ${cantidad} x $${precioUnitario.toFixed(2)} = $${subtotal.toFixed(2)}`,
                margin + 20,
                yPos
              )
              yPos += 5
            })
            
            // Mostrar mano de obra si existe
            if (manoObra > 0) {
              checkNewPage(6)
              doc.setFontSize(10)
              doc.setFont("helvetica", "normal")
              doc.text(`Mano de obra: $${manoObra.toFixed(2)}`, margin + 10, yPos)
              yPos += 6
            }
          } else {
            // Si no hay repuestos detallados, mostrar solo el precio total
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            doc.text(`Precio del servicio: $${precioServicio.toFixed(2)}`, margin + 10, yPos)
            yPos += 6
            
            if (manoObra > 0 && manoObra !== precioServicio) {
              doc.text(`(Incluye mano de obra: $${manoObra.toFixed(2)})`, margin + 15, yPos)
              yPos += 5
            }
          }

          // Subtotal del servicio (precioServicio ya está declarado arriba)
          totalGeneral += precioServicio

          checkNewPage(8)
          doc.setFontSize(10)
          doc.setFont("helvetica", "bold")
          doc.text(
            `Subtotal del servicio: $${precioServicio.toFixed(2)}`,
            margin + 10,
            yPos
          )
          yPos += 10
        })

        // Total general
        checkNewPage(15)
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(
          `TOTAL: $${totalGeneral.toFixed(2)}`,
          pageWidth - margin,
          yPos,
          { align: "right" }
        )
      } else {
        doc.setFontSize(11)
        doc.text("No hay servicios registrados para esta reparación.", margin, yPos)
      }

      // Pie de página
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        )
      }

      // Descargar PDF
      doc.save(`cotizacion-${cotizacion.id}.pdf`)
      
      setDownloadingId(null)
      ok("PDF generado", "La cotización se ha descargado correctamente")
    } catch (err) {
      console.error("Error generating PDF:", err)
      errorSwal("Error", err.message || "No se pudo generar el PDF")
      setDownloadingId(null)
    }
  }

  const handleMenuClick = (menu) => {
    if (menu === "perfil") {
      navigate("/dashboard-cliente")
    } else if (menu === "vehiculos") {
      navigate("/vehiculos-cliente")
    } else if (menu === "facturas") {
      navigate("/facturas-cliente")
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
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const tableStyle = {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  }

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#2D3573",
    color: "white",
    fontWeight: "600",
    fontSize: "0.875rem",
  }

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "0.875rem",
  }

  const statusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase() || ""
    let backgroundColor = "#e5e7eb"
    let color = "#374151"

    if (statusLower.includes("pendiente")) {
      backgroundColor = "#fef3c7"
      color = "#92400e"
    } else if (statusLower.includes("aprobada") || statusLower.includes("aprobado")) {
      backgroundColor = "#d1fae5"
      color = "#065f46"
    } else if (statusLower.includes("rechazada") || statusLower.includes("rechazado")) {
      backgroundColor = "#fee2e2"
      color = "#991b1b"
    }

    return {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor,
      color,
      display: "inline-block",
    }
  }

  const downloadButtonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#2D3573",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
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

        <div style={menuSectionStyle}>
          <div style={menuTitleStyle}>Cliente</div>

          <div
            style={activeMenu === "cotizaciones" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("cotizaciones")}
          >
            Cotizaciones
          </div>

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
          <h1 style={titleStyle}>Gestión de Cotizaciones</h1>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            Cargando cotizaciones...
          </div>
        ) : cotizaciones.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280", fontSize: "1.2rem" }}>
            No hay cotizaciones activas disponibles.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Número</th>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Vehículo</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((cotizacion) => (
                <tr key={cotizacion.id}>
                  <td style={tdStyle}>#{cotizacion.id}</td>
                  <td style={tdStyle}>
                    {new Date(cotizacion.fecha_inicio).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td style={tdStyle}>{cotizacion.modelo || "N/A"}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(cotizacion.status)}>
                      {cotizacion.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    ${(cotizacion.precio || 0).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={downloadButtonStyle}
                      onClick={() => generarPDF(cotizacion)}
                      disabled={downloadingId === cotizacion.id}
                      onMouseOver={(e) => {
                        if (downloadingId !== cotizacion.id) {
                          e.target.style.backgroundColor = "#1e2550"
                        }
                      }}
                      onMouseOut={(e) => {
                        if (downloadingId !== cotizacion.id) {
                          e.target.style.backgroundColor = "#2D3573"
                        }
                      }}
                    >
                      {downloadingId === cotizacion.id ? "Generando..." : "Descargar PDF"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default CotizacionesCliente

