import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {questions,scenes,prompts,chunks,audioTexts,normalizeProgress,fullAnswer} from '../content.mjs';
import {audioProfile} from '../audio-config.mjs';
test('cada decisión tiene una única respuesta correcta y feedback útil para cada alternativa',()=>{
 assert.equal(questions.length,8);
 assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
 for(const question of questions){assert.equal(question.options.filter(o=>o.correct).length,1);for(const o of question.options)assert.ok(o.feedback.length>70);}
});
test('las escenas, bloques y situaciones orales tienen audio real con texto y checksum coincidentes',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../audio/manifest.json',import.meta.url)));
 assert.equal(manifest.length,Object.keys(audioTexts).length);
 for(const id of [...scenes.map(s=>s.id),...chunks.map(c=>c.audio),...prompts.map(p=>p.audio),'question','full']){
  const entry=manifest.find(a=>a.id===id);assert.ok(entry,`Falta ${id}`);assert.equal(entry.text,audioTexts[id]);
  assert.equal(entry.provider,'ElevenLabs');assert.equal(entry.modelId,'eleven_v4');assert.equal(entry.voiceId,audioProfile.voiceId);assert.equal(entry.voice,audioProfile.voice);
  const bytes=readFileSync(new URL(`../${entry.file}`,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);assert.ok(bytes.length>2000);
 }
 assert.equal(audioTexts.full,fullAnswer);
});
test('el progreso ajeno o corrupto no produce ejercicios completados ni autoevaluaciones ficticias',()=>{
 assert.deepEqual(normalizeProgress(null).solved,[]);
 assert.deepEqual(normalizeProgress({version:9,solved:['habit']}).solved,[]);
 const cleaned=normalizeProgress({version:1,solved:['habit','habit','inventado'],attempts:[null,{at:'ayer'},{prompt:'tokens',at:123,before:true,change:false,independent:true}],startedAt:'hoy'});
 assert.deepEqual(cleaned.solved,['habit']);assert.equal(cleaned.attempts.length,1);assert.equal(cleaned.startedAt,null);
});
test('se conserva un historial acotado de autoevaluaciones y se rechazan tipos inválidos',()=>{
 const attempt={prompt:'battery',at:123,before:true,change:true,independent:false};
 const result=normalizeProgress({version:1,attempts:[...Array(35).fill(attempt),{...attempt,independent:'sí'}],solved:[]});
 assert.equal(result.attempts.length,30);assert.equal(result.attempts[0].independent,false);
});
