// 将 csv 文件解析成 JSON
function csvJson (file, result) {
  // 检测是浏览器是否支持 readAsBinaryString 函数
  var rABS = typeof FileReader !== 'undefined' && typeof FileReader.prototype !== 'undefined' && typeof FileReader.prototype.readAsBinaryString !== 'undefined'
  // 创建 FileReader
  var reader = new FileReader()
  // 读取回调
  reader.onload = function (e) {
    var data = e.target.result
    var dataString = null
    var dataArray = null
    if (rABS) {
      // 此时 data 为 binarystring，需要把 binarystring 转换为 Uint8Array
      dataString = data
      var newArray = []
      for (var index = 0; index < data.length; index++) {
          newArray.push(data.charCodeAt(index));
      }
      dataArray = new Uint8Array(newArray)
    } else {
      // 此时 data 为 ArrayBuffer
      dataArray = new Uint8Array(data)
      for (var index in dataArray) {
        dataString += String.fromCharCode(dataArray[index]);
        // 考虑到效率，只取前100个用于判断字符集
        if (index >= 100) { break }
      }
    }
    // 获取编码格式
    var encoding = jschardet.detect(dataString.substring(0, 1000)).encoding;
    // 处理编码格式
    if (encoding == 'GB2312' || encoding == 'GB18030') {
      encoding = 'GB18030'
    } else if (encoding == 'ascii' || encoding == 'UTF-8' || encoding == 'UTF-16BE' || encoding == 'UTF-16LE') {
    } else {
        // alert('不支持的编码格式:' + encoding + ';你只能使用UTF-8或GB18030(GB2320,GBK)编码格式文件');
        result(3)
        return
    }
    // 将数据转成成指定编码格式
    dataString = new TextDecoder(encoding).decode(dataArray)
    // 处理数据
    handleJsonCsv(file, dataString, result)
  }
  // 开始读取
  if(rABS) {
    reader.readAsBinaryString(file)
  } else {
    reader.readAsArrayBuffer(file)
  }
}

// 将数据处理成需要的JSON
function handleJsonCsv (file, data, result) {
  // 获得文件名
  const fileSplits = file.name.split('.')
  var fileName = file.name
  if (fileSplits.length) {
    fileSplits.pop()
    fileName = fileSplits.join('')
  }
  // 将数据分割成数组
  const strArray = data.split('\n')
  const list = []
  strArray.forEach((item) => {
    if (item.length) {
      list.push(CSVtoArray(item))
    }
  })
  // 组合返回书架
  const dataArray = [{
    name: fileName,
    list: list
  }]
  // 返回
  result(0, dataArray)
}

// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  var a = []; // Initialize array to receive values.
  text.replace(re_value, // "Walk" the string using replace with callback.
      function(m0, m1, m2, m3) {
          // Remove backslash from \' in single quoted values.
          if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
          // Remove backslash from \" in double quoted values.
          else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
          else if (m3 !== undefined) a.push(m3);
          return ''; // Return empty string.
      });
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
};