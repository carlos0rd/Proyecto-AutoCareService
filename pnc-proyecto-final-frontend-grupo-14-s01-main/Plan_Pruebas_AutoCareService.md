# 📋 Plan de Pruebas – AutoCare Manager
**Versión:** 1.0  
**Estado:** Activo  
**Cobertura:** 1 caso de prueba por cada Historia de Usuario (HU1–HU24)

---

## 📌 1. Información General

### 🎯 Objetivo
Verificar que el sistema **AutoCare Manager** cumpla con los requisitos funcionales descritos en las historias de usuario, asegurando que el flujo principal de cotizaciones, órdenes de trabajo, facturas, evidencia de reparaciones y recordatorios funcione correctamente antes de la entrega parcial.

### 📊 Alcance
Este plan cubre **pruebas funcionales** sobre todas las historias de usuario definidas en el documento de épicas (HU1–HU24).  
No se incluyen resultados de ejecución, únicamente la **planificación** de las pruebas (casos, pasos y resultados esperados).

### 🚀 Estrategia de Pruebas

| Tipo de Prueba   | Descripción                                               |
|------------------|-----------------------------------------------------------|
| Funcional        | Verifica criterios de aceptación de cada historia.       |
| De Seguridad     | Validación básica de acceso por credenciales y roles.    |
| De Usabilidad    | Flujo básico para el usuario final (cliente/mecánico).   |
| De Integración   | Flujo entre módulos: cotización → aprobación → factura.  |

Niveles de prueba considerados: **Integración** y **Sistema** (las unitarias quedan fuera de este documento).

---

## 🧪 2. Casos de prueba por Historia de Usuario

> Nota: cada HU tiene al menos **un caso de prueba**.  
> Formato: **CP-XXX – Título**.

---

### Épica 1: Cotización desglosada

#### HU1 – Crear vista de cotización detallada

**CP-001 – Registro de piezas y mano de obra en cotización**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Usuario autenticado con rol *mecánico*.
  - Vehículo y cliente seleccionados.
- **Pasos de ejecución:**
  1. Navegar a la pantalla de creación de cotización.
  2. Agregar al menos un repuesto indicando nombre, cantidad y precio unitario.
  3. Agregar al menos un ítem de mano de obra (tipo de trabajo, horas, costo por hora).
  4. Editar la cantidad de un repuesto.
  5. Eliminar uno de los ítems de mano de obra.
  6. Guardar la cotización.
- **Resultado esperado:**
  - Los subtotales de repuestos y mano de obra se recalculan automáticamente.
  - El total general refleja los cambios de edición y eliminación.
  - La cotización se guarda con el desglose correcto en base de datos/interfaz.

---

#### HU2 – Obtener la lista de repuestos

**CP-002 – Consulta de lista de repuestos para cotización**

- **Tipo:** Funcional (API / Backend + UI)  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Catálogo de repuestos cargado.
- **Pasos de ejecución:**
  1. Desde la pantalla de cotización, abrir el buscador de repuestos.
  2. Verificar que se muestre una lista con ID, nombre y precio unitario.
  3. Aplicar filtro por nombre (ej. “filtro por categoría o nombre”).
  4. Seleccionar un repuesto y agregarlo a la cotización.
- **Resultado esperado:**
  - La lista inicial muestra los repuestos disponibles.
  - El filtro reduce los resultados según el texto/categoría ingresado.
  - El repuesto seleccionado se agrega con su precio correcto a la cotización.

---

### Épica 2: Gestión de aprobación del cliente a la cotización

#### HU3 – Aprobación/Rechazo de cotización desde portal

**CP-003 – Aprobación de cotización por el cliente**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Cliente autenticado en el portal.
  - Cotización en estado *Pendiente* asociada al cliente.
- **Pasos de ejecución:**
  1. Ingresar al portal como cliente.
  2. Navegar a la sección de cotizaciones y abrir una cotización pendiente.
  3. Revisar el detalle (repuestos, mano de obra, total).
  4. Hacer clic en el botón **“Aprobar”**.
  5. Confirmar la acción en el diálogo (si existe).
- **Resultado esperado:**
  - El sistema registra la aprobación y la fecha/hora.
  - Se muestra un mensaje de confirmación de que la cotización fue aprobada.
  - El estado de la cotización cambia a *Aprobada*.

---

#### HU4 – Registrar aprobación o rechazo

**CP-004 – Registro de estado de cotización y trazabilidad**

