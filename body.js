class Vec2D {
	#norm;
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	invert() {
		return new Vec2D(- this.x, - this.y);
	}
	
	get norm() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
}

class Body
{
	id;
	position;
	velocity;
	acceleration;
	force;
	interactions = [];
	mass;
	massInv;
	color;
	radius;
	
	constructor(id, initialPosition, initialVelocity, initialAcceleration, mass, radius, color) {
		this.id = id;
		this.position = initialPosition;
		this.velocity = initialVelocity;
		this.acceleration = initialAcceleration;
		this.mass = mass;
		this.massInv = 1 / mass;
		this.color = color;
		this.radius = radius;
	}
	
	computeForce() {
		this.force = new Vec2D(0.0, 0.0);
		this.interactions.forEach(interaction => {
			var intensity = interaction.constant * interaction.masses * Math.pow(interaction.distanceInv, 3);
			this.force.x += interaction.vector.x * intensity;
			this.force.y += interaction.vector.y * intensity;
		});
	}
	
	addInteraction(interaction) {
		this.interactions.push(interaction);
	}
	
	next(dt) {
		this.computeForce();
		var newAcceleration = new Vec2D(this.force.x * this.massInv, this.force.y * this.massInv);
		var newVelocity = new Vec2D(this.velocity.x + (newAcceleration.x) / 2 * dt, this.velocity.y + (newAcceleration.y) / 2 * dt);		
		var newPosition = new Vec2D(this.position.x + (newVelocity.x) / 2 * dt, this.position.y + (newVelocity.y) / 2 * dt);
		
		//var refinedVelocity = new Vec2D(this.velocity.x + this.newVelocity
		
		return new Body(this.id, newPosition, newVelocity, newAcceleration, this.mass, this.radius, this.color);
	}
}