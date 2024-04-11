function UniverseToDisplayCoordinates(position)
{
	var e = document.getElementById("main");
	
	
	display_width = e.clientWidth;
	scale_x = display_width / universe.size;
	// console.log(e);
	
	display_height = e.clientHeight;
	scale_y = display_height / universe.size;
	
	new_x = (universe.size / 2 + position.x) * scale_x;
	new_y = (universe.size / 2 - position.y) * scale_y;
	
	return new Vec2D(new_x, new_y);
}

function updateOldBodies() {
	var children = Array.from(document.getElementById("main").children);
	children.forEach(el => {
		if(el.style.opacity <= 0)
			el.remove();
		el.style.opacity -= 0.01;
	});
}

function plotBody(body) {
	positionDisplay = UniverseToDisplayCoordinates(body.position);
	//console.log(body.position, positionDisplay);
	
	var svgns = "http://www.w3.org/2000/svg", svg = document.getElementById("main");
	var circle = document.createElementNS(svgns, 'circle');
	circle.setAttributeNS(null, 'id', body.id + "_t" + universe.time);
	circle.setAttributeNS(null, 'cx', positionDisplay.x);
	circle.setAttributeNS(null, 'cy', positionDisplay.y);
	circle.setAttributeNS(null, 'r', body.radius);
	circle.setAttributeNS(null, 'style', 'fill: ' + body.color + '; opacity:' + body.opacity + ';' );
	svg.appendChild(circle);
	
	// var container = document.getElementById("main");
	// var circle = document.createElement("span");
	// circle.setAttribute("id", body.id + "_t" + universe.time);
	// circle.setAttribute("class", "dot");
	// circle.style.left = positionDisplay.x + "px";
	// circle.style.top = positionDisplay.y + "px";
	// circle.style.backgroundColor = body.color;
	// circle.style.opacity = body.opacity;
	// container.appendChild(circle);
	
	
	//console.log("Plotting a body at x=" + positionDisplay.x + ", y=" + positionDisplay.y + ", color=" + body.color);
}

function zoom(newScale) {
	universe.size *= 1 / newScale;
}

window.addEventListener("wheel", event => {
	scale = (1 - event.deltaY * 0.001);
	zoom(scale);
});