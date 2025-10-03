import { defineConfig, Plugin } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import fs from 'fs';
import path from 'path';

// Helper to read the body of a request
function getRequestBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * A Vite plugin to provide a file-based API for managing tactic presets.
 */
function tacticFileApi(): Plugin {
  return {
    name: 'tactic-file-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // --- SAVE PRESET --- (Create or Update)
        if (req.url === '/api/save-preset' && req.method === 'POST') {
          try {
            const tactic = await getRequestBody(req);
            if (!tactic || !tactic.label || !tactic.id) {
              res.statusCode = 400;
              res.end('Invalid tactic data provided');
              return;
            }

            const fileName = tactic.label.toLowerCase().replace(/\s+/g, '-') + '.ts';
            const presetsDir = path.resolve(__dirname, 'packages/tactics/src/presets');
            const filePath = path.join(presetsDir, fileName);

            const fileContent = `import type { Tactic } from '../models/tactic';

const tactic: Tactic = {
  id: "${tactic.id}",
  label: "${tactic.label}",
  in_possession: {
    formation: "${tactic.in_possession.formation}",
    style: "${tactic.in_possession.style}",
  },
  out_of_possession: {
    formation: "${tactic.out_of_possession.formation}",
    style: "${tactic.out_of_possession.style}",
  },
  transition: {
    on_loss: "${tactic.transition.on_loss}",
    on_win: "${tactic.transition.on_win}",
  },
};

export default tactic;
`;

            fs.writeFileSync(filePath, fileContent);

            console.log(`[FTO] Saved preset file: ${fileName}`);
            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Preset saved successfully' }));
          } catch (e: any) {
            console.error(`[FTO] Error saving preset:`, e);
            res.statusCode = 500;
            res.end(e.message);
          }
          return;
        }

        // --- DELETE PRESET ---
        if (req.url === '/api/delete-preset' && req.method === 'POST') {
          try {
            const { label } = await getRequestBody(req);
            if (!label) {
              res.statusCode = 400;
              res.end('Invalid tactic label provided');
              return;
            }

            const fileName = label.toLowerCase().replace(/\s+/g, '-') + '.ts';
            const presetsDir = path.resolve(__dirname, 'packages/tactics/src/presets');
            const filePath = path.join(presetsDir, fileName);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`[FTO] Deleted preset file: ${fileName}`);
              res.statusCode = 200;
              res.end(JSON.stringify({ message: 'Preset deleted' }));
            } else {
              console.warn(`[FTO] Preset file not found for deletion: ${fileName}`);
              res.statusCode = 404;
              res.end('Preset file not found');
            }
          } catch (e: any) {
            console.error(`[FTO] Error deleting preset:`, e);
            res.statusCode = 500;
            res.end(e.message);
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    tacticFileApi()
  ],
  server: {
    fs: {
      // Allow serving files from the project root.
      allow: ['.'],
      cachedChecks: false,
      strict: false,
    },
  },
});
