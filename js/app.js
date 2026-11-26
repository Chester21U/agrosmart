import { DATOS } from "./datos.js";
import { iniciarMqtt } from "./mqtt.js";
import { iniciarRiego } from "./riego.js";
import { iniciarVision } from "./vision.js";

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

function crear(etiqueta, props = {}, hijos = []) {
  const nodo = document.createElement(etiqueta);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") nodo.className = v;
    else if (k === "text") nodo.textContent = v;
    else if (k === "dataset") Object.assign(nodo.dataset, v);
    else nodo.setAttribute(k, v);
  });
  [].concat(hijos).forEach((h) => nodo.append(h));
  return nodo;
}

function iniciarMenu() {
  const menu = $("#menu");
  const arriba = $("#btn-arriba");
  const alDesplazar = () => {
    const y = window.scrollY;
    menu.classList.toggle("compacta", y > 40);
    arriba.classList.toggle("visible", y > 700);
  };
  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();
  arriba.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const colapso = $("#enlaces");
  $$("#enlaces .nav-link").forEach((a) =>
    a.addEventListener("click", () => {
      if (colapso.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(colapso).hide();
    })
  );
}

function iniciarRevelado() {
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visto");
        obs.unobserve(e.target);
      }),
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".revelar").forEach((n) => obs.observe(n));
}

function iniciarContadores() {
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const nodo = e.target;
        const fin = Number(nodo.dataset.contar);
        const inicio = performance.now();
        const paso = (t) => {
          const p = Math.min(1, (t - inicio) / 1400);
          nodo.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
        obs.unobserve(nodo);
      }),
    { threshold: 0.6 }
  );
  $$("[data-contar]").forEach((n) => obs.observe(n));
}

function iniciarBurbujas() {
  const hs = $('[data-burbuja="hs"]');
  const t = $('[data-burbuja="t"]');
  const ia = $('[data-burbuja="ia"]');
  let suelo = 40;
  let temp = 30.5;
  setInterval(() => {
    suelo = Math.min(58, Math.max(32, suelo + (Math.random() - 0.5) * 2));
    temp = Math.min(31.5, Math.max(29.5, temp + (Math.random() - 0.5) * 0.3));
    hs.textContent = suelo.toFixed(0);
    t.textContent = temp.toFixed(1);
    ia.textContent = (95 + Math.random() * 4).toFixed(0);
  }, 2000);
}

function iniciarZoom() {
  const modal = new bootstrap.Modal("#modal-zoom");
  const img = $("#modal-zoom-img");
  const titulo = $("#modal-zoom-titulo");
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-zoom]");
    if (!b) return;
    img.src = b.dataset.zoom;
    img.alt = b.dataset.zoomTitulo;
    titulo.textContent = b.dataset.zoomTitulo;
    modal.show();
  });
}

function iniciarAtajosPestanas() {
  $$("[data-ir-pestana]").forEach((b) =>
    b.addEventListener("click", () => {
      bootstrap.Tab.getOrCreateInstance(document.getElementById(b.dataset.irPestana)).show();
      $("#pestanas").scrollIntoView({ behavior: "smooth", block: "center" });
    })
  );
}

function iniciarCarrusel(laminas) {
  const interior = $("#carrusel-interior");
  const indicadores = $("#carrusel-indicadores");
  laminas.forEach((titulo, i) => {
    const num = String(i + 1).padStart(2, "0");
    const src = `img/diapositivas/lamina-${num}.webp`;
    const item = crear("div", { class: `carousel-item${i === 0 ? " active" : ""}` }, [
      crear("button", { type: "button", class: "lamina", "data-zoom": src, "data-zoom-titulo": `Lámina ${i + 1} de ${laminas.length} · ${titulo}`, "aria-label": `Ampliar lámina ${i + 1}: ${titulo}` }, [
        crear("img", { src, alt: `Lámina ${i + 1}: ${titulo}`, loading: i === 0 ? "eager" : "lazy", width: "1600", height: "900" })
      ]),
      crear("p", { class: "lamina-pie", text: `${i + 1} / ${laminas.length} · ${titulo}` })
    ]);
    interior.append(item);
    const punto = crear("button", { type: "button", "data-bs-target": "#carrusel", "data-bs-slide-to": String(i), "aria-label": titulo });
    if (i === 0) {
      punto.classList.add("active");
      punto.setAttribute("aria-current", "true");
    }
    indicadores.append(punto);
  });
}

async function iniciarVideo() {
  const video = $("#video-demo");
  const pronto = $("#video-pronto");
  try {
    const r = await fetch("video/demo.mp4", { method: "HEAD" });
    if (!r.ok) throw new Error();
    video.src = "video/demo.mp4";
    video.hidden = false;
    pronto.hidden = true;
  } catch (e) {
    video.remove();
  }
}

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function resaltar(texto, consulta) {
  const frag = document.createDocumentFragment();
  if (!consulta) {
    frag.append(texto);
    return frag;
  }
  const base = normalizar(texto);
  let desde = 0;
  let i = base.indexOf(consulta);
  while (i !== -1) {
    frag.append(texto.slice(desde, i), crear("mark", { text: texto.slice(i, i + consulta.length) }));
    desde = i + consulta.length;
    i = base.indexOf(consulta, desde);
  }
  frag.append(texto.slice(desde));
  return frag;
}

function iniciarPreguntas(faq) {
  const lista = $("#lista-preguntas");
  const buscar = $("#buscar");
  const filtros = $("#filtros");
  const contador = $("#contador");
  const categorias = ["Todas", ...new Set(faq.map((f) => f.categoria))];
  let categoria = "Todas";

  categorias.forEach((c) => {
    const b = crear("button", { type: "button", class: `btn btn-sm ${c === "Todas" ? "btn-agro" : "btn-outline-agro"}`, text: c, "aria-pressed": String(c === "Todas") });
    b.addEventListener("click", () => {
      categoria = c;
      $$("button", filtros).forEach((x) => {
        const activo = x === b;
        x.className = `btn btn-sm ${activo ? "btn-agro" : "btn-outline-agro"}`;
        x.setAttribute("aria-pressed", String(activo));
      });
      pintar();
    });
    filtros.append(b);
  });

  const INICIALES = 8;
  let todas = false;
  const masBoton = crear("button", { type: "button", class: "btn btn-outline-agro w-100 mt-2" });
  masBoton.addEventListener("click", () => {
    todas = !todas;
    pintar();
    if (!todas) $("#preguntas").scrollIntoView({ behavior: "smooth" });
  });
  lista.after(masBoton);

  function pintar() {
    const q = normalizar(buscar.value.trim());
    const filtradas = faq.filter((f) => (categoria === "Todas" || f.categoria === categoria) && (!q || normalizar(f.pregunta + " " + f.respuesta).includes(q)));
    const recortar = !q && categoria === "Todas" && !todas;
    const visibles = recortar ? filtradas.slice(0, INICIALES) : filtradas;
    lista.replaceChildren();
    visibles.forEach((f, i) => {
      const id = `p${i}`;
      const boton = crear("button", { class: "accordion-button collapsed", type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#${id}`, "aria-expanded": "false", "aria-controls": id }, [
        crear("span", { class: "categoria", text: f.categoria }),
        crear("span", {}, resaltar(f.pregunta, q))
      ]);
      const cuerpo = crear("div", { id, class: "accordion-collapse collapse", "data-bs-parent": "#lista-preguntas" }, [crear("div", { class: "accordion-body" }, resaltar(f.respuesta, q))]);
      lista.append(crear("div", { class: "accordion-item" }, [crear("h3", { class: "accordion-header" }, boton), cuerpo]));
    });
    contador.textContent = filtradas.length ? `Mostrando ${visibles.length} de ${filtradas.length} preguntas` : "No encontramos esa pregunta. Pregúntanos en el stand.";
    const mostrarBoton = !q && categoria === "Todas";
    masBoton.hidden = !mostrarBoton;
    masBoton.textContent = todas ? "Ver menos preguntas" : `Ver todas las preguntas (${faq.length})`;
  }

  let espera;
  buscar.addEventListener("input", () => {
    clearTimeout(espera);
    espera = setTimeout(pintar, 150);
  });
  pintar();
}