- **Tipo:** Funcional (persistencia)  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Flujo de HU3 ejecutado (cotización aprobada o rechazada).
- **Pasos de ejecución:**
  1. Después de aprobar/rechazar una cotización, consultar su detalle desde el portal o módulo de administración.
  2. Validar la información almacenada: estado, fecha, hora, ID de cliente e ID de cotización.
  3. Acceder a la pantalla de órdenes de trabajo vinculadas.
- **Resultado esperado:**
  - La cotización muestra el estado correcto (Aprobada o Rechazada) con marca de tiempo.
  - La orden de trabajo asociada refleja automáticamente el estado de aprobación.

---

### Épica 3: Generación de reporte una vez aprobada la cotización

#### HU5 – Generar factura automática

**CP-005 – Generación de factura desde cotización aprobada**

- **Tipo:** Funcional / Integración  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Cotización en estado *Aprobada*.
  - Datos de cliente y vehículo completos.
- **Pasos de ejecución:**
  1. Ingresar como administrador del taller.
  2. Abrir una cotización aprobada.
  3. Hacer clic en **“Generar factura”**.
- **Resultado esperado:**
  - El sistema genera una factura con datos de cliente, vehículo, repuestos, mano de obra y total.
  - Se asigna un número correlativo a la factura.
  - La factura queda registrada en el sistema para futuras consultas.

---

### Épica 4: Exportar factura

#### HU6 – Generar archivo PDF y asignar número correlativo

**CP-006 – Exportar factura a PDF con número correlativo**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Factura generada (ver CP-005).
- **Pasos de ejecución:**
  1. Abrir el detalle de una factura existente.
  2. Seleccionar la opción **“Exportar/Descargar PDF”**.
  3. Guardar y abrir el archivo descargado.
- **Resultado esperado:**
  - El archivo se descarga en formato PDF.
  - El PDF incluye datos de cliente, vehículo, repuestos, mano de obra, total y número correlativo único.
  - El número correlativo coincide con el registrado en el sistema.

---

#### HU7 – Descargar factura desde el sistema

**CP-007 – Descarga de factura desde sección de facturas/historial**

- **Tipo:** Funcional  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Cliente o administrador autenticado.
  - Al menos una factura generada y visible en la tabla de facturas/historial.
- **Pasos de ejecución:**
  1. Navegar a la sección de facturas o historial.
  2. Localizar una factura de la lista.
  3. Hacer clic en el botón **“Descargar”** de esa factura.
- **Resultado esperado:**
  - El archivo PDF se descarga correctamente.
  - Si la factura aún no ha sido generada, se muestra un mensaje indicando el estado y no se genera un archivo vacío.

---

### Épica 5: Órdenes de trabajo

#### HU8 – Ver estado del vehículo en el proceso de servicio

**CP-008 – Consulta de estado de orden de trabajo por parte del cliente**

- **Tipo:** Funcional / Usabilidad  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Cliente autenticado.
  - Orden de trabajo asociada al cliente con un estado válido (Recibido, Diagnóstico, etc.).
- **Pasos de ejecución:**
  1. Ingresar al portal como cliente.
  2. Navegar a **“Mis órdenes de trabajo”**.
  3. Seleccionar un vehículo u orden específica.
- **Resultado esperado:**
  - Se muestra el estado actual del vehículo con claridad.
  - Solo se visualizan las órdenes asociadas al cliente autenticado.
  - Si no hay órdenes, se muestra un mensaje de estado vacío.

---

#### HU9 – Actualizar estado del vehículo en el proceso de reparación

**CP-009 – Actualización del estado de orden de trabajo por mecánico**

- **Tipo:** Funcional / Seguridad (autorización)  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Usuario autenticado con rol *mecánico* o *administrador*.
  - Orden de trabajo existente.
- **Pasos de ejecución:**
  1. Ingresar como mecánico/administrador.
  2. Abrir una orden de trabajo en curso.
  3. Cambiar el estado (por ejemplo, de *En reparación* a *Listo*).
  4. Guardar los cambios.
- **Resultado esperado:**
  - Solo el personal autorizado puede modificar el estado.
  - Se registra fecha, hora y usuario que realizó el cambio.
  - El nuevo estado se refleja inmediatamente en la vista del cliente.

---

### Épica 6: Acceso por credenciales

#### HU10 – Iniciar sesión con correo y contraseña

**CP-010 – Inicio de sesión exitoso**

- **Tipo:** Funcional / Seguridad  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Usuario registrado con correo y contraseña válidos.
- **Pasos de ejecución:**
  1. Navegar a la pantalla de inicio de sesión.
  2. Ingresar correo y contraseña válidos.
  3. Hacer clic en **“Iniciar sesión”**.
