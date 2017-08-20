import Emitter from 'yaemit'
import { isArray, isFunction } from './utils'

export default class Lexer extends Emitter {
  rules = []

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

    this.rules.push(rule)
  }

  _wrapRegex(regex, position) {
    const wrapped = new RegExp(regex, 'ygm')
    wrapped.lastIndex = position
    return wrapped
  }

  scan(text, rules = this.rules) {
    const tokens = []
    const end = text.length
    let position = 0

    while (position < end) {
      let found

      for (const rule of rules) {
        found = this._wrapRegex(rule.match, position).exec(text)
        if (!found) continue

        const token = {
          position,
          type: rule.name,
          value: found[0],
        }

        const context = { rule, token, tokens }

        if (isFunction(rule.handler)) context.action = rule.handler
        this.emit(rule.name, context)
        if (isFunction(context.action)) context.action(context)

        position += context.token.value.length
        tokens.push(context.token)
      }

      if (!found) break
    }

    return tokens
  }
}
