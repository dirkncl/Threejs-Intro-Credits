function FitcName(base, n, index) {
	this.name = n;
    this.tunnel = new tunnelController(base, this.name, index);
    this.tunnel.init();
    this.index = index;
}

FitcName.prototype.show = function() {
    console.log("show " + this.name + " tunnel");
    this.tunnel.addToScene();
    this.tunnel.ShowThisPhrase();
}

FitcName.prototype.fadeOutTunnelThisPhrase = function() {
    console.log("fade out " + this.name + " tunnel");
    this.tunnel.HideThisPhrase();
}

FitcName.prototype.removeTunnelFromScene = function() {
    console.log("remove " + this.name + " tunnel");
    this.tunnel.removeFromScene();
}
