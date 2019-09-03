const defaultMessages = {
  // English language - Used by default
  en: {
    numbers: 'The field "{0}" must be a valid number.',
    email: 'The field "{0}" must be a valid email address.',
    required: 'The field "{0}" is mandatory.',
    date: 'The field "{0}" must be a valid date ({1}).',
    minlength: 'The field "{0}" length must be greater than {1}.',
    maxlength: 'The field "{0}" length must be lower than {1}.',
  },
  // TODO Add other languages here...
  zh: {
    numbers: '"{0}" 必须填入数字',
    email: '"{0}" 请输入正确的邮箱格式',
    required: '"{0}" 不能为空',
    date: '"{0}" 输入了正确的日期 ({1})',
    minlength: '"{0}" 长度不能低于 {1}',
    maxlength: '"{0}" 长度不能超过 {1}',
  },
}

export default defaultMessages
