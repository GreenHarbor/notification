module.exports = {
    "env": {
        "browser": false, // Set browser environment to false
        "node": true,    // Enable Node.js environment
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    }
}
