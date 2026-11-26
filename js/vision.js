const UMBRAL = 0.85;
const SEGUNDOS = 5;
const ESPERA_ALERTA = 20;
const LECTURAS_PROMEDIO = 5;
const ORT_URL = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
const MODELO = "modelo/agrosmart.onnx";
const CLASES = "modelo/clases.txt";

const EJEMPLOS = {
  "sana": { sana: 0.97, plaga: 0.02, fondo: 0.01 },
  "sana-2": { sana: 0.94, plaga: 0.04, fondo: 0.02 },
  "plaga": { sana: 0.04, plaga: 0.95, fondo: 0.01 },
  "plaga-2": { sana: 0.07, plaga: 0.91, fondo: 0.02 },
  "fondo": { sana: 0.03, plaga: 0.05, fondo: 0.92 }
};

const COLORES = { sana: "#4caf50", plaga: "#ff5252", fondo: "#cfd8dc" };

export function iniciarVision() {
  const el = {
    camara: document.getElementById("vis-camara"),
    imagen: document.getElementById("vis-imagen"),
    video: document.getElementById("vis-video"),
    etiqueta: document.getElementById("vis-etiqueta"),
    alerta: document.getElementById("vis-alerta"),
    nota: document.getElementById("vis-nota"),
    ejemplos: document.querySelectorAll("[data-ejemplo]"),
    anillo: document.getElementById("vis-anillo"),
    segundos: document.getElementById("vis-segundos"),
    regla: document.getElementById("vis-regla"),
    led: document.getElementById("vis-led"),
    sonido: document.getElementById("vis-sonido"),
    estadoIA: document.getElementById("ia-estado"),
    btnCamara: document.getElementById("ia-camara"),
    subir: document.getElementById("ia-subir"),
    subirEtiqueta: document.getElementById("ia-subir-etiqueta"),
    detener: document.getElementById("ia-detener")
  };
  if (!el.camara) return;

  const estado = {
    ejemplo: "sana",
    historial: [],
    inicioPlaga: null,
    ultimaAlerta: -Infinity,
    sonando: false,
    audio: null,
    sonidoActivo: false,
    modoReal: false,
    sesion: null,
    clases: [],
    flujo: null,
    corriendo: false,
    visible: false
  };

  function promedio(probs) {
    estado.historial.push(probs);
    if (estado.historial.length > LECTURAS_PROMEDIO) estado.historial.shift();
    const suma = {};
    estado.historial.forEach((p) => Object.entries(p).forEach(([k, v]) => (suma[k] = (suma[k] || 0) + v)));
    Object.keys(suma).forEach((k) => (suma[k] /= estado.historial.length));
    return suma;
  }

  function pintarBarras(probs) {
    document.querySelectorAll(".barra-clase").forEach((fila) => {
      const v = probs[fila.dataset.clase] || 0;
      fila.querySelector(".relleno").style.width = `${(v * 100).toFixed(0)}%`;
      fila.querySelector("b").textContent = `${(v * 100).toFixed(0)} %`;
    });
  }

  function tono(frecuencia, inicio, duracion) {
    const ctx = estado.audio;
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = frecuencia;
    vol.gain.value = 0.04;
    osc.connect(vol).connect(ctx.destination);
    osc.start(ctx.currentTime + inicio);
    osc.stop(ctx.currentTime + inicio + duracion);
  }

  function dispararAlarma() {
    if (estado.sonando) return;
    estado.sonando = true;
    el.led.classList.add("encendido");
    el.camara.classList.add("alerta");
    el.alerta.hidden = false;
    if (estado.sonidoActivo && estado.audio) {
      for (let i = 0; i < 4; i++) {
        tono(4500, i * 0.5, 0.25);
        tono(3500, i * 0.5 + 0.25, 0.25);
      }
    }
    setTimeout(() => {
      el.led.classList.remove("encendido");
      el.camara.classList.remove("alerta");
      el.alerta.hidden = true;
      estado.sonando = false;
    }, 2400);
  }

  function evaluar(probs, ahora, continuo = true) {
    const suave = continuo ? promedio(probs) : probs;
    const [clase, conf] = Object.entries(suave).sort((a, b) => b[1] - a[1])[0];
    pintarBarras(suave);
    el.etiqueta.textContent = `${clase.toUpperCase()} ${(conf * 100).toFixed(0)} %`;
    el.etiqueta.style.color = COLORES[clase] || "#fff";
    if (!continuo) {
      const ok = clase === "plaga" && conf >= UMBRAL;
      el.anillo.style.setProperty("--progreso", ok ? 100 : 0);
      el.segundos.textContent = ok ? "5.0" : "0.0";
      el.regla.textContent = ok ? "Foto con plaga sobre 85 %. En la cámara en vivo se exige mantenerlo 5 segundos." : "Esta foto no cumple la regla de alerta.";
      if (ok) dispararAlarma();
      return;
    }
    if (clase === "plaga" && conf >= UMBRAL) {
      if (estado.inicioPlaga === null) estado.inicioPlaga = ahora;
    } else {
      estado.inicioPlaga = null;
    }
    const transcurrido = estado.inicioPlaga === null ? 0 : Math.min(SEGUNDOS, (ahora - estado.inicioPlaga) / 1000);
    el.anillo.style.setProperty("--progreso", (transcurrido / SEGUNDOS) * 100);
    el.segundos.textContent = transcurrido.toFixed(1);
    if (transcurrido >= SEGUNDOS) {
      el.regla.textContent = "¡Plaga sostenida 5 segundos! Se activan LED, zumbador y aviso al dashboard.";
      if (ahora - estado.ultimaAlerta >= ESPERA_ALERTA * 1000) {
        estado.ultimaAlerta = ahora;
        dispararAlarma();
      }
    } else if (estado.inicioPlaga !== null) {
      el.regla.textContent = `Plaga sobre 85 %: contando ${transcurrido.toFixed(1)} de 5 segundos…`;
    } else {
      el.regla.textContent = clase === "fondo" ? "No hay hoja frente a la cámara." : "La hoja se ve sana. Esperando una hoja con plaga…";
    }
  }

  function ruido(base) {
    const p = {};
    Object.entries(base).forEach(([k, v]) => (p[k] = Math.max(0.001, v + (Math.random() - 0.5) * 0.05)));
    const t = Object.values(p).reduce((a, b) => a + b, 0);
    Object.keys(p).forEach((k) => (p[k] /= t));
    return p;
  }

  setInterval(() => {
    if (estado.modoReal || !estado.visible) return;
    evaluar(ruido(EJEMPLOS[estado.ejemplo]), performance.now());
  }, 250);

  el.ejemplos.forEach((b) =>
    b.addEventListener("click", () => {
      if (estado.modoReal) detenerReal();
      estado.ejemplo = b.dataset.ejemplo;
      estado.historial = [];
      estado.inicioPlaga = null;
      el.ejemplos.forEach((x) => x.classList.toggle("activa", x === b));
      el.imagen.src = `img/hojas/${estado.ejemplo}.webp`;
    })
  );

  el.sonido.addEventListener("click", () => {
    estado.sonidoActivo = !estado.sonidoActivo;
    if (estado.sonidoActivo && !estado.audio) estado.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (estado.audio && estado.audio.state === "suspended") estado.audio.resume();
    el.sonido.setAttribute("aria-pressed", String(estado.sonidoActivo));
    el.sonido.innerHTML = estado.sonidoActivo ? '<i class="bi bi-volume-up-fill"></i> Sonido' : '<i class="bi bi-volume-mute-fill"></i> Sonido';
  });

  new IntersectionObserver((e) => e.forEach((x) => (estado.visible = x.isIntersecting)), { threshold: 0.1 }).observe(document.getElementById("vision"));

  function cargarScript(src) {
    return new Promise((ok, mal) => {
      if (window.ort) return ok();
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = mal;
      document.head.append(s);
    });
  }

  async function prepararSesion() {
    if (estado.sesion) return;
    el.estadoIA.textContent = "Cargando el modelo en tu navegador…";
    await cargarScript(`${ORT_URL}ort.min.js`);
    window.ort.env.wasm.wasmPaths = ORT_URL;
    window.ort.env.wasm.numThreads = 1;
    estado.sesion = await window.ort.InferenceSession.create(MODELO, { executionProviders: ["wasm"] });
    el.estadoIA.textContent = "Modelo cargado. Todo se procesa en tu dispositivo.";
  }

  const lienzo = document.createElement("canvas");
  lienzo.width = 224;
  lienzo.height = 224;
  const lctx = lienzo.getContext("2d", { willReadFrequently: true });

  async function clasificar(fuente, ancho, alto) {
    const lado = Math.min(ancho, alto);
    lctx.drawImage(fuente, (ancho - lado) / 2, (alto - lado) / 2, lado, lado, 0, 0, 224, 224);
    const px = lctx.getImageData(0, 0, 224, 224).data;
    const datos = new Float32Array(3 * 224 * 224);
    const plano = 224 * 224;
    for (let i = 0; i < plano; i++) {
      datos[i] = px[i * 4] / 255;
      datos[plano + i] = px[i * 4 + 1] / 255;
      datos[2 * plano + i] = px[i * 4 + 2] / 255;
    }
    const entrada = new window.ort.Tensor("float32", datos, [1, 3, 224, 224]);
    const salida = await estado.sesion.run({ [estado.sesion.inputNames[0]]: entrada });
    let v = Array.from(salida[estado.sesion.outputNames[0]].data);
    const suma = v.reduce((a, b) => a + b, 0);
    if (Math.min(...v) < 0 || Math.abs(suma - 1) > 0.01) {
      const max = Math.max(...v);
      const ex = v.map((x) => Math.exp(x - max));
      const t = ex.reduce((a, b) => a + b, 0);
      v = ex.map((x) => x / t);
    }
    const probs = {};
    estado.clases.forEach((c, i) => (probs[c] = v[i] || 0));
    return probs;
  }

  function entrarModoReal(texto) {
    estado.modoReal = true;
    estado.historial = [];
    estado.inicioPlaga = null;
    el.ejemplos.forEach((x) => x.classList.remove("activa"));
    el.nota.textContent = texto;
    el.detener.hidden = false;
  }

  function detenerReal() {
    estado.corriendo = false;
    if (estado.flujo) estado.flujo.getTracks().forEach((t) => t.stop());
    estado.flujo = null;
    el.video.hidden = true;
    el.imagen.hidden = false;
    el.detener.hidden = true;
    estado.modoReal = false;
    estado.historial = [];
    el.nota.textContent = "Modo simulación: los porcentajes son de ejemplo. Imágenes del dataset público PlantVillage.";
    el.imagen.src = `img/hojas/${estado.ejemplo}.webp`;
    el.ejemplos.forEach((x) => x.classList.toggle("activa", x.dataset.ejemplo === estado.ejemplo));
  }

  async function bucleCamara() {
    while (estado.corriendo) {
      if (el.video.readyState >= 2) {
        const probs = await clasificar(el.video, el.video.videoWidth, el.video.videoHeight);
        if (!estado.corriendo) break;
        evaluar(probs, performance.now());
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  el.btnCamara.addEventListener("click", async () => {
    try {
      await prepararSesion();
      estado.flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 640 } }, audio: false });
      el.video.srcObject = estado.flujo;
      await el.video.play();
      el.imagen.hidden = true;
      el.video.hidden = false;
      entrarModoReal("Modelo real en vivo con tu cámara: apunta a una hoja. Nada sale de tu teléfono.");
      estado.corriendo = true;
      bucleCamara();
    } catch (e) {
      el.estadoIA.textContent = "No se pudo abrir la cámara. Revisa el permiso del navegador o usa «Subir foto».";
    }
  });

  el.subir.addEventListener("change", async () => {
    const archivo = el.subir.files[0];
    if (!archivo) return;
    try {
      await prepararSesion();
      if (estado.corriendo) detenerReal();
      const url = URL.createObjectURL(archivo);
      el.imagen.src = url;
      await el.imagen.decode();
      entrarModoReal("Modelo real sobre tu foto. Nada sale de tu teléfono.");
      const probs = await clasificar(el.imagen, el.imagen.naturalWidth, el.imagen.naturalHeight);
      evaluar(probs, performance.now(), false);
    } catch (e) {
      el.estadoIA.textContent = "No se pudo analizar la foto.";
    }
    el.subir.value = "";
  });

  el.detener.addEventListener("click", detenerReal);

  (async () => {
    try {
      const [rm, rc] = await Promise.all([fetch(MODELO, { method: "HEAD" }), fetch(CLASES)]);
      if (!rm.ok || !rc.ok) throw new Error("sin modelo");
      estado.clases = (await rc.text()).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
      const mb = Number(rm.headers.get("content-length") || 0) / 1048576;
      el.estadoIA.textContent = `Es el mismo modelo YOLO11 que usa la Raspberry Pi${mb >= 0.1 ? ` (${mb.toFixed(1)} MB)` : ""}. Corre dentro de tu navegador: usa la cámara o sube una foto de una hoja.`;
      el.btnCamara.disabled = false;
      el.subir.disabled = false;
      el.subirEtiqueta.classList.remove("disabled");
    } catch (e) {
      el.estadoIA.textContent = "El modelo real todavía no está publicado en esta página. Mientras tanto, prueba la simulación de arriba.";
    }
  })();
}