- **Resultado esperado:**
  - Se crea una sesión o token válido.
  - El sistema redirige al panel correspondiente al rol del usuario.
  - No se muestran mensajes que revelen si el correo existe cuando las credenciales son incorrectas.

---

#### HU11 – Cerrar sesión

**CP-011 – Cierre de sesión y protección de vistas protegidas**

- **Tipo:** Funcional / Seguridad  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Usuario autenticado y navegando en una vista protegida.
- **Pasos de ejecución:**
  1. Abrir el menú del usuario.
  2. Seleccionar la opción **“Cerrar sesión”**.
  3. Intentar volver con el botón “Atrás” del navegador.
- **Resultado esperado:**
  - La sesión/token se invalida.
  - El usuario es redirigido a la pantalla de login.
  - No es posible volver a vistas protegidas con el botón “Atrás”.

---

#### HU12 – Control de acceso por roles

**CP-012 – Restricción de funcionalidades según rol**

- **Tipo:** Funcional / Seguridad (autorización)  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Existen usuarios con roles: cliente, mecánico y administrador.
- **Pasos de ejecución:**
  1. Iniciar sesión como cliente y revisar el menú y las vistas disponibles.
  2. Iniciar sesión como mecánico y comparar las opciones disponibles.
  3. Iniciar sesión como administrador y revisar permisos (gestión general).
- **Resultado esperado:**
  - Cada rol solo puede acceder a sus pantallas y funcionalidades permitidas.
  - Endpoints protegidos requieren autenticación.
  - Las opciones de menú se adaptan correctamente al rol.

---

### Épica 7: Panel de vehículo

#### HU13 – Ver listado de mis vehículos

**CP-013 – Listado de vehículos del cliente**

- **Tipo:** Funcional  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Cliente autenticado con al menos un vehículo registrado.
- **Pasos de ejecución:**
  1. Navegar a la sección **“Mis vehículos”**.
- **Resultado esperado:**
  - Se muestra una tabla o tarjetas con placa, VIN, marca, modelo (y estado opcional).
  - Solo se listan los vehículos asociados al cliente autenticado.
  - Si no hay vehículos, se muestra un mensaje de “sin vehículos registrados”.

---

#### HU14 – Buscar y filtrar vehículos

**CP-014 – Búsqueda y filtro de vehículos por placa/VIN y marca**

- **Tipo:** Funcional / Usabilidad  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Cliente con varios vehículos registrados de distintas marcas.
- **Pasos de ejecución:**
  1. Ingresar texto en la barra de búsqueda por placa o VIN.
  2. Aplicar filtro por marca.
- **Resultado esperado:**
  - Los resultados se actualizan en tiempo real.
  - Solo se muestran los vehículos que coinciden con la búsqueda y filtros.

---

#### HU15 – Ver detalle de vehículo

**CP-015 – Consulta de ficha de vehículo**

- **Tipo:** Funcional  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Vehículo existente asociado al cliente.
- **Pasos de ejecución:**
  1. Desde el listado de vehículos, seleccionar uno.
- **Resultado esperado:**
  - Se muestra una ficha con datos completos (año, color, historial básico, etc.).
  - La ficha incluye enlaces a “Órdenes de trabajo” y “Cotizaciones” del mismo vehículo y cliente.

---

#### HU16 – Edición de vehículo

**CP-016 – Registro/edición de datos de vehículo**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Usuario autenticado con rol autorizado (administrador o personal autorizado).
- **Pasos de ejecución:**
  1. Ingresar como administrador.
  2. Crear un nuevo vehículo llenando los campos obligatorios (placa, VIN, marca, modelo).
  3. Guardar y verificar que aparezca en el panel del cliente.
  4. Editar alguno de los datos y guardar de nuevo.
- **Resultado esperado:**
  - Se valida que placa y VIN sean únicos por cliente.
  - Los cambios se reflejan inmediatamente en el panel del cliente.
  - El cliente no puede editar, solo visualizar.

---

### Épica 8: Cotizaciones

#### HU17 – Gestión de cotizaciones

**CP-017 – Listado y descarga básica de cotizaciones**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Cliente autenticado con al menos una cotización registrada.
- **Pasos de ejecución:**
  1. Navegar a la sección **“Cotizaciones”**.
  2. Verificar la tabla con número de cotización, fecha, vehículo, estado y total.
  3. Descargar una cotización activa en PDF (si la opción existe).
