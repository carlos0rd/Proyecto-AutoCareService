"use client"

import axios from "axios"; 
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ok, warn, error as errorSwal, confirm } from "../../utils/alerts"

const VehiculosMecanico = () => {
  const [activeMenu, setActiveMenu] = useState("reparaciones")
  const [userData, setUserData] = useState(null)
  const [showDropdown, setShowDropdown] = useState(null) 
  const navigate = useNavigate()
  const [search, setSearch] = useState("");    

  const [showAddModal, setShowAddModal] = useState(false)
  const [addFormData, setAddFormData] = useState({
    modelo: "",
    marca: "",
    año: "",
    color: "",
    placa: "",
    clienteEmail: "",
    imagen: null,
  })

  // Estado para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPreview, setEditPreview] = useState(null);      // para la miniatura
  const [editData, setEditData] = useState({
    id: "",
    modelo: "",
    marca: "",
    anio: "",
    color: "",
    placa: "",
    imagen: null,    // File o null
  });

 const [vehiculos,   setVehiculos]   = useState([]);
 const [page,        setPage]        = useState(1);   
 const [totalPages,  setTotalPages]  = useState(1);   
 const limit = 10;   
 const [file, setFile] = useState(null);


  const fetchVehiculos = async (p = 1) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No hay token disponible");
        setVehiculos([]);
        return;
      }

      const res = await axios.get(
       `${import.meta.env.VITE_API_URL}/vehiculos?page=${p}&limit=${limit}`,
       { headers: { Authorization: `Bearer ${token}` } }
     );
      // si tu backend devuelve { data: [...] } usa res.data.data
       const { data, totalPages } = res.data;
     setVehiculos(Array.isArray(data) ? data : []);
     setTotalPages(totalPages || 1);
    } catch (err) {
      console.error("Error al obtener vehículos:", err);
      
      // Manejo específico de errores
      if (err.response?.status === 403) {
        console.error("403 Forbidden - El backend está rechazando el acceso");
        console.error("Detalles:", err.response?.data);
        // No mostrar alerta aquí para evitar spam, solo log
      } else if (err.response?.status === 401) {
        console.error("401 Unauthorized - Token inválido o expirado");
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUser");
        navigate("/");
      }
      
      setVehiculos([]);
    }
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("currentUser")

    if (!isAuthenticated || !currentUser) {
      navigate("/")
      return
    }

    const user = JSON.parse(currentUser)
    if (user.rol_id !== 2) {
      if (user.rol_id === 3) {
        navigate("/dashboard-admin")
      } else {
        navigate("/dashboard-cliente")
      }
      return
    }

    setUserData(user)


    // Close dropdown when clicking outside
    const handleClickOutside = () => {
      setShowDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [navigate])

  useEffect(() => {
  fetchVehiculos(page)// se dispara al cambiar de pagina
}, [page]);

  useEffect(() => {                                     
    setPage(1);
  }, [search]);

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
    padding: "3rem",
    backgroundColor: "#f8f9fa",
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "3rem",
  }

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0",
    letterSpacing: "0.02em",
  }

  const addButtonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }

  const vehiculosContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  }

  const vehiculoCardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    position: "relative",
  }

  const vehiculoImageStyle = {
    width: "120px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "0.375rem",
  }

  const vehiculoInfoStyle = {
    flex: 1,
  }

  const vehiculoNombreStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0 0 0.5rem 0",
  }

  const vehiculoDetalleStyle = {
    fontSize: "1rem",
    color: "#6b7280",
    margin: "0.25rem 0",
  }

  const vehiculoActionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    position: "relative",
  }

  const visualizarLinkStyle = {
    color: "#2D3573",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  }

  const settingsIconStyle = {
    width: "24px",
    height: "24px",
    cursor: "pointer",
    color: "#6b7280",
  }

  // Dropdown menu styles
  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "200px",
    marginTop: "0.5rem",
  }

  const dropdownItemStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: "#374151",
    cursor: "pointer",
    borderBottom: "1px solid #f3f4f6",
    transition: "background-color 0.2s",
  }

  const dropdownItemHoverStyle = {
    backgroundColor: "#f9fafb",
  }

  const deleteItemStyle = {
    ...dropdownItemStyle,
    color: "#dc2626",
    borderBottom: "none",
  }

  

  const handleSearchChange = (e) => {                    
  setSearch(e.target.value.toLowerCase());
  };

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

  const handleVerReparaciones = (vehiculoId) => {
    navigate(`/reparaciones-mecanico/${vehiculoId}`)
  }

  const handleAgregarVehiculo = () => {
    setShowAddModal(true)
  }

  const handleSettingsClick = (e, vehiculoId) => {
    e.stopPropagation()
    setShowDropdown(showDropdown === vehiculoId ? null : vehiculoId)
  }

  const handleEditField = (vehiculoId, field) => {
    const vehiculo = vehiculosData.find((v) => v.id === vehiculoId)
    const currentValue = vehiculo[field]
    const newValue = prompt(`Editar ${field}:`, currentValue)

    if (newValue && newValue !== currentValue) {
      console.log(`Editando ${field} del vehículo ${vehiculoId}: ${currentValue} -> ${newValue}`)
      alert(`${field} actualizado exitosamente`)
    }
    setShowDropdown(null)
  }

  const handleDeleteVehicle = async (vehiculoId) => {
  const okUser = await confirm("¿Eliminar vehículo?", "Esta acción es irreversible")
  if (!okUser) return

  try {
    const token = localStorage.getItem("token")
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/vehiculos/${vehiculoId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // elimina en la UI sin recargar
    setVehiculos(prev => prev.filter(v => v.id !== vehiculoId))
    await ok("Vehículo eliminado", "Se eliminó correctamente")
  } catch (err) {
    console.error(err)
    errorSwal("No se pudo eliminar",
              err.response?.data?.error || "Intenta más tarde")
  } finally {
    setShowDropdown(null)
  }
}

  const handleAddChange = (e) => {
    const { name, value } = e.target
    setAddFormData({
      ...addFormData,
      [name]: value,
    })
  }

const handleAddSubmit = async (e) => {
  e.preventDefault();

  if(!addFormData.modelo.trim() || !addFormData.marca.trim()) {
    return warn("Campos obligatorios", "Modelo y marca no pueden quedar vacíos")
  }

  try {
    const token = localStorage.getItem("token");
    
    // Verificar que el token existe
    if (!token) {
      errorSwal("Error de autenticación", "No hay token de sesión. Por favor, inicia sesión nuevamente.");
      navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append("modelo",        addFormData.modelo);
    formData.append("marca",         addFormData.marca);
    formData.append("anio",          addFormData.año);
    formData.append("color",         addFormData.color);
    formData.append("placa",         addFormData.placa);
    formData.append("clienteEmail",  addFormData.clienteEmail);
    if (file) formData.append("imagen", file);

    // NO establecer Content-Type manualmente cuando usas FormData
    // axios lo establece automáticamente con el boundary correcto
    await axios.post(
      `${import.meta.env.VITE_API_URL}/vehiculos`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Removido "Content-Type": axios lo maneja automáticamente
        },
      }
    );

    //Refrescamos la lista de vehículos
    setPage(1);
    fetchVehiculos(1);

    setAddFormData({
      modelo: "", marca: "", año: "",
      color: "", placa: "", clienteEmail: "", imagen: null,
    });
    setFile(null);
    setShowAddModal(false);
    await ok("Vehículo agregado", "Se registró correctamente")
  } catch (err) {
    console.error("Error completo:", err);
    
    // Manejo de errores más específico
    if (err.response?.status === 403) {
      errorSwal(
        "Acceso denegado", 
        "No tienes permisos para realizar esta acción. Verifica que tu sesión sea válida o contacta al administrador."
      );
      // Si el token es inválido, redirigir al login
      if (err.response?.data?.message?.includes("token") || err.response?.data?.message?.includes("Token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUser");
        navigate("/");
      }
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


  const handleImageUpload = (e) => {
   const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
  }

  const handleOpenEditModal = (veh) => {
  setEditData({
    id: veh.id,
    modelo: veh.modelo,
    marca: veh.marca,
    anio: veh.anio,
    color: veh.color,
    placa: veh.placa,
    imagen: null,              
  });
  setEditPreview(`${import.meta.env.VITE_API_URL}${veh.imagen}`);  
  setShowDropdown(null);        
  setShowEditModal(true);
};

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      const file = files[0];
      setEditData((prev) => ({ ...prev, imagen: file }));
      setEditPreview(URL.createObjectURL(file));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

    const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        errorSwal("Error de autenticación", "No hay token de sesión. Por favor, inicia sesión nuevamente.");
        navigate("/");
        return;
      }

      const fd = new FormData();
      fd.append("modelo", editData.modelo);
      fd.append("marca",  editData.marca);
      fd.append("anio",   editData.anio);
      fd.append("color",  editData.color);
      fd.append("placa",  editData.placa);

      if (editData.imagen) fd.append("imagen", editData.imagen); // sólo si cambia

      // NO establecer Content-Type manualmente cuando usas FormData
      await axios.put(`${import.meta.env.VITE_API_URL}/vehiculos/${editData.id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await ok("Vehículo actualizado", "Los cambios se guardaron")
      setShowEditModal(false);
      fetchVehiculos();          // vuelve a pedir la lista → sin recargar la página
    } catch (err) {
      console.error("Error completo:", err);
      
      if (err.response?.status === 403) {
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
          "Error al guardar cambios", 
          err.response?.data?.message || err.response?.data?.error || "Intenta más tarde"
        );
      }
    }
  };


  // Modal styles (keeping the existing add modal)
  const addModalStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "2rem",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    position: "relative",
  }

  const addModalHeaderStyle = {
    textAlign: "center",
    marginBottom: "2rem",
  }

  const addModalContentStyle = {
    display: "flex",
    gap: "2rem",
    alignItems: "flex-start",
  }

  const imageUploadSectionStyle = {
    flex: "0 0 200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }

  const imageUploadAreaStyle = {
    width: "150px",
    height: "120px",
    border: "2px dashed #d1d5db",
    borderRadius: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: "#f9fafb",
    marginBottom: "1rem",
  }

  const cameraIconStyle = {
    fontSize: "3rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  }

  const formSectionStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }

  const addButtonStyleModal = {
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

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
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
    margin: "0",
  }

  const inputStyle = {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    color: "#374151",
    width: "100%",
    boxSizing: "border-box",
  }

  const searchInputStyle = {                              
    ...inputStyle,
    maxWidth: "300px",
    marginRight: "1rem",
  };

  // Tamaño y recorte uniforme de las fotos
  const vehicleThumbWrapper = {
    width: 110,           
    height: 110,          
    flexShrink: 0,        
    borderRadius: 8,      
    overflow: "hidden",   
    marginRight: "1rem",
  };

  const vehicleThumbImg = {
    width: "100%",
    height: "100%",
    objectFit: "cover",    
  };

  const currentVehiculos = vehiculos.filter((v) => {      
    const term = search.trim();
    if (!term) return true;
    return (
      v.modelo?.toLowerCase().includes(term) ||
      v.marca?.toLowerCase().includes(term)  ||
      v.placa?.toLowerCase().includes(term)
    );
  });

  /* ─────────────── VehiculosMecanico - estilos “edit modal” ─────────────── */

  const modalBackdropStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    width: "min(36rem, 90%)",
    background: "#fff",
    borderRadius: "0.75rem",
    padding: "2rem 2.5rem",
    boxShadow: "0 10px 25px rgba(0,0,0,.15)",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  };

  const modalTitle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1e2a63",              // azul oscuro que usas en los h-titles
    marginBottom: "0.75rem",
    textAlign: "center",
  };

  // Caja de subida / preview de la imagen
  const imgUploadWrapper = { display: "flex", justifyContent: "center" };

  const imgUploadArea = {
    width: "11rem",
    height: "11rem",
    border: "2px dashed #c4c4c4",
    borderRadius: "0.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    color: "#6b7280",
    overflow: "hidden",
  };

  const imgPreviewStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };


  const confirmBtnStyle = {
    flex: 1,
    background: "#16a34a",        
    color: "#fff",
    border: "none",
    padding: "0.65rem 0",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity .15s",
  };
  const cancelBtnStyle = {
    flex: 1,
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "0.65rem 0",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity .15s",
  };



  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

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
          <div style={headerStyle}>
            <h1 style={titleStyle}>Menú Vehículos</h1>
            <button
              style={addButtonStyle}
              onClick={handleAgregarVehiculo}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#16a34a")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#22c55e")}
            >
              Agregar Vehiculo
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "left", margin: "0 0 1.5rem" }}>
        <input
          type="text"
          placeholder="Buscar vehículo…"
          value={search}
          onChange={handleSearchChange}
          style={searchInputStyle}
        />
      </div>

        {/* Lista de Vehículos */}
        <div style={vehiculosContainerStyle}>
          {currentVehiculos.map((vehiculo) => (
            <div key={vehiculo.id} style={vehiculoCardStyle}>

              <div style={vehicleThumbWrapper}>
                 <img
                  src={`${import.meta.env.VITE_API_URL}${vehiculo.imagen}`}   //  http://localhost:3000/imagenes/....
                  alt={vehiculo.modelo}
                  style={vehicleThumbImg}
                />
              </div>
               
                
                <div style={vehiculoInfoStyle}>
                <h3 style={vehiculoNombreStyle}>
                  {vehiculo.marca} {vehiculo.modelo}
                </h3>
                <p style={vehiculoDetalleStyle}>Placa: {vehiculo.placa}</p>
                <p style={vehiculoDetalleStyle}>Marca: {vehiculo.marca}</p>
                <p style={vehiculoDetalleStyle}>Cliente: {vehiculo.cliente}</p>
              </div>

              <div style={vehiculoActionsStyle}>
                <div style={visualizarLinkStyle} onClick={() => handleVerReparaciones(vehiculo.id)}>
                  visualizar reparaciones
                </div>
                <div style={{ position: "relative" }}>
                  <svg
                    style={settingsIconStyle}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={(e) => handleSettingsClick(e, vehiculo.id)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  {/* Dropdown Menu */}
                  {showDropdown === vehiculo.id && (
                    <div style={dropdownStyle}>
                    <div
                        style={dropdownItemStyle}
                        onClick={() => handleOpenEditModal(vehiculo)}
                        onMouseOver={(e) => (e.target.style.backgroundColor = dropdownItemHoverStyle.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                      >
                        ✏️ Editar Vehículo
                      </div>
                      <div
                        style={deleteItemStyle}
                        onClick={() => handleDeleteVehicle(vehiculo.id)}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#fef2f2")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                      >
                        🗑️ Eliminar Vehículo
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
       {totalPages > 1 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          margin: "2rem 0"
        }}>
          {/* Anterior */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: ".5rem 1.25rem",
              borderRadius: "0.375rem",
              border: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: page === 1 ? "#9ca3af" : "#fff",
              backgroundColor: page === 1 ? "#e5e7eb" : "#1e40af",
              cursor: page === 1 ? "default" : "pointer",
              transition: "background-color .2s ease"
            }}
          >
            ◀︎ Anterior
          </button>

          {/* Indicador */}
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "#1f2937" }}>
            Página {page} / {totalPages}
          </span>

          {/* Siguiente */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: ".5rem 1.25rem",
              borderRadius: "0.375rem",
              border: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: page === totalPages ? "#9ca3af" : "#fff",
              backgroundColor: page === totalPages ? "#e5e7eb" : "#1e40af",
              cursor: page === totalPages ? "default" : "pointer",
              transition: "background-color .2s ease"
            }}
          >
            Siguiente ▶︎
          </button>
        </div>
      )}
      </div>

      {/* Modal de Agregar Vehículo */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)}>
          <div style={addModalStyle} onClick={(e) => e.stopPropagation()}>
         
            <form onSubmit={handleAddSubmit}>
              <div style={addModalContentStyle}>
                  {/* Sección imagen*/}
                <div style={imageUploadSectionStyle}>
                  <div
                    style={imageUploadAreaStyle}
                    onClick={() => document.getElementById("imageInput").click()}
                  >
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <>
                        <div style={cameraIconStyle} />
                        <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          Dos cam…
                        </span>
                      </>
                    )}
                  </div>

                  {/* input oculto */}
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />

                  <input
                    type="text"
                    name="clienteEmail"
                    value={addFormData.clienteEmail}
                    onChange={handleAddChange}
                    style={inputStyle}
                    placeholder="Correo del cliente"
                    required
                  />
                </div>

                {/* Sección de formulario */}
                <div style={formSectionStyle}>
                  <input
                    type="text"
                    name="modelo"
                    value={addFormData.modelo}
                    onChange={handleAddChange}
                    style={inputStyle}
                    placeholder="Modelo del vehículo"
                    required
                  />

                  <input
                    type="text"
                    name="marca"
                    value={addFormData.marca}
                    onChange={handleAddChange}
                    style={inputStyle}
                    placeholder="Marca"
                    required
                  />

                  <input
                    type="text"
                    name="año"
                    value={addFormData.año}
                    onChange={handleAddChange}
                    style={inputStyle}
                    placeholder="Año"
                    required
                  />

                  <input
                    type="text"
                    name="color"
                    value={addFormData.color}
                    onChange={handleAddChange}
                    style={inputStyle}
                    placeholder="Color"
                    required
                  />

                  <input
                    type="text"
                    name="placa"
                    value={addFormData.placa}
                    onChange={handleAddChange}
                    style={inputStyle}
                    placeholder="Placa"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={addButtonStyleModal}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1e2550")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3573")}
              >
                Agregar vehículo
              </button>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
      <div style={modalBackdropStyle}>
        <form
          style={modalStyle}
          onSubmit={handleEditSubmit}
        >
          <h2 style={modalTitle}>Editar vehículo</h2>

          {/* Foto */}
          <div style={imgUploadWrapper}>
            <label htmlFor="editImageInput" style={imgUploadArea}>
              {editPreview ? (
                <img src={editPreview} style={imgPreviewStyle} />
              ) : (
                "Cambiar foto"
              )}
            </label>
            <input
              id="editImageInput"
              name="imagen"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleEditChange}
            />
          </div>

          {/* Campos */}
          <input
            name="modelo"
            placeholder="Modelo"
            value={editData.modelo}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <input
            name="marca"
            placeholder="Marca"
            value={editData.marca}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <input
            name="anio"
            placeholder="Año"
            value={editData.anio}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <input
            name="color"
            placeholder="Color"
            value={editData.color}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <input
            name="placa"
            placeholder="Placa"
            value={editData.placa}
            onChange={handleEditChange}
            style={inputStyle}
          />

          {/* Botones */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" style={confirmBtnStyle}>
              Guardar cambios
            </button>
            <button
              type="button"
              style={cancelBtnStyle}
              onClick={() => setShowEditModal(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    )}


    </div>
  )
}

export default VehiculosMecanico
