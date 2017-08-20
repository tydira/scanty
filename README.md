# Scanty

[![TravisCI](https://img.shields.io/travis/kroogs/scanty.svg)](https://travis-ci.org/kroogs/scanty)
[![Coverage](https://img.shields.io/coveralls/kroogs/scanty.svg)](https://coveralls.io/github/kroogs/scanty)
[![Dependencies](https://img.shields.io/david/kroogs/scanty.svg)](https://david-dm.org/kroogs/scanty)
[![Dev Dependencies](https://img.shields.io/david/dev/kroogs/scanty.svg)](https://david-dm.org/kroogs/scanty?type=dev)
[![MIT License](https://img.shields.io/github/license/kroogs/scanty.svg)](https://github.com/kroogs/scanty/blob/master/LICENSE)

## Install

  ```shell
  npm --save install scanty
  ```

## Example

  Lex arbitrary tokens from a RegExp.
  ```javascript
  import { Lexer } from 'scanty'

  const lexer = new Lexer()
  lexer.rule('char', /./)

  console.log(lexer.scan('hello'))
  // Output:
  // [
  //   { type: 'char', value: 'h', position: 0 },
  //   { type: 'char', value: 'e', position: 1 },
  //   { type: 'char', value: 'l', position: 2 },
  //   { type: 'char', value: 'l', position: 3 },
  //   { type: 'char', value: 'o', position: 4 },
  // ]
  ```
