module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        'airbnb-typescript',
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "vue",
        "@typescript-eslint",
        "plugin:prettier/recommended",
    ],
    "rules": {
      "prettier/prettier": "error",
      "no-continue": 0,
      "consistent-return": 0,
      "no-unused-vars": 1,
      "import/no-cycle": 0,
      "import/prefer-default-export": 0,
      "@typescript-eslint/no-unused-vars": 1,
    },
    "settings": {
      "import/resolver": {
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
};