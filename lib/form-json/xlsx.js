// 将 xls、xlsx 文件解析成 JSON
function xlsxJson (file, result) {
  // 读取完成的数据
  var wb;
  // 检测是浏览器是否支持 readAsBinaryString 函数
  var rABS = typeof FileReader !== 'undefined' && typeof FileReader.prototype !== 'undefined' && typeof FileReader.prototype.readAsBinaryString !== 'undefined'
  // 创建 FileReader
  var reader = new FileReader()
  // 读取回调
  reader.onload = function (e) {
    var data = e.target.result
    if(rABS) {
      wb = XLSX.read(data, {
        type: 'binary'
      })
    } else {
      // 以base64方式读取
      wb = XLSX.read(btoa(fixdata(data)), {
        type: 'base64'
      })
    }
    // 将数据处理成需要的JSON
    handleJson(wb, result)
  }
  // 开始读取
  if(rABS) {
    reader.readAsBinaryString(file)
  } else {
    reader.readAsArrayBuffer(file)
  }
}

// 将数据处理成需要的JSON
function handleJson (data, result) {
  // 获取表名
  const sheetNames = data.SheetNames
  // 获取表数据
  const sheets = data.Sheets
  // 数据源
  const dataArray = []
  // 便利数据
  sheetNames.forEach((item) => {
    const sheet = sheets[item]
    const merges = sheet['!merges'] || []
    var sheetJson = XLSX.utils.sheet_to_json(sheets[item], { header: 1 })
    merges.forEach((item) => {
      handleMerge(item, sheetJson)
    })
    // 组合数据
    dataArray.push({
      name: item,
      list: sheetJson
    })
  })
  // 返回数据
  result(0, dataArray)
}

// 解析合并行数据
function handleMerge (merge, sheetJson) {
  const start = merge.s
  const end = merge.e
  if (start.c === end.c) { // 列合并
    const item = sheetJson[start.r][start.c]
    for (let index = start.r; index <= end.r; index++) {
      sheetJson[index][start.c] = item
    }
  } else { // 行合并
    const item = sheetJson[start.r][start.c]
    for (let index = start.c; index <= end.c; index++) {
      sheetJson[start.r][index] = item
    }
  }
}

// 文件流转 BinaryString
function fixdata(data) {
  var o = "",
      l = 0,
      w = 10240;
  for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}