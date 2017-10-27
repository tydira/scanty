# Scanty

[![TravisCI](https://img.shields.io/travis/kroogs/scanty.svg)](https://travis-ci.org/kroogs/scanty)
[![Coverage](https://img.shields.io/coveralls/kroogs/scanty.svg)](https://coveralls.io/github/kroogs/scanty)
[![Dependencies](https://img.shields.io/david/kroogs/scanty.svg)](https://david-dm.org/kroogs/scanty)
[![Dev Dependencies](https://img.shields.io/david/dev/kroogs/scanty.svg)](https://david-dm.org/kroogs/scanty?type=dev)
[![npm version](https://img.shields.io/npm/v/scanty.svg)](https://www.npmjs.com/package/scanty)
[![MIT License](https://img.shields.io/github/license/kroogs/scanty.svg)](https://github.com/kroogs/scanty/blob/master/LICENSE)

A small library for building toy lexers.

## Install

  ```shell
  npm --save install scanty
  ```

## Examples

  Lex input into tokens:

  ```javascript
  import { Lexer } from 'scanty'

  const rules = [
    { name: 'word',    match: /[a-zA-Z]+/ },
    { name: 'float',   match: /\d*\.\d+/ },
    { name: 'integer', match: /\d+/ },
    { name: 'space',   match: /\s+/ },
  ]

  const common = new Lexer(rules)
  common.scan('one 2 3.0')
  // [
  //   { type: 'word',    value: 'one', position: 0 },
  //   { type: 'space',   value: ' ',   position: 3 },
  //   { type: 'integer', value: '2',   position: 4 },
  //   { type: 'space',   value: ' ',   position: 5 },
  //   { type: 'float',   value: '3.0', position: 6 },
  // ]
  ```

  > Order matters! Rules are matched in the order they were created with `lexer.rule()`
  > or `new Lexer()`. If we swap the order of `float` and `integer` in our
  > example, the `float` match has a value of '.0' instead of the intended '3.0'

  You can add more rules with `lexer.rule()` and call `lexer.scan()`
  on additional input.

  ```javascript
  common.rule('bang', '!')
  common.scan("I ate 10 tacos!")
  // [
  //   { type: 'word',    value: 'I',     position: 0   },
  //   { type: 'space',   value: ' ',     position: 1   },
  //   { type: 'word',    value: 'ate',   position: 2   },
  //   { type: 'space',   value: ' ',     position: 5   },
  //   { type: 'integer', value: '10',    position: 6   },
  //   { type: 'space',   value: ' ',     position: 8   },
  //   { type: 'word',    value: 'tacos', position: 9   },
  //   { type: 'bang',    value: '!',     position: 14  },
  // ]
  ```
