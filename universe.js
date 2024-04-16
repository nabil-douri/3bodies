
class Universe {
	time = 0;
	physicsPeriod; initialPhysicsPeriod;
	displayPeriod;
	oldBodies = [];
	bodies = [];
	size;
	momentum;
	kineticEnergy;
	gravitationalEnergy;
	totalEnergy;
	physicsInconsistency = 0.001;
	paused = false;
	
	constructor(physicsPeriod, displayPeriod, size) {
		this.physicsPeriod = physicsPeriod;
		this.initialPhysicsPeriod = physicsPeriod;
		this.displayPeriod = displayPeriod;
		this.size = size;
	}
	
	initialize() {
		// this.bodies.push(new Body("body0", new Vec2D(10, 0), new Vec2D(0, 0), 1000, 3, "#52E"));
		// this.bodies.push(new Body("body1", new Vec2D(900, 0), new Vec2D(0, 0.8), 1000, 3, "#E52"));
		// this.bodies.push(new Body("body2", new Vec2D(-700, 0), new Vec2D(0, -1), 1000, 3, "#5E2"));
		
		this.bodies.push(new Body("sun", new Vec2D(0, 0), new Vec2D(0, 0), 10000000, 15, "#EE1"));
		this.bodies.push(new Body("earth", new Vec2D(800, 0), new Vec2D(0, 100), 50, 3, "#25E"));
		this.bodies.push(new Body("mars", new Vec2D(-1500, 0), new Vec2D(0, -60), 20, 3, "#E52"));
		
		this.interact();
		this.plot();
		
		this.updateConservedProperties();
	}
	
	// Computes next iterations and plots the result
	// To keep a reasonable display refreshing rate, a display iteration is made of a multiple physics iteration
	next() {
		if(this.paused == false) {
			for(let i=0; i < this.displayPeriod / this.physicsPeriod; i++) {
				this.time += this.physicsPeriod;
				this.interact();
			}
			
			this.plot();
			
			this.updateConservedProperties();
			this.updatePhysicsPeriod(this.checkPhysics());
		}
	}
	
	plot() {
		updateOldBodies();
		this.bodies.forEach(body => {
			plotBody(body);
		});
	}
	
	interact() {
		this.bodies.forEach(body => {
			body.interactions = [];
		});
		
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
			const newBody = body.next(this.physicsPeriod);
			newBody.interactions = body.interactions;
			newBodies.push(newBody);
			//this.oldBodies.push(body);
		});
		
		this.bodies = newBodies;
	}
	
	// Checks if current momentum or energies are the same as initial values
	// If not, the physics period is probably too high and should be reduced
	checkPhysics() {
		//console.log(this.currentEnergy, this.initialEnergy);
		if(Math.abs(this.totalEnergy.error) < this.physicsInconsistency) {
			return true;
		}
		
		return false;
	}
	
	updatePhysicsPeriod(physicsIsOK) {
		if(physicsIsOK) {
			this.physicsPeriod = this.physicsPeriod * 1.0;
		}
		else {
			this.physicsPeriod = this.physicsPeriod / 1.0;
		}
	}
	
	getVector(body1, body2) {
		return new Vec2D(body2.position.x - body1.position.x, body2.position.y - body1.position.y);
	}
	
	updateConservedProperties() {
		if(this.momentum === undefined) {
			this.momentum = new ConservedProperty(this.getMomentum());
		}
		else {
			this.momentum.currentValue = this.getMomentum();
		}
		
		if(this.kineticEnergy === undefined) {
			this.kineticEnergy = new ConservedProperty(this.getKineticEnergy());
		}
		else {
			this.kineticEnergy.currentValue = this.getKineticEnergy();
		}
		
		if(this.gravitationalEnergy === undefined) {
			this.gravitationalEnergy = new ConservedProperty(this.getGravitationalEnergy());
		}
		else {
			this.gravitationalEnergy.currentValue = this.getGravitationalEnergy();
		}
		
		if(this.totalEnergy === undefined) {
			this.totalEnergy = new ConservedProperty(this.kineticEnergy.currentValue + this.gravitationalEnergy.currentValue);
		}
		else {
			this.totalEnergy.currentValue = this.kineticEnergy.currentValue + this.gravitationalEnergy.currentValue;
		}
		
	}
	
	getMomentum() {
		var momentum = new Vec2D(0,0);
		this.bodies.forEach(body => {
			momentum.x += body.velocity.x * body.mass;
			momentum.y += body.velocity.y * body.mass;
		});
		return momentum;
	}
	
	getKineticEnergy() {
		var energy = 0;
		this.bodies.forEach(body => {
			energy += Math.pow(body.velocity.distance(), 2) * body.mass * 0.5;
		});
		return energy;
	}
	
	getGravitationalEnergy() {
		var energy = 0;
		this.bodies.forEach(body => {
			body.interactions.forEach(interaction => {
				energy += interaction.energy();
			});
		});
		return energy / 2;
	}
}


class Interaction {
	constant = 1;
	vector;
	distance;
	masses;
	
	constructor(vector, masses) {
		this.vector = vector;
		this.masses = masses;
		this.distance = vector.distance();
	}
	
	energy() {
		var energy = - this.constant * this.masses / this.distance;
		return energy;
	}
}

class ConservedProperty {
	initialValue;
	currentValue;
	error;
	
	constructor(value) {
		this.initialValue = value;
		this.currentValue = value;
	}
	
	get error() {
		return (this.currentValue / this.initialValue - 1);
	}
}