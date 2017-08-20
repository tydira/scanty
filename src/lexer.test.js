import Lexer from './lexer'

describe('Lexer', function() {
  beforeEach(() => {
    this.lexer = new Lexer()
  })

  describe('#constructor', () => {
    it('accepts an array of rules', () => {
      const lexer = new Lexer([{ name: 'char', match: /./ }])

      expect(lexer.options.rules[0].name).toBe('char')
    })

    it('accepts an object of options', () => {
      const lexer = new Lexer({
        option: 'value',
      })

      expect(lexer.options.option).toBe('value')
    })

    it('sets up any known rules', () => {
      const lexer = new Lexer([
        { name: 'number', match: /[0-9]/ },
        { name: 'char', match: /[a-z]/ },
      ])

      expect(lexer._rules[0].name).toBe('number')
      expect(lexer._rules[1].name).toBe('char')
    })
  })

  describe('#rule', () => {
    it('accepts a name and regex', () => {
      this.lexer.rule('something', /.*/)
      expect(this.lexer._rules[0]).toEqual({
        name: 'something',
        match: /.*/,
      })
    })

    it('accepts a name, regex, and handler', () => {
      const handler = () => {}
      const regex = /.*/
      this.lexer.rule('something', regex, handler)
      expect(this.lexer._rules[0]).toEqual({
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
      expect(this.lexer._rules[0]).toEqual({
        name: 'something',
        match: /.*/,
      })
    })
  })

  describe('#_wrapRegex', () => {
    it('returns a wrapped RegExp with ygm and lastIndex set', () => {
      const regex = this.lexer._wrapRegex(/./, 5)
      expect(regex.source).toBe('.')
      expect(regex.sticky).toBe(true)
      expect(regex.global).toBe(true)
      expect(regex.multiline).toBe(true)
      expect(regex.lastIndex).toBe(5)
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

    it('cycles rules until it finds one', () => {
      this.lexer.rule('one', /1/)
      this.lexer.rule('two', /2/)
      this.lexer.rule('three', /3/)
      expect(this.lexer.scan('3')).toEqual([
        { type: 'three', value: '3', position: 0 },
      ])
    })

    it("assigns rule.handler to context.action if it's a function and then runs it", () => {
      const action = context => {
        expect(context.action).toBe(action)
      }
      this.lexer.rule('one', /1/, action)
      this.lexer.scan('1')
    })

    it('returns an empty array if nothing matched', () => {
      this.lexer.rule('one', /1/)
      expect(this.lexer.scan('3')).toEqual([])
    })
  })
})
