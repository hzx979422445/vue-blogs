/**
 * 全局表单验证集合
 * @param Vue
 * @param options
 *
 * 注意:  定义type 规则时 不用做非空验证 只需要传入 required:true 即可
 */
exports.install = function (Vue, options) {
  /**
   * 保留两位小数
   * */
  const isvalidatedoubleNum = (rule, value, callback) => {
    if (value != null && value !== '') {
      if (!/^\d+(.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入正确的数字，最多保留两位小数!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  /**
   * 验证手机号
   * */
  const isvalidateMobile = (rule, value, callback) => {
    if (value != null && value !== '') {
      if (!/^(13[0-9]|15[0-9]|18[0|2|3|4|5|6|7|8|9])\d{8}$/.test(value)) {
        callback(new Error('您输入的手机号不正确!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  /**
   * 含有非法字符(只能输入字母、汉字)
   * */
  const isvalidateRegexn = (rule, value, callback) => {
    if (value != null && value !== '') {
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        callback(new Error('含有非法字符(只能输入字母、汉字)!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  /**
   *请输入正整数
   * */
  const isvalidateInteger = (rule, value, callback) => {
    if (value != null && value !== '') {
      if (!/^\+?[0-9]\d*$/.test(value)) { // 大于0
        callback(new Error('请输入正整数!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  /**
   *验证身份证
   * */
  const isvalidateIdCard = (rule, value, callback) => {
    if (value != null && value !== '') {
      if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value)) { // 大于0
        callback(new Error('请输入有效身份证号码!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  /**
   * 参数 item
   * required true  必填项
   * maxLength  字符串的最大长度
   * min 和 max 必须同时给 min < max  type=number
   * type 手机号 mobile
   *      邮箱   email
   * */
  Vue.prototype.filter_rules = function (item) {
    let rules = []
    if (item.required) {
      rules.push({required: true, message: item.required})
    }
    if (item.maxLength) {
      rules.push({min: 1, max: item.maxLength, message: '最多输入' + item.maxLength + '个字符!', trigger: 'blur'})
    }
    if (item.min && item.max) {
      rules.push({min: item.min, max: item.max, message: '字符长度在' + item.min + '至' + item.max + '之间!', trigger: 'blur'})
    }
    if (item.type) {
      let type = item.type
      switch (type) {
        case 'email':
          rules.push({type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'})
          break
        case 'mobile':
          rules.push({validator: isvalidateMobile, trigger: 'blur,change'})
          break
        case 'regexn':
          rules.push({validator: isvalidateRegexn, trigger: 'blur,change'})
          break
        case 'integer':
          rules.push({validator: isvalidateInteger, trigger: 'blur,change'})
          break
        case 'doubleNum':
          rules.push({validator: isvalidatedoubleNum, trigger: 'blur,change'})
          break
        case 'idCard':
          rules.push({validator: isvalidateIdCard, trigger: 'blur,change'})
          break
        default:
          rules.push({})
          break
      }
    }
    return rules
  }
}
