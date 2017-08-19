function FitcName(base, n, index) {
	this.name = n;
    this.tunnel = new tunnelController(base, this.name, index);
    this.tunnel.init();
    this.index = index;
    this.isShowingTunnel = false;
}

FitcName.prototype.show = function(intensity) {
    console.log("show " + this.name + " tunnel");
    if (!this.isShowingTunnel) {
        this.tunnel.addToScene();
        this.isShowingTunnel = true;
    }
    this.tunnel.ShowThisPhrase(intensity);
}

FitcName.prototype.fadeOutTunnelThisPhrase = function() {
    console.log("fade out " + this.name + " tunnel");
    this.tunnel.HideThisPhrase();
}

FitcName.prototype.removeTunnelFromScene = function() {
    console.log("remove " + this.name + " tunnel");
    this.tunnel.removeFromScene();
    this.isShowingTunnel = false;
}
