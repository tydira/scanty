import Lexer from './lexer'

describe('Lexer', function() {
  beforeEach(() => {
    this.lexer = new Lexer()
  })

  describe('#rule', () => {
    it('accepts a name and regex', () => {
      this.lexer.rule('something', /.*/)
      expect(this.lexer.rules[0]).toEqual({
        name: 'something',
        match: /.*/,
      })
    })

    it('accepts a name, regex, and handler', () => {
      const handler = () => {}
      const regex = /.*/
      this.lexer.rule('something', regex, handler)
      expect(this.lexer.rules[0]).toEqual({
        name: 'something',
        match: /.*/,
        handler,
      })
    })

    it('accepts only a config {handler, name, match}', () => {
      this.lexer.rule({
        name: 'something',
        match: /.*/,
      })
      expect(this.lexer.rules[0]).toEqual({
        name: 'something',
        match: /.*/,
      })
    })
  })

  describe('#scan', () => {
    it('returns tokens', () => {
      this.lexer.rule('boop', /./)
      expect(this.lexer.scan('honk')).toEqual([
        { type: 'boop', value: 'h', position: 0 },
        { type: 'boop', value: 'o', position: 1 },
        { type: 'boop', value: 'n', position: 2 },
        { type: 'boop', value: 'k', position: 3 },
      ])
    })
  })
})
