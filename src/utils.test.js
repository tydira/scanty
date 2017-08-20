import Lexer from './lexer'
import * as u from './utils'

describe('Utils', function() {
  it('#isArray returns true with an Array argument', () => {
    expect(u.isArray([])).toBe(true)
    expect(u.isArray(['honk'])).toBe(true)
    expect(u.isArray('honk')).toBe(false)
  })

  it('#isBoolean returns true with an boolean argument', () => {
    expect(u.isBoolean(true)).toBe(true)
    expect(u.isBoolean(false)).toBe(true)
    expect(u.isBoolean('boop')).toBe(false)
  })

  it('#isFunction returns true with an function argument', () => {
    expect(u.isFunction(() => {})).toBe(true)
    expect(u.isFunction(class {})).toBe(true)
    expect(u.isFunction('honk')).toBe(false)
  })

  it('#isNull returns true with an null argument', () => {
    expect(u.isNull(null)).toBe(true)
    expect(u.isNull('honk')).toBe(false)
  })

  it('#isNumber returns true with an number argument', () => {
    expect(u.isNumber(1)).toBe(true)
    expect(u.isNumber('honk')).toBe(false)
  })

  it('#isRegex returns true with an RegExp argument', () => {
    expect(u.isRegex(/./)).toBe(true)
    expect(u.isRegex(5)).toBe(false)
  })

  it('#isString returns true with an string argument', () => {
    expect(u.isString('honk')).toBe(true)
    expect(u.isString(3)).toBe(false)
  })

  it('#isSymbol returns true with an symbol argument', () => {
    expect(u.isSymbol(Symbol('one'))).toBe(true)
    expect(u.isSymbol([])).toBe(false)
  })

  it('#isUndefined returns true with an undefined argument', () => {
    expect(u.isUndefined()).toBe(true)
    expect(u.isUndefined('honk')).toBe(false)
  })

  describe('matchers', function() {
    beforeEach(() => {
      const lex = new Lexer()
      this.scan = lex.scan.bind(lex)
    })

    it('#word matches a sequence of alphabetical characters', () => {
      expect(this.scan('honk', [u.matchers.word])).toEqual([
        { type: 'word', value: 'honk', position: 0 },
      ])
    })

    it('#whitespace matches a sequence whitespace', () => {
      expect(u.matchers.whitespace.match.test('blah')).toBe(false)
      expect(u.matchers.whitespace.match.test('\n\r\t ')).toBe(true)
    })

    it('#sentence matches a sentence', () => {
      const sentence = 'This is a sentence.'
      expect(u.matchers.sentence.match.test(sentence)).toBe(true)
    })

    it('#word matches a word', () => {
      expect(u.matchers.word.match.test('word')).toBe(true)
    })

    it('#word matches a word', () => {
      expect(u.matchers.word.match.test('word')).toBe(true)
    })

    it('#word matches a word', () => {
      expect(u.matchers.word.match.test('word')).toBe(true)
    })
  })
})
