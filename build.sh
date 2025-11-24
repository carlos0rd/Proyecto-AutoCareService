#!/bin/bash
# Script para construir las imágenes Docker del proyecto AutoCareService

echo "========================================"
echo "Construyendo imágenes Docker"
echo "========================================"
echo ""

# Verificar que Docker esté corriendo
echo "Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "✗ Error: Docker no está corriendo"
    echo "Por favor, inicia Docker y vuelve a intentar"
    exit 1
fi

echo "✓ Docker está corriendo"
echo ""

# Construir las imágenes
echo "Construyendo imágenes con docker-compose..."
docker-compose build

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✓ Construcción completada exitosamente"
    echo "========================================"
    echo ""
    echo "Para levantar los contenedores, ejecuta:"
    echo "  docker-compose up -d"
    echo ""
else
    echo ""
    echo "========================================"
    echo "✗ Error en la construcción"
    echo "========================================"
    exit 1
fi

