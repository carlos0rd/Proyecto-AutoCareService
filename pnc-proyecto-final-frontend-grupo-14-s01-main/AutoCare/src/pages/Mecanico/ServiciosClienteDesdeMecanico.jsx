"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"; 
import { ok, warn, error as errorSwal } from "../../utils/alerts"
import { crearFactura } from "../../api/facturas"

const ServiciosClienteDesdeMecanico = () => {
  const [activeMenu, setActiveMenu] = useState("reparaciones")
  const [userData, setUserData] = useState(null)
  const [vehiculoData, setVehiculoData] = useState(null)
  const [reparacionInfo, setReparacionInfo] = useState(null);   
  const [servicios,      setServicios]      = useState([]);     
  const [showEditModal,  setShowEditModal]  = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [editFormData, setEditFormData] = useState({
    nombre_servicio: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    costo_mano_obra: "",
  })
  const navigate = useNavigate()
  const { vehiculoId, reparacionId } = useParams()

  const [repuestosCatalogo, setRepuestosCatalogo] = useState([])
  const [addRepuestos, setAddRepuestos] = useState([
    { repuesto_id: "", cantidad: 1 },
  ])

  const [editRepuestos, setEditRepuestos] = useState([
  { repuesto_id: "", cantidad: 1 },
  ])


  // Estado para el modal de agregar servicio
  const [showAddModal, setShowAddModal]  = useState(false);
  const [addFormData,  setAddFormData]   = useState({
    nombre_servicio: "",
    descripcion:     "",
    fecha_inicio:    "",
    fecha_fin:       "",
    costo_mano_obra: "",
  });

  // Estado para generación de factura
  const [generandoFactura, setGenerandoFactura] = useState(false);
  const [facturaId, setFacturaId] = useState(null);

  useEffect(() => {
    // Verificar autenticación y rol del usuario
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const currentUser     = localStorage.getItem("currentUser");

    if (!isAuthenticated || !currentUser) {
      navigate("/");
      return;
    }

    const user = JSON.parse(currentUser);
    if (user.rol_id !== 2) {
      navigate(user.rol_id === 3 ? "/dashboard-admin" : "/dashboard-cliente");
      return;
    }
    setUserData(user);

    (async () => {
      try {
        const token = localStorage.getItem("token");

        const repRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/reparaciones/${reparacionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReparacionInfo(repRes.data);         

        const servRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/servicios/reparacion/${reparacionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServicios(Array.isArray(servRes.data) ? servRes.data : []);
        
        const vehRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/vehiculos/${vehiculoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVehiculoData(vehRes.data);

        //Obtener lista de repuestos
        const repuestosRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/repuestos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRepuestosCatalogo(repuestosRes.data);

      } catch (err) {
        console.error(err);
        navigate(`/reparaciones-mecanico/${vehiculoId}`);
      }
    })();
  }, [vehiculoId, reparacionId, navigate]);

  // Estilos inline
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

  const editButtonStyle = {
    backgroundColor: "transparent",
    color: "#2D3573",
    border: "1px solid #2D3573",
    borderRadius: "0.375rem",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "0.5rem",
    transition: "all 0.3s ease",
  }

  const getStatusStyle = (status) => {
    let color = "#2D3573"

    if (status.toLowerCase().includes("rechazado")) {
      color = "#DC2626"
    } else if (status.toLowerCase().includes("pendiente")) {
      color = "#F59E0B"
    } else if (status.toLowerCase().includes("finalizado")) {
      color = "#10B981"
    } else if (status.toLowerCase().includes("curso")) {
      color = "#3B82F6"
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

  // Estilos para el modal
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "2rem",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    position: "relative",
  }

  const modalHeaderStyle = {
    textAlign: "center",
    marginBottom: "2rem",
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

  const formGroupStyle = {
    marginBottom: "1rem",
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  }

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  }

  const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "2rem",
  }

  const saveButtonStyle = {
    padding: "0.75rem 2rem",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }

  const cancelButtonStyle = {
    padding: "0.75rem 2rem",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }

  // Estilos para la sección de repuestos en el modal
  const repuestosSectionTitleStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#374151",
    margin: "1rem 0 0.5rem 0",
  }

  const repuestoRowStyle = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  }

  const repuestoCantidadInputStyle = {
    width: "80px",
    padding: "0.5rem",
    border: "2px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.9rem",
  }

  const addRepuestoButtonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "0.5rem",
  }

  const removeRepuestoButtonStyle = {
    padding: "0.4rem 0.6rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    cursor: "pointer",
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")
    navigate("/")
  }

  const handleMenuClick = (menu) => {
    if (menu === "perfil") {
      navigate("/dashboard-mecanico")
    } else {
      setActiveMenu(menu)
    }
  }

  /*const handleEditServicio = (servicio, index) => {
    setSelectedServicio({ ...servicio, index })
    setEditFormData({
      nombre_servicio:  servicio.nombre_servicio,
      descripcion:      servicio.descripcion ?? "",
      fecha_inicio:     servicio.fecha_inicio?.slice(0,10) ?? "",
      fecha_fin:        servicio.fecha_fin?.slice(0,10)    ?? "",
      costo_mano_obra:  servicio.costo_mano_obra ?? "",
    })
    setShowEditModal(true)
  }*/

    const handleEditServicio = async (servicio, index) => {
      try {
        const token = localStorage.getItem("token");
    
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/servicios/${servicio.id}/completo`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        setSelectedServicio({ ...servicio, index });
    
        setEditFormData({
          nombre_servicio: data.nombre_servicio,
          descripcion:     data.descripcion ?? "",
          fecha_inicio:    data.fecha_inicio ? data.fecha_inicio.slice(0, 10) : "",
          fecha_fin:       data.fecha_fin ? data.fecha_fin.slice(0, 10) : "",
          costo_mano_obra: data.mano_obra ?? data.costo_mano_obra ?? "",
        });
    
        if (Array.isArray(data.repuestos) && data.repuestos.length > 0) {
          setEditRepuestos(
            data.repuestos.map((r) => ({
              repuesto_id: r.repuesto_id ?? r.id,
              cantidad:    r.cantidad,
            }))
          );
        } else {
          setEditRepuestos([{ repuesto_id: "", cantidad: 1 }]);
        }
    
        setShowEditModal(true);
      } catch (err) {
        console.error(err);
        errorSwal("Error", "No se pudo cargar la información completa del servicio");
      }
    };
    


  const handleEditChange = ({target}) => {
    setEditFormData({ ...editFormData, [target.name]: target.value });
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    if (!editFormData.nombre_servicio.trim() || !editFormData.descripcion.trim()) {
      return warn("Campos obligatorios", "Nombre y descripción no pueden quedar vacíos");
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/servicios/${selectedServicio.id}`,
        {
          nombre_servicio: editFormData.nombre_servicio,
          descripcion:     editFormData.descripcion,
          fecha_inicio:    editFormData.fecha_inicio || null,
          fecha_fin:       editFormData.fecha_fin || null,
          costo_mano_obra: parseFloat(editFormData.costo_mano_obra) || 0,   
          repuestos: editRepuestos
            .filter(r => r.repuesto_id && r.repuesto_id !== ""),           
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const nuevoPrecio = response.data?.precio_total;
  
      // actualizar la lista en memoria
      setServicios((prev) =>
        prev.map((s) =>
          s.id === selectedServicio.id
            ? {
                ...s,
                ...editFormData,
                precio: nuevoPrecio != null ? nuevoPrecio : s.precio,
                costo_mano_obra: parseFloat(editFormData.costo_mano_obra) || 0,
              }
            : s
        )
      );
  
      setShowEditModal(false);
      await ok("Servicio actualizado", "Los cambios se guardaron correctamente");
    } catch (err) {
      console.error(err);
      errorSwal(
        "Error al actualizar",
        err.response?.data?.message || "Intenta más tarde"
      );
    }
  };
  

  const handleAddChange = ({ target }) =>
    setAddFormData({ ...addFormData, [target.name]: target.value });


  const handleAddRepuestoRow = () => {
    setAddRepuestos((prev) => [...prev, { repuesto_id: "", cantidad: 1 }]);
  };

  const handleRemoveRepuestoRow = (index) => {
    setAddRepuestos((prev) => prev.filter((_, i) => i !== index));
  };

  // Repuestos modal edita
  const handleAddEditRepuestoRow = () => {
    setEditRepuestos((prev) => [...prev, { repuesto_id: "", cantidad: 1 }])
  }

  const handleRemoveEditRepuestoRow = (index) => {
    setEditRepuestos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChangeEditRepuestoRow = (index, field, value) => {
    setEditRepuestos((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    )
  }


  const handleChangeRepuestoRow = (index, field, value) => {
    setAddRepuestos((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
  
    if (!addFormData.nombre_servicio.trim() || !addFormData.descripcion.trim()) {
      return warn(
        "Campos obligatorios",
        "Nombre y descripción no pueden quedar vacíos"
      );
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/servicios`,
        {
          ...addFormData,
          costo_mano_obra: parseFloat(addFormData.costo_mano_obra) || 0,
          reparacion_id: reparacionId,
          repuestos: addRepuestos.filter(r => r.repuesto_id && r.repuesto_id !== ""),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const nuevoServicio = {
        ...addFormData,
        id: response.data.servicio_id,
        precio: response.data.precio_total,
      };
  
      setServicios((prev) => [...prev, nuevoServicio]);
  
      setShowAddModal(false);
      setAddFormData({
        nombre_servicio: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        costo_mano_obra: "",
      });
      setAddRepuestos([{ repuesto_id: "", cantidad: 1 }]);
  
      await ok("Servicio agregado", "Se registró correctamente");
    } catch (err) {
      console.error(err);
      errorSwal(
        "Error al agregar",
        err.response?.data?.message || "Intenta más tarde"
      );
    }
  };
  


  // Handler para generar factura
  const handleGenerarFactura = async () => {
    if (!reparacionInfo || reparacionInfo.status !== 'Finalizado') {
      return warn("Estado inválido", "Solo se pueden generar facturas para reparaciones finalizadas");
    }

    try {
      setGenerandoFactura(true);
      const response = await crearFactura(reparacionId);
      
      // Response can be either new invoice or existing invoice
      const factura = response.factura;
      setFacturaId(factura.id);

      if (response.message.includes('Ya existe')) {
        await ok("Factura existente", `La factura ${factura.numero_factura} ya existe para esta reparación`);
      } else {
        await ok("Factura generada", `Factura ${factura.numero_factura} creada exitosamente`);
      }
    } catch (err) {
      console.error("Error generando factura:", err);
      
      // Handle specific error messages
      const errorMessage = err.message || "Error al generar factura";
      if (errorMessage.includes('Finalizado')) {
        errorSwal("Estado inválido", "La reparación debe estar finalizada para generar la factura");
      } else if (errorMessage.includes('permiso')) {
        errorSwal("Sin permisos", "No tienes permiso para generar esta factura");
      } else {
        errorSwal("Error", errorMessage);
      }
    } finally {
      setGenerandoFactura(false);
    }
  };

  if (!userData || !vehiculoData || !reparacionInfo) {
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
          <div style={mecanicoLabelStyle}>Mecanico</div>
        </div>

        {/* Menu */}
        <div style={menuSectionStyle}>
          <div
            style={activeMenu === "reparaciones" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("reparaciones")}
          >
            Reparaciones
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
            Cerrar sesion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Back Button */}
        <div style={backButtonStyle} onClick={() => navigate(`/reparaciones-mecanico/${vehiculoId}`)}>
          &lt; {vehiculoData.marca} {vehiculoData.modelo}
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <h1 style={titleStyle}>Reparación #{reparacionInfo.id}</h1>
              <p style={subtitleStyle}>
                {vehiculoData.marca} {vehiculoData.modelo}
              </p>
              <p style={subtitleStyle}>Placa: {vehiculoData.placa}</p>
            </div>
            
            {/* Generate Invoice Button - Only show when status is Finalizado */}
            {reparacionInfo.status === 'Finalizado' && (
              <button
                onClick={handleGenerarFactura}
                disabled={generandoFactura}
                style={{
                  backgroundColor: generandoFactura ? "#9ca3af" : "#2D3573",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: generandoFactura ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onMouseOver={(e) => {
                  if (!generandoFactura) {
                    e.target.style.backgroundColor = "#1e2550";
                  }
                }}
                onMouseOut={(e) => {
                  if (!generandoFactura) {
                    e.target.style.backgroundColor = "#2D3573";
                  }
                }}
              >
                {generandoFactura ? "Generando..." : "Generar Factura"}
              </button>
            )}
          </div>

          <div style={infoRowStyle}>
            <span>Fecha de Inicio: {reparacionInfo.fecha_inicio}</span>
            <span>Fecha de Finalización: {reparacionInfo.fecha_fin}</span>
            <span>Estado: {reparacionInfo.status}</span>
          </div>

          {/* Show invoice link if invoice was generated */}
          {facturaId && (
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "#d1fae5",
              borderRadius: "0.375rem",
              border: "1px solid #10b981"
            }}>
              <p style={{ margin: 0, color: "#065f46", fontWeight: "500" }}>
                ✓ Factura generada. 
                <button
                  onClick={() => navigate(`/facturas-cliente`)}
                  style={{
                    marginLeft: "0.5rem",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#059669",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Ver facturas
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Sección de Fotos Antes y Después */}
        {(reparacionInfo.imagen_antes || reparacionInfo.imagen_despues) && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={sectionTitleStyle}>Fotos de la Reparación</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem"
            }}>
              {/* Foto Antes */}
              {reparacionInfo.imagen_antes && (
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
                    src={`${import.meta.env.VITE_API_URL}${reparacionInfo.imagen_antes}`}
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
              {reparacionInfo.imagen_despues && (
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
                    src={`${import.meta.env.VITE_API_URL}${reparacionInfo.imagen_despues}`}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",           
            marginBottom: "1rem"
          }}
        >
          <h2 style={sectionTitleStyle}>Servicios</h2>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              padding: "0.6rem 1.2rem",
              borderRadius: "0.375rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
            onMouseOver={e => (e.target.style.backgroundColor = "#16a34a")}
            onMouseOut={e => (e.target.style.backgroundColor = "#22c55e")}
          >
            Agregar Servicio
          </button>
        </div>
        {/* Lista de Servicios */}
        
        {servicios.length === 0 && (
             <p style={{ color: "#6b7280", fontSize: "1rem" }}>Esta reparación no tiene servicios asociados.</p>

        )}

        {servicios.map((servicio, index) => (
          <div key={index} style={servicioCardStyle}>
            <h3 style={servicioTitleStyle}>{servicio.nombre_servicio}</h3>
            <p style={servicioDescriptionStyle}>Descripción: {servicio.descripcion}</p>
            <p style={servicioDetailStyle}>Fecha de Inicio: {servicio.fecha_inicio}</p>
            <p style={servicioDetailStyle}>Fecha de Finalización: {servicio.fecha_fin}</p>

            <div style={statusContainerStyle}>
              <button
                style={editButtonStyle}
                onClick={() => handleEditServicio(servicio, index)}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#2D3573"
                  e.target.style.color = "white"
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent"
                  e.target.style.color = "#2D3573"
                }}
              >
                Editar
              </button>
   
              <p style={valorStyle}>Valor: ${servicio.precio}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición de Servicio */}
      {showEditModal && (
        <div style={modalOverlayStyle} onClick={() => setShowEditModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Editar Servicio</h2>
              <p style={modalSubtitleStyle}>Modificar los detalles del servicio</p>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={formGroupStyle}>
                <input
                  type="text"
                  name="nombre_servicio"
                  value={editFormData.nombre_servicio}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Nombre del servicio"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <textarea
                  name="descripcion"
                  value={editFormData.descripcion}
                  onChange={handleEditChange}
                  style={textareaStyle}
                  placeholder="Descripción del servicio"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={editFormData.fecha_inicio ?? ""}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Fecha de inicio (DD/MM/YYYY)"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <input
                  type="date"
                  name="fecha_fin"
                  value={editFormData.fecha_fin ?? ""}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Fecha de finalización (DD/MM/YYYY o ----)"
                />
              </div>

              <div style={formGroupStyle}>
                <input
                  type="number"
                  step="0.01"
                  name="costo_mano_obra"
                  value={editFormData.costo_mano_obra.toString()}
                  onChange={handleEditChange}
                  style={inputStyle}
                  placeholder="Costo de Mano de Obra ($ 0.00)"
                  min="0"
                  required
                />
              </div>

              {/* -------- Repuestos del servicio -------- */}
          <div style={{ marginTop: "1rem" }}>
            <div style={repuestosSectionTitleStyle}>Repuestos del servicio</div>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Modifique los repuestos y cantidades usados en este servicio.
            </p>

            {editRepuestos.map((row, index) => (
              <div key={index} style={repuestoRowStyle}>
                <select
                  style={selectStyle}
                  value={row.repuesto_id}
                  onChange={(e) =>
                    handleChangeEditRepuestoRow(index, "repuesto_id", e.target.value)
                  }
                >
                  <option value="">-- Seleccione un repuesto --</option>
                  {repuestosCatalogo.map((r) => {
                    const precioNumber = Number(r.precio_unitario)
                    const precioFormateado = !isNaN(precioNumber)
                      ? precioNumber.toFixed(2)
                      : r.precio_unitario

                    return (
                      <option key={r.id} value={r.id}>
                        {r.nombre} {precioFormateado ? `($${precioFormateado})` : ""}
                      </option>
                    )
                  })}
                </select>

                <input
                  type="number"
                  min="1"
                  value={row.cantidad}
                  onChange={(e) =>
                    handleChangeEditRepuestoRow(index, "cantidad", e.target.value)
                  }
                  style={repuestoCantidadInputStyle}
                />

                {editRepuestos.length > 1 && (
                  <button
                    type="button"
                    style={removeRepuestoButtonStyle}
                    onClick={() => handleRemoveEditRepuestoRow(index)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              style={addRepuestoButtonStyle}
              onClick={handleAddEditRepuestoRow}
            >
              + Agregar otro repuesto
            </button>
          </div>

              <div style={buttonContainerStyle}>
                <button
                  type="submit"
                  style={saveButtonStyle}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#16a34a")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#22c55e")}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  style={cancelButtonStyle}
                  onClick={() => setShowEditModal(false)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#4b5563")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal agregar servicio */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Nuevo Servicio</h2>
              <p style={modalSubtitleStyle}>Complete los datos del servicio</p>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div style={formGroupStyle}>
                <input
                  type="text"
                  name="nombre_servicio"
                  value={addFormData.nombre_servicio}
                  onChange={handleAddChange}
                  style={inputStyle}
                  placeholder="Nombre del servicio"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <textarea
                  name="descripcion"
                  value={addFormData.descripcion}
                  onChange={handleAddChange}
                  style={textareaStyle}
                  placeholder="Descripción del servicio"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={addFormData.fecha_inicio}
                  onChange={handleAddChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <input
                  type="date"
                  name="fecha_fin"
                  value={addFormData.fecha_fin}
                  onChange={handleAddChange}
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <input
                  type="number"
                  step="0.01"
                  name="costo_mano_obra"
                  value={addFormData.costo_mano_obra}
                  onChange={handleAddChange}
                  style={inputStyle}
                  placeholder="Costo de Mano de Obra ($ 0.00)"
                  min="0"
                  required
                />
              </div>

              {/* -------- NUEVA SECCIÓN: Repuestos del servicio -------- */}
              <div style={{ marginTop: "1rem" }}>
                <div style={repuestosSectionTitleStyle}>Repuestos del servicio</div>
                <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  Seleccione los repuestos que se utilizarán en este servicio y su cantidad.
                </p>

                {addRepuestos.map((row, index) => (
                  <div key={index} style={repuestoRowStyle}>
                    <select
                      style={selectStyle}
                      value={row.repuesto_id}
                      onChange={(e) =>
                        handleChangeRepuestoRow(index, "repuesto_id", e.target.value)
                      }
                    >
                      <option value="">-- Seleccione un repuesto --</option>
                      {repuestosCatalogo.map((r) => {
                        const precioNumber = Number(r.precio_unitario);
                        const precioFormateado = !isNaN(precioNumber)
                          ? precioNumber.toFixed(2)
                          : r.precio_unitario; // en caso de que sea nulo

                        return (
                          <option key={r.id} value={r.id}>
                            {r.nombre} {precioFormateado ? `($${precioFormateado})` : ""}
                          </option>
                        );
                      })}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={row.cantidad}
                      onChange={(e) =>
                        handleChangeRepuestoRow(index, "cantidad", e.target.value)
                      }
                      style={repuestoCantidadInputStyle}
                    />

                    {addRepuestos.length > 1 && (
                      <button
                        type="button"
                        style={removeRepuestoButtonStyle}
                        onClick={() => handleRemoveRepuestoRow(index)}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  style={addRepuestoButtonStyle}
                  onClick={handleAddRepuestoRow}
                >
                  + Agregar otro repuesto
                </button>
              </div>
              {/* ------------------------------------------------------- */}

              <div style={buttonContainerStyle}>
                <button
                  type="submit"
                  style={saveButtonStyle}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#16a34a")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#22c55e")}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  style={cancelButtonStyle}
                  onClick={() => {
                    setShowAddModal(false)
                    setAddRepuestos([{ repuesto_id: "", cantidad: 1 }])
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#4b5563")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiciosClienteDesdeMecanico
