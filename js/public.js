// 正则匹配是否存在
function REG_TEST (reg, value) {
  var re = new RegExp(reg)
  if (re.test(value)) {
    return true
  } else {
    return false
  }
}

// 判断是否为正整数
function REG_IS_INTEGER (value) {
  return REG_TEST(/^\d+$/, value)
}