- **Resultado esperado:**
  - Solo se muestran cotizaciones asociadas al cliente autenticado.
  - Las cotizaciones activas se pueden descargar correctamente.
  - Si no hay cotizaciones, se muestra un estado vacío.

---

#### HU18 – Filtrar y buscar cotizaciones

**CP-018 – Filtro de cotizaciones por vehículo y estado**

- **Tipo:** Funcional / Usabilidad  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Cotizaciones en distintos estados: Pendiente, Aprobada, Rechazada.
- **Pasos de ejecución:**
  1. Usar la barra de búsqueda por placa/VIN del vehículo.
  2. Aplicar filtro por estado (ej. solo *Pendiente*).
- **Resultado esperado:**
  - La tabla se actualiza mostrando únicamente las cotizaciones que coinciden.
  - Búsqueda y filtros pueden combinarse sin errores.

---

### Épica 9: Facturas y comprobantes

#### HU19 – Consulta de facturas

**CP-019 – Listado de facturas para el cliente**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Cliente con facturas generadas.
- **Pasos de ejecución:**
  1. Ingresar como cliente.
  2. Navegar a la sección **“Facturas”**.
- **Resultado esperado:**
  - Se muestra una tabla con número de factura, fecha, vehículo, total y estado (pagada/pendiente).
  - Solo se listan las facturas del cliente autenticado.
  - Si no existen facturas, se muestra un estado vacío.

---

#### HU20 – Descargar factura en PDF

**CP-020 – Descarga de factura desde listado**

- **Tipo:** Funcional  
- **Prioridad:** 🔴 Alta  
- **Precondiciones:**
  - Factura existente y generada.
- **Pasos de ejecución:**
  1. En el listado de facturas, localizar una factura específica.
  2. Hacer clic en **“Descargar PDF”**.
- **Resultado esperado:**
  - El archivo se descarga en formato PDF.
  - Contiene datos de cliente, vehículo, subtotal, total y número correlativo.
  - Si la factura no se ha generado, se muestra un mensaje informando el estado.

---

### Épica 10: Evidencia de las reparaciones

#### HU21 – Capturar foto antes de la reparación

**CP-021 – Registro de foto “antes” de la reparación**

- **Tipo:** Funcional / Usabilidad  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Orden de reparación abierta.
  - Usuario autenticado como técnico.
- **Pasos de ejecución:**
  1. Abrir la orden de trabajo.
  2. Seleccionar la opción **“Agregar foto antes”**.
  3. Tomar una foto con la cámara o adjuntar desde archivos.
  4. Guardar.
- **Resultado esperado:**
  - La foto queda asociada a la orden con fecha y usuario.
  - Si no se ha cargado foto, el sistema puede mostrar un aviso de “sin evidencia inicial”.

---

#### HU22 – Capturar foto después de la reparación

**CP-022 – Registro de foto “después” de la reparación**

- **Tipo:** Funcional  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Trabajo de reparación finalizado.
  - Orden de trabajo activa.
- **Pasos de ejecución:**
  1. Abrir la orden de trabajo correspondiente.
  2. Seleccionar **“Agregar foto después”**.
  3. Subir la fotografía del vehículo reparado.
- **Resultado esperado:**
  - La foto se asocia a la misma orden donde está la foto “antes” (si existe).
  - Se guarda fecha y usuario que subió la foto.
  - Si no hay foto “antes”, el sistema permite subir la “después” pero muestra mensaje indicando que falta evidencia inicial.

---

### Épica 11: Recordatorios y comunicaciones

#### HU23 – Enviar recordatorio de mantenimiento

**CP-023 – Generación de recordatorio de mantenimiento**

- **Tipo:** Funcional / Integración (tareas programadas)  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Orden de servicio con fecha de próximo mantenimiento registrada.
- **Pasos de ejecución:**
  1. Registrar o verificar la fecha de “próximo servicio” en la orden.
  2. Simular o esperar la fecha de recordatorio (ej. un día antes).
  3. Revisar el correo del cliente o los mensajes internos.
- **Resultado esperado:**
  - El sistema genera un aviso al cliente en la fecha establecida.
  - El mensaje incluye número de orden, vehículo y fecha sugerida.
  - Si la orden está cerrada o anulada, no se envía recordatorio.

---

#### HU24 – Agregar comentarios internos por orden de trabajo

**CP-024 – Registro de comentarios internos en orden de trabajo**

- **Tipo:** Funcional / Usabilidad  
- **Prioridad:** 🟡 Media  
- **Precondiciones:**
  - Orden de trabajo activa.
  - Usuario autenticado como técnico.
- **Pasos de ejecución:**
  1. Abrir la orden de trabajo.
  2. Ir a la sección de comentarios/notas.
  3. Escribir un comentario y guardarlo.
  4. Intentar guardar un comentario vacío.
- **Resultado esperado:**
  - Cada comentario se guarda con usuario, fecha y contenido en orden cronológico.
  - El sistema no permite guardar comentarios vacíos.

---

## 📊 3. Matriz de Trazabilidad (HU – Casos de prueba)

| Historia de Usuario | Caso(s) de Prueba | Tipo principal       | Prioridad |
|---------------------|-------------------|----------------------|-----------|
| HU1                 | CP-001            | Funcional            | Alta      |
| HU2                 | CP-002            | Funcional            | Alta      |
| HU3                 | CP-003            | Funcional            | Alta      |
| HU4                 | CP-004            | Funcional            | Alta      |
| HU5                 | CP-005            | Funcional/Integración| Alta      |
| HU6                 | CP-006            | Funcional            | Alta      |
| HU7                 | CP-007            | Funcional            | Media     |
| HU8                 | CP-008            | Funcional/Usabilidad | Alta      |
| HU9                 | CP-009            | Funcional/Seguridad  | Alta      |
| HU10                | CP-010            | Funcional/Seguridad  | Alta      |
| HU11                | CP-011            | Funcional/Seguridad  | Alta      |
| HU12                | CP-012            | Funcional/Seguridad  | Alta      |
| HU13                | CP-013            | Funcional            | Media     |
| HU14                | CP-014            | Funcional/Usabilidad | Media     |
| HU15                | CP-015            | Funcional            | Media     |
| HU16                | CP-016            | Funcional            | Alta      |
| HU17                | CP-017            | Funcional            | Alta      |
| HU18                | CP-018            | Funcional/Usabilidad | Media     |
| HU19                | CP-019            | Funcional            | Alta      |
| HU20                | CP-020            | Funcional            | Alta      |
| HU21                | CP-021            | Funcional/Usabilidad | Media     |
| HU22                | CP-022            | Funcional            | Media     |
| HU23                | CP-023            | Funcional/Integración| Media     |
| HU24                | CP-024            | Funcional/Usabilidad | Media     |

---

## ✅ 4. Criterios del Plan

### Criterios de entrada
- Ambiente de pruebas configurado (backend, frontend y base de datos).
- Historias de usuario implementadas en un entorno accesible.
- Datos de prueba mínimos creados (usuarios, vehículos, repuestos, cotizaciones).
- Casos de prueba revisados por el equipo.

### Criterios de salida
- 100% de los casos de prueba del plan ejecutados al menos una vez.
- 0 defectos críticos abiertos.
- Defectos medios o bajos documentados y planificados para corrección.
- Evidencia de ejecución almacenada (capturas/logs si el docente lo requiere).

### Criterios de suspensión
- Fallas críticas que bloqueen el login o la navegación principal.
- Caída del ambiente de pruebas o errores constantes de conexión a la base de datos.

### Criterios de reanudación
- Defectos bloqueantes corregidos.
- Ambiente restablecido y verificado.

---

## 🛠 5. Recursos

- **Equipo:**  
  - 1 Líder de pruebas (coordina ejecución y reporte).  
  - 1–2 testers (pueden ser miembros del mismo equipo de desarrollo).

- **Herramientas sugeridas:**  
  - Navegador web (Chrome/Firefox).  
  - Postman/Insomnia para pruebas de API.  
  - Hojas de cálculo o tablero (Jira/Trello) para registrar resultados y defectos.

---

## 📅 6. Cronograma general (sugerido)

- **Día 1:** Pruebas de acceso, panel de vehículos y cotizaciones (HU1–HU4, HU10–HU18).  
- **Día 2:** Pruebas de órdenes de trabajo, facturas y evidencias (HU5–HU9, HU19–HU22).  
- **Día 3:** Pruebas de recordatorios y comentarios internos (HU23–HU24) + re-ejecución de casos fallidos.  

---

## 📝 7. Conclusión

La ejecución de este plan de pruebas permitirá validar los flujos principales de **AutoCare Manager** sin necesidad de documentar resultados en este documento, cumpliendo el requisito docente de contar al menos con un caso de prueba por cada historia de usuario y una planificación clara de qué se va a probar y qué se espera que ocurra.
