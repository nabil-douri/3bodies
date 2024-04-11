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
}

class Body
{
	id;
	position;
	velocity;
	force;
	interactions = [];
	mass;
	color;
	opacity;
	radius;
	
	constructor(id, initialPosition, initialVelocity, mass, radius, color) {
		this.id = id;
		this.position = initialPosition;
		this.velocity = initialVelocity;
		this.mass = mass;
		this.color = color;
		this.opacity = 1;
		this.radius = radius;
	}
	
	computeForce() {
		this.force = new Vec2D(0, 0);
		this.interactions.forEach(interaction => {
			var intensity = interaction.constant * interaction.masses / (interaction.distance * interaction.distance);
			this.force.x += (interaction.vector.x / interaction.distance) * intensity;
			this.force.y += (interaction.vector.y / interaction.distance) * intensity;
		});
	}
	
	addInteraction(interaction) {
		this.interactions.push(interaction);
	}
	
	next(dt) {
		this.computeForce();
		var acceleration = new Vec2D(this.force.x / this.mass, this.force.y / this.mass);
		var newVelocity = new Vec2D(this.velocity.x + acceleration.x * dt, this.velocity.y + acceleration.y * dt);
		var newPosition = new Vec2D(this.position.x + newVelocity.x * dt, this.position.y + newVelocity.y * dt);
		this.opacity -= 0.1;
		
		return new Body(this.id, newPosition, newVelocity, this.mass, this.radius, this.color);
	}
}