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
      if (args.length > 2) rule.handler = args[2]
    }

    this._rules.push(rule)
  }

  _wrapRegex(regex, position = 0) {
    const key = isRegex(regex) ? regex.source : regex
    let wrapped

    if (this._regexCache[key]) {
      wrapped = this._regexCache[key]
    } else {
      wrapped = this._regexCache[key] = new RegExp(regex, 'ygm')
    }

    wrapped.lastIndex = position

    return wrapped
  }

  scan(text, rules = this._rules) {
    const tokens = []
    let position = 0

    while (position < text.length) {
      let found

      for (const rule of rules) {
        found = this._wrapRegex(rule.match, position).exec(text)
        if (!found) continue

        const token = {
          position,
          type: rule.name,
          value: found[0],
        }

        const context = { rule, token, tokens, found }

        if (rule.handler) context.handler = rule.handler
        this.emit(rule.name, context)
        if (isFunction(context.handler)) context.handler(context)

        position += context.token.value.length
        tokens.push(context.token)
      }

      if (!found) break
    }

    return tokens
  }
}
