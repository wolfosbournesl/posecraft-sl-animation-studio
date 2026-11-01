const TASKS_VERSION = "0.10.32";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const BUNDLE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/vision_bundle.mjs`;

const COPY = {
  pt: {
    title: "Capturar movimento de um v\u00eddeo", intro: "Envie um v\u00eddeo curto com uma pessoa vis\u00edvel de corpo inteiro. A estimativa e a convers\u00e3o acontecem neste navegador.",
    choose: "Escolher v\u00eddeo", none: "Nenhum v\u00eddeo selecionado", source: "Para YouTube ou TikTok, selecione um arquivo que voc\u00ea tenha direito de usar. P\u00e1ginas e links de streaming dessas plataformas n\u00e3o s\u00e3o processados diretamente.",
    sampling: "Amostras por segundo", length: "Capturar os primeiros", seconds: "segundos", mirror: "Espelhar os lados", root: "Capturar deslocamento do quadril",
    hint: "Use c\u00e2mera est\u00e1vel, boa ilumina\u00e7\u00e3o e mantenha a pessoa inteira no quadro. Estimativa monocular n\u00e3o recupera profundidade real nem dedos; movimentos de c\u00e2mera podem afetar o deslocamento.",
    idle: "Selecione um v\u00eddeo para come\u00e7ar.", process: "Analisar movimento", apply: "Aplicar \u00e0 timeline", cancel: "Cancelar", close: "Fechar captura de movimento",
    loading: "Carregando o modelo de pose (necess\u00e1rio na primeira vez)...", processing: "Analisando quadro {current} de {total}...", ready: "{detected} de {total} quadros reconhecidos. Revise o v\u00eddeo e aplique a sequ\u00eancia.",
    noPose: "N\u00e3o foi poss\u00edvel reconhecer uma pessoa. Tente um v\u00eddeo frontal com corpo inteiro e mais luz.",
    tooLong: "O editor analisar\u00e1 apenas os primeiros 30 segundos ou o limite selecionado.", unsupported: "N\u00e3o foi poss\u00edvel abrir este v\u00eddeo. Tente MP4 ou WebM.",
    modelError: "N\u00e3o foi poss\u00edvel carregar o modelo. Confira a conex\u00e3o e tente novamente.",
    replace: "Aplicar substituir\u00e1 os quadros atuais da timeline.", applied: "Movimento aplicado \u00e0 timeline. Revise a pose antes de exportar."
  },
  en: {
    title: "Capture motion from video", intro: "Choose a short video with one person visible head to toe. Pose estimation and conversion run in this browser.",
    choose: "Choose video", none: "No video selected", source: "For YouTube or TikTok, choose a video file you are allowed to use. Platform pages and streaming links cannot be processed directly.",
    sampling: "Samples per second", length: "Capture first", seconds: "seconds", mirror: "Mirror sides", root: "Capture hip movement",
    hint: "Use a steady camera, good lighting, and keep the whole person in frame. Monocular estimation cannot recover true depth or fingers; camera movement can affect translation.",
    idle: "Choose a video to begin.", process: "Analyze motion", apply: "Apply to timeline", cancel: "Cancel", close: "Close motion capture",
    loading: "Loading the pose model (needed the first time)...", processing: "Analyzing frame {current} of {total}...", ready: "Recognized {detected} of {total} frames. Review the video and apply the sequence.",
    noPose: "No person was detected. Try a well-lit, front-facing, full-body video.",
    tooLong: "Only the first 30 seconds or the selected limit will be analyzed.", unsupported: "This video could not be opened. Try MP4 or WebM.",
    modelError: "The pose model could not be loaded. Check your connection and try again.",
    replace: "Applying will replace the current timeline keyframes.", applied: "Motion applied to the timeline. Review the pose before exporting."
  },
  es: {
    title: "Capturar movimiento de un v\u00eddeo", intro: "Elige un v\u00eddeo corto donde una persona aparezca de cuerpo entero. La estimaci\u00f3n y la conversi\u00f3n se realizan en este navegador.",
    choose: "Elegir v\u00eddeo", none: "Ning\u00fan v\u00eddeo seleccionado", source: "Para YouTube o TikTok, elige un archivo que tengas derecho a usar. Las p\u00e1ginas y los enlaces de streaming de esas plataformas no se procesan directamente.",
    sampling: "Muestras por segundo", length: "Capturar los primeros", seconds: "segundos", mirror: "Reflejar los lados", root: "Capturar desplazamiento de cadera",
    hint: "Usa una c\u00e1mara estable, buena iluminaci\u00f3n y mant\u00e9n a la persona completa en cuadro. La estimaci\u00f3n monocular no recupera profundidad real ni dedos; el movimiento de c\u00e1mara puede afectar el desplazamiento.",
    idle: "Selecciona un v\u00eddeo para comenzar.", process: "Analizar movimiento", apply: "Aplicar a la l\u00ednea de tiempo", cancel: "Cancelar", close: "Cerrar captura de movimiento",
    loading: "Cargando el modelo de pose (necesario la primera vez)...", processing: "Analizando cuadro {current} de {total}...", ready: "Se reconocieron {detected} de {total} cuadros. Revisa el v\u00eddeo y aplica la secuencia.",
    noPose: "No se detect\u00f3 a una persona. Prueba un v\u00eddeo frontal, con cuerpo completo y buena luz.",
    tooLong: "Solo se analizar\u00e1n los primeros 30 segundos o el l\u00edmite seleccionado.", unsupported: "No se pudo abrir este v\u00eddeo. Prueba MP4 o WebM.",
    modelError: "No se pudo cargar el modelo. Comprueba la conexi\u00f3n e int\u00e9ntalo de nuevo.",
    replace: "Al aplicar, se reemplazar\u00e1n los fotogramas actuales de la l\u00ednea de tiempo.", applied: "Movimiento aplicado a la l\u00ednea de tiempo. Revisa la pose antes de exportar."
  }
};

let landmarkerPromise;

export function installMotionCapture() {
  const trigger = document.querySelector("#captureMotionBtn");
  if (!trigger) return;

  const style = document.createElement("style");
  style.textContent = `
    .mc-backdrop{position:fixed;inset:0;z-index:1200;background:#080a10d9;display:grid;place-items:center;padding:18px}
    .mc-backdrop[hidden]{display:none}.mc-card{width:min(860px,96vw);max-height:94vh;overflow:auto;background:#191c23;border:1px solid #454b5c;border-radius:16px;box-shadow:0 22px 80px #0009;padding:20px;color:#f2f4f8}
    .mc-head{display:flex;align-items:center;gap:14px}.mc-head h2{font-size:19px;margin:0;flex:1}.mc-card p{color:#aeb5c4;line-height:1.5;margin:8px 0 16px}.mc-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(250px,.85fr);gap:18px}
    .mc-preview{position:relative;min-height:250px;background:#101218;border:1px solid #303540;border-radius:12px;overflow:hidden;display:grid;place-items:center}.mc-preview video{width:100%;max-height:52vh;object-fit:contain}.mc-preview canvas{position:absolute;pointer-events:none}.mc-empty{position:absolute;color:#9aa1b1;text-align:center;padding:24px}
    .mc-controls{display:grid;align-content:start;gap:10px}.mc-controls label{font-size:12px;color:#d4d8e1}.mc-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.mc-row select{background:#20242d;border:1px solid #414756;border-radius:8px;padding:8px}.mc-file{font-size:11px;color:#aeb5c4;overflow-wrap:anywhere}.mc-check{display:flex;align-items:center;gap:8px}.mc-hint{font-size:11px!important;margin:0!important}.mc-warning{font-size:11px!important;color:#f3d28b!important;margin:0!important}.mc-status{font-size:12px!important;min-height:18px;margin:12px 0 7px!important}.mc-progress{width:100%;height:8px;accent-color:#9c8cff}.mc-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}.mc-actions .primary{background:#9c8cff;color:#11111a;border-color:#9c8cff;font-weight:700}.mc-error{color:#ff9aa4!important}
    @media(max-width:680px){.mc-backdrop{padding:8px}.mc-card{padding:14px}.mc-grid{grid-template-columns:1fr}.mc-preview{min-height:180px}.mc-preview video{max-height:34vh}}
  `;
  document.head.append(style);

  const backdrop = document.createElement("div");
  backdrop.className = "mc-backdrop";
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <section class="mc-card" role="dialog" aria-modal="true" aria-labelledby="mcTitle">
      <div class="mc-head"><h2 id="mcTitle"></h2><button type="button" id="mcClose" class="quiet" aria-label=""></button></div>
      <p id="mcIntro"></p>
      <div class="mc-grid">
        <div class="mc-preview"><video id="mcVideo" controls playsinline muted hidden></video><canvas id="mcOverlay"></canvas><div class="mc-empty" id="mcEmpty"></div></div>
        <div class="mc-controls">
          <div class="mc-row"><button type="button" id="mcChoose"></button><span class="mc-file" id="mcFileName"></span><input id="mcFile" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" hidden></div>
          <p id="mcSource" class="mc-hint"></p>
          <label for="mcRate" id="mcRateLabel"></label><select id="mcRate"><option value="6">6 FPS</option><option value="8" selected>8 FPS</option><option value="10">10 FPS</option></select>
          <label for="mcLength" id="mcLengthLabel"></label><select id="mcLength"><option value="10">10</option><option value="15" selected>15</option><option value="20">20</option><option value="30">30</option></select>
          <label class="mc-check"><input id="mcMirror" type="checkbox"><span id="mcMirrorLabel"></span></label>
          <label class="mc-check"><input id="mcRoot" type="checkbox"><span id="mcRootLabel"></span></label>
          <p id="mcHint" class="mc-hint"></p><p id="mcReplace" class="mc-warning"></p>
        </div>
      </div>
      <p id="mcStatus" class="mc-status" role="status" aria-live="polite"></p><progress id="mcProgress" class="mc-progress" max="1" value="0"></progress>
      <div class="mc-actions"><button type="button" id="mcCancel"></button><button type="button" id="mcProcess" class="primary" disabled></button><button type="button" id="mcApply" class="primary" disabled></button></div>
    </section>`;
  document.body.append(backdrop);

  const $ = (selector) => backdrop.querySelector(selector);
  const video = $("#mcVideo");
  const canvas = $("#mcOverlay");
  const context = canvas.getContext("2d");
  let objectUrl = null;
  let captured = null;
  let uiLanguage = document.querySelector("#languageSelect")?.value || "pt";

  function text(key, values = {}) {
    let result = (COPY[uiLanguage] || COPY.pt)[key] || COPY.pt[key] || key;
    for (const [name, value] of Object.entries(values)) result = result.replace(`{${name}}`, value);
    return result;
  }

  function setStatus(key, values = {}, error = false) {
    const element = $("#mcStatus");
    element.textContent = text(key, values);
    element.classList.toggle("mc-error", error);
  }

  function translate() {
    uiLanguage = document.querySelector("#languageSelect")?.value || "pt";
    $("#mcTitle").textContent = text("title");
    $("#mcIntro").textContent = text("intro");
    $("#mcChoose").textContent = text("choose");
    $("#mcSource").textContent = text("source");
    $("#mcRateLabel").textContent = text("sampling");
    $("#mcLengthLabel").textContent = `${text("length")} (${text("seconds")})`;
    $("#mcMirrorLabel").textContent = text("mirror");
    $("#mcRootLabel").textContent = text("root");
    $("#mcHint").textContent = text("hint");
    $("#mcReplace").textContent = text("replace");
    $("#mcEmpty").textContent = text("none");
    $("#mcCancel").textContent = text("cancel");
    $("#mcProcess").textContent = text("process");
    $("#mcApply").textContent = text("apply");
    $("#mcClose").textContent = "×";
    $("#mcClose").setAttribute("aria-label", text("close"));
    if (!captured && !$("#mcStatus").classList.contains("mc-error")) setStatus("idle");
  }

  function resetCapture() {
    captured = null;
    $("#mcApply").disabled = true;
    $("#mcProcess").disabled = !video.src;
    $("#mcProgress").value = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStatus("idle");
  }

  function close() {
    backdrop.hidden = true;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.hidden = true;
    $("#mcEmpty").hidden = false;
    $("#mcFileName").textContent = "";
    $("#mcFile").value = "";
    resetCapture();
  }

  trigger.addEventListener("click", () => {
    translate();
    backdrop.hidden = false;
    $("#mcChoose").focus();
  });
  $("#mcClose").addEventListener("click", close);
  $("#mcCancel").addEventListener("click", close);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !backdrop.hidden) close(); });
  document.querySelector("#languageSelect")?.addEventListener("change", translate);
  $("#mcChoose").addEventListener("click", () => $("#mcFile").click());

  $("#mcFile").addEventListener("change", () => {
    const file = $("#mcFile").files?.[0];
    resetCapture();
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.hidden = false;
    $("#mcEmpty").hidden = true;
    $("#mcFileName").textContent = file.name;
    setStatus("idle");
  });

  video.addEventListener("loadedmetadata", () => {
    $("#mcProcess").disabled = false;
    setStatus("idle");
  });
  video.addEventListener("error", () => setStatus("unsupported", {}, true));
  video.addEventListener("seeked", drawNearest);
  video.addEventListener("timeupdate", drawNearest);

  $("#mcProcess").addEventListener("click", processVideo);
  $("#mcApply").addEventListener("click", () => {
    if (!captured) return;
    const applied = new CustomEvent("posecraft:motion-captured", { detail: captured, cancelable: true });
    window.dispatchEvent(applied);
    if (applied.defaultPrevented) close();
  });

  function drawPose(points) {
    const width = video.videoWidth || 0;
    const height = video.videoHeight || 0;
    if (!width || !height) return;
    const videoRect = video.getBoundingClientRect(), previewRect = canvas.parentElement.getBoundingClientRect();
    canvas.style.left = `${videoRect.left - previewRect.left}px`;
    canvas.style.top = `${videoRect.top - previewRect.top}px`;
    canvas.style.width = `${videoRect.width}px`;
    canvas.style.height = `${videoRect.height}px`;
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    context.clearRect(0, 0, width, height);
    if (!points) return;
    const connections = [[11,12],[11,13],[13,15],[15,19],[12,14],[14,16],[16,20],[11,23],[12,24],[23,24],[23,25],[25,27],[27,31],[24,26],[26,28],[28,32]];
    context.lineWidth = Math.max(2, width / 260);
    context.strokeStyle = "#8dffdc";
    context.fillStyle = "#d8fff3";
    for (const [a,b] of connections) {
      const p = points[a], q = points[b];
      if (!p || !q || (p.visibility ?? 1) < .35 || (q.visibility ?? 1) < .35) continue;
      context.beginPath(); context.moveTo(p.x * width, p.y * height); context.lineTo(q.x * width, q.y * height); context.stroke();
    }
    for (const p of points) {
      if (!p || (p.visibility ?? 1) < .35) continue;
      context.beginPath(); context.arc(p.x * width, p.y * height, Math.max(2.5, width / 220), 0, Math.PI * 2); context.fill();
    }
  }

  function drawNearest() {
    if (!captured?.frames?.length) return;
    let nearest = captured.frames[0];
    for (const frame of captured.frames) if (Math.abs(frame.t - video.currentTime) < Math.abs(nearest.t - video.currentTime)) nearest = frame;
    drawPose(nearest.image);
  }

  async function getLandmarker() {
    if (!landmarkerPromise) {
      landmarkerPromise = (async () => {
        const { FilesetResolver, PoseLandmarker } = await import(BUNDLE_URL);
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        return PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: .45,
          minPosePresenceConfidence: .45,
          minTrackingConfidence: .45
        });
      })().catch((error) => { landmarkerPromise = null; throw error; });
    }
    return landmarkerPromise;
  }

  function waitForSeek(time) {
    if (Math.abs(video.currentTime - time) < .001) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("seek-timeout")), 8000);
      video.addEventListener("seeked", () => { clearTimeout(timer); resolve(); }, { once: true });
      video.currentTime = time;
    });
  }

  async function processVideo() {
    if (!video.src || !Number.isFinite(video.duration)) return;
    $("#mcProcess").disabled = true;
    $("#mcApply").disabled = true;
    captured = null;
    const oldText = $("#mcProcess").textContent;
    try {
      setStatus("loading");
      const task = await getLandmarker();
      const duration = Math.min(video.duration, Number($("#mcLength").value), 30);
      if (!(duration > 0)) throw new Error("unsupported");
      const sampleRate = Number($("#mcRate").value);
      const times = [];
      for (let t = 0; t < duration; t += 1 / sampleRate) times.push(Number(t.toFixed(4)));
      if (!times.length || duration - times[times.length - 1] > .025) times.push(duration);
      const frames = [];
      let found = 0;
      let lastTimestamp = -1;
      video.pause();
      if (video.readyState < 2) await new Promise((resolve) => video.addEventListener("loadeddata", resolve, { once: true }));
      for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const seekTime = Math.min(t, Math.max(0, video.duration - .035));
        await waitForSeek(seekTime);
        const timestamp = Math.max(Math.round(t * 1000), lastTimestamp + 1);
        lastTimestamp = timestamp;
        const result = task.detectForVideo(video, timestamp);
        const world = result.worldLandmarks?.[0];
        const image = result.landmarks?.[0];
        if (world?.length) found++;
        frames.push({
          t,
          world: world?.map((p) => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility ?? 1 })) || null,
          image: image?.map((p) => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility ?? 1 })) || null
        });
        $("#mcProgress").value = (i + 1) / times.length;
        setStatus("processing", { current: i + 1, total: times.length });
        if (image) drawPose(image);
        await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      }
      if (found < Math.max(3, Math.ceil(times.length * .15))) { setStatus("noPose", {}, true); return; }
      fillMissing(frames);
      captured = {
        frames,
        duration,
        sampleRate,
        mirror: $("#mcMirror").checked,
        rootMotion: $("#mcRoot").checked
      };
      setStatus("ready", { detected: found, total: frames.length });
      $("#mcApply").disabled = false;
      drawNearest();
    } catch (error) {
      console.error("Video pose estimation failed", error);
      setStatus(error.message === "unsupported" ? "unsupported" : "modelError", {}, true);
    } finally {
      $("#mcProcess").disabled = false;
      $("#mcProcess").textContent = oldText || text("process");
    }
  }

  function fillMissing(frames) {
    for (let i = 0; i < frames.length; i++) {
      if (frames[i].world) continue;
      let before = i - 1, after = i + 1;
      while (before >= 0 && !frames[before].world) before--;
      while (after < frames.length && !frames[after].world) after++;
      const a = frames[before], b = frames[after];
      if (!a && b) { frames[i].world = b.world; frames[i].image = b.image; }
      else if (a && !b) { frames[i].world = a.world; frames[i].image = a.image; }
      else if (a && b) {
        const f = (frames[i].t - a.t) / (b.t - a.t);
        frames[i].world = a.world.map((p, n) => ({ x:p.x+(b.world[n].x-p.x)*f, y:p.y+(b.world[n].y-p.y)*f, z:p.z+(b.world[n].z-p.z)*f, visibility:.35 }));
        frames[i].image = a.image?.map((p, n) => ({ x:p.x+(b.image[n].x-p.x)*f, y:p.y+(b.image[n].y-p.y)*f, z:p.z+(b.image[n].z-p.z)*f, visibility:.35 })) || a.image;
      }
    }
  }

  translate();
  trigger.disabled = false;
}
