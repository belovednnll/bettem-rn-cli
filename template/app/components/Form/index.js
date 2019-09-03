import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import defaultRules from './defaultRules'
import defaultMessages from './defaultMessages'

export default class BaseForm extends PureComponent {
  constructor(props) {
    super(props)
    // array to store error on each fields
    // ex:
    // [{ fieldName: "name", messages: ["The field name is required."] }]
    this.errors = []
    // Retrieve props
    this.deviceLocale = props.deviceLocale || 'zh' // ex: en, fr
    this.rules = { ...defaultRules, ...props.rules } // rules for Validation
    this.messages = { ...defaultMessages, ...props.messages }
  }

  // Concatenate each error messages
  getErrorMessages(separator = '\n') {
    return this.errors.map(err => err.messages.join(separator)).join(separator)
  }

  // Method to return errors on a specific field
  getErrorsInField(fieldName) {
    const foundError = this.errors.find(err => err.fieldName === fieldName)
    if (!foundError) {
      return []
    }
    return foundError.messages
  }

  isFormValid() {
    return this.errors.length === 0
  }
  // Method to check if the field is in error
  isFieldInError(fieldName) {
    return this.errors.filter(err => err.fieldName === fieldName).length > 0
  }

  // Reset error fields
  resetErrors() {
    this.errors = []
  }

  addError(fieldName, title, rule, value) {
    const errMsg = this.messages[this.deviceLocale][rule]
      .replace('{0}', title)
      .replace('{1}', value)
    const [error] = this.errors.filter(err => err.fieldName === fieldName)
    // error already exists
    if (error) {
      // Update existing element
      const index = this.errors.indexOf(error)
      error.messages.push(errMsg)
      this.errors[index] = error
    } else {
      // Add new item
      this.errors.push({
        fieldName,
        messages: [errMsg],
      })
    }
  }

  validate(fields) {
    // Reset errors
    this.resetErrors()
    // Iterate over inner state
    Object.keys(this.state).forEach(key => {
      // Check if child name is equals to fields array set up in parameters
      const rules = fields[key]
      if (rules) {
        // Check rule for current field
        this.checkRules(key, rules, this.state[key])
      }
    })
    return this.isFormValid()
  }

  // Method to check rules on a spefific field
  checkRules(fieldName, rules, value) {
    const title = 'title'
    Object.keys(rules)
      .filter(key => key !== 'title')
      .forEach(key => {
        const isRuleFn = typeof this.rules[key] === 'function'
        const isRegExp = this.rules[key] instanceof RegExp
        if (
          (isRuleFn && !this.rules[key](rules[key], value)) ||
          (isRegExp && !this.rules[key].test(value))
        ) {
          this.addError(fieldName, rules[title], key, rules[key])
        }
      })
  }
}
BaseForm.propTypes = {
  deviceLocale: PropTypes.string, // Used for language locale
  rules: PropTypes.object, // rules for validations
  messages: PropTypes.object,
}
