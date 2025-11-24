const obtenerVehiculos = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener vehículos");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
