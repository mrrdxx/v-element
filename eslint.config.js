import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...vue.configs['flat/essential']
    ],
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { parser: tseslint.parser }
    },
    plugins: { prettier: prettier },
    rules: {
      'prettier/prettier': [2],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: [
            'Button',
            'Icon',
            'Input',
            'Link',
            'Modal',
            'Table',
            'Card',
            'Collapse',
            'Alert',
            'Tooltip',
            'Dropdown',
            'Message',
            'Basic',
            'Disabled',
            'Loading',
            'Size'
          ]
        }
      ]
    }
  }
)
