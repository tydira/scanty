/**
 * Copyright (c) 2017-present, Justin Krueger <justin@kroo.gs>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

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
      this.on(rule.name, rule.action)
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

        if (isFunction(context.action)) context.action()
      }

      if (tokens.length === 0) break
    }

    return tokens
  }
}
