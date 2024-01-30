// 初始化指定星星数量
function initStars(num) {
  // 获取当前天空元素
  let thesky = document.getElementById('the-sky')
  // 获取天空宽高
  let w = thesky.clientWidth
  let h = thesky.clientHeight
  // 星星列表，方便更新位置
  let stars = []
  // 星星颜色
  let colors = ['#fff', '#5f91ff']
  // 循环创建
  for (let i = 0; i < num; i++) {
    // 星星坐标
    let x = createRandomInteger(0, w)
    // 顶部的星星不会被挡住，也可以设置为 0 ，但是有些星星会被挡掉半边
    let y = createRandomInteger(15, h)
    // 延迟闪烁，保证所有星星不是同时执行动画，产生交替闪烁的感觉
    let delay = createRandomDecimal(0, 10) // i * 0.1
    // 随机闪烁时间
    let duration = createRandomDecimal(1.5, 6.0)
    // 星星大小
    let scale = Math.min(createRandomDecimal(0.1, 0.7), 1.0) // 1
    // 星星颜色
    let color = colors[createRandomInteger(0, colors.length)]
    // 星星容器
    const starContainer = document.createElement('div')
    starContainer.setAttribute('class', 'star-container')
    starContainer.setAttribute('style', `
      left: ${x}px;
      top: ${y}px;
      transform: scale(${scale});
    `)
    // 星星横条
    const starHor = document.createElement('div')
    starHor.setAttribute('class', 'star-hor')
    starHor.setAttribute('style', `
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      background: linear-gradient(
        -45deg,
        rgba(0, 0, 255, 0),
        ${color},
        rgba(0, 0, 255, 0)
      );
    `)
    // 星星竖条
    const starVer = document.createElement('div')
    starVer.setAttribute('class', 'star-ver')
    starVer.setAttribute('style', `
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      background: linear-gradient(
        -45deg,
        rgba(0, 0, 255, 0),
        ${color},
        rgba(0, 0, 255, 0)
      )
    `)
    // 组装星星
    starHor.appendChild(starVer)
    starContainer.appendChild(starHor)
    // 星星添加到天空
    stars.push(starContainer)
    thesky.append(starContainer)
  }
  // 监听窗口变化，更新星星位置
  window.addEventListener('resize', () => {
    // 获取天空宽高
    let w = thesky.clientWidth
    let h = thesky.clientHeight
    // 循环创建
    for (let i = 0; i < stars.length; i++) {
      // 星星坐标
      let x = createRandomInteger(0, w)
      // 顶部的星星不会被挡住，也可以设置为 0 ，但是有些星星会被挡掉半边
      let y = createRandomInteger(15, h)
      // 修改位置
      stars[i].style.top = `${y}px`
      stars[i].style.left = `${x}px`
    }
  })
}
// 随机出现指定区间数量内的流星划过，间隔指定时间再次随机出现
function initMeteors(min, max) {
  // 获取当前天空元素
  let thesky = document.getElementById('the-sky')
  // 流星颜色
  let colors = ['#fff', '#5f91ff']
  // 随机出现几条流星
  let count = createRandomInteger(min, max)
  // 开始随机出现
  for (let i = 0; i < count; i++) {
    // 获取天空宽高
    let w = thesky.clientWidth
    let h = thesky.clientHeight
    // 流星坐标
    let x = createRandomInteger(w * 0.1, w)
    let y = createRandomInteger(-15, -10)
    // 延迟出现时间
    let delay = createRandomDecimal(0, 8)
    // 划过天空时间
    let duration = createRandomDecimal(10.0, 20.0)
    // 流星大小
    let scale = Math.min(createRandomDecimal(0.5, 1.0), 1.0)
    // 流星颜色
    let color = colors[createRandomInteger(0, colors.length)]
    // 流星容器
    const meteorContainer = document.createElement('div')
    meteorContainer.setAttribute('class', 'meteor-container')
    meteorContainer.setAttribute('style', `
      left: ${x}px;
      top: ${y}px;
      transform: scale(${scale});
    `)
    // 流星主体
    const meteor = document.createElement('div')
    meteor.setAttribute('class', 'meteor')
    meteor.setAttribute('style', `
      background: ${color};
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
      0 0 0 8px rgba(255, 255, 255, 0.1),
      0 0 20px rgba(255, 255, 255, 0.1);
      opacity: 1;
      transition: all ${duration}s;
      transition-delay: ${delay}s;
      transform: rotate(315deg) translateX(0);
    `)
    // 流星尾巴
    const meteorTail = document.createElement('div')
    meteorTail.setAttribute('class', 'meteor-tail')
    meteorTail.setAttribute('style', `
      background: linear-gradient(90deg, ${color}, transparent);
    `)
    // 组装流星
    meteor.appendChild(meteorTail)
    meteorContainer.appendChild(meteor)
    // 流星添加到天空
    thesky.append(meteorContainer)
    // 流星动画，动画完成后移除
    setTimeout(() => {
      meteor.style.opacity = 0
      meteor.style.transform = `rotate(315deg) translateX(-${Math.max(w, h)}px)`
      // 移除当前流星
      setTimeout(() => {
        meteor.removeChild(meteorTail)
        meteorContainer.removeChild(meteor)
        thesky.removeChild(meteorContainer)
      }, duration * 1000 + delay * 1000)
    }, 0)
  }
  // 重复出现流星
  setTimeout(() => {
    initMeteors(min, max)
  }, 2000)
}
// 在指定区间生成随机整数
function createRandomInteger(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}
// 在指定区间生成随机小数，保留两位小数，float 为浮动值，默认 0
function createRandomDecimal(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2)
}
setTimeout(() => {
  // 如果卡顿可以降低星星、流星渲染数量
  // 初始化 500 颗星星
  initStars(500)
  // 每次随机 2-3 个流星
  initMeteors(2, 3)
}, 2000)