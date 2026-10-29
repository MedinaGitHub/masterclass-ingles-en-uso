# Verificación de la masterclass

Fecha: 28 de octubre de 2026, America/Santiago.

Historia verificada: entrar en la conversación → escuchar sin texto → revelar el modelo → explorar intención y tiempo → decidir en escenas nuevas → producir una respuesta propia → guardar autoevaluación y volver.

## Ejecución real

- Servidor HTTP estático local: respuesta 200. No hay API ni base de datos; los audios se leen desde archivos y el avance vive en el navegador.
- Reproducción de la respuesta completa en navegador: `readyState=4`, `paused=false`, duración 11,238 s. Cambio de velocidad a 0,8 confirmado por `playbackRate`.
- Primera comprensión: alternativa incorrecta devuelve una pista contextual; alternativa correcta confirma la historia. Segunda comprensión: contraste entre límites mensual y semanal con feedback específico.
- Explorador de seis fragmentos: cambios de panel, focos visuales, mapa de contexto y recorrido desde el cambio.
- Slider mediante teclado hasta 100: restante 0%, tanque vacío, “I've run out of tokens”, tope alcanzado y “I've hit the limit”.
- Cambio de período: Yesterday produce “I didn't hit any limits yesterday”; Since the switch produce “I haven't hit any limits since the switch”.
- Ocho ejercicios resueltos en el navegador; comprobado un error y posterior reintento. Al recargar: “8 resueltas” y “LAS 8 ESCENAS RESUELTAS”.
- Producción: el inicio oculta pistas y modelo; el temporizador puede terminarse antes. Abrir apoyo durante un intento y marcar independencia produce una aclaración; el intento se guarda al desmarcarla.
- Consultar el modelo después de terminar permite guardar una autoevaluación independiente. La evaluación del contenido hablado depende del alumno; no hay análisis de voz ni puntuación automática.
- Autoevaluación persistente tras recarga y fechas de repaso calculadas desde el primer intento guardado.
- Responsive: 390 × 844 y 320 × 760. Ancho del documento igual al viewport (390 y 320, respectivamente); navegación y fragmentos disponen de desplazamiento horizontal contenido.
- Consola del navegador: sin avisos ni errores durante el recorrido probado.
- Cuatro pruebas de Node aprobadas: respuestas y feedback, integridad de los 12 audios, rechazo de progreso inválido y límite del historial.

## Evidencia

Capturas de ejecución real guardadas en una carpeta de proyecto y fecha del Escritorio del usuario. Las vistas de laboratorio se recapturaron después de eliminar desplazamiento y transiciones que contaminaban capturas tempranas. No son maquetas.

## Límites

- Verificado en el navegador integrado del entorno; no se ejecutó una matriz de navegadores físicos.
- La interfaz ofrece audio y autoevaluación oral; no verifica la calidad de la respuesta hablada.
- No hay sincronización entre dispositivos o notificaciones de repaso.

Publicación configurada en GitHub Pages, desde la raíz de `main`, con HTTPS forzado. Dirección: https://medinagithub.github.io/masterclass-ingles-en-uso/. La entrega incluye la comprobación del sitio publicado.
