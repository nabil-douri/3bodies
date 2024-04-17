class Vec2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	invert() {
		return new Vec2D(- this.x, - this.y);
	}
	
	distance() {
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
	color;
	radius;
	
	constructor(id, initialPosition, initialVelocity, initialAcceleration, mass, radius, color) {
		this.id = id;
		this.position = initialPosition;
		this.velocity = initialVelocity;
		this.acceleration = initialAcceleration;
		this.mass = mass;
		this.color = color;
		this.radius = radius;
	}
	
	computeForce() {
		this.force = new Vec2D(0, 0);
		this.interactions.forEach(interaction => {
			var intensity = interaction.constant * interaction.masses * interaction.distanceInv * interaction.distanceInv;
			this.force.x += interaction.vector.x * interaction.distanceInv * intensity;
			this.force.y += interaction.vector.y * interaction.distanceInv * intensity;
		});
	}
	
	addInteraction(interaction) {
		this.interactions.push(interaction);
	}
	
	next(dt) {
		this.computeForce();
		var newAcceleration = new Vec2D(this.force.x / this.mass, this.force.y / this.mass);
		var newVelocity = new Vec2D(this.velocity.x + 1 * (newAcceleration.x) * dt, this.velocity.y + 1 * (newAcceleration.y) * dt);
		var newPosition = new Vec2D(this.position.x + 1 * (newVelocity.x) * dt, this.position.y + 1 * (newVelocity.y) * dt);
		
		return new Body(this.id, newPosition, newVelocity, newAcceleration, this.mass, this.radius, this.color);
	}
}