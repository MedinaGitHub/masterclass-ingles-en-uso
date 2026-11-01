import {audioTexts,scenes,questions,prompts,chunks,wouldExamples,normalizeProgress} from './content.mjs?v=20261101-guided-v2';
import {initLessonNavigation} from './lesson-navigation.mjs?v=20261101-guided-v2';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='english-in-use-v1';
let progress,canStore=true;
try {progress=normalizeProgress(JSON.parse(localStorage.getItem(KEY)));} catch {progress=normalizeProgress(null);canStore=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{canStore=false;}if(!canStore)$('#storage-note').textContent='El almacenamiento no está disponible. Puedes completar toda la práctica en esta visita; el avance no se conservará al salir.';}
if(!canStore)save();

$('#would-examples-list').innerHTML=wouldExamples.map((example,i)=>`<li class="would-example"><span class="would-number" aria-hidden="true">0${i+1}</span><div><p class="small-label">${escape(example.context)}</p><p class="would-sentence" lang="en">${escape(example.lead)}<mark>${escape(example.focus)}</mark>${escape(example.tail)}</p><p class="would-intent">${escape(example.intent)}</p><button class="audio-button" data-audio="${example.id}">▶ Escuchar el ejemplo ${i+1}</button></div></li>`).join('');

// One shared player prevents overlapping examples and keeps playback controls accessible.
const player=$('#audio-player');
let activeAudio='';
async function playAudio(id){
  if(!audioTexts[id])return;
  activeAudio=id;
  $('#lesson-player').hidden=false;
  document.body.classList.add('audio-open');
  player.src=new URL(`audio/${id}.mp3`,import.meta.url).href;
  player.playbackRate=Number($('#audio-speed').value);
  $('#audio-label').textContent=id==='full'?'La respuesta completa':id==='question'?'La pregunta de Jamie':audioTexts[id];
  $('#audio-status').textContent='';
  try{await player.play();}catch{if(activeAudio===id)$('#audio-status').textContent='No se pudo iniciar el audio. Usa el control de reproducción o inténtalo de nuevo.';}
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-audio]');if(button)playAudio(button.dataset.audio);});
$('#audio-speed').addEventListener('change',()=>{player.playbackRate=Number($('#audio-speed').value);});
$('#player-close').addEventListener('click',()=>{player.pause();$('#lesson-player').hidden=true;document.body.classList.remove('audio-open');});
player.addEventListener('error',()=>{$('#audio-status').textContent='No se pudo cargar este audio. El texto sigue disponible; vuelve a intentarlo cuando haya conexión.';});
$('#transcript-toggle').addEventListener('click',()=>{
  const show=$('#transcript').hidden;$('#transcript').hidden=!show;$('#listen-cover').hidden=show;
  $('#transcript-toggle').setAttribute('aria-expanded',String(show));$('#transcript-toggle').textContent=show?'Ocultar respuesta':'Ver respuesta';
});
$$('[data-listen-answer]').forEach(button=>button.addEventListener('click',()=>{
  const right=button.dataset.listenAnswer==='right';
  $('#listen-feedback').className=`feedback ${right?'success':'error'}`;
  $('#listen-feedback').textContent=right?'Sí. Oíste un patrón anterior y un balance distinto desde el cambio hasta hoy.':'Escucha de nuevo: “used to” abre la etapa anterior y “since switching” cambia el período. ¿Qué balance oyes después?';
  if(right)$('#listening-detail').hidden=false;
}));
$$('[data-listen-detail]').forEach(button=>button.addEventListener('click',()=>{
 const right=button.dataset.listenDetail==='right';$('#detail-feedback').className=`feedback ${right?'success':'error'}`;
 $('#detail-feedback').textContent=right?'Sí: “both the daily and weekly limits”. Tu colega entiende que había problemas con ambos tipos de tope.':'Vuelve a escuchar el bloque después de “I’d hit both…”. ¿Oyes “monthly” o “weekly”?';
}));

let sceneIndex=0;
$('#scene-nav').innerHTML=scenes.map((scene,i)=>`<button data-scene="${i}" aria-pressed="${i===0}"><span>0${i+1}</span><b lang="en">${escape(scene.label)}</b></button>`).join('');
function renderScene(){
 const scene=scenes[sceneIndex];
 $$('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.scene)===sceneIndex)));
 $('#scene-panel').innerHTML=`<p class="eyebrow">PIEZA ${sceneIndex+1} DE ${scenes.length} · ${scene.intent}</p><h3 lang="en">${scene.title}</h3><p>${scene.explain}</p><div class="visual-timeline" role="img" aria-label="${escape(scene.caption)}"><div class="era-block"><span>${scene.past}</span><div class="event-row" aria-hidden="true">${scene.pastEvents}</div></div><span class="timeline-arrow" aria-hidden="true">→</span><div class="era-block new-era"><span>${scene.now}</span><div class="event-row" aria-hidden="true">${scene.nowEvents}</div></div></div><div class="timeline-caption"><span>ANTES</span><span class="now-dot">AHORA ●</span></div><p class="scene-insight">${scene.insight}</p><div class="scene-bottom"><button class="audio-button" data-audio="${scene.id}">▶ Escuchar este bloque</button><button class="text-toggle" id="scene-next">${sceneIndex===scenes.length-1?'Continuar: would en uso →':'Siguiente pieza →'}</button></div>`;
 $('#scene-next').addEventListener('click',()=>{if(sceneIndex===scenes.length-1){location.hash='#would-examples';return;}sceneIndex++;renderScene();$('#scene-next').focus({preventScroll:true});});
}
$('#scene-nav').addEventListener('click',event=>{const b=event.target.closest('[data-scene]');if(b){sceneIndex=Number(b.dataset.scene);renderScene();}});
renderScene();

$('#usage').addEventListener('input',()=>{
 const used=Number($('#usage').value),left=100-used,empty=used===100;
 $('#usage-value').textContent=`${used}%`;
 $('#tank-fill').style.height=`${left}%`;$('#tank-number').textContent=`${left}%`;
 $('#tank').setAttribute('aria-label',`${left} por ciento de tokens restantes`);
 $('#limit-fill').style.width=`${used}%`;$('#limit-track').setAttribute('aria-label',`${used} por ciento de la cuota usada`);
 $('.resource-lab').classList.toggle('exhausted',empty);
 $('#resource-sentence').textContent=empty?"I've run out of tokens.":'I still have some tokens left.';
 $('#limit-sentence').textContent=empty?"I've hit the limit.":used===0?"I haven't used any of my quota yet.":"I haven't hit the limit yet.";
});
function renderWindow(mode){const open=mode==='open';
 $$('[data-window]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.window===mode)));
 $('#time-result').innerHTML=`<div class="window-line ${open?'':'closed'}"><b>${open?'SWITCH':'YESTERDAY'}</b><span></span><b>${open?'NOW ●':'│'}</b>${open?'':'<span style="background:transparent"></span><b>NOW ●</b>'}</div><p lang="en">${open?"I haven't hit any limits since the switch.":"I didn't hit any limits yesterday."}</p><div class="tiny">${open?'Miras el período desde el cambio hasta hoy. El balance está conectado con el momento en que hablas.':'Miras un día que ya terminó. El balance pertenece a ese período cerrado, aunque pueda importar ahora.'}</div>`;
}
$$('[data-window]').forEach(b=>b.addEventListener('click',()=>renderWindow(b.dataset.window)));renderWindow('open');

let quizIndex=Math.max(0,questions.findIndex(q=>!progress.solved.includes(q.id))),quizAnswered=false;
if(progress.solved.length===questions.length)quizIndex=questions.length;
function renderQuiz(focus=false){
 $('#quiz-progress').value=progress.solved.length;$('#quiz-progress-label').textContent=`${progress.solved.length} resueltas`;
 $('#quiz-feedback').textContent='';$('#quiz-feedback').className='quiz-feedback';$('#quiz-next').hidden=true;
 if(quizIndex>=questions.length){
  $('#quiz-count').textContent='LAS 8 ESCENAS RESUELTAS';
  $('#quiz-card').innerHTML='<h3 tabindex="-1">Ya decidiste con la escena en mente.</h3><p>Lo siguiente es preparar la respuesta por bloques. Después pasarás a una conversación sin modelo.</p><a class="button dark" href="#ritmo">Continuar: repetir en bloques →</a> <button class="text-toggle" id="restart-quiz">Practicar las ocho otra vez</button>';
  $('#restart-quiz').addEventListener('click',()=>{quizIndex=0;renderQuiz(true);});
 }else{
  const q=questions[quizIndex];quizAnswered=false;
  $('#quiz-count').textContent=`ESCENA ${quizIndex+1} / ${questions.length}`;
  $('#quiz-card').innerHTML=`<div class="quiz-scene"><span class="scene-symbols" aria-hidden="true">${q.visual}</span><span>${q.scene}</span></div><h3 tabindex="-1">${q.prompt}</h3><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option" data-choice="${i}"><span aria-hidden="true">${'ABC'[i]}</span><span class="option-copy" ${q.id==='would'||q.id==='zero'?'':'lang="en"'}>${escape(o.text)}</span></button>`).join('')}</div>`;
 }
 if(focus)$('#quiz-card h3').focus({preventScroll:true});
}
$('#quiz-card').addEventListener('click',event=>{
 const button=event.target.closest('[data-choice]');if(!button||quizAnswered)return;
 const q=questions[quizIndex],option=q.options[Number(button.dataset.choice)];
 $$('.quiz-option').forEach(b=>b.classList.remove('incorrect'));
 $('#quiz-feedback').textContent=option.feedback;$('#quiz-feedback').className=`quiz-feedback ${option.correct?'':'wrong'}`;
 button.classList.add(option.correct?'correct':'incorrect');
 if(option.correct){quizAnswered=true;$$('.quiz-option').forEach(b=>b.disabled=true);if(!progress.solved.includes(q.id))progress.solved.push(q.id);save();$('#quiz-progress').value=progress.solved.length;$('#quiz-progress-label').textContent=`${progress.solved.length} resueltas`;$('#quiz-next').hidden=false;$('#quiz-next').textContent=quizIndex===questions.length-1?'Pasar a la conversación →':'Siguiente escena →';}
});
$('#quiz-next').addEventListener('click',()=>{quizIndex++;renderQuiz(true);});renderQuiz();

$('#chunk-practice').innerHTML=chunks.map((chunk,i)=>`<div class="chunk-row"><button data-audio="${chunk.audio}" aria-label="Escuchar ${escape(audioTexts[chunk.audio])}">▶</button><span><small class="chunk-count">BLOQUE ${i+1} DE ${chunks.length}</small><span lang="en">${escape(chunk.text)}</span><small>${chunk.cue}</small></span></div>`).join('');
let promptIndex=0,timer=null,seconds=30,supportDuringAttempt=false;
function stopTimer(message='Intento terminado. Compara tu idea cuando quieras.'){
 clearInterval(timer);timer=null;$('#timer-status').textContent=message;$('#timer-stop').hidden=true;$('.timer-row').classList.remove('running');$('#speak-start').disabled=false;$('#speak-start').textContent='Intentar otra vez sin pistas · 30 s';
}
function renderPrompt(){
 stopTimer('Tómate tu tiempo. Puedes terminar antes o seguir después.');supportDuringAttempt=false;
 const p=prompts[promptIndex];$('#speaking-prompt').innerHTML=`<h3 lang="en">${escape(p.question)}</h3><p>${p.scene}</p>`;
 $('#speaking-hints').hidden=true;$('#hint-toggle').setAttribute('aria-expanded','false');$('#hint-toggle').textContent='Ver mapa de apoyo';$('#model-answer').open=false;$('#model-text').textContent=p.model;
 $$('[data-self]').forEach(c=>c.checked=false);$('#attempt-feedback').textContent='';$('#speak-start').textContent='Responder sin pistas · 30 s';
}
$('#new-prompt').addEventListener('click',()=>{promptIndex=(promptIndex+1)%prompts.length;renderPrompt();});
$('#model-audio').addEventListener('click',()=>playAudio(prompts[promptIndex].audio));
$('#hint-toggle').addEventListener('click',()=>{const show=$('#speaking-hints').hidden;$('#speaking-hints').hidden=!show;$('#hint-toggle').setAttribute('aria-expanded',String(show));$('#hint-toggle').textContent=show?'Ocultar mapa de apoyo':'Ver mapa de apoyo';if(show&&timer)supportDuringAttempt=true;});
$('#model-answer').addEventListener('toggle',()=>{if($('#model-answer').open&&timer)supportDuringAttempt=true;});
$('#speak-start').addEventListener('click',()=>{
 player.pause();$('#speaking-hints').hidden=true;$('#hint-toggle').setAttribute('aria-expanded','false');$('#hint-toggle').textContent='Ver mapa de apoyo';$('#model-answer').open=false;
 supportDuringAttempt=false;$$('[data-self]').forEach(c=>c.checked=false);$('#attempt-feedback').textContent='';clearInterval(timer);seconds=30;
 $('#timer-status').textContent='30 s · Cuenta la historia en voz alta.';$('#timer-stop').hidden=false;$('.timer-row').classList.add('running');$('#speak-start').disabled=true;
 timer=setInterval(()=>{seconds--;if(seconds<=0)stopTimer('Terminó la guía de 30 s. Puedes seguir hablando; no es un examen de velocidad.');else $('#timer-status').textContent=`${seconds} s · Cuenta la historia en voz alta.`;},1000);
});
$('#timer-stop').addEventListener('click',()=>stopTimer());
$('#save-attempt').addEventListener('click',()=>{
 const values=Object.fromEntries($$('[data-self]').map(c=>[c.dataset.self,c.checked]));
 if(!Object.values(values).some(Boolean)){$('#attempt-feedback').textContent='Marca lo que realmente pudiste hacer en tu respuesta; puedes guardar un intento con apoyo.';return;}
 if(supportDuringAttempt&&values.independent){$('#attempt-feedback').textContent='Abriste apoyo durante este intento. Desmarca la respuesta sin modelo para guardar este intento con apoyo, o inténtalo de nuevo sin pistas.';return;}
 if(timer)stopTimer();
 const at=Date.now();progress.attempts.push({prompt:prompts[promptIndex].id,at,...values});progress.attempts=progress.attempts.slice(-30);if(!progress.startedAt)progress.startedAt=at;save();renderRecall();
 $('#attempt-feedback').textContent=canStore?'Autoevaluación guardada. No es una evaluación automática de tu inglés. Vuelve a intentarlo otro día con una situación distinta.':'Autoevaluación registrada durante esta visita. El almacenamiento no está disponible y no se conservará al salir.';
});
function renderRecall(){
 const last=progress.attempts.at(-1),base=progress.startedAt;
 $('#recall-status').innerHTML=`<div class="recall-row"><b>${last?'Última autoevaluación':'Tu primer intento'}</b><span>${last?new Date(last.at).toLocaleDateString('es-CL'):'Todavía sin guardar'}</span></div>`+[1,3,7].map(days=>{const due=base?new Date(base):null;if(due)due.setDate(due.getDate()+days);return `<div class="recall-row"><b>${days===1?'Al día siguiente':`A los ${days} días`}</b><span>${due?`${due.toLocaleDateString('es-CL')}${Date.now()>=due.getTime()?' · ya puedes repasar':''}`:'Después de tu primer intento'}</span></div>`;}).join('');
}
$('#reset-progress').addEventListener('click',()=>{
 if(!window.confirm('¿Borrar las escenas resueltas y autoevaluaciones guardadas en este navegador?'))return;
 progress=normalizeProgress(null);save();quizIndex=0;renderQuiz();renderPrompt();renderRecall();$('#reset-status').textContent='Progreso local borrado. Puedes comenzar de nuevo.';
});
renderPrompt();renderRecall();
initLessonNavigation({onLeave:()=>{
 player.pause();$('#lesson-player').hidden=true;document.body.classList.remove('audio-open');
 if(timer)stopTimer('Intento pausado al cambiar de paso. Puedes volver a intentarlo cuando quieras.');
}});
