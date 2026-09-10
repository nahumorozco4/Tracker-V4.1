# Genshin Impact Tracker v5

PWA para GitHub Pages. Incluye:
- ahorro y meta de deseos efectivos;
- pity y garantía;
- cuota diaria;
- pestañas para no saturar la pantalla;
- panel de ingresos por fuente: Diarias, Abismo, Teatro, Estigia, Eventos, Actualización, Livestream, Aniversario, Misiones, Exploración y Otros;
- historial;
- exportar/importar JSON;
- instalación como app;
- funcionamiento offline mediante Service Worker.

## Estructura
index.html
styles.css
app.js
manifest.json
service-worker.js
icons/icon-192.png
icons/icon-512.png

Los ingresos por fuente son un registro/estimación independiente: no se suman automáticamente al saldo para evitar duplicaciones.
