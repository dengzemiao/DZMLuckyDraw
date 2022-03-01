var users = JSON.parse(localStorage.getItem('users')) || []

if (!users.length) {
	users = [{
		id: 0,
		name: 'Test',
		department: 'Dep',
		number: 0
	}]
}

var maxCount = 120
var userPros = []
var index = 0
if (users.length > maxCount) {
	userPros = users.slice(0, maxCount)
} else {
	userPros = [...users]
	while (userPros.length < maxCount) {
		userPros.push(users[index%users.length])
		index++;
	}
}

var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

var animateTypes = ['table', 'sphere', 'grid', 'helix'];
var animateIndex = 0;
var animateTime = undefined;

init();
animate();

function init() {
	
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;
	
	scene = new THREE.Scene();

	// table
	for ( var i = 0; i < userPros.length; i++ ) {

    const user = userPros[i]

		var element = document.createElement( 'div' );
		element.className = 'element';
		element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

		// var number = document.createElement( 'div' );
		// number.className = 'number';
		// number.textContent = user.id;
		// element.appendChild( number );

		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol';
		symbol.textContent = user.name;
		element.appendChild( symbol );

		var details = document.createElement( 'div' );
		details.className = 'details';
    details.textContent = user.department;
		element.appendChild( details );

		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );

		objects.push( object );

    var object = new THREE.Object3D();
    
    const rowNumer = 15
    const row = parseInt(i / rowNumer)
    const col = i % rowNumer
		object.position.x = (col * 180) - 1330;
		object.position.y = - (row * 220) + 770;

		targets.table.push( object );
	}

	// sphere
	var vector = new THREE.Vector3();
	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;
		var object = new THREE.Object3D();
		object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
		object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
		object.position.z = 800 * Math.cos( phi );
		vector.copy( object.position ).multiplyScalar( 2 );
		object.lookAt( vector );
		targets.sphere.push( object );
	}

	// helix
	var vector = new THREE.Vector3();
	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var phi = i * 0.175 + Math.PI;
		var object = new THREE.Object3D();
		object.position.x = 900 * Math.sin( phi );
		object.position.y = - ( i * 8 ) + 450;
		object.position.z = 900 * Math.cos( phi );
		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;
		object.lookAt( vector );
		targets.helix.push( object );
	}

	// grid
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = new THREE.Object3D();
		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
		targets.grid.push( object );
	}

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	// controls = new THREE.TrackballControls( camera, renderer.domElement );
	// controls.rotateSpeed = 0.5;
	// controls.minDistance = 300;
	// controls.maxDistance = 2500;
	// controls.addEventListener( 'change', render );

	// transform( targets.grid, 2000 );
	// startAnimate()
	onlyAnimate()
	window.addEventListener( 'resize', onWindowResize, false );
}

function transform( targets, duration ) {
	TWEEN.removeAll();
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = objects[ i ];
		var target = targets[ i ];
		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
	}
	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	// controls.update();
}

function render() {
	renderer.render( scene, camera );
}

function onlyAnimate () {
	setAnimate('table')
	setTimeout(() => {
		setAnimate('helix')
	}, 5000)
}

function startAnimate() {
	const count = animateTypes.length
	const index = animateIndex % count
	setAnimate(animateTypes[index])
	animateIndex++;
	animateTime = setTimeout(() => {
		this.startAnimate()
	}, 6000);
}

function stopAnimate (type) {
	if (animateTime) {
		clearTimeout(animateTime);
		animateTime = undefined
	}
	setAnimate(type);
}

function setAnimate (type) {
	if (type === 'table') {
		transform( targets.table, 2000 );
	} else if (type === 'sphere') {
		transform( targets.sphere, 2000 );
	} else if (type === 'helix') {
		transform( targets.helix, 2000 );
	} else if (type === 'grid') {
		transform( targets.grid, 2000 );
	}
}