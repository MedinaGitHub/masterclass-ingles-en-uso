import {mkdirSync,readFileSync,writeFileSync,existsSync,copyFileSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {audioTexts} from '../content.mjs';
import {audioProfile} from '../audio-config.mjs';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const destination=join(root,'audio');
const staging=join(root,'.audio-staging');
const key=process.env.ELEVENLABS_API_KEY;
if(!key)throw new Error('Falta ELEVENLABS_API_KEY en el entorno. Cárgala desde un archivo privado con node --env-file=/ruta/privada/.env.local scripts/generate-audio.mjs.');
const checksum=bytes=>createHash('sha256').update(bytes).digest('hex');
const readManifest=path=>{try{return JSON.parse(readFileSync(path,'utf8'));}catch{return [];}};
const fingerprint=text=>checksum(JSON.stringify({text,...audioProfile}));
function valid(entry,text,directory){
 if(!entry||entry.fingerprint!==fingerprint(text))return false;
 const file=join(directory,`${entry.id}.mp3`);
 return existsSync(file)&&checksum(readFileSync(file))===entry.sha256;
}
async function request(path,body){
 const response=await fetch(`https://api.elevenlabs.io${path}`,{method:body?'POST':'GET',headers:{'xi-api-key':key,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(60000)});
 if(!response.ok){
  let status='request_failed';try{const result=await response.json();if(typeof result.detail?.status==='string')status=result.detail.status;}catch{}
  throw new Error(`ElevenLabs HTTP ${response.status}: ${status}. No se reintenta automáticamente para evitar consumo duplicado.`);
 }
 return response;
}
mkdirSync(staging,{recursive:true});mkdirSync(destination,{recursive:true});
const existing=readManifest(join(destination,'manifest.json'));
const staged=readManifest(join(staging,'manifest.json'));
const pending=Object.entries(audioTexts).filter(([id,text])=>!valid(staged.find(e=>e.id===id),text,staging)&&!valid(existing.find(e=>e.id===id),text,destination));
if(pending.length){
 const [models,voice,subscription]=await Promise.all([
  request('/v1/models').then(r=>r.json()),
  request(`/v1/voices/${audioProfile.voiceId}`).then(r=>r.json()),
  request('/v1/user/subscription').then(r=>r.json()),
 ]);
 if(!models.some(m=>m.model_id===audioProfile.modelId&&m.can_do_text_to_speech))throw new Error('El modelo solicitado no está disponible. No se sustituye por otro.');
 if(voice.voice_id!==audioProfile.voiceId||voice.name!==audioProfile.voice)throw new Error('La identidad de la voz no coincide con Adam Spencer.');
 const characters=pending.reduce((sum,[,text])=>sum+text.length,0);
 if(!Number.isFinite(subscription.character_limit)||!Number.isFinite(subscription.character_count)||subscription.character_limit-subscription.character_count<characters)throw new Error('No hay saldo confirmado suficiente. No se activa facturación adicional.');
 console.log(`Generación: ${pending.length} audios, ${characters} caracteres, ${audioProfile.voice}, ${audioProfile.modelId}.`);
}
const completed=[];
// Keep the working bank intact until every replacement is generated. Cache each
// success so an interrupted run resumes without paying for completed examples.
for(const [id,text] of Object.entries(audioTexts)){
 let entry=staged.find(e=>e.id===id);
 if(!valid(entry,text,staging)){
  const saved=existing.find(e=>e.id===id);
  if(valid(saved,text,destination)){entry=saved;copyFileSync(join(destination,`${id}.mp3`),join(staging,`${id}.mp3`));}
  else{
   const response=await request(`/v1/text-to-speech/${audioProfile.voiceId}?output_format=${audioProfile.outputFormat}`,{
    text,model_id:audioProfile.modelId,language_code:'en',apply_text_normalization:'on',voice_settings:audioProfile.voiceSettings,
   });
   const bytes=Buffer.from(await response.arrayBuffer());
   if(bytes.length<2000||!(bytes.toString('ascii',0,3)==='ID3'||(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0)))throw new Error(`El audio ${id} no es un MP3 válido. Se conserva el banco anterior.`);
   writeFileSync(join(staging,`${id}.mp3`),bytes);
   entry={id,file:`audio/${id}.mp3`,text,...audioProfile,synthetic:true,generatedAt:new Date().toISOString(),fingerprint:fingerprint(text),bytes:bytes.length,sha256:checksum(bytes)};
  }
 }
 completed.push(entry);
 writeFileSync(join(staging,'manifest.json'),JSON.stringify(completed,null,2)+'\n');
 console.log(`Audio listo: ${id}`);
}
for(const entry of completed)copyFileSync(join(staging,`${entry.id}.mp3`),join(destination,`${entry.id}.mp3`));
writeFileSync(join(destination,'manifest.json'),JSON.stringify(completed,null,2)+'\n');
for(const id of Object.keys(audioTexts))rmSync(join(destination,`${id}.m4a`),{force:true});
console.log(`Banco actualizado: ${completed.length} audios ElevenLabs.`);
