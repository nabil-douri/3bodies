
class Universe {
	time = 0;
	dtime;
	oldBodies = [];
	bodies = [];
	size;
	
	constructor(dtime, size) {
		this.dtime = dtime;
		this.size = size;
	}
	
	initialize() {
		// this.bodies.push(new Body("body0", new Vec2D(10, 0), new Vec2D(0, 0), 1000, "#52E"));
		// this.bodies.push(new Body("body1", new Vec2D(700, 0), new Vec2D(0, 2), 5000, "#E52"));
		// this.bodies.push(new Body("body2", new Vec2D(-700, 0), new Vec2D(0, -2), 5000, "#5E2"));
		
		this.bodies.push(new Body("sun", new Vec2D(0, 0), new Vec2D(0, 0), 10000000, 15, "#EE1"));
		this.bodies.push(new Body("earth", new Vec2D(800, 0), new Vec2D(0, 100), 50, 3, "#25E"));
		this.bodies.push(new Body("mars", new Vec2D(-1500, 0), new Vec2D(0, -60), 20, 3, "#E52"));
		
		this.plot();
	}
	
	next() {
		this.time += this.dtime;
		this.interact();
		this.plot();
		// console.log(this.time);
	}
	
	plot() {
		updateOldBodies();
		this.bodies.forEach(body => {
			plotBody(body);
		});
	}
	
	interact() {
		for(var b1 = 0; b1 < this.bodies.length; b1++) {
			for(var b2 = b1 + 1; b2 < this.bodies.length; b2++) {
				var vector = this.getVector(this.bodies[b1], this.bodies[b2]);
				var masses = this.bodies[b1].mass * this.bodies[b2].mass;
				this.bodies[b1].addInteraction(new Interaction(vector, masses));
				this.bodies[b2].addInteraction(new Interaction(vector.invert(), masses));
			}
		}
		
		var newBodies = [];
		this.bodies.forEach(body => {
			newBodies.push(body.next(this.dtime));
			this.oldBodies.push(body);
		});
		
		this.bodies = newBodies;
	}
	
	getVector(body1, body2) {
		return new Vec2D(body2.position.x - body1.position.x, body2.position.y - body1.position.y);
	}
}
