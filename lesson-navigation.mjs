import {lessonSteps,resolveLessonView,normalizeLessonPosition,lessonNeighbors} from './lesson-route.mjs?v=20261101-guided-v2';

export function initLessonNavigation({onLeave=()=>{}}={}){
 const $=selector=>document.querySelector(selector);
 const panels=['inicio',...lessonSteps.map(step=>step.id),'repaso'];
 const key='english-in-use-route-v1';
 let last=null,current=null;
 try{last=normalizeLessonPosition(localStorage.getItem(key));}catch{}
 $('#lesson-step-list').innerHTML=lessonSteps.map((step,i)=>`<li><a href="#${step.id}" data-route-step="${step.id}"><span class="route-number">${i+1}</span><span>${step.label}</span><small class="route-state"></small></a></li>`).join('');
 $('#welcome-route').innerHTML=lessonSteps.map((step,i)=>`<li><a href="#${step.id}"><span class="welcome-number">${i+1}</span><span><strong>${step.label}</strong><small>${step.time}</small></span><span aria-hidden="true">→</span></a></li>`).join('');

 function render({focus=true}={}){
  const view=location.hash==='#contenido'?(current||last||'inicio'):resolveLessonView(location.hash);
  if(current!==null&&view!==current)onLeave();
  current=view;
  for(const id of panels)$('#'+id).hidden=id!==view;
  const course=lessonSteps.find(step=>step.id===view),neighbors=lessonNeighbors(view);
  $('#contenido').dataset.view=view;
  $('#lesson-sidebar').hidden=!course;
  $('#lesson-banner').hidden=!course;
  $('#lesson-actions').hidden=!course;
  $('#lesson-footer').hidden=!!course;
  $('#header-position').textContent=course?`Paso ${neighbors.index+1} de ${lessonSteps.length}`:view==='repaso'?'Tu repaso':'7 pasos · 25–30 min';
  if(course){
   last=course.id;
   try{localStorage.setItem(key,last);}catch{}
   $('#lesson-position').textContent=`PASO ${neighbors.index+1} DE ${lessonSteps.length} · ${course.time}`;
   $('#lesson-task').textContent=course.task;
   $('#lesson-prev').href=`#${neighbors.previous}`;
   $('#lesson-prev').textContent=neighbors.index===0?'Ver la ruta':'Anterior';
   $('#lesson-next').href=`#${neighbors.next}`;
   const next=lessonSteps[neighbors.index+1];
   $('#lesson-next').textContent=next?`Continuar: ${next.short.toLowerCase()}`:'Finalizar y ver mi repaso';
   $('#lesson-next-label').textContent=next?`Paso ${neighbors.index+2}: ${next.label}`:'Después: tu plan de repaso';
   document.title=`Paso ${neighbors.index+1} · ${course.label} — Inglés en uso`;
  }else document.title=view==='repaso'?'Tu repaso — Inglés en uso':'Tu ruta — Inglés en uso';
  document.querySelectorAll('[data-route-step]').forEach(link=>{
   const active=link.dataset.routeStep===view;
   if(active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');
   link.querySelector('.route-state').textContent=active?'Ahora':'';
  });
  const lastIndex=lessonSteps.findIndex(step=>step.id===last);
  $('#lesson-resume').hidden=lastIndex<=0;
  if(lastIndex>0){$('#lesson-resume').href=`#${last}`;$('#lesson-resume').textContent=`Retomar en el paso ${lastIndex+1}: ${lessonSteps[lastIndex].short.toLowerCase()}`;}
  if(focus){
   const heading=$('#'+view).querySelector('h1,h2');
   heading?.setAttribute('tabindex','-1');
   heading?.focus({preventScroll:true});
  }
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}));
 }
 window.addEventListener('hashchange',()=>render());
 $('.skip').addEventListener('click',event=>{
  event.preventDefault();
  const heading=$('#'+current)?.querySelector('h1,h2');
  heading?.setAttribute('tabindex','-1');
  heading?.focus();
 });
 render({focus:false});
 return {current:()=>current};
}
