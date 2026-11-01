# Inglés en uso — Antes. El cambio. Ahora.

Masterclass interactiva en español, con ejemplos y práctica en inglés. Parte de una conversación sobre tokens y cuotas para enseñar a contar un patrón anterior, un cambio y el balance hasta hoy. Inspirada en el enfoque de Inglés en la vida real; implementación independiente.

[Abrir la masterclass](https://medinagithub.github.io/masterclass-ingles-en-uso/)

## Recorrido guiado

La portada muestra una ruta de siete pasos. Durante la lección se ve un solo paso, con su objetivo, posición, navegación Anterior/Continuar y un reproductor compartido. Los ejemplos de `would` tienen su propio lugar en la ruta.

1. Escuchar la conversación y comprobar la comprensión.
2. Entender la historia en seis piezas.
3. Ver cinco ejemplos de `would` en uso.
4. Comparar recursos, límites y períodos de tiempo.
5. Resolver ocho decisiones en contexto.
6. Repetir seis bloques de sentido.
7. Responder sin modelo y guardar una autoevaluación.

Después aparece el plan de repaso. «Ver la ruta completa» permite volver al mapa y retomar desde el último paso abierto. La posición de lectura se guarda por separado de las respuestas de los ejercicios. Los enlaces anteriores (`#escucha`, `#historia`, `#would-examples`, etc.) siguen funcionando.

Los audios son sintéticos: ElevenLabs Eleven v4, voz Adam Spencer – Intelligent and Kind (en-US). Se sirven desde el mismo sitio. No hay evaluación automática de pronunciación ni garantías de fluidez. Las fechas de repaso son una propuesta de 1/3/7 días desde el primer intento guardado. No se envían notificaciones. El avance se guarda únicamente en localStorage y sigue funcionando durante la visita si el almacenamiento está bloqueado.

Fable y Opus 5.5 pertenecen al ejemplo proporcionado. No son una afirmación sobre la existencia, funcionamiento o cuotas de esos productos.

## Ejecutar

No necesita dependencias ni compilación.

```sh
python3 -m http.server 4187 --bind 127.0.0.1
```

Abrir <http://127.0.0.1:4187/>. Comprobar contenido, persistencia y manifiesto de audio con:

```sh
node --test tests/*.test.mjs
node --check app.mjs
```

Para regenerar los 17 audios, usa Node.js 22 o posterior y una clave privada de ElevenLabs. El generador comprueba voz, modelo y saldo; reutiliza los archivos ya generados con el mismo texto y perfil:

```sh
node --env-file=/ruta/privada/.env.local scripts/generate-audio.mjs
```

La clave `ELEVENLABS_API_KEY` solo se usa en el generador local. No se incluye en el código del navegador ni se sube a GitHub. El audio se guarda en MP3 de 44,1 kHz y 128 kbps; los ajustes de voz y el modelo quedan documentados en `audio-config.mjs` y en el manifiesto.

## Publicación

GitHub Pages sirve la raíz de la rama `main`. Todos los enlaces y recursos internos son relativos y admiten la ruta de proyecto. No incluye secretos, credenciales o contenido del repositorio privado de inspiración.

## Archivos

- `index.html` y `styles.css`: estructura y presentación adaptable.
- `content.mjs`: escenas, preguntas, modelos, textos de audio y validación del avance.
- `app.mjs`: reproductor único, ejercicios, visualizaciones, temporizador y persistencia.
- `lesson-route.mjs` y `lesson-navigation.mjs`: orden de los siete pasos, enlaces, posición de lectura y foco.
- `audio/manifest.json`: texto, voz y checksum de cada archivo de audio.
- `tests/content.test.mjs`: integridad y límites de los datos guardados.
- `docs/`: revisión pedagógica independiente y evidencia de verificación.

Contrastes gramaticales consultados: [British Council, hábitos pasados](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2-grammar/past-habits-used-to-would-past-simple) y [present perfect](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect).
