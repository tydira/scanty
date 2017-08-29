import Emitter from 'yaemit'
import { isArray, isFunction, isRegex } from './utils'

export default class Lexer extends Emitter {
  _rules = []
  _regexCache = {}

  constructor(options = {}) {
    super()

    if (isArray(options)) {
      this.options = { rules: options }
    } else {
      this.options = options
    }

    if (this.options.rules) {
      this.options.rules.forEach(rule => this.rule(rule))
    }
  }

  rule(...args) {
    let rule = args[0]

    if (args.length > 1) {
      rule = { name: args[0], match: args[1] }
      if (args.length > 2) rule.action = args[2]
    }

    if (isFunction(rule.action)) {
      this.on(rule.name, context => rule.action(context))
    }

    this._rules.push(rule)
  }

  _prepRegex(regex, position = 0) {
    const key = isRegex(regex) ? regex.source : regex
    let prepped

    if (this._regexCache[key]) {
      prepped = this._regexCache[key]
    } else {
      prepped = this._regexCache[key] = new RegExp(regex, 'ygm')
    }

    prepped.lastIndex = position

    return prepped
  }

  scan(text, rules = this._rules) {
    const tokens = []
    let position = 0

    while (position < text.length) {
      let found

      for (const rule of rules) {
        found = this._prepRegex(rule.match, position).exec(text)
        if (!found) continue

        const token = {
          position,
          type: rule.name,
          value: found[0],
        }

        const action = () => {
          position += token.value.length
          tokens.push(token)
        }

        const context = { rule, token, tokens, found, action }

        this.emit(rule.name, context)
        this.emit('token', context)

        context.action()
      }

      if (tokens.length === 0) break
    }

    return tokens
  }
}
