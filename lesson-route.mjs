export const lessonSteps = [
  {id:'escucha',label:'Escucha la conversación',short:'Escuchar',time:'3 min',task:'Primero escucha la pregunta y la respuesta. Después elige qué historia oíste; al final, revela el texto para comprobar.'},
  {id:'historia',label:'Entiende las seis piezas',short:'Entender',time:'5 min',task:'Recorre las piezas del 1 al 6. Mira qué aporta cada una a la historia y escucha su ejemplo.'},
  {id:'would-examples',label:'Mira cómo se usa would',short:'Would en uso',time:'4 min',task:'Recorre los cinco ejemplos en orden. Escucha, imagina la acción repetida y di una versión con un detalle tuyo.'},
  {id:'laboratorio',label:'Compara los significados',short:'Comparar',time:'4 min',task:'Primero lleva el consumo al 100%. Después alterna Yesterday y Since the switch para ver qué cambia en la historia.'},
  {id:'practica',label:'Resuelve las ocho escenas',short:'Elegir',time:'5 min',task:'Elige la respuesta que encaja con cada escena. Lee el feedback y vuelve a intentarlo cuando lo necesites.'},
  {id:'ritmo',label:'Repite por bloques',short:'Repetir',time:'3 min',task:'Escucha el bloque 1 y repítelo en voz alta. Sigue con los demás; al terminar, intenta unirlos sin mirar.'},
  {id:'habla',label:'Responde por tu cuenta',short:'Responder',time:'4 min',task:'Responde en voz alta sin mirar el modelo. Después compara tu historia y guarda tu autoevaluación.'},
];
export function resolveLessonView(hash){
 const id=String(hash||'').replace(/^#/,'');
 if(id==='repaso')return 'repaso';
 if(id==='chunk-practice')return 'ritmo';
 return lessonSteps.some(step=>step.id===id)?id:'inicio';
}
export function normalizeLessonPosition(value){
 return lessonSteps.some(step=>step.id===value)?value:null;
}
export function lessonNeighbors(id){
 const index=lessonSteps.findIndex(step=>step.id===id);
 if(index<0)return null;
 return {index,previous:index===0?'inicio':lessonSteps[index-1].id,next:index===lessonSteps.length-1?'repaso':lessonSteps[index+1].id};
}
