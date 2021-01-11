/*
  // result 回调数据
  funcation result (code, data) {
    // code:
    // 0: 成功
    // 1: 解析失败
    // 2: 不支持解析该文件格式
    // 3: 不支持解析该文件编码格式

    // data: [
      {
        name: 'xxx',
        list: []
      }
    ]
  }
*/
function formJson (file, result) {
  // 分割文件名
  const fileSplits = file.name.split('.')
  // 获取文件后缀
  const fileSuffix = fileSplits[fileSplits.length - 1]
  // 解析文件
  if (fileSuffix === 'csv') {
    csvJson(file, result)
  } else if (fileSuffix === 'xls' || fileSuffix === 'xlsx') {
    xlsxJson(file, result)
  } else {
    result(2)
  }
}
