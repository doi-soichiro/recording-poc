// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'], // TypeScriptプロジェクトの指定
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      'no-implicit-coercion': 'error',
      'prefer-template': 'error',
      'vue/multi-word-component-names': 'off',
    },
    ignores: ['eslint.config.mjs'], // 型情報が不要なファイルを無視
  },
)
