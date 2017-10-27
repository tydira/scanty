// const symbols = {
//   '~': 'tilde',
//   '`': 'backtick',
//   '!': 'exclamation',
//   '@': 'at',
//   '#': 'pound',
//   $: 'dollar',
//   '%': 'percent',
//   '^': 'carat',
//   '&': 'ampersand',
//   '*': 'asterisk',
//   '(': 'paren-open',
//   ')': 'paren-close',
//   '-': 'hyphen',
//   _: 'underscore',
//   '=': 'equals',
//   '+': 'plus',
//   '[': 'square-open',
//   ']': 'square-close',
//   '{': 'curly-open',
//   '}': 'curly-close',
//   '\\': 'backslash',
//   '|': 'pipe',
//   ';': 'semicolon',
//   ':': 'colon',
//   "'": 'single-quote',
//   '"': 'double-quote',
//   ',': 'comma',
//   '.': 'period',
//   '<': 'less',
//   '>': 'greater',
//   '/': 'slash',
//   '?': 'question-mark',
// }

export const matchers = {
  word: {
    name: 'word',
    match: /[a-zA-Z]+/,
  },

  whitespace: {
    name: 'whitespace',
    match: /\s+/,
  },

  sentence: {
    name: 'sentence',
    match: /[\w\s'",-]+\./,
  },

  paragraph: {
    name: 'paragraph',
    match: /^.*$/m,
  },

  newline: {
    name: 'newline',
    match: /\n/,
  },

  integer: {
    name: 'integer',
    match: /\d+/,
  },

  float: {
    name: 'float',
    match: /\d*\.\d+/,
  },

  number: {
    name: 'number',
    match: /\d*\.\d+|\d+/,
  },

  // call: {
  //   name: 'call',
  //   match: /([\w.]+)\((.*)\)/,
  // },

  // comment: {
  //   name: 'comment',
  //   match: /(?:(?:\/\/|#).*$|\/\*(.|\n)*?\*\/)/,
  // },

  symbol: {
    name: 'symbol',
    match: /[^\w\s]/,
  },

  // 'symbol-map': {
  //   name: 'symbol',
  //   match: /^[^\w\s]/,
  //   handler: context => {
  //     const symbol = symbols[context.token[1]]
  //     if (symbol) context.tokens.push([symbol, context.token[1]])
  //   },
  // },

  string: {
    name: 'string',
    match: /(?:"[^"\n]*"|'[^'\n]*')/,
  },

  unknown: {
    name: 'unknown',
    match: /[\s\S]/,
  },

  terminator: {
    name: 'terminator',
    match: /[\n;]+/,
  },
}
