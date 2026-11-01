# Posecraft - Editor de poses e animações para Second Life

Editor web para criar poses, importar movimento de vídeos e exportar animações para revisar no viewer.

**Abrir o editor:** https://wolfosbournesl.github.io/posecraft-sl-animation-studio/

## Recursos

- Avatares masculino e feminino rigados, com 49 controles e articulações dos dedos.
- Ferramentas de mover e girar, campos numéricos e presets de mãos e pés.
- Timeline com quadros-chave, reprodução, FPS, duração e biblioteca local de animações.
- Interface em português, inglês e espanhol.
- Importa animações MMD `.vmd` carregadas localmente.
- Exporta `.bvh`, `.anim` e JSON do projeto.
- Captura movimento de um vídeo local com estimativa de pose do MediaPipe.

## Capturar movimento de vídeo

1. Abra **Capturar movimento** e selecione um vídeo MP4, WebM ou MOV compatível com o navegador.
2. Escolha a amostragem e a duração; o editor analisa até 30 segundos do vídeo.
3. Revise o esqueleto sobre o vídeo e aplique a sequência à timeline. A aplicação substitui os quadros atuais.
4. Ajuste os quadros e exporte para o formato desejado.

O vídeo é processado no navegador e não é enviado ao servidor. Na primeira captura, o navegador baixa o modelo de pose e os arquivos de inferência do MediaPipe; é necessária conexão à internet. O tempo de processamento depende do dispositivo, da duração e da amostragem.

Para vídeos do YouTube, TikTok ou outros sites, selecione um arquivo obtido por um método permitido e que você tenha direito de usar. O editor não processa diretamente páginas, links de streaming ou baixa vídeos dessas plataformas.

A estimativa funciona melhor com uma pessoa de corpo inteiro, câmera estável e boa iluminação. Ela aproxima a pose 3D a partir de um vídeo 2D: não recupera profundidade real, dedos ou movimentos ocultos, e movimento de câmera pode afetar o deslocamento do quadril. Confira e ajuste a animação antes de exportar.

## Executar localmente

1. Clone este repositório.
2. Na pasta do projeto, execute `python -m http.server 4173`.
3. Acesse `http://127.0.0.1:4173/dist/`.

## Licenças

Consulte `dist/assets/QUATERNIUS-LICENSE.txt` e `dist/assets/MODEL-CREDITS.txt` para os créditos e termos dos avatares. A biblioteca MediaPipe Tasks Vision é carregada do jsDelivr; o modelo de pose é servido pelo Google MediaPipe Models.
