# Posecraft ? Editor de poses e anima??es para Second Life

Editor visual para criar poses e anima??es humanoides, organizar quadros-chave e exportar arquivos para testar no Second Life.

**Abrir o editor:** https://wolfosbournesl.github.io/posecraft-sl-animation-studio/

## Recursos

- Avatares masculinos e femininos com esqueleto articulado, 49 controles e 30 articula??es dos dedos.
- Ferramentas de mover e girar, campos num?ricos e limites de deslocamento para manter as juntas conectadas.
- Timeline com quadros-chave, reprodu??o, FPS e dura??o.
- Presets de m?os e p?s, poses de exemplo e m?ltiplos avatares na cena.
- Interface em portugu?s, ingl?s e espanhol.
- Importa??o local de anima??es MMD no formato `.vmd`.
- Exporta??o de anima??es `.bvh`, `.anim` e projetos Posecraft em JSON.

## Usar no navegador

A vers?o p?blica ? publicada pelo GitHub Pages a partir da pasta `dist/`. Abra o endere?o do Pages e use o editor diretamente no navegador. A aplica??o salva rascunhos no armazenamento local do navegador.

## Executar localmente

1. Clone este reposit?rio.
2. Abra um terminal na pasta do projeto.
3. Execute `python -m http.server 4173`.
4. Acesse `http://127.0.0.1:4173/dist/`.

A cena 3D e o parser MMD carregam depend?ncias do Three.js por CDN; ? necess?ria conex?o ? internet.

## Modelos e licen?as

Os avatares FBX v?m do pacote Universal Base Characters, de Quaternius, distribu?do sob CC0. A licen?a e os cr?ditos est?o em `dist/assets/QUATERNIUS-LICENSE.txt` e `dist/assets/MODEL-CREDITS.txt`.

## Compatibilidade

A exporta??o gera arquivos para avalia??o no viewer. O carregamento no editor n?o garante compatibilidade final de cada anima??o no Second Life; confira o resultado no viewer antes de usar ou enviar. O formato `.anim` ? o formato bin?rio interno do viewer.

Para importar MMD, obtenha um arquivo `.vmd` de uma fonte que permita seu uso e selecione-o localmente. O editor n?o busca nem baixa anima??es a partir de sites.

## Publica??o

Cada push para `main` publica automaticamente `dist/` no GitHub Pages usando GitHub Actions. O workflow est? em `.github/workflows/pages.yml`.
