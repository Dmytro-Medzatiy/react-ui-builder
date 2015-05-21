{
  "name": "<%= projectName %>",
  "version": "0.0.0",
  "description": "<%= projectName %>",
  "main": "",
  "scripts": {
    "build-dev": "webpack --config webpack.config.js --progress --colors",
    "test": "test"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^0.13.1"
  },
  "devDependencies": {
    "css-loader": "^0.9.1",
    "file-loader": "^0.8.1",
    "less": "^2.4.0",
    "less-loader": "^2.2.0",
    "jquery": "^2.1.3",
    "jsx-loader": "^0.12.2",
    "style-loader": "^0.8.3",
    "url-loader": "^0.5.5",
    "webpack": "^1.7.3"
  }
}
