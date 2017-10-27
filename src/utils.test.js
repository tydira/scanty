import Lexer from './lexer'
import * as u from './utils'

describe('Utils', function() {
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
