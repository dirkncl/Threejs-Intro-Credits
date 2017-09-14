var introController = null;

function IntroController(base) {
	this.base = base;
    introController = this;
}

IntroController.prototype.show = function(duration, onComplete) {
    this.time = 0.0;

    this.mesh = this.base.textTools.textMeshes.intro;
    console.log(this.base.textTools.textMeshes);
    
    this.mesh.geometry.center();
    this.mesh.position.z = -25;
    this.mesh.scale.z = 0.1;
    this.base.scene.add(this.mesh);
    this.base.camera.position.z = 0.0;
    this.base.addUpdateCallback(this.update);
    this.duration = duration;
    
    this.base.scheduler.callInSeconds(() => {
        this.base.scene.remove(this.mesh);
        this.base.removeUpdateCallback(this.update);
        onComplete();
    }, duration);
}

IntroController.prototype.update = function() {
    
    var progress = introController.time/introController.duration;
    
    introController.mesh.rotation.z = Math.cos(introController.time)*0.05;
    introController.mesh.rotation.y = Math.cos(introController.time*1.25)*0.05;

    base.blur.pass.uniforms.strength.value = Math.lerp(0.5, 1.0, progress);
    base.blur.pass.uniforms.noiseAmplitude.value = Math.lerp(0.0, 0.05, progress);
    
    introController.time += base.time.delta;
}
