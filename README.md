# Inglés en uso — Antes. El cambio. Ahora.

Masterclass interactiva en español, con ejemplos y práctica en inglés. Parte de una conversación sobre tokens y cuotas para enseñar a contar un patrón anterior, un cambio y el balance hasta hoy. Inspirada en el enfoque de Inglés en la vida real; implementación independiente.

[Abrir la masterclass](https://medinagithub.github.io/masterclass-ingles-en-uso/)

## Recorrido

1. Escuchar una pregunta y su respuesta antes de revelar el texto.
2. Explorar seis fragmentos con mapas de la historia y audio.
3. Manipular consumo/restante/tope y alternar un período cerrado con uno que llega hasta hoy.
4. Resolver ocho decisiones en contexto con feedback por alternativa y reintento.
5. Practicar seis grupos de sentido y responder a cuatro situaciones con pistas ocultables, tiempo opcional y autoevaluación.

Los audios son sintéticos (Samantha, en-US). Se sirven desde el mismo sitio. No hay evaluación automática de pronunciación ni garantías de fluidez. Las fechas de repaso son una propuesta de 1/3/7 días desde el primer intento guardado. No se envían notificaciones. El avance se guarda únicamente en localStorage y sigue funcionando durante la visita si el almacenamiento está bloqueado.

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

Para regenerar los 12 audios en macOS con Samantha, `say` y `afconvert`:

```sh
node scripts/generate-audio.mjs
```

## Publicación

GitHub Pages sirve la raíz de la rama `main`. Todos los enlaces y recursos internos son relativos y admiten la ruta de proyecto. No incluye secretos, credenciales o contenido del repositorio privado de inspiración.

## Archivos

- `index.html` y `styles.css`: estructura y presentación adaptable.
- `content.mjs`: escenas, preguntas, modelos, textos de audio y validación del avance.
- `app.mjs`: reproductor único, ejercicios, visualizaciones, temporizador y persistencia.
- `audio/manifest.json`: texto, voz y checksum de cada archivo de audio.
- `tests/content.test.mjs`: integridad y límites de los datos guardados.
- `docs/`: revisión pedagógica independiente y evidencia de verificación.

Contrastes gramaticales consultados: [British Council, hábitos pasados](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2-grammar/past-habits-used-to-would-past-simple) y [present perfect](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect).
