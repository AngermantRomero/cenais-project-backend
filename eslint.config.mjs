// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Cambiado a "warn" para alertarte del uso de "any" y mantener flexibilidad.
      '@typescript-eslint/no-floating-promises': 'error', // Aumenta el nivel a "error" para evitar promesas sin manejar, lo que puede causar problemas serios.
      '@typescript-eslint/no-unsafe-argument': 'error', // Refuerza el control al elevarlo a "error" para evitar argumentos no seguros.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Nueva regla que evita advertencias por variables sin usar, especialmente si inician con "_".
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto', // Mantiene consistencia en los finales de línea entre diferentes sistemas operativos.
          singleQuote: true, // Prefiere comillas simples para un estilo de código más limpio.
          tabWidth: 2, // Usa 2 espacios para la indentación para mayor claridad.
        },
      ],
    },
    
  },
);
