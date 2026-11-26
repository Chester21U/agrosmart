const HUMEDAD_ENCENDER = 30;
const HUMEDAD_APAGAR = 60;
const MAX_RIEGO = 10;
const REPOSO = 60;
const PULSOS_MAX = 3;
const INTERVALO_SENSOR = 2;
const SECADO = 0.4;
const RIEGO = 3.4;
const VENTANA = 180;

export function iniciarRiego() {
  const el = {
    hs: document.getElementById("sim-hs"),
    barra: document.getElementById("sim-barra"),
    icono: document.getElementById("sim-bomba-icono"),
    bomba: document.getElementById("sim-bomba"),
    modo: document.getElementById("sim-modo"),
    estado: document.getElementById("sim-estado"),
    tiempo: document.getElementById("sim-tiempo"),
    pulsos: document.getElementById("sim-pulsos"),
    auto: document.getElementById("sim-auto"),
    on: document.getElementById("sim-on"),
    off: document.getElementById("sim-off"),
    reset: document.getElementById("sim-reset"),
    sensor: document.getElementById("sim-sensor"),
    vacio: document.getElementById("sim-vacio"),
    registro: document.getElementById("sim-registro"),
    canvas: document.getElementById("sim-grafica")
  };
  if (!el.canvas) return;

  const s = {
    t: 0,
    humedadReal: 45,
    lectura: 45,
    ultimaLectura: -INTERVALO_SENSOR,
    bomba: false,
    modoAuto: true,
    bloqueo: false,
    pulsos: 0,
    inicioRiego: 0,
    finRiego: null,
    velocidad: 5,
    historia: []
  };

  const ctx = el.canvas.getContext("2d");
  let visible = false;
  let ultimoCuadro = null;

  function reloj(seg) {
    const m = Math.floor(seg / 60);
    const r = Math.floor(seg % 60);
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }

  function registrar(texto, tipo = "") {
    const li = document.createElement("li");
    if (tipo) li.classList.add(tipo);
    const hora = document.createElement("time");
    hora.textContent = reloj(s.t);
    const msg = document.createElement("span");
    msg.textContent = texto;
    li.append(hora, msg);
    el.registro.prepend(li);
    while (el.registro.children.length > 40) el.registro.lastElementChild.remove();
  }

  function aplicarBomba(encender) {
    if (encender === s.bomba) return;
    s.bomba = encender;
    if (encender) {
      s.inicioRiego = s.t;
      registrar("Relé activado: la bomba empieza a regar.", "info");
    } else {
      s.finRiego = s.t;
      registrar("Relé desactivado: la bomba se detiene.");
    }
  }

  function controlRiego() {
    if (s.bomba && s.t - s.inicioRiego >= MAX_RIEGO) {
      aplicarBomba(false);
      s.pulsos++;
      registrar("Alarma anti_inundacion: 10 s encendida, se corta sola.", "aviso");
      if (s.pulsos >= PULSOS_MAX) {
        s.bloqueo = true;
        registrar("Alarma deposito_vacio: 3 cortes seguidos, riego bloqueado.", "peligro");
      }
      return;
    }
    if (!s.modoAuto) return;
    if (s.bomba) {
      if (s.lectura >= HUMEDAD_APAGAR) {
        aplicarBomba(false);
        s.pulsos = 0;
        registrar("La tierra llegó a 60 %: riego completo.");
      }
      return;
    }
    if (s.bloqueo) return;
    if (s.finRiego !== null && s.t - s.finRiego < REPOSO) return;
    if (s.lectura < HUMEDAD_ENCENDER) {
      registrar(`Suelo en ${s.lectura.toFixed(0)} %: está seco, toca regar.`);
      aplicarBomba(true);
    }
  }

  function fisica(dt) {
    if (s.bomba && !el.vacio.checked) s.humedadReal += RIEGO * dt;
    else s.humedadReal -= SECADO * dt;
    s.humedadReal = Math.min(100, Math.max(0, s.humedadReal));
    if (s.t - s.ultimaLectura >= INTERVALO_SENSOR) {
      s.ultimaLectura = s.t;
      s.lectura = el.sensor.checked ? 0 : Math.min(100, Math.max(0, s.humedadReal + (Math.random() - 0.5) * 0.6));
      s.historia.push({ t: s.t, v: s.lectura, b: s.bomba });
      while (s.historia.length && s.historia[0].t < s.t - VENTANA) s.historia.shift();
    }
  }

  function pintarEstado() {
    el.hs.textContent = s.lectura.toFixed(0);
    el.barra.style.width = `${s.lectura}%`;
    el.bomba.textContent = s.bomba ? "Encendida" : "Detenida";
    el.modo.textContent = s.modoAuto ? "Automático" : "Manual";
    el.estado.textContent = s.bloqueo ? "Bloqueado" : (!s.bomba && s.finRiego !== null && s.t - s.finRiego < REPOSO && s.modoAuto ? `Reposo ${Math.ceil(REPOSO - (s.t - s.finRiego))} s` : "Normal");
    el.estado.style.color = s.bloqueo ? "var(--rojo)" : "";
    el.tiempo.textContent = (s.bomba ? s.t - s.inicioRiego : 0).toFixed(1);
    el.pulsos.textContent = s.pulsos;
    el.icono.classList.toggle("activa", s.bomba);
    el.icono.classList.toggle("bloqueada", s.bloqueo);
  }

  function ajustarCanvas() {
    const r = el.canvas.getBoundingClientRect();
    const d = window.devicePixelRatio || 1;
    el.canvas.width = Math.round(r.width * d);
    el.canvas.height = Math.round(r.height * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function pintarGrafica() {
    const w = el.canvas.clientWidth;
    const h = el.canvas.clientHeight;
    const m = { i: 42, d: 12, a: 14, b: 26 };
    const X = (t) => m.i + ((t - (s.t - VENTANA)) / VENTANA) * (w - m.i - m.d);
    const Y = (v) => m.a + (1 - v / 100) * (h - m.a - m.b);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#e8f1e4";
    ctx.fillRect(m.i, Y(60), w - m.i - m.d, Y(30) - Y(60));
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let v = 0; v <= 100; v += 20) {
      ctx.strokeStyle = "#eef2ee";
      ctx.beginPath();
      ctx.moveTo(m.i, Y(v));
      ctx.lineTo(w - m.d, Y(v));
      ctx.stroke();
      ctx.fillStyle = "#8a978e";
      ctx.fillText(`${v}%`, m.i - 6, Y(v));
    }
    for (let i = 1; i < s.historia.length; i++) {
      const p = s.historia[i - 1];
      if (p.b) {
        ctx.fillStyle = "rgba(21,101,192,0.12)";
        ctx.fillRect(X(p.t), m.a, X(s.historia[i].t) - X(p.t), h - m.a - m.b);
      }
    }
    [[60, "#1565c0", "apaga"], [30, "#c62828", "enciende"]].forEach(([v, c, txt]) => {
      ctx.strokeStyle = c;
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.i, Y(v));
      ctx.lineTo(w - m.d, Y(v));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = c;
      ctx.textAlign = "left";
      ctx.fillText(`${v}% ${txt}`, m.i + 6, Y(v) - 9);
    });
    if (s.historia.length > 1) {
      ctx.strokeStyle = "#2f5d36";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.beginPath();
      s.historia.forEach((p, i) => (i ? ctx.lineTo(X(p.t), Y(p.v)) : ctx.moveTo(X(p.t), Y(p.v))));
      ctx.stroke();
      const u = s.historia[s.historia.length - 1];
      ctx.fillStyle = "#2f5d36";
      ctx.beginPath();
      ctx.arc(X(u.t), Y(u.v), 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#8a978e";
    ctx.textAlign = "center";
    ctx.fillText("últimos 3 minutos simulados", w / 2, h - 10);
  }

  function cuadro(ahora) {
    if (ultimoCuadro === null) ultimoCuadro = ahora;
    const real = Math.min(0.1, (ahora - ultimoCuadro) / 1000);
    ultimoCuadro = ahora;
    if (visible) {
      let restante = real * s.velocidad;
      while (restante > 0) {
        const paso = Math.min(0.05, restante);
        s.t += paso;
        fisica(paso);
        controlRiego();
        restante -= paso;
      }
      pintarEstado();
      pintarGrafica();
    }
    requestAnimationFrame(cuadro);
  }

  el.auto.addEventListener("change", () => {
    s.modoAuto = el.auto.checked;
    registrar(`Modo ${s.modoAuto ? "automático" : "manual"} (publica agrosmart/nodo1/modo).`, "info");
    if (s.bomba) aplicarBomba(false);
  });

  function orden(encender) {
    if (s.modoAuto) return registrar("Orden ignorada: en automático decide el NodeMCU.", "aviso");
    if (s.bloqueo) return registrar("Orden ignorada: el riego está bloqueado.", "peligro");
    aplicarBomba(encender);
  }

  el.on.addEventListener("click", () => orden(true));
  el.off.addEventListener("click", () => orden(false));
  el.reset.addEventListener("click", () => {
    s.bloqueo = false;
    s.pulsos = 0;
    s.finRiego = null;
    registrar("Bloqueo reiniciado (publica reset).", "info");
  });
  el.sensor.addEventListener("change", () => registrar(el.sensor.checked ? "Sensor fuera de la tierra: ahora lee 0 %." : "Sensor de vuelta en la tierra.", "aviso"));
  el.vacio.addEventListener("change", () => registrar(el.vacio.checked ? "Tanque vacío: la bomba ya no saca agua." : "Tanque lleno otra vez.", "aviso"));
  document.querySelectorAll('input[name="velocidad"]').forEach((r) => r.addEventListener("change", () => (s.velocidad = Number(r.value))));

  new IntersectionObserver((entradas) => entradas.forEach((e) => (visible = e.isIntersecting)), { threshold: 0.1 }).observe(document.getElementById("riego"));
  window.addEventListener("resize", ajustarCanvas);
  ajustarCanvas();
  registrar("Simulación iniciada con la tierra al 45 %.");
  requestAnimationFrame(cuadro);
}
