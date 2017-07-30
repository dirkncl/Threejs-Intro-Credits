function FitcName(base, n, index) {
	this.name = n;
    this.tunnel = new tunnelController(base, this.name, index);
    this.tunnel.init();
    this.index = index;
}

FitcName.prototype.show = function() {
    this.tunnel.addToScene();
}

FitcName.prototype.hide = function() {
    this.tunnel.removeFromScene();
}
