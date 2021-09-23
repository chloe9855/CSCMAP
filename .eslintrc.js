module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 12,
    sourceType: 'module'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'off',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    'no-unused-vars': ['off'],
    'no-undef': ['off'],
    'no-console': ['off'],
    'nuxt/no-env-in-hooks': ['off'],
    'vue/require-default-prop': ['off'],
    'node/no-path-concat': ['off'],
    'vue/order-in-components': ['error', {
      order: [
        'el',
        ['template', 'render'],
        'renderError',
        'data',
        'name',
        'head',
        'key',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        ['provide', 'inject'],
        'ROUTER_GUARDS',
        'layout',
        'middleware',
        'validate',
        'scrollToTop',
        'transition',
        'loading',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'emits',
        'setup',
        'asyncData',
        'fetch',
        'LIFECYCLE_HOOKS',
        'methods',
        'computed',
        'watch',
        'watchQuery'
      ]
    }]
  }
};
