ccFlyController = function(base){
	var velocityX = 0;
	var velocityY = 0;
	var speed = 0;
	var maxSpeed = 1;
	var acceleration = .1;
	var damp = .95;
	
	var rotationSpeed = 0;
	var maxRotationSpeed = .5;
	var rotationAccereration = .002;
	var rotationDamp = .8;
	
	var target;
	
	
	
	base.speed = 0;
	base.addUpdateCallback(function(){
		speed *= damp;
		rotationSpeed*= damp;
		
		if(target!=null){
			var q = base.camera.quaternion.clone();
			base.camera.lookAt(target);
			THREE.Quaternion.slerp(q,base.camera.quaternion.clone(),base.camera.quaternion,.1);
			speed+=acceleration;
			speed = Math.min(speed,maxSpeed);
		}
		
		if(base.key.pressed[38]||base.key.pressed[87]){
			speed+=acceleration;
			speed = Math.min(speed,maxSpeed);
		}
		if(base.key.pressed[40]||base.key.pressed[83]){
			speed-=acceleration;
			speed = Math.max(speed,-maxSpeed);
		}
		
		if(base.key.pressed[37]||base.key.pressed[65]){
			rotationSpeed+=rotationAccereration;
			rotationSpeed = Math.min(rotationSpeed,maxRotationSpeed);
		}		
		if(base.key.pressed[39]||base.key.pressed[68]){
			rotationSpeed-=rotationAccereration;
			rotationSpeed = Math.max(rotationSpeed,-maxRotationSpeed);
		}
		base.camera.rotateOnAxis(new THREE.Vector3(0,1,0), rotationSpeed);
		
		
			base.camera.translateZ( -speed );
	});
	
	this.moveToTarget = function(p){
		target = p;
	}
	
}