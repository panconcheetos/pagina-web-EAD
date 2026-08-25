# Educacion a Distancia 

## Tecnólogias utilizadas
- HTML5
- CSS3
- JavaScript(Vanilla)
No se utilizaron librerias externas ni frameworks

## Estructura del proyecto
Archivos :
- "index.html": estructura completa de la landing, secciones, navegacion, modales y metadatos
- "css/styles.css": estilos globales, componentes, layout responsive, animaciones y estilos de modales
- "js/main.js": interacciones de UI (menú movil, scroll suave, reveal, carrusel, modales y validaciones)
- "assets/": recursos (imagenes, videos, logos y catalogo de cursos en PDF)

## Funcionalidades principales
- Hero principal con video
- Sección informativa de presentación (quienes somos, diferenciadores, propuesta)
- Catalogo de cursos en formato carrusel, con apertura de modal de video por curso
- Modal de contacto con formulario 
- Navegacion responsive (menú desktop y menú para móvil)
- Animaciones de entrada mediante "IntersectionObserver"

## Formulario de contacto !(IMPORTANTE)
- El formulario esta completamente implementado a nivel frontend
- Incluye validaciones básicas (campos obligatorios, formato de correo, validacion simple de telefono, mensajes de estado y estados de envío)
- Actualmente NO esta conectado a una API ni base de datos
- Esta preparado para integrarse con backend mediante el endpoint "/api/contacto"

El proyecto es compatible con despliegue en GitHub Pages o cualquier servidor web

## Pendientes
- Conectar el formulario de contacto a un backend 
- Integración de base de datos (si requieren)
- Configuración de despliegue en dominio final

