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

    it('accepts a name, regex, and action', () => {
      const action = () => {}
      const regex = /.*/

      this.lexer.rule('something', regex, action)

      expect(this.lexer._rules[0]).toEqual({
        name: 'something',
        match: /.*/,
        action,
      })
    })

    it('accepts a {action, name, match}', () => {
      this.lexer.rule({
        name: 'something',
        match: /.*/,
      })

      expect(this.lexer._rules[0]).toEqual({
        name: 'something',
        match: /.*/,
      })
    })

    it('attempts to configure an action for a rule', () => {
      const action = context => {
        expect(context.action).toBe(action)
      }

      this.lexer.rule('one', /1/, action)
      this.lexer.scan('one')
    })

    it("register a rule's action to be ran with a context arg", () => {
      const required = ['rule', 'token', 'tokens', 'found', 'action']
      let keys

      this.lexer.rule('one', '1', ctx => (keys = Object.keys(ctx)))
      this.lexer.scan('1')

      expect(keys).toEqual(required)
    })
  })

  describe('#_prepRegex', () => {
    it('returns a prepped RegExp with ygm and lastIndex set', () => {
      const regex = this.lexer._prepRegex(/./, 5)
      expect(regex.source).toBe('.')
      expect(regex.sticky).toBe(true)
      expect(regex.global).toBe(true)
      expect(regex.multiline).toBe(true)
      expect(regex.lastIndex).toBe(5)
    })

    it('stores and returns cached RegExp instances', () => {
      const regex = this.lexer._prepRegex(/./)
      expect(this.lexer._prepRegex('.')).toBe(regex)
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

    it('cycles rules until it finds a valid one', () => {
      this.lexer.rule('one', /1/)
      this.lexer.rule('two', /2/)
      this.lexer.rule('three', /3/)

      expect(this.lexer.scan('3')).toEqual([
        { type: 'three', value: '3', position: 0 },
      ])
    })

    it('returns an empty array if nothing matched', () => {
      this.lexer.rule('one', /1/)
      expect(this.lexer.scan('3')).toEqual([])
    })

    it('emits a token event for every token found', () => {
      const ran = []

      this.lexer.rule('one', '1')
      this.lexer.rule('two', '2')
      this.lexer.rule('three', '3')
      this.lexer.rule('space', ' ')

      this.lexer.on('token', ({ rule }) => {
        ran.push(rule.name)
      })

      this.lexer.scan('1 2 3')

      expect(ran).toEqual(['one', 'space', 'two', 'space', 'three'])
    })

    it("runs #context.action if it's a function", () => {
      const ran = []

      this.lexer.rule('one', '1', ctx => {
        ran.push(true)
        ctx.action = undefined
      })

      this.lexer.rule('digits', /\d+/, () => {
        ran.push(true)
      })

      expect(this.lexer.scan('12')).toEqual([
        { type: 'digits', value: '12', position: 0 },
      ])
      expect(ran.length).toBe(2)
    })
  })
})
