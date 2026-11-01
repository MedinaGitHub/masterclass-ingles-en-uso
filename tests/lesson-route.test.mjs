import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonSteps,resolveLessonView,normalizeLessonPosition,lessonNeighbors} from '../lesson-route.mjs';
test('la ruta tiene siete pasos distintos y cada siguiente lleva al paso inmediato',()=>{
 assert.equal(lessonSteps.length,7);
 assert.equal(new Set(lessonSteps.map(s=>s.id)).size,7);
 lessonSteps.forEach((step,i)=>{
  const neighbors=lessonNeighbors(step.id);
  assert.equal(neighbors.previous,i===0?'inicio':lessonSteps[i-1].id);
  assert.equal(neighbors.next,i===6?'repaso':lessonSteps[i+1].id);
 });
});
test('enlaces anteriores y el nuevo bloque de would abren el paso correcto',()=>{
 for(const id of ['escucha','historia','laboratorio','practica','habla','would-examples'])assert.equal(resolveLessonView('#'+id),id);
 assert.equal(resolveLessonView('#chunk-practice'),'ritmo');
 assert.equal(resolveLessonView('#repaso'),'repaso');
 assert.equal(resolveLessonView('#desconocido'),'inicio');
 assert.equal(resolveLessonView(''),'inicio');
});
test('retomar solo acepta un paso válido sin modificar el avance de los ejercicios',()=>{
 assert.equal(normalizeLessonPosition('ritmo'),'ritmo');
 for(const invalid of [null,{},'repaso','inicio','<script>'])assert.equal(normalizeLessonPosition(invalid),null);
});
