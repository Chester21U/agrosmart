export const DATOS = {
  "equipo": [
    { "nombre": "Abraham Bladimir Umanzor Vásquez", "foto": "img/equipo/abraham.webp" },
    { "nombre": "Andy Jhoan Navarrete Ramos", "foto": "img/equipo/andy.webp" },
    { "nombre": "Freddy Samuel Vásquez Álvarez", "foto": "img/equipo/freddy.webp" },
    { "nombre": "Héctor Eduardo Contreras Romero", "foto": "img/equipo/hector.webp" },
    { "nombre": "Michaell Daniel Chavarria Romero", "foto": "img/equipo/michaell.webp" }
  ],
  "mensajes": {
    "telemetria": {
      "de": "nodemcu",
      "a": "nodered",
      "tema": "agrosmart/nodo1/telemetria",
      "carga": {
        "t": 30.5,
        "ha": 59,
        "hs": 40,
        "bomba": false,
        "modo": "auto",
        "bloqueo": false
      },
      "texto": "El NodeMCU publica sus lecturas cada 2 segundos."
    },
    "bomba": {
      "de": "nodered",
      "a": "nodemcu",
      "tema": "agrosmart/nodo1/bomba",
      "carga": "on",
      "texto": "Clic en «Encender bomba»: Node-RED publica la orden y el NodeMCU activa el relé."
    },
    "modo": {
      "de": "nodered",
      "a": "nodemcu",
      "tema": "agrosmart/nodo1/modo",
      "carga": "auto",
      "texto": "El interruptor del dashboard cambia el modo de riego."
    },
    "alarma": {
      "de": "nodemcu",
      "a": "nodered",
      "tema": "agrosmart/nodo1/alarma",
      "carga": "anti_inundacion",
      "texto": "La bomba llegó a 10 segundos y se cortó sola: aviso de protección."
    },
    "ia": {
      "de": "vision",
      "a": "nodered",
      "tema": "agrosmart/ia/estado",
      "carga": {
        "clase": "plaga",
        "conf": 0.97,
        "alerta": true
      },
      "texto": "La visión artificial reporta el estado de la hoja cada segundo."
    }
  },
  "laminas": [
    "Portada",
    "El problema",
    "Nuestra solución",
    "¿Cómo funciona?",
    "Red propia sin internet",
    "Mensajes con MQTT",
    "Riego con histéresis",
    "Protecciones del riego",
    "Visión artificial",
    "Así decide la IA",
    "Entrenamiento del modelo",
    "Dashboard",
    "Cableado",
    "Componentes",
    "La maqueta",
    "En números",
    "Escalabilidad",
    "¿Preguntas?"
  ],
  "quiz": [
    {
      "p": "¿A qué humedad del suelo se enciende la bomba en modo automático?",
      "o": [
        "Bajo 10 %",
        "Bajo 30 %",
        "Bajo 60 %",
        "Bajo 85 %"
      ],
      "c": 1,
      "e": "Enciende bajo 30 % y apaga al llegar a 60 %: eso es la histéresis."
    },
    {
      "p": "¿Cuánto tiempo máximo puede estar encendida la bomba seguida?",
      "o": [
        "5 segundos",
        "10 segundos",
        "60 segundos",
        "Sin límite"
      ],
      "c": 1,
      "e": "La protección anti-inundación la corta a los 10 segundos."
    },
    {
      "p": "¿Qué equipo crea la red Wi-Fi AgroSmart?",
      "o": [
        "Un router de internet",
        "El NodeMCU",
        "La Raspberry Pi",
        "El celular"
      ],
      "c": 2,
      "e": "La Raspberry Pi funciona como punto de acceso con la IP 10.42.0.1."
    },
    {
      "p": "¿Qué protocolo usan para comunicarse los equipos?",
      "o": [
        "Bluetooth",
        "MQTT",
        "FTP",
        "Correo electrónico"
      ],
      "c": 1,
      "e": "MQTT: publican y se suscriben a temas a través del broker Mosquitto."
    },
    {
      "p": "¿Qué necesita la IA para disparar la alarma de plaga?",
      "o": [
        "Una sola imagen con plaga",
        "Plaga ≥ 85 % durante 5 segundos",
        "Que el usuario presione un botón",
        "Internet"
      ],
      "c": 1,
      "e": "La regla evita falsas alarmas por un reflejo o un movimiento."
    },
    {
      "p": "¿Para qué sirve el diodo 1N4148 junto a la bomba?",
      "o": [
        "Encender un LED",
        "Medir la humedad",
        "Absorber el pico de voltaje del motor",
        "Conectarse al Wi-Fi"
      ],
      "c": 2,
      "e": "Es un diodo de rueda libre: protege el circuito cuando el motor se apaga."
    },
    {
      "p": "¿Qué pasa si la bomba se corta por tiempo 3 veces seguidas?",
      "o": [
        "Se apaga la Raspberry Pi",
        "Se bloquea el riego por posible depósito vacío",
        "Riega sin parar",
        "Cambia a modo manual"
      ],
      "c": 1,
      "e": "Se bloquea para no quemar la bomba trabajando en seco."
    }
  ],
  "faq": [
    {
      "categoria": "General",
      "pregunta": "¿Qué problema resuelve AgroSmart?",
      "respuesta": "Dos problemas del agricultor: el desperdicio de agua por regar sin medir y la detección tardía de plagas. Y lo hace sin internet, que es la realidad de muchas zonas rurales."
    },
    {
      "categoria": "General",
      "pregunta": "¿Por qué se llama «inteligente»?",
      "respuesta": "Porque toma decisiones solo: decide cuándo regar según la humedad real del suelo, y usa inteligencia artificial para reconocer hojas enfermas y avisar."
    },
    {
      "categoria": "General",
      "pregunta": "¿A quién va dirigido?",
      "respuesta": "A pequeños productores, huertos escolares, viveros e invernaderos pequeños que no pueden pagar sistemas comerciales caros."
    },
    {
      "categoria": "General",
      "pregunta": "¿Qué lo hace diferente de un temporizador de riego?",
      "respuesta": "El temporizador riega a la misma hora aunque haya llovido. AgroSmart riega solo cuando el suelo lo necesita, se detiene al llegar a la humedad correcta y además vigila la salud de las hojas."
    },
    {
      "categoria": "General",
      "pregunta": "¿Funciona con cualquier planta?",
      "respuesta": "El riego sí, solo hay que ajustar los límites de 30 % y 60 % según el cultivo. La IA hay que entrenarla con fotos de la planta y de las enfermedades que se quieran detectar."
    },
    {
      "categoria": "General",
      "pregunta": "¿Cuánto cuesta?",
      "respuesta": "Es de bajo costo porque usa placas de uso general: un NodeMCU, sensores sencillos y una Raspberry Pi. Un sistema comercial de riego con monitoreo cuesta mucho más."
    },
    {
      "categoria": "General",
      "pregunta": "¿Qué pasa si se va la luz?",
      "respuesta": "Al volver la energía, el NodeMCU se reconecta solo al Wi-Fi y al broker, y el relé siempre arranca apagado por seguridad. La Pi vuelve a levantar su red y sus servicios al encender."
    },
    {
      "categoria": "General",
      "pregunta": "¿Qué lenguajes usaron?",
      "respuesta": "C++ (framework Arduino) para el NodeMCU, Python para la visión artificial y Node-RED (programación visual sobre JavaScript) para el dashboard."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Por qué no usan internet?",
      "respuesta": "Por autonomía: el sistema debe funcionar en el campo, donde muchas veces no hay señal. También es más seguro y no depende de servicios pagados."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Cómo se comunica el NodeMCU con la Raspberry Pi?",
      "respuesta": "Por Wi-Fi, en la red AgroSmart que crea la Pi, usando el protocolo MQTT. El NodeMCU publica sus datos en el broker Mosquitto de la Pi."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué es un punto de acceso?",
      "respuesta": "Un equipo que crea una red inalámbrica a la que otros se conectan. Aquí la Raspberry Pi hace de punto de acceso, como si fuera el router."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué es DHCP?",
      "respuesta": "El servicio que reparte direcciones IP automáticamente. La Pi le da a cada equipo una IP 10.42.0.x al conectarse."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Por qué la IP de la Pi es 10.42.0.1?",
      "respuesta": "Es la dirección que NetworkManager asigna por defecto cuando la Pi comparte su conexión como punto de acceso. Es una red privada que no choca con internet."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué es MQTT?",
      "respuesta": "Un protocolo de mensajes ligero para IoT basado en publicar y suscribirse a temas, con un intermediario llamado broker que reparte los mensajes."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué es un broker?",
      "respuesta": "El servidor que recibe todos los mensajes MQTT y los entrega a quienes están suscritos a cada tema. Usamos Mosquitto en el puerto 1883."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué es un tema (topic)?",
      "respuesta": "Una «dirección» para los mensajes, con forma de ruta, por ejemplo agrosmart/nodo1/telemetria. Sirve para ordenar quién manda qué."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué pasa si el Wi-Fi se cae?",
      "respuesta": "El NodeMCU sigue regando solo con su lógica, porque la decisión del riego está en él, no en la Pi. Mientras tanto reintenta conectarse cada 30 s al Wi-Fi y cada 5 s al broker."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué alcance tiene la red?",
      "respuesta": "El de un Wi-Fi normal de 2.4 GHz, unas decenas de metros con obstáculos. Para más distancia se usaría ESP-NOW, LoRa o repetidores."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Es segura la red?",
      "respuesta": "Usa WPA2 con contraseña. El broker no pide usuario porque solo es accesible dentro de esa red cerrada; como mejora se le pueden poner usuarios y cifrado TLS."
    },
    {
      "categoria": "Red y comunicación",
      "pregunta": "¿Qué es JSON?",
      "respuesta": "Un formato de texto para enviar datos ordenados como pares nombre-valor, por ejemplo {\"t\":30.5}. Lo entienden casi todos los lenguajes."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Qué es un relé y por qué lo usan?",
      "respuesta": "Un interruptor que se acciona con una señal eléctrica pequeña. El pin del NodeMCU no puede dar la corriente que necesita la bomba, así que el pin activa el relé y el relé conecta la bomba."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Para qué sirve el diodo 1N4148?",
      "respuesta": "Es un diodo de rueda libre. El motor de la bomba es una bobina, y al apagarse genera un pico de voltaje inverso. El diodo le da un camino a esa energía para que no reinicie el NodeMCU ni dañe los contactos."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Por qué el diodo va «al revés»?",
      "respuesta": "Porque en funcionamiento normal no debe conducir: la raya (cátodo) va al positivo. Solo conduce cuando aparece el pico inverso al apagar la bomba. Si se pone al revés, haría un cortocircuito."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Por qué sensor capacitivo y no resistivo?",
      "respuesta": "El resistivo tiene dos patas metálicas que se oxidan en semanas por la corriente en la tierra húmeda. El capacitivo tiene las pistas cubiertas, mide por capacitancia y dura mucho más."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Por qué la lectura del suelo baja cuando hay más agua?",
      "respuesta": "Así está diseñado ese sensor: más humedad, mayor capacitancia y menor voltaje de salida. Por eso la calibración va de 784 (seco) a 298 (mojado)."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Qué precisión tiene el DHT11?",
      "respuesta": "Temperatura ±2 °C y humedad ±5 %. Es suficiente para un prototipo; para mayor precisión se puede cambiar por un DHT22 o BME280 sin cambiar la arquitectura."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Cuál es la diferencia entre zumbador activo y pasivo?",
      "respuesta": "El activo suena solo con aplicarle voltaje. El pasivo necesita una señal oscilante (PWM) y permite elegir el tono. Usamos uno pasivo con 3500 y 4500 Hz para que suene como sirena."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Qué es PWM?",
      "respuesta": "Modulación por ancho de pulso: encender y apagar un pin muy rápido. En el zumbador, la frecuencia de esa señal define el tono."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Por qué una resistencia con el LED?",
      "respuesta": "Para limitar la corriente. Sin ella, el LED pediría demasiada corriente y se quemaría, o dañaría el pin de la Pi."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿De dónde sale la energía de la bomba?",
      "respuesta": "Del pin VU del NodeMCU, que entrega los 5 V que llegan por el USB. Pasa por el contacto COM-NO del relé hasta la bomba."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Por qué todas las tierras van juntas?",
      "respuesta": "Para que los voltajes tengan la misma referencia. Si el relé y el NodeMCU no compartieran GND, la señal de control no funcionaría bien."
    },
    {
      "categoria": "Electrónica",
      "pregunta": "¿Qué es un GPIO?",
      "respuesta": "Pin de entrada/salida de propósito general. En la Pi los usamos como salida para encender el LED (GPIO20) y el zumbador (GPIO21)."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Qué es la histéresis?",
      "respuesta": "Usar dos límites distintos para encender y apagar. Enciende bajo 30 % y apaga en 60 %. Evita que la bomba se prenda y apague a cada rato cerca de un solo valor."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Por qué 30 % y 60 %?",
      "respuesta": "Son valores de referencia para tierra de maceta: bajo 30 % la planta empieza a sufrir y sobre 60 % ya está bien regada. Son constantes en el código y se ajustan por cultivo."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Para qué el límite de 10 segundos?",
      "respuesta": "Para evitar inundaciones si algo falla, por ejemplo si el sensor se sale de la tierra o se daña: aunque crea que el suelo está seco, la bomba nunca trabaja más de 10 s seguidos."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Para qué esperar 60 segundos?",
      "respuesta": "El agua tarda en filtrarse. Si se volviera a medir enseguida, el sensor aún vería seco y regaría de más."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Cómo sabe que el tanque está vacío?",
      "respuesta": "No lo mide directamente: lo deduce. Si la bomba se corta 3 veces seguidas por tiempo y la tierra no se humedece, probablemente no está saliendo agua. Entonces bloquea el riego para no dañar la bomba en seco."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Qué pasa en modo manual?",
      "respuesta": "El riego automático se detiene y solo se riega con los botones del dashboard. El tope de 10 segundos sigue activo por seguridad."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Por qué no usan delay()?",
      "respuesta": "Porque delay() detiene todo el programa. Con millis() el NodeMCU puede leer sensores, controlar el riego y atender la red al mismo tiempo sin trabarse."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Dónde se toma la decisión de regar, en la Pi o en el NodeMCU?",
      "respuesta": "En el NodeMCU. Así el riego sigue funcionando aunque la Pi se apague o se caiga la red. La Pi solo muestra datos y manda órdenes manuales."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Cada cuánto manda datos?",
      "respuesta": "Cada 2 segundos lee los sensores y publica la telemetría."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Cómo calibraron el sensor de suelo?",
      "respuesta": "Midiendo el valor crudo con el sensor al aire (784) y dentro de agua (298), y convirtiendo con una regla de tres a porcentaje de 0 a 100."
    },
    {
      "categoria": "Firmware y riego",
      "pregunta": "¿Qué es PlatformIO?",
      "respuesta": "Un entorno de desarrollo para microcontroladores que se usa dentro de VS Code. Maneja las librerías y compila y sube el programa al NodeMCU."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué modelo de IA usan?",
      "respuesta": "YOLO11n-cls de Ultralytics: la versión nano de YOLO11 para clasificación de imágenes, con unos 1.5 millones de parámetros."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué significa YOLO?",
      "respuesta": "«You Only Look Once»: la imagen se analiza en una sola pasada por la red neuronal, por eso es rápido."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué clases reconoce?",
      "respuesta": "Tres: sana, plaga y fondo. Fondo es cuando no hay hoja, para que no invente un resultado viendo la mesa o a una persona."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Cómo lo entrenaron?",
      "respuesta": "En Google Colab con una GPU Tesla T4, durante 30 épocas, con fotos propias tomadas por la misma cámara del sistema: 100 de hoja sana, 100 de hoja con plaga y 60 de fondo."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué es una época?",
      "respuesta": "Una pasada completa por todas las fotos de entrenamiento. Con 30 épocas el modelo vio cada foto 30 veces, ajustándose un poco cada vez."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Por qué no usaron solo fotos de internet?",
      "respuesta": "Lo intentamos con 1200 fotos del dataset PlantVillage, pero en vivo dudaba porque esas fotos tienen fondo gris y hojas sueltas. Entrenar con fotos de nuestra propia cámara fue lo que funcionó."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué precisión tiene?",
      "respuesta": "100 % en las 52 imágenes de validación y casi 100 % de confianza en vivo con las hojas de la maqueta. Aclaramos que la validación es con fotos muy parecidas, así que mide qué tan bien aprendió este caso, no cualquier cultivo."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Por qué 85 % y 5 segundos?",
      "respuesta": "Para evitar falsas alarmas. Una sola imagen puede equivocarse por un reflejo o movimiento; exigir 85 % sostenido durante 5 s asegura que de verdad se está viendo una hoja enferma."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿La IA corre en internet?",
      "respuesta": "No. El modelo corre dentro de la Raspberry Pi. Solo usamos Colab una vez para entrenarlo; después se copió el archivo a la Pi."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué es ONNX?",
      "respuesta": "Un formato estándar para guardar modelos de IA. Nos permite entrenar con PyTorch en Colab y ejecutarlo en la Pi con OpenCV, sin instalar PyTorch."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Qué es OpenCV?",
      "respuesta": "Una librería de visión por computadora. La usamos para leer la cámara, recortar la imagen, ejecutar el modelo y dibujar la etiqueta sobre el video."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Por qué clasificación y no detección?",
      "respuesta": "La detección busca y encierra cada objeto en una caja; es más pesada. Para saber si la hoja enfocada está sana o no, basta clasificar, y en una Pi 3 es mucho más rápido."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Cómo detectaría una plaga real?",
      "respuesta": "Igual: con fotos reales de esa plaga. Se toman cientos de fotos de hojas afectadas y sanas, se reentrena el modelo y se copia el nuevo archivo a la Pi. El resto del sistema no cambia."
    },
    {
      "categoria": "Inteligencia artificial",
      "pregunta": "¿Por qué promedian 5 lecturas?",
      "respuesta": "Para suavizar: si una lectura sale rara por una sombra, el promedio evita que el resultado salte de sana a plaga y de regreso."
    },
    {
      "categoria": "Dashboard",
      "pregunta": "¿Qué es Node-RED?",
      "respuesta": "Una herramienta de programación visual por flujos, muy usada en IoT. Se conectan nodos para recibir MQTT, transformar datos y mostrarlos en un dashboard web."
    },
    {
      "categoria": "Dashboard",
      "pregunta": "¿Desde dónde se puede ver el dashboard?",
      "respuesta": "Desde cualquier navegador conectado a la red AgroSmart: laptop, celular o tablet, en http://10.42.0.1:1880/dashboard."
    },
    {
      "categoria": "Dashboard",
      "pregunta": "¿El dashboard guarda los datos?",
      "respuesta": "Muestra los últimos 30 minutos en la gráfica. Para guardar historial largo se agregaría una base de datos; es una de las mejoras propuestas."
    },
    {
      "categoria": "Dashboard",
      "pregunta": "¿Qué pasa si dos personas cambian el modo a la vez?",
      "respuesta": "Gana la última orden. El interruptor siempre muestra el modo real que reporta el NodeMCU, así nadie ve un estado falso."
    },
    {
      "categoria": "Dashboard",
      "pregunta": "¿Cómo llega el video al dashboard?",
      "respuesta": "El script de visión sirve el video en MJPEG en el puerto 8081 y el dashboard lo muestra dentro de un recuadro."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "Esto ya existe comercialmente, ¿qué aportan?",
      "respuesta": "Los sistemas comerciales son caros y casi siempre dependen de la nube. Nosotros integramos riego automático, IA para plagas y monitoreo en un sistema de bajo costo que funciona totalmente sin internet."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "Si la IA se equivoca, ¿qué pasa?",
      "respuesta": "Lo peor que pasa es una falsa alarma o una alerta tardía; el riego no depende de la IA. Además usamos tres capas contra errores: clase fondo, promedio de 5 lecturas y la regla de 85 % durante 5 s."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Por qué no usar solo un Arduino?",
      "respuesta": "Un Arduino no tiene Wi-Fi ni potencia para IA. El ESP8266 trae Wi-Fi integrado y la Raspberry Pi permite correr el modelo de visión y el dashboard."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Por qué Raspberry Pi 3 y no una más nueva?",
      "respuesta": "Era el equipo disponible y demuestra que el sistema corre en hardware modesto. Con una Pi 4 o 5 el modelo iría más rápido, sin cambiar el código."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "La hoja «con plaga» es una hoja seca, ¿eso es una plaga?",
      "respuesta": "Para la maqueta representa una hoja dañada. El sistema aprende lo que se le enseña; en campo se entrenaría con fotos de la plaga real (roya, mancha bacteriana, ácaros, etc.). El procedimiento es el mismo."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Qué pasa si el sensor de suelo se daña?",
      "respuesta": "Si marca seco por error, la bomba riega máximo 10 s, descansa 60 s y, tras 3 cortes seguidos, se bloquea. Es imposible que inunde la maceta."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Qué pasa si la Raspberry Pi se apaga?",
      "respuesta": "El NodeMCU sigue regando de forma autónoma. Se pierde el dashboard y la IA hasta que la Pi vuelva."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Cuánta energía consume?",
      "respuesta": "Todo funciona a 5 V: el NodeMCU con un cargador de celular y la Pi con una fuente de 2.5 A. Es bajo consumo, apto para un panel solar pequeño."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Cómo lo escalarían a una finca?",
      "respuesta": "Un nodo por zona, cada uno con su tema MQTT (nodo2, nodo3…), con más alcance por ESP-NOW o LoRa, válvulas para cada zona, una Pi central y base de datos para el historial."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿Qué fue lo más difícil?",
      "respuesta": "Entre otras cosas: que la IA funcionara en vivo (lo resolvimos entrenando con fotos de nuestra propia cámara), y que la Pi creara su propia red Wi-Fi estable para el NodeMCU."
    },
    {
      "categoria": "Preguntas difíciles",
      "pregunta": "¿El MQTT sin contraseña no es inseguro?",
      "respuesta": "Dentro de una red cerrada con WPA2, el riesgo es bajo para un prototipo. En producción activaríamos usuarios en Mosquitto y cifrado TLS."
    }
  ]
};
