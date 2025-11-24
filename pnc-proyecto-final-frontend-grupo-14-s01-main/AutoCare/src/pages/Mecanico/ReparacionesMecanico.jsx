"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios" 
import { ok, warn, error as errorSwal } from "../../utils/alerts"

const ReparacionesMecanico = () => {
  const [activeMenu, setActiveMenu] = useState("reparaciones")
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  const [vehiculoData, setVehiculoData] = useState(null);
  const [reparaciones, setReparaciones] = useState([]); 

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    tipo_reparacion: "",
    descripcion:     "",
    fecha_inicio:    "",
    fecha_fin:       "",
    status:         "En curso", // Valor por defecto
    comentarios_internos: "",
    fecha_proximo_mantenimiento: "",
  });
  const [file, setFile] = useState(null); // Foto "antes" al crear

  // Estado para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRep, setCurrentRep] = useState(null);
  const [fileAfter, setFileAfter] = useState(null); // Foto "después" al editar
  const [editFormData, setEditFormData] = useState({
    tipo_reparacion: "",
    descripcion:     "",
    fecha_inicio:    "",
    fecha_fin:       "",
    status:          "",
    comentarios_internos: "",
    fecha_proximo_mantenimiento: "",
    // precio removed - it's calculated from services
  });
  


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
    if (user.rol_id !== 2) {
      if (user.rol_id === 3) {
        navigate("/dashboard-admin")
      } else {
        navigate("/dashboard-cliente")
      }
      return
    }

   (async () => {                     // 👈 NUEVO  IIFE async
    try {
      const token = localStorage.getItem("token");

      //vehículo por ID
      const vehRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/vehiculos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehiculoData(vehRes.data);
      

      // reparaciones del vehículo
      const repRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/reparaciones/vehiculo/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(user)
      setReparaciones(Array.isArray(repRes.data) ? repRes.data : []);

    } catch (err) {
      console.error(err);
      setReparaciones([]);
      navigate("/vehiculos-mecanico");
    }
  })();
  
  }, [id, navigate])

  // Estilos inline para asegurar que funcione sin Tailwind
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  }

  const sidebarStyle = {
    width: "280px",
    backgroundColor: "#22c55e", // Verde para mecánico
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
    overflowY: "hidden",
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

  const sectionTitleStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#374151",
    margin: "2rem 0 1.5rem 0",
  }

  const reparacionCardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }

  const reparacionTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const reparacionDetailStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0.25rem 0",
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

  const imageUploadSectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
  }

  const imageUploadAreaStyle = {
    width: "200px",
    height: "150px",
    border: "2px dashed #d1d5db",
    borderRadius: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: "#f9fafb",
    marginBottom: "1rem",
    transition: "border-color 0.3s ease",
  }

  const cameraIconStyle = {
    fontSize: "3rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  }


  const getStatusStyle = (status) => {
    let color = "#2D3573" // Default blue

    if (status.toLowerCase().includes("rechazado")) {
      color = "#DC2626" // Red for rejected
    } else if (status.toLowerCase().includes("pendiente")) {
      color = "#F59E0B" // Yellow for pending
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
      navigate("/dashboard-mecanico")
    } else if (menu === "reparaciones") {
      navigate("/vehiculos-mecanico")
    } else {
      setActiveMenu(menu)
    }
  }

  const handleReparacionClick = (reparacionId) => {
    navigate(`/servicios-mecanico/${id}/${reparacionId}`)
  }

  
    const handleAddChange = ({ target }) =>
      setAddFormData({ ...addFormData, [target.name]: target.value });

    const handleImageUpload = (e) => {
      const selected = e.target.files?.[0];
      if (!selected) return;
      setFile(selected);
    };

    const handleAddSubmit = async (e) => {
      e.preventDefault();

      if(!addFormData.tipo_reparacion.trim() || !addFormData.descripcion.trim()) {
        return warn("Campos obligatorios", "Tipo y descripción no púeden quedar vaciós")
      }

      try {
        const token = localStorage.getItem("token");
        
        // Verificar que el token existe y no está vacío
        if (!token || token.trim() === "") {
          errorSwal("Error de autenticación", "No hay token de sesión. Por favor, inicia sesión nuevamente.");
          navigate("/");
          return;
        }

        // Limpiar el token de espacios en blanco
        const cleanToken = token.trim();

        const formData = new FormData();
        formData.append("tipo_reparacion", addFormData.tipo_reparacion.trim());
        formData.append("descripcion", addFormData.descripcion.trim());
        
        // Solo agregar fechas si tienen valor
        if (addFormData.fecha_inicio) {
          formData.append("fecha_inicio", addFormData.fecha_inicio);
        }
        if (addFormData.fecha_fin) {
          formData.append("fecha_fin", addFormData.fecha_fin);
        }
        
        // Price is now calculated from services, so we don't send it
        formData.append("status", addFormData.status || "Pendiente");
        formData.append("vehiculo_id", id);
        
        // Agregar comentarios internos si tiene valor
        if (addFormData.comentarios_internos) {
          formData.append("comentarios_internos", addFormData.comentarios_internos.trim());
        }
        
        // Agregar fecha próximo mantenimiento si tiene valor
        if (addFormData.fecha_proximo_mantenimiento) {
          formData.append("fecha_proximo_mantenimiento", addFormData.fecha_proximo_mantenimiento);
        }
        
        // Solo agregar imagen "antes" si existe
        if (file) {
          formData.append("imagen_antes", file); // Nombre del campo para foto antes
        }

        // Configurar headers explícitamente
        const config = {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        };

        // Log para debugging (remover en producción)
        console.log("Enviando petición a:", `${import.meta.env.VITE_API_URL}/reparaciones`);
        console.log("Token presente:", !!cleanToken);
        console.log("Headers:", config.headers);

        // NO establecer Content-Type manualmente cuando usas FormData
        // axios lo establece automáticamente con el boundary correcto
        await axios.post(
          `${import.meta.env.VITE_API_URL}/reparaciones`,
          formData,
          config
        );

        const repRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/reparaciones/vehiculo/${id}`,
          { headers: { Authorization: `Bearer ${cleanToken}` } }
        );
        setReparaciones(repRes.data);  

        setShowAddModal(false);
        setAddFormData({
          tipo_reparacion: "",
          descripcion: "",
          fecha_inicio: "",
          fecha_fin: "",
          status: "Pendiente",
          comentarios_internos: "",
          fecha_proximo_mantenimiento: "",
        });
        setFile(null);
        await ok("Reparación registrada", "Se guardó correctamente")
      } catch (err) {
        console.error("Error completo:", err);
        
        // Manejo de errores más específico
        if (err.response?.status === 500) {
          const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error interno del servidor";
          errorSwal(
            "Error del servidor", 
            `El servidor encontró un error: ${errorMessage}. Verifica los datos ingresados o contacta al administrador.`
          );
        } else if (err.response?.status === 403) {
          errorSwal(
            "Acceso denegado", 
            "No tienes permisos para realizar esta acción. Verifica que tu sesión sea válida."
          );
        } else if (err.response?.status === 401) {
          errorSwal("Sesión expirada", "Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("currentUser");
          navigate("/");
        } else {
          errorSwal(
            "Error al registrar", 
            err.response?.data?.message || err.response?.data?.error || "Intenta más tarde"
          );
        }
      }
    };

  const openEditModal = (rep) => {
  setCurrentRep(rep);
  setEditFormData({
    tipo_reparacion: rep.tipo_reparacion,
    descripcion:     rep.descripcion,
    fecha_inicio:    rep.fecha_inicio?.slice(0,10) ?? "",
    fecha_fin:       rep.fecha_fin?.slice(0,10)   ?? "",
      // precio removed - it's calculated from services
    status:          rep.status,
    comentarios_internos: rep.comentarios_internos || "",
    fecha_proximo_mantenimiento: rep.fecha_proximo_mantenimiento?.slice(0,10) ?? "",
  });
  setFileAfter(null); // Resetear foto después al abrir modal
  setShowEditModal(true);
};

const handleEditChange = ({ target }) =>
  setEditFormData({ ...editFormData, [target.name]: target.value });

const handleImageUploadAfter = (e) => {
  const selected = e.target.files?.[0];
  if (!selected) return;
  setFileAfter(selected);
};

const handleEditSubmit = async (e) => {
  e.preventDefault();

  if(!editFormData.tipo_reparacion.trim() || !editFormData.descripcion.trim()) {
    return warn("Campos obligatorios", "Tipo y descripción no pueden quedar vaciós")
  }

  try {
    const token = localStorage.getItem("token");
    
    if (!token || token.trim() === "") {
      errorSwal("Error de autenticación", "No hay token de sesión. Por favor, inicia sesión nuevamente.");
      navigate("/");
      return;
    }

    const cleanToken = token.trim();

    // Si hay foto después, usar FormData; si no, JSON normal
    if (fileAfter) {
      const formData = new FormData();
      formData.append("tipo_reparacion", editFormData.tipo_reparacion.trim());
      formData.append("descripcion", editFormData.descripcion.trim());
      if (editFormData.fecha_inicio) formData.append("fecha_inicio", editFormData.fecha_inicio);
      if (editFormData.fecha_fin) formData.append("fecha_fin", editFormData.fecha_fin);
      // precio removed - it's calculated from services
      formData.append("status", editFormData.status);
      if (editFormData.comentarios_internos) {
        formData.append("comentarios_internos", editFormData.comentarios_internos.trim());
      }
      if (editFormData.fecha_proximo_mantenimiento) {
        formData.append("fecha_proximo_mantenimiento", editFormData.fecha_proximo_mantenimiento);
      }
      formData.append("imagen_despues", fileAfter); // Nombre del campo para foto después

      await axios.put(
        `${import.meta.env.VITE_API_URL}/reparaciones/${currentRep.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
    } else {
      // Sin foto, enviar como JSON normal
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reparaciones/${currentRep.id}`,
        {
          ...editFormData,
          // precio removed - it's calculated from services
        },
        { headers: { Authorization: `Bearer ${cleanToken}` } }
      );
    }

    /* refrescamos lista sin recargar la página */
    const repRes = await axios.get(
      `${import.meta.env.VITE_API_URL}/reparaciones/vehiculo/${id}`,
      { headers: { Authorization: `Bearer ${cleanToken}` } }
    );
    setReparaciones(repRes.data);

    setShowEditModal(false);
    setFileAfter(null);
    await ok("Reparación actualizada", "Los cambios se guardaron")
  } catch (err) {
    console.error("Error completo:", err);
    
    if (err.response?.status === 500) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error interno del servidor";
      errorSwal("Error del servidor", `El servidor encontró un error: ${errorMessage}`);
    } else if (err.response?.status === 403) {
      errorSwal("Acceso denegado", "No tienes permisos para realizar esta acción.");
    } else if (err.response?.status === 401) {
      errorSwal("Sesión expirada", "Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
      navigate("/");
    } else {
      errorSwal("Error al actualizar", err.response?.data?.message || err.response?.data?.error || "Intenta más tarde");
    }
  }
};

  // Si no hay datos del usuario o vehículo, mostrar loading
  if (!userData || !vehiculoData) {
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
        <div style={backButtonStyle} onClick={() => navigate("/vehiculos-mecanico")}>
          &lt; Menú Vehículos
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {vehiculoData.marca} {vehiculoData.modelo}
          </h1>
          <p style={subtitleStyle}>Placa: {vehiculoData.placa}</p>
        </div>

        {/* Botón agregar */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.375rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#16a34a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#22c55e")}
        >
          Agregar Reparación
        </button>
      </div>

        {/* Reparaciones Section */}
        <h2 style={sectionTitleStyle}>Registro de Reparaciones</h2>

        {/* Lista de Reparaciones */}
        {reparaciones.length === 0 && (
             <p style={{ color: "#6b7280", fontSize: "1rem" }}>No hay reparaciones registradas para este vehículo.</p>

        )}

       {reparaciones.map((rep) => (
            <div
              key={rep.id}
              style={reparacionCardStyle}
              onClick={() => handleReparacionClick(rep.id)} 
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow  = "0 4px 6px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow  = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              {/* Header con título y status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={reparacionTitleStyle}>Reparación #{rep.id}</h3>
                  <p style={reparacionDetailStyle}>
                    Fecha de Inicio: {rep.fecha_inicio}
                  </p>
                  <p style={reparacionDetailStyle}>
                    Fecha de Finalización: {rep.fecha_fin}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={getStatusStyle(rep.status)}>Status: {rep.status}</p>
                  <p style={valorStyle}>
                    Valor: {rep.precio === null || rep.precio === undefined || rep.precio === 0 
                      ? "N/A" 
                      : `$${Number(rep.precio).toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Fotos antes y después */}
              {(rep.imagen_antes || rep.imagen_despues) && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  marginTop: "0.5rem"
                }}>
                  {/* Foto Antes */}
                  {rep.imagen_antes && (
                    <div style={{
                      borderRadius: "0.375rem",
                      overflow: "hidden",
                      border: "2px solid #e5e7eb",
                      backgroundColor: "#f9fafb"
                    }}>
                      <div style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6b7280",
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        textAlign: "center"
                      }}>
                        Antes
                      </div>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${rep.imagen_antes}`}
                        alt="Antes de la reparación"
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          display: "block"
                        }}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                    </div>
                  )}

                  {/* Foto Después */}
                  {rep.imagen_despues && (
                    <div style={{
                      borderRadius: "0.375rem",
                      overflow: "hidden",
                      border: "2px solid #e5e7eb",
                      backgroundColor: "#f9fafb"
                    }}>
                      <div style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6b7280",
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        textAlign: "center"
                      }}>
                        Después
                      </div>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${rep.imagen_despues}`}
                        alt="Después de la reparación"
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          display: "block"
                        }}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Comentarios internos - Solo visible para mecánicos */}
              {rep.comentarios_internos && (
                <div style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fbbf24",
                  borderRadius: "0.375rem",
                  borderLeft: "4px solid #f59e0b"
                }}>
                  <div style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#92400e",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <span>🔒</span>
                    <span>Comentarios Internos</span>
                  </div>
                  <p style={{
                    fontSize: "0.875rem",
                    color: "#78350f",
                    margin: 0,
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap"
                  }}>
                    {rep.comentarios_internos}
                  </p>
                </div>
              )}

              {/* Botón para el modal de editar reparación */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();         
                    openEditModal(rep);          
                  }}
                  style={{
                    padding: "0.4rem 0.8rem",
                    background: "#2D3573",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Editar reparación
                </button>
              </div>
            </div>
          ))}
      </div>

            {/* Modal para agregar reparación */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: "540px",
              background: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2D3573", textAlign: "center" }}>
              Nueva Reparación
            </h2>
            <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#6b7280" }}>
              Complete los datos de la reparación
            </p>

            <form onSubmit={handleAddSubmit}>
              {/* Sección de imagen "antes" */}
              <div style={imageUploadSectionStyle}>
                <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                  Foto antes de la reparación (opcional)
                </label>
                <div
                  style={imageUploadAreaStyle}
                  onClick={() => document.getElementById("reparacionImageInput").click()}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = "#2D3573")}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview antes"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <>
                      <div style={cameraIconStyle}>📷</div>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        Click para agregar foto antes
                      </span>
                    </>
                  )}
                </div>

                {/* Input oculto para la imagen antes */}
                <input
                  id="reparacionImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>

              <input
                style={inputStyle}
                type="text"
                name="tipo_reparacion"
                placeholder="Tipo de reparación"
                value={addFormData.tipo_reparacion}
                onChange={handleAddChange}
                required
              />

              <textarea
                style={textareaStyle}
                name="descripcion"
                placeholder="Descripción"
                value={addFormData.descripcion}
                onChange={handleAddChange}
                required
              />

              <input
                style={inputStyle}
                type="date"
                name="fecha_inicio"
                value={addFormData.fecha_inicio}
                onChange={handleAddChange}
                required
              />

              <input
                style={inputStyle}
                type="date"
                name="fecha_fin"
                value={addFormData.fecha_fin}
                onChange={handleAddChange}
              />


              <select
                name="status"
                value={addFormData.status}
                onChange={handleAddChange}
                style={{
                  width: "100%",
                  height: "2.75rem",
                  padding: "0 0.75rem",
                  background: "#F5F7F9",
                  border: "2px solid #282F66",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En curso">En curso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Rechazado por el cliente">Rechazado por el cliente</option>
              </select>

              {/* Campo de comentarios internos */}
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block", marginTop: "1rem" }}>
                Comentarios internos (opcional)
              </label>
              <textarea
                style={textareaStyle}
                name="comentarios_internos"
                placeholder="Notas internas sobre la reparación (solo visible para mecánicos y administradores)"
                value={addFormData.comentarios_internos}
                onChange={handleAddChange}
                rows={3}
              />

              {/* Campo de fecha próximo mantenimiento */}
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block", marginTop: "1rem" }}>
                Fecha próximo mantenimiento (opcional)
              </label>
              <input
                style={inputStyle}
                type="date"
                name="fecha_proximo_mantenimiento"
                value={addFormData.fecha_proximo_mantenimiento}
                onChange={handleAddChange}
                placeholder="Fecha sugerida para el próximo mantenimiento"
              />

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    marginRight: "0.5rem",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "0.8rem",
                    borderRadius: "0.375rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    marginLeft: "0.5rem",
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.8rem",
                    borderRadius: "0.375rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar reparación */}
        {showEditModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 50,
            }}
            onClick={() => setShowEditModal(false)}
          >
            <div
              style={{
                width: "540px",
                background: "white",
                borderRadius: "0.75rem",
                padding: "2rem",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2D3573", textAlign: "center" }}>
                Editar Reparación
              </h2>
              <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#6b7280" }}>
                Modifique los datos necesarios
              </p>

              <form onSubmit={handleEditSubmit}>
                <input
                  style={inputStyle}
                  type="text"
                  name="tipo_reparacion"
                  placeholder="Tipo de reparación"
                  value={editFormData.tipo_reparacion}
                  onChange={handleEditChange}
                  required
                />

                <textarea
                  style={textareaStyle}
                  name="descripcion"
                  placeholder="Descripción"
                  value={editFormData.descripcion}
                  onChange={handleEditChange}
                  required
                />

                <input
                  style={inputStyle}
                  type="date"
                  name="fecha_inicio"
                  value={editFormData.fecha_inicio}
                  onChange={handleEditChange}
                  required
                />

                <input
                  style={inputStyle}
                  type="date"
                  name="fecha_fin"
                  value={editFormData.fecha_fin}
                  onChange={handleEditChange}
                />

                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  style={{
                    ...inputStyle,
                    height: "2.75rem",
                    background: "#F5F7F9",
                  }}
                  required
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En curso">En curso</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Rechazado por el cliente">Rechazado por el cliente</option>
                </select>

                {/* Campo para foto "después" - especialmente útil cuando se finaliza */}
                {(editFormData.status === "Finalizado" || fileAfter) && (
                  <div style={imageUploadSectionStyle}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                      Foto después de la reparación (opcional)
                    </label>
                    <div
                      style={imageUploadAreaStyle}
                      onClick={() => document.getElementById("reparacionImageAfterInput").click()}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = "#2D3573")}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                    >
                      {fileAfter ? (
                        <img
                          src={URL.createObjectURL(fileAfter)}
                          alt="preview después"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <>
                          <div style={cameraIconStyle}>📷</div>
                          <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                            Click para agregar foto después
                          </span>
                        </>
                      )}
                    </div>

                    {/* Input oculto para la imagen después */}
                    <input
                      id="reparacionImageAfterInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadAfter}
                      style={{ display: "none" }}
                    />
                  </div>
                )}

                {/* Campo de comentarios internos */}
                <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block", marginTop: "1rem" }}>
                  Comentarios internos (opcional)
                </label>
                <textarea
                  style={textareaStyle}
                  name="comentarios_internos"
                  placeholder="Notas internas sobre la reparación (solo visible para mecánicos y administradores)"
                  value={editFormData.comentarios_internos}
                  onChange={handleEditChange}
                  rows={3}
                />

                {/* Campo de fecha próximo mantenimiento */}
                <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block", marginTop: "1rem" }}>
                  Fecha próximo mantenimiento (opcional)
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  name="fecha_proximo_mantenimiento"
                  value={editFormData.fecha_proximo_mantenimiento}
                  onChange={handleEditChange}
                  placeholder="Fecha sugerida para el próximo mantenimiento"
                />

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      marginRight: "0.5rem",
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      padding: "0.8rem",
                      borderRadius: "0.375rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      marginLeft: "0.5rem",
                      background: "#6b7280",
                      color: "white",
                      border: "none",
                      padding: "0.8rem",
                      borderRadius: "0.375rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowEditModal(false)}
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

export default ReparacionesMecanico