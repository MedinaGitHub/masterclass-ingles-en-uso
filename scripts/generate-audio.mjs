import {spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {audioTexts} from '../content.mjs';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
mkdirSync(join(root,'audio'),{recursive:true});
const manifest=[];
for(const [id,text] of Object.entries(audioTexts)){
 const temporary=join(tmpdir(),`masterclass-${process.pid}-${id}.aiff`);
 const destination=join(root,'audio',`${id}.m4a`);
 try{
  for(const [command,args] of [
   ['/usr/bin/say',['-v','Samantha','-r','165','-o',temporary,text]],
   ['/usr/bin/afconvert',['-f','m4af','-d','aac','-b','64000',temporary,destination]],
  ]){const result=spawnSync(command,args,{encoding:'utf8',timeout:45000});if(result.status!==0)throw new Error(result.stderr||String(result.error));}
  const bytes=readFileSync(destination);if(bytes.length<2000)throw new Error(`Audio demasiado pequeño: ${id}`);
  manifest.push({id,file:`audio/${id}.m4a`,text,voice:'Samantha',locale:'en-US',wordsPerMinute:165,synthetic:true,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  console.log(`Audio preparado: ${id}`);
 }finally{rmSync(temporary,{force:true});}
}
writeFileSync(join(root,'audio','manifest.json'),JSON.stringify(manifest,null,2)+'\n');
