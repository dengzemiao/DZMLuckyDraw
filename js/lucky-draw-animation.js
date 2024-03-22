// 取出用户列表
var users = JSON.parse(localStorage.getItem('users')) || []

// 没有用户，填充点测试数据
if (!users.length) {
	users = [{
		id: 0,
		name: 'Test',
		department: 'Dep',
		number: 0
	}]
}

// 中奖栏是否支持滚动条拖拽(推荐鼠标用户打开，触摸板用户关闭)
var isScrollbarVisible = true
// 内定用户在剩余用户充足情况允许进入随机池
var isTagUsersAllowRandom = false
// 当剩余用户 <= 内定用户时，只能抽取内定用户了，可以指定优先抽中顺序
// 标签值：就是导入用户名单中那个【第几轮中奖(只能数字，不设置随机)】的值，例如：例如：“张三-副总-3” 里面的 “3”
// 取值范围：0、随机抽取中奖 1、标签值小的优先中奖 2、标签值最大的优先中奖
var tagUsersRandomWinningOrderType = 2
// 用户展示效果的用户列表，不足 maxCount 会自动二次抽取补全
// 这里设置的 maxCount，只是单纯为了动画效果，抽奖还是会按实际名单抽取，不会使用展示效果名单抽取
// 根据自身电脑性能增加效果，使用 mac m2 设置 700+ 有点卡
var maxCount = 300
var perspective = maxCount * 11.5
var userPros = []
var index = 0
if (users.length > maxCount) {
	userPros = users.slice(0, maxCount)
} else {
	userPros = [...users]
	while (userPros.length < maxCount) {
		userPros.push(users[index % users.length])
		index++
	}
}

// 属性
var camera, scene, renderer

// 名片3D坐标
var objects = []
var targets = { sphere: [], grid: [] }

// 动画类型
var animateTypes = ['sphere', 'grid', 'none']
var animateType = undefined
var animateDuration = 2000

// 初始化
init()
animate()

// 初始化
function init() {

	// 摄像机
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
	camera.position.z = 3000

	// 场景
	scene = new THREE.Scene()

	// sphere || none
	var vector = new THREE.Vector3()
	for (var i = 0, l = userPros.length; i < l; i++) {

		// 用户
		const user = userPros[i]

		// 名片
		var element = document.createElement('div')
		element.className = 'element'
		// 名片背景颜色（为了效果，给了个随机透明度）
		element.style.backgroundColor = `rgba(0, 127, 127, ${Math.random() * 0.5 + 0.25})`

		// var number = document.createElement( 'div' )
		// number.className = 'number'
		// number.textContent = user.id
		// element.appendChild( number )

		// 名称
		var symbol = document.createElement('div')
		symbol.className = 'symbol'
		symbol.textContent = user.name
		element.appendChild(symbol)

		// 描述
		var details = document.createElement('div')
		details.className = 'details'
		details.textContent = user.department
		element.appendChild(details)

		// none
		var object = new THREE.CSS3DObject(element)
		object.position.x = Math.random() * 4000 - 2000
		object.position.y = Math.random() * 4000 - 2000
		object.position.z = Math.random() * 4000 - 2000
		scene.add(object)
		objects.push(object)

		// sphere
		var phi = Math.acos(-1 + (2 * i) / l)
		var theta = Math.sqrt(l * Math.PI) * phi
		var object = new THREE.Object3D()
		object.position.x = 800 * Math.cos(theta) * Math.sin(phi)
		object.position.y = 800 * Math.sin(theta) * Math.sin(phi)
		object.position.z = 800 * Math.cos(phi)
		vector.copy(object.position).multiplyScalar(2)
		object.lookAt(vector)
		targets.sphere.push(object)
	}

	// grid
	for (var i = 0; i < objects.length; i++) {
		var object = new THREE.Object3D()
		object.position.x = ((i % 10) * 400) - 1800
		object.position.y = (- (Math.floor(i / 10) % 5) * 400) + 800
		object.position.z = (Math.floor(i / 25)) * 1000 - perspective
		targets.grid.push(object)
	}

	// 父容器
	renderer = new THREE.CSS3DRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.domElement.style.position = 'absolute'
	document.getElementById('container').appendChild(renderer.domElement)

	// 开始
	onlyAnimate()

	// 监听浏览器尺寸
	window.addEventListener('resize', onWindowResize, false)
}

// 刷新坐标
function reloadGridPosition() {
	for (var i = 0; i < targets.grid.length; i++) {
		var scale = Number((Math.random() + 0.2).toFixed(1))
		var newPerspective = Number((perspective * scale).toFixed(0))
		var object = targets.grid[i]
		// object.position.x = ((i % 10) * 400) - 1800
		// object.position.y = (- (Math.floor(i / 10) % 5) * 400) + 800
		object.position.z = (Math.floor(i / 25)) * 1000 - newPerspective
	}
}

// 刷新3D定位
function transform(targets, duration) {
	TWEEN.removeAll()
	for (var i = 0; i < objects.length; i++) {
		var object = objects[i]
		var target = targets[i]
		new TWEEN.Tween(object.position)
			.to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start()
		new TWEEN.Tween(object.rotation)
			.to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start()
	}
	new TWEEN.Tween(this)
		.to({}, duration * 2)
		.onUpdate(render)
		.start()
}

// 窗口尺寸变化
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	render()
}

// 动画
function animate() {
	requestAnimationFrame(animate)
	TWEEN.update()
}

// 重新绘制
function render() {
	renderer.render(scene, camera)
}

// 开始动画
function onlyAnimate() {
	setAnimate('grid')
	setTimeout(() => {
		setAnimate('sphere')
	}, 4000)
}

// 停止动画
function stopAnimate(type) {
	if (type === 'grid') {
		reloadGridPosition()
	}
	// 设置展示
	setAnimate(type)
}

// 动画展示模版
function setAnimate(type) {
	// 记录
	animateType = type
	// 根据类型展示
	if (type === 'sphere') {
		// 球形
		transform(targets.sphere, animateDuration)
	} else if (type === 'grid') {
		// 有序的悬浮
		transform(targets.grid, animateDuration)
	} else {
		// 无序的悬浮
		transform(objects, animateDuration)
	}
}