ccBase = function(){
	var self = this;
	
	
	this.init = function(){
		requestAnimationFrame(self.onUpdate);
		self.onResize();
	}
	
	//**********
	//**WINDOW**
	//**********
	{
		this.resizeCallbacks = [];		
		this.onResize = function(){
			self.callback(self.resizeCallbacks);
		}
		this.addResizeCallback = function(func){
			self.addCallback(self.resizeCallbacks,func);	
		}
		this.removeResizeCallback = function(func){
			self.removeCallback(self.resizeCallbacks,func);	
		}
		window.addEventListener('resize',this.onResize,false);
		
		this.time = {
			date:new Date(),
			start:0,
			delta:0,
			time:0,
			last:0,
			frame:0
		};
		this.time.start = this.time.date.getTime()/1000;
		
		this.updateCallbacks = [];
		this.preUpdateCallbacks = [];
		this.onUpdate = function(){
			self.callback(self.preUpdateCallbacks);
			self.time.date = new Date();
			self.time.last = self.time.time;
			self.time.time = self.time.date.getTime()/1000-self.time.start;
			self.time.delta = self.time.time-self.time.last;
			self.time.frame++;
			
			self.callback(self.updateCallbacks);
			requestAnimationFrame( self.onUpdate );
		}
		this.addUpdateCallback = function(func){
			self.addCallback(self.updateCallbacks,func);	
		}
		this.removeUpdateCallback = function(func){
			self.removeCallback(self.updateCallbacks,func);	
		}
		this.addPreUpdateCallback = function(func){
			self.addCallback(self.preUpdateCallbacks,func);	
		}
		this.removePreUpdateCallback = function(func){
			self.removeCallback(self.preUpdateCallbacks,func);	
		}
	}
	
	//*********
	//**MOUSE**
	//*********
	{
	//relating to mouse things
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

		//MOUSE MOVE
		this.onMouseMove = function (event){
			self.mouse.x = event.clientX;
			self.mouse.y = event.clientY;
			self.mouse.deltaX = self.mouse.x - self.mouse.lastX;
			self.mouse.deltaY = self.mouse.y - self.mouse.lastY;
			self.mouse.lastX = self.mouse.x;
			self.mouse.lastY = self.mouse.y;
			self.callback(self.mouse.moveCallbacks);
		}
		this.addMouseMoveCallback = function(func){
			self.addCallback(self.mouse.moveCallbacks,func);	
		}
		this.removeMouseMoveCallback = function(func){
			self.removeCallback(self.mouse.moveCallbacks,func);	
		}
		window.addEventListener('mousemove',this.onMouseMove,false);

		//MOUSE DOWN
		this.onMouseDown = function (event){
			self.mouse.leftPressed = event.button==0;
			self.mouse.middlePressed = event.button==1;
			self.mouse.rightPressed = event.button==2;
			self.callback(self.mouse.downCallbacks);
		}
		this.addMouseDownCallback = function(func){
			self.addCallback(self.mouse.downCallbacks,func);	
		}
		this.removeMouseDownCallback = function(func){
			self.removeCallback(self.mouse.downCallbacks,func);	
		}
		window.addEventListener('mousedown',this.onMouseDown,false);

		//MOUSE UP
		this.onMouseUp = function (event){
			if(event.button==0)
				self.mouse.leftPressed = false;
			if(event.button==1)
				self.mouse.middlePressed = false;
			if(event.button==2)
				self.mouse.rightPressed = false;
			self.callback(self.mouse.upCallbacks);		
		}
		this.addMouseUpCallback = function(func){
			self.addCallback(self.mouse.upCallbacks,func);	
		}
		this.removeMouseUpCallback = function(func){
			self.removeCallback(self.mouse.upCallbacks,func);	
		}
		window.addEventListener('mouseup',this.onMouseUp,false);
	}
	
	//********
	//**KEYS**
	//********
	{
		this.key = {
			pressed: []
		}
		//KEY DOWN
		this.onKeyDown = function(event){
			if(event.repeat)
				return;
			self.key.pressed[event.keyCode] = true;
			console.log("key pressed: "+event.keyCode);
		}
		window.addEventListener('keydown',this.onKeyDown,false);
		
		//KEY UP
		this.onKeyUp = function(event){
			self.key.pressed[event.keyCode] = false;
			console.log("key released: "+event.keyCode);
		}
		window.addEventListener('keyup',this.onKeyUp,false);
	}
	
	//*********
	//**UTILS**
	//*********
	{
		this.callback = function(a){
			for(var i = 0; i<a.length;i++){
				a[i]();	
			}
		}
		this.addCallback = function(addTo,func){
			if(addTo.indexOf(func)==-1){
				addTo.push(func);	
			}
		}
		this.removeCallback = function(removeFrom,func){
			var i = removeFrom.indexOf(func);
			if(i!=-1){
				removeFrom.splice(i,1);
			}
		}
	}
}