import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of Firebase packages to handle
const FIREBASE_PACKAGES = [
  'app',
  'auth',
  'firestore',
  'storage',
  'functions',
  'messaging',
  'database'
];

/**
 * Resolve the path to a Firebase package
 */
function resolveFirebasePath(pkg) {
  const paths = [
    // Try direct resolution first (works in most cases)
    () => {
      try {
        if (pkg === 'app') {
          return resolve(process.cwd(), 'node_modules', 'firebase', 'app', 'dist', 'index.esm.js');
        }
        return resolve(process.cwd(), 'node_modules', 'firebase', pkg, 'dist', 'index.esm.js');
      } catch (e) {
        return null;
      }
    },
    // Try pnpm's .pnpm directory structure
    () => {
      try {
        const pkgPath = require.resolve('firebase/package.json', {
          paths: [process.cwd()]
        });
        const pkgDir = dirname(pkgPath);
        if (pkg === 'app') {
          return resolve(pkgDir, 'app', 'dist', 'index.esm.js');
        }
        return resolve(pkgDir, pkg, 'dist', 'index.esm.js');
      } catch (e) {
        return null;
      }
    },
    // Fallback to node_modules in the project root
    () => {
      if (pkg === 'app') {
        return resolve(process.cwd(), 'node_modules', 'firebase', 'app', 'dist', 'index.esm.js');
      }
      return resolve(process.cwd(), 'node_modules', 'firebase', pkg, 'dist', 'index.esm.js');
    },
    // Fallback to node_modules in the plugin directory
    () => {
      if (pkg === 'app') {
        return resolve(__dirname, '..', 'node_modules', 'firebase', 'app', 'dist', 'index.esm.js');
      }
      return resolve(__dirname, '..', 'node_modules', 'firebase', pkg, 'dist', 'index.esm.js');
    }
  ];

  for (const pathResolver of paths) {
    try {
      const resolved = pathResolver();
      if (resolved) {
        require.resolve(resolved); // Check if the file exists
        return resolved;
      }
    } catch (e) {
      // Ignore and try next path
    }
  }
  
  throw new Error(`Could not resolve firebase/${pkg}`);
}

/**
 * Vite plugin to fix Firebase module resolution with pnpm
 */
export default function firebaseFix() {
  return {
    name: 'firebase-fix',
    config() {
      // Create aliases for all firebase submodules
      const aliases = {};
      
      // Add main firebase alias first
      try {
        const firebaseAppPath = resolveFirebasePath('app');
        aliases['firebase'] = firebaseAppPath;
        console.log(`[vite:firebase-fix] Resolved firebase -> ${firebaseAppPath}`);
      } catch (error) {
        console.error('[vite:firebase-fix] Failed to resolve firebase/app:', error.message);
        throw error;
      }
      
      // Add aliases for all firebase submodules
      for (const pkg of FIREBASE_PACKAGES) {
        if (pkg === 'app') continue; // Already handled above
        
        try {
          const resolvedPath = resolveFirebasePath(pkg);
          aliases[`firebase/${pkg}`] = resolvedPath;
          console.log(`[vite:firebase-fix] Resolved firebase/${pkg} -> ${resolvedPath}`);
        } catch (error) {
          console.error(`[vite:firebase-fix] Failed to resolve firebase/${pkg}:`, error.message);
          // Don't throw for optional packages
          if (pkg === 'messaging' || pkg === 'functions' || pkg === 'database') {
            console.warn(`[vite:firebase-fix] Continuing without firebase/${pkg} as it's optional`);
          } else {
            throw error;
          }
        }
      }

      return {
        resolve: {
          alias: Object.entries(aliases).map(([find, replacement]) => ({
            find,
            replacement
          }))
        },
        optimizeDeps: {
          // Include Firebase packages that need to be pre-bundled
          include: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
            'firebase/functions',
            'firebase/messaging',
            'firebase/database'
          ],
          // Exclude from optimization to prevent resolution issues
          exclude: ['firebase']
        },
        ssr: {
          // Ensure Firebase modules are properly bundled for SSR
          noExternal: true
        }
      };
    }
  };
}
