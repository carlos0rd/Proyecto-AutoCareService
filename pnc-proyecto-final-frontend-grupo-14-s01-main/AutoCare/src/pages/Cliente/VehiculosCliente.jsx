"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const VehiculosCliente = () => {
  const [activeMenu, setActiveMenu] = useState("vehiculos")
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  // Datos de vehículos
  const [vehiculosData, setVehiculosData] = useState([]);
  // Reparaciones activas por vehículo (vehiculoId -> array de reparaciones)
  const [reparacionesActivas, setReparacionesActivas] = useState({});
  // Mantenimientos próximos para notificaciones
  const [mantenimientosProximos, setMantenimientosProximos] = useState([]);

  // HU14: búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");        // búsqueda placa / VIN
  const [brandFilter, setBrandFilter] = useState("todas"); // filtro por marca

  // Función para obtener reparaciones activas de un vehículo
  const fetchReparacionesActivas = async (vehiculoId, token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reparaciones/vehiculo/${vehiculoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.ok) return;
      
      const reparaciones = await response.json();
      
      // Filtrar solo las que no estan finalizadas
      const activas = reparaciones.filter(
        (rep) => rep.status && rep.status.toLowerCase() !== "finalizado"
      );
      
      setReparacionesActivas((prev) => ({
        ...prev,
        [vehiculoId]: activas,
      }));
    } catch (err) {
      console.error(`Error al obtener reparaciones del vehículo ${vehiculoId}:`, err);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    if (!isAuthenticated || !currentUser) {
      navigate("/");
      return;
    }

    const user = JSON.parse(currentUser);
    setUserData(user);

    // Obtener vehículos del backend
    fetch(`${import.meta.env.VITE_API_URL}/vehiculos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener vehículos");
        return res.json();
      })
      .then((data) => {
        const lista = Array.isArray(data) ? data
          : Array.isArray(data.data) ? data.data
          : [];
        setVehiculosData(lista);
        
        // Obtener reparaciones activas para cada vehículo
        lista.forEach((vehiculo) => {
          fetchReparacionesActivas(vehiculo.id, token);
        });
      })
      .catch((err) => console.error(err));

    // Cargar mantenimientos próximos
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/reparaciones/mantenimientos-proximos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            console.error("Error en respuesta:", res.status, res.statusText);
            return [];
          }
          return res.json();
        })
        .then(data => {
          setMantenimientosProximos(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("Error cargando mantenimientos:", err);
          setMantenimientosProximos([]);
        });
    }
  }, [navigate]);

  // Actualización automática del estado cada 30 segundos
  useEffect(() => {
    if (vehiculosData.length === 0) return;
    
    const token = localStorage.getItem("token");
    if (!token) return;

    // Función para actualizar todas las reparaciones
    const actualizarReparaciones = () => {
      vehiculosData.forEach((vehiculo) => {
        fetchReparacionesActivas(vehiculo.id, token);
      });
    };

    // Actualizar inmediatamente
    actualizarReparaciones();

    // Configurar intervalo para actualización automática cada 30 segundos
    const intervalId = setInterval(actualizarReparaciones, 30000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [vehiculosData]);

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
    setUserData(JSON.parse(currentUser))
  }, [navigate])

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
    marginBottom: "1.5rem",
  }

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2D3573",
    margin: "0",
    letterSpacing: "0.02em",
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
    flexDirection: "column",
    gap: "1rem",
  }

  const vehiculoCardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
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

  const estadoReparacionContainerStyle = {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
  }

  const estadoReparacionTitleStyle = {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  }

  const estadoReparacionItemStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0.25rem 0",
    padding: "0.5rem",
    backgroundColor: "white",
    borderRadius: "0.375rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }

  const getStatusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase() || "";
    let backgroundColor = "#e5e7eb";
    let color = "#374151";

    if (statusLower.includes("recibido")) {
      backgroundColor = "#dbeafe";
      color = "#1e40af";
    } else if (statusLower.includes("diagnóstico") || statusLower.includes("diagnostico")) {
      backgroundColor = "#fef3c7";
      color = "#92400e";
    } else if (statusLower.includes("cotizado")) {
      backgroundColor = "#fce7f3";
      color = "#9f1239";
    } else if (statusLower.includes("aprobado")) {
      backgroundColor = "#d1fae5";
      color = "#065f46";
    } else if (statusLower.includes("reparación") || statusLower.includes("reparacion")) {
      backgroundColor = "#dbeafe";
      color = "#1e40af";
    } else if (statusLower.includes("listo")) {
      backgroundColor = "#d1fae5";
      color = "#065f46";
    } else if (statusLower.includes("entregado")) {
      backgroundColor = "#d1fae5";
      color = "#065f46";
    }

    return {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor,
      color,
    };
  }

  const vehiculoActionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  }

  const visualizarLinkStyle = {
    color: "#2D3573",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  }

  // 🔎 HU14: obtener marcas y aplicar filtros
  const marcasDisponibles = Array.from(
    new Set(
      vehiculosData
        .map((v) => (v.marca || "").trim())
        .filter(Boolean)
    )
  ).sort();

  const filteredVehiculos = vehiculosData.filter((v) => {
    const term = searchTerm.trim().toLowerCase();

    const placa = (v.placa || "").toLowerCase();
    const vin   = (v.vin || "").toLowerCase();
    const marca = (v.marca || "").toLowerCase();

    const matchesSearch =
      term === "" ||
      placa.includes(term) ||
      vin.includes(term);

    const matchesBrand =
      brandFilter === "todas" ||
      marca === brandFilter.toLowerCase();

    return matchesSearch && matchesBrand;
  });

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
    } else {
      setActiveMenu(menu)
    }
  }

  const handleVerReparaciones = (vehiculoId) => {
    navigate(`/reparaciones-cliente/${vehiculoId}`)
  }

  // Si no hay datos del usuario, mostrar loading
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
          <h1 style={titleStyle}>Menú Vehículos</h1>
        </div>

        {/* Notificación de Mantenimientos Próximos */}
        {mantenimientosProximos && mantenimientosProximos.length > 0 && (
          <div style={{
            backgroundColor: "#fef3c7",
            border: "2px solid #fbbf24",
            borderLeft: "6px solid #f59e0b",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem"
            }}>
              <span style={{ fontSize: "2rem" }}>🔔</span>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#92400e",
                margin: 0
              }}>
                Recordatorio de Mantenimiento
              </h3>
            </div>
            <p style={{
              fontSize: "1rem",
              color: "#78350f",
              marginBottom: "1rem"
            }}>
              Tienes {mantenimientosProximos.length} {mantenimientosProximos.length === 1 ? 'vehículo' : 'vehículos'} con mantenimiento programado para hoy o mañana:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {mantenimientosProximos.map((mant) => {
                const fecha = new Date(mant.fecha_proximo_mantenimiento);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaMant = new Date(fecha);
                fechaMant.setHours(0, 0, 0, 0);
                const esHoy = fechaMant.getTime() === hoy.getTime();
                
                return (
                  <div key={mant.id} style={{
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #fbbf24"
                  }}>
                    <div style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#92400e",
                      marginBottom: "0.5rem"
                    }}>
                      {esHoy ? "⏰ Hoy" : "📅 Mañana"} - {mant.marca} {mant.modelo} ({mant.placa})
                    </div>
                    <div style={{
                      fontSize: "0.875rem",
                      color: "#78350f"
                    }}>
                      <strong>Reparación #{mant.id}:</strong> {mant.tipo_reparacion}
                    </div>
                    <div style={{
                      fontSize: "0.875rem",
                      color: "#78350f",
                      marginTop: "0.25rem"
                    }}>
                      <strong>Fecha programada:</strong> {fecha.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HU14: barra de búsqueda + filtros por marca */}
        {vehiculosData.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 0 1.5rem 0",
            }}
          >
            {/* Búsqueda por placa / VIN */}
            <input
              type="text"
              placeholder="Buscar por placa o VIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "0.55rem 0.8rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />

            {/* Filtros por marca */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <button
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  backgroundColor: brandFilter === "todas" ? "#2D3573" : "white",
                  color: brandFilter === "todas" ? "white" : "#4b5563",
                  fontWeight: brandFilter === "todas" ? 600 : 400,
                }}
                onClick={() => setBrandFilter("todas")}
              >
                Todas las marcas
              </button>

              {marcasDisponibles.map((marca) => (
                <button
                  key={marca}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    backgroundColor:
                      brandFilter.toLowerCase() === marca.toLowerCase()
                        ? "#2D3573"
                        : "white",
                    color:
                      brandFilter.toLowerCase() === marca.toLowerCase()
                        ? "white"
                        : "#4b5563",
                    fontWeight:
                      brandFilter.toLowerCase() === marca.toLowerCase() ? 600 : 400,
                  }}
                  onClick={() => setBrandFilter(marca)}
                >
                  {marca}
                </button>
              ))}
            </div>
          </div>
        )}

        {vehiculosData.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b7280", fontSize: "1.2rem" }}>
            No tienes vehículos registrados.
          </div>
        )}

        {/* Lista de Vehículos */}
        <div style={vehiculosContainerStyle}>
          {filteredVehiculos.length === 0 && vehiculosData.length > 0 && (
            <div style={{ textAlign: "center", color: "#6b7280", marginTop: "1rem" }}>
              No hay vehículos que coincidan con la búsqueda o filtro.
            </div>
          )}

          {filteredVehiculos.map((vehiculo) => {
            const reparacionesDelVehiculo = reparacionesActivas[vehiculo.id] || [];
            const tieneReparacionesActivas = reparacionesDelVehiculo.length > 0;
            
            return (
              <div key={vehiculo.id} style={vehiculoCardStyle}>
                {/* Header del vehículo */}
                <div style={vehiculoCardHeaderStyle}>
                  <img
                    src={vehiculo.imagen ? `${import.meta.env.VITE_API_URL}${vehiculo.imagen}` : "/placeholder.svg"}
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    style={vehiculoImageStyle}
                  />

                  <div style={vehiculoInfoStyle}>
                    <h3 style={vehiculoNombreStyle}>
                      {vehiculo.marca} {vehiculo.modelo}
                    </h3>
                    <p style={vehiculoDetalleStyle}>Placa: {vehiculo.placa}</p>
                    <p style={vehiculoDetalleStyle}>Mecánico: {vehiculo.mecanico || "No asignado"}</p>
                  </div>

                  <div style={vehiculoActionsStyle}>
                    <div style={visualizarLinkStyle} onClick={() => handleVerReparaciones(vehiculo.id)}>
                      visualizar reparaciones
                    </div>
                  </div>
                </div>

                {/* Estado de reparaciones activas */}
                {tieneReparacionesActivas ? (
                  <div style={estadoReparacionContainerStyle}>
                    <div style={estadoReparacionTitleStyle}>
                      📋 Estado Actual de Reparaciones:
                    </div>
                    {reparacionesDelVehiculo.map((rep) => (
                      <div key={rep.id} style={estadoReparacionItemStyle}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", color: "#374151", marginBottom: "0.25rem" }}>
                            Reparación #{rep.id} - {rep.tipo_reparacion || "Sin tipo"}
                          </div>
                          {rep.descripcion && (
                            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                              {rep.descripcion}
                            </div>
                          )}
                        </div>
                        <div style={{ marginLeft: "1rem" }}>
                          <span style={getStatusBadgeStyle(rep.status)}>
                            {rep.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    ...estadoReparacionContainerStyle,
                    backgroundColor: "#f0fdf4",
                    borderColor: "#bbf7d0",
                  }}>
                    <div style={{ fontSize: "0.875rem", color: "#166534", textAlign: "center" }}>
                      ✅ No hay reparaciones activas en este momento
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default VehiculosCliente