function iniciarQuiz(preguntas) {
  const caja = $("#quiz-caja");
  let indice = 0;
  let puntos = 0;

  function mostrar() {
    caja.replaceChildren();
    if (indice >= preguntas.length) return final();
    const p = preguntas[indice];
    const progreso = crear("div", { class: "quiz-progreso mb-3" }, crear("div", { style: `width:${(indice / preguntas.length) * 100}%` }));
    const cabecera = crear("p", { class: "small text-secondary fw-bold mb-1", text: `Pregunta ${indice + 1} de ${preguntas.length}` });
    const titulo = crear("h3", { class: "h4 fw-bold mb-3", text: p.p });
    const opciones = crear("div", { role: "group", "aria-label": "Opciones" });
    const explicacion = crear("p", { class: "mt-3 mb-0 fw-semibold", hidden: "" });
    const siguiente = crear("button", { type: "button", class: "btn btn-agro mt-3", hidden: "", text: indice + 1 < preguntas.length ? "Siguiente" : "Ver resultado" });
    p.o.forEach((texto, i) => {
      const b = crear("button", { type: "button", class: "quiz-opcion", text: texto });
      b.addEventListener("click", () => {
        $$(".quiz-opcion", opciones).forEach((x, j) => {
          x.disabled = true;
          if (j === p.c) x.classList.add("correcta");
        });
        const acierto = i === p.c;
        if (acierto) puntos++;
        else b.classList.add("incorrecta");
        explicacion.textContent = `${acierto ? "¡Correcto! " : "Casi. "}${p.e}`;
        explicacion.style.color = acierto ? "#2e7d32" : "var(--rojo)";
        explicacion.hidden = false;
        siguiente.hidden = false;
        siguiente.focus();
      });
      opciones.append(b);
    });
    siguiente.addEventListener("click", () => {
      indice++;
      mostrar();
    });
    caja.append(progreso, cabecera, titulo, opciones, explicacion, siguiente);
  }

  function final() {
    const nota = puntos / preguntas.length;
    const mensaje = nota === 1 ? "¡Perfecto! Ya podrías presentar AgroSmart." : nota >= 0.6 ? "¡Muy bien! Repasa las preguntas frecuentes para el resto." : "Buen intento. Explora el simulador y vuelve a intentarlo.";
    const otra = crear("button", { type: "button", class: "btn btn-agro mt-3", text: "Intentar de nuevo" });
    otra.addEventListener("click", () => {
      indice = 0;
      puntos = 0;
      mostrar();
    });
    caja.append(
      crear("div", { class: "text-center" }, [
        crear("i", { class: "bi bi-trophy-fill text-ambar", style: "font-size:3rem", "aria-hidden": "true" }),
        crear("p", { class: "cifra text-verde", text: `${puntos} / ${preguntas.length}` }),
        crear("p", { class: "fs-5 fw-semibold", text: mensaje }),
        otra
      ])
    );
  }

  mostrar();
}

function iniciarEquipo(integrantes) {
  const lista = $("#lista-equipo");
  integrantes.forEach(({ nombre, foto }) => {
    const partes = nombre.split(" ");
    const iniciales = (partes[0][0] + (partes[partes.length - 2] || partes[1])[0]).toUpperCase();
    const avatar = foto
      ? crear("img", { class: "avatar avatar-foto", src: foto, alt: `Foto de ${nombre}`, loading: "lazy", width: "400", height: "400" })
      : crear("div", { class: "avatar", "aria-hidden": "true", text: iniciales });
    lista.append(
      crear("article", { class: "col-6 col-md-4 col-lg revelar visto" }, [
        crear("div", { class: "tarjeta integrante h-100" }, [avatar, crear("h3", { class: "h6 fw-bold mb-0", text: nombre })])
      ])
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#anio").textContent = new Date().getFullYear();
  iniciarMenu();
  iniciarRevelado();
  iniciarContadores();
  iniciarBurbujas();
  iniciarZoom();
  iniciarAtajosPestanas();
  iniciarCarrusel(DATOS.laminas);
  iniciarVideo();
  iniciarPreguntas(DATOS.faq);
  iniciarQuiz(DATOS.quiz);
  iniciarEquipo(DATOS.equipo);
  iniciarMqtt(DATOS.mensajes);
  iniciarRiego();
  iniciarVision();
});
