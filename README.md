# DZMLuckyDraw

HTML 5 网页端年会抽奖源码，只需要导入名单列表即可，可内定中奖人员！

# 使用说明

  0、index.html: 主入口
  1、关闭窗口清空所有数据（重置），刷新网页不会清空用户列表，但是会重置抽奖记录，相当于刚导入名单的时候。
  2、支持 .xlsx、.xls、.csv 文件格式上传
  3、已经中过奖的人不会重复中奖
  4、在上面支持的文件格式中每个单元格是一个用户
  5、每个单元格支持的用户格式，可以混合存在文件中：

    名字
    名字-部门(或职位, 或描述)
    名字-第几轮中奖(只能数字，不设置随机)
    名字-部门(或职位, 或描述)
    名字-部门(或职位, 或描述)-第几轮中奖(只能数字，不设置随机)

    例如：
    
    张三
    李四-1
    王五-财务部
    赵六-副总-2

# 使用效果

<video id="video" controls="" preload="none" poster="http://media.w3.org/2010/05/sintel/poster.png">
  <source id="mp4" src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
  <source id="webm" src="http://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm">
  <source id="ogv" src="http://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg">
  <p>Your user agent does not support the HTML5 Video element.</p>
</video>

  
