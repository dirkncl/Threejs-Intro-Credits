ccBase = function(){
	this.resizeCallbacks = [];
	this.updateCallbacks = [];
	this.preUpdateCallbacks = [];
	
	this.time = {
		date:new Date(),
		start:0,
		delta:0,
		time:0,
		last:0,
		frame:0
	};
	this.time.start = this.time.date.getTime()/1000;

	this.mouse = {
		x:0,
		y:0,
		lastX:0,
		lastY:0,
		deltaX:0,
		deltaY:0,
		leftPressed:false,
		middlePressed:false,
		rightPressed:false,
		moveCallbacks:[],
		downCallbacks:[],
		upCallbacks:[]
	};
	
	this.key = {
		pressed: []
	}
	
	var self = this;
	var getEvent = function(func){
		var f = function(event){
			self[func](event);
		}
		return f;
	}
	
	window.addEventListener('mousemove',getEvent("onMouseMove"),false);
	window.addEventListener('mousedown',getEvent("onMouseDown"),false);
	window.addEventListener('mouseup',getEvent("onMouseUp"),false);
	window.addEventListener('keydown',getEvent("onKeyDown"),false);
	window.addEventListener('keyup',getEvent("onKeyUp"),false);
	window.addEventListener('resize',getEvent("onResize"),false);
	
	var update = function()
	{
		self.onUpdate();
		requestAnimationFrame(update);
	};
	this.onResize();	
	update();
}
	//**********
	//**WINDOW**
	//**********
	{
				
		ccBase.prototype.onResize = function(){
			callback(this.resizeCallbacks);
		}
		ccBase.prototype.addResizeCallback = function(func){
			addCallback(this.resizeCallbacks,func);	
		}
		ccBase.prototype.removeResizeCallback = function(func){
			removeCallback(this.resizeCallbacks,func);	
		}
				
		ccBase.prototype.onUpdate = function(){
			callback(this.preUpdateCallbacks);
			this.time.date = new Date();
			this.time.last = this.time.time;
			this.time.time = this.time.date.getTime()/1000-this.time.start;
			this.time.delta = this.time.time-this.time.last;
			this.time.frame++;
			
			callback(this.updateCallbacks);
		}
		ccBase.prototype.addUpdateCallback = function(func){
			addCallback(this.updateCallbacks,func);	
		}
		ccBase.prototype.removeUpdateCallback = function(func){
			removeCallback(this.updateCallbacks,func);	
		}
		ccBase.prototype.addPreUpdateCallback = function(func){
			addCallback(this.preUpdateCallbacks,func);	
		}
		ccBase.prototype.removePreUpdateCallback = function(func){
			removeCallback(this.preUpdateCallbacks,func);	
		}
	}
	
	//*********
	//**MOUSE**
	//*********
	{
	//relating to mouse things

		//MOUSE MOVE
		ccBase.prototype.onMouseMove = function (event){
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
			this.mouse.deltaX = this.mouse.x - this.mouse.lastX;
			this.mouse.deltaY = this.mouse.y - this.mouse.lastY;
			this.mouse.lastX = this.mouse.x;
			this.mouse.lastY = this.mouse.y;
			callback(this.mouse.moveCallbacks);
		}
		ccBase.prototype.addMouseMoveCallback = function(func){
			addCallback(this.mouse.moveCallbacks,func);	
		}
		ccBase.prototype.removeMouseMoveCallback = function(func){
			removeCallback(this.mouse.moveCallbacks,func);	
		}

		//MOUSE DOWN
		ccBase.prototype.onMouseDown = function (event){
			this.mouse.leftPressed = event.button==0;
			this.mouse.middlePressed = event.button==1;
			this.mouse.rightPressed = event.button==2;
			callback(this.mouse.downCallbacks);
		}
		ccBase.prototype.addMouseDownCallback = function(func){
			addCallback(this.mouse.downCallbacks,func);	
		}
		ccBase.prototype.removeMouseDownCallback = function(func){
			removeCallback(this.mouse.downCallbacks,func);	
		}

		//MOUSE UP
		ccBase.prototype.onMouseUp = function (event){
			if(event.button==0)
				this.mouse.leftPressed = false;
			if(event.button==1)
				this.mouse.middlePressed = false;
			if(event.button==2)
				this.mouse.rightPressed = false;
			callback(this.mouse.upCallbacks);		
		}
		ccBase.prototype.addMouseUpCallback = function(func){
			addCallback(this.mouse.upCallbacks,func);	
		}
		ccBase.prototype.removeMouseUpCallback = function(func){
			removeCallback(this.mouse.upCallbacks,func);	
		}
	}
	
	//********
	//**KEYS**
	//********
	{
		//KEY DOWN
		ccBase.prototype.onKeyDown = function(event){
			if(event.repeat)
				return;
			this.key.pressed[event.keyCode] = true;
			console.log("key pressed: "+event.keyCode);
		}
		
		//KEY UP
		ccBase.prototype.onKeyUp = function(event){
			this.key.pressed[event.keyCode] = false;
			console.log("key released: "+event.keyCode);
		}
	}

	//*********
	//**UTILS**
	//*********
function callback(a){
	for(var i = 0; i<a.length;i++){
		a[i]();	
	}
}
function addCallback (addTo,func){
	if(addTo.indexOf(func)==-1){
		addTo.push(func);	
	}
}
function removeCallback (removeFrom,func){
	var i = removeFrom.indexOf(func);
	if(i!=-1){
		removeFrom.splice(i,1);
	}
}