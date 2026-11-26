# AgroSmart · Sitio informativo

Página web del proyecto **AgroSmart: Monitoreo Agrícola Inteligente**, presentado por el Grupo A1 en la Feria de Hardware y Automatización de la Universidad Gerardo Barrios.

Sitio publicado: **https://chester21u.github.io/agrosmart/**

## Qué incluye

| Sección | Qué hace |
|---|---|
| Inicio | Presentación del proyecto con la ilustración de la maqueta y datos animados |
| El problema | Cifras de la FAO con contadores animados |
| Nuestra solución | Los tres módulos; cada tarjeta abre su pestaña de detalles |
| Cómo funciona | Diagrama de arquitectura ampliable y pestañas por módulo y red local |
| MQTT | Animación de los mensajes viajando por el broker con el tema y la carga reales |
| Simulador de riego | Réplica en JavaScript de la lógica del firmware: histéresis 30/60 %, máximo 10 s, reposo de 60 s y bloqueo tras 3 cortes, con gráfica en `canvas` y registro de eventos |
| Visión artificial | Simulación de la regla de alerta (85 % durante 5 s) con LED y sirena; y prueba del modelo real en el navegador con la cámara del celular o una foto |
| Protecciones y cableado | Diagramas ampliables y tablas de pines |
| Galería | Carrusel con las 18 láminas del stand |
| Video | Se muestra solo cuando existe `video/demo.mp4` |
| Preguntas frecuentes | 73 preguntas con buscador, resaltado y filtro por categoría |
| Quiz | 7 preguntas con retroalimentación y puntaje |
| Equipo | Integrantes del Grupo A1 |

## Estructura

```
agrosmart/
├── index.html            Estructura semántica de toda la página
├── css/estilos.css       Estilos propios sobre Bootstrap
├── js/
│   ├── app.js            Punto de entrada: menú, animaciones, galería, preguntas, quiz y equipo
│   ├── datos.js          Contenido: preguntas, quiz, mensajes MQTT, láminas y equipo
│   ├── mqtt.js           Animación del recorrido de los mensajes
│   ├── riego.js          Simulador del riego con la lógica del firmware
│   └── vision.js         Simulación de la alerta y ejecución del modelo ONNX
├── img/
│   ├── diagramas/        Diagramas en SVG
│   ├── diapositivas/     Láminas del stand en WebP
│   ├── hojas/            Imágenes de ejemplo para la simulación
│   ├── maqueta.webp
│   └── favicon.svg
├── modelo/               agrosmart.onnx y clases.txt (los mismos de la Raspberry Pi)
└── video/                demo.mp4 (opcional)
```

## Tecnologías

- HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `figure`, `footer`) con atributos ARIA.
- CSS3 con variables, animaciones e `IntersectionObserver` para los efectos al desplazarse; respeta `prefers-reduced-motion`.
- Bootstrap 5.3.3 y Bootstrap Icons 1.11.3 desde jsDelivr.
- JavaScript moderno con módulos ES, manipulación del DOM, `canvas`, Web Animations API y Web Audio API.
- ONNX Runtime Web 1.20.1 para ejecutar el modelo YOLO11 dentro del navegador. Se carga solo cuando alguien usa la prueba del modelo.

## Activar la prueba del modelo real

1. Copiar a la carpeta `modelo/` los mismos archivos que usa la Raspberry Pi:
   - `agrosmart.onnx`
   - `clases.txt`
2. Subir los cambios. La sección «Prueba el modelo real» se activa sola.

La imagen se procesa en el dispositivo de quien visita la página; no se envía a ningún servidor.

## Agregar el video de la demostración

1. Grabar la demostración con el celular (horizontal, 30 a 60 segundos).
2. Comprimirlo para que pese menos de 25 MB, por ejemplo:
   ```
   ffmpeg -i original.mp4 -vf scale=1280:-2 -c:v libx264 -preset veryfast -crf 28 -an video/demo.mp4
   ```
3. Guardarlo como `video/demo.mp4` y subir los cambios.

## Probar en la computadora

La página usa módulos de JavaScript, así que necesita un servidor local (no funciona abriendo el archivo con doble clic):

```
python -m http.server 8000
```

Luego abrir `http://localhost:8000`. También sirve la extensión Live Server de VS Code.

## Publicar en GitHub Pages

1. Crear el repositorio público `agrosmart` y subir esta carpeta a la rama `main`.
2. En **Settings → Pages**, elegir **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. En uno o dos minutos queda en `https://chester21u.github.io/agrosmart/`.

## Fuentes

- FAO. *How to overcome water challenges in agriculture*.
- FAO. *Plant Production and Protection*.
- Mohanty, Hughes y Salathé (2016). Dataset PlantVillage.

---

Grupo A1 · Ingeniería en Sistemas y Redes Informáticas · Universidad Gerardo Barrios · 2026
