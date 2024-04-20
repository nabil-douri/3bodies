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
		if(el.style.opacity <= 0.01)
			el.remove();
		el.style.opacity *= 0.98;
		el.style.filter = "brightness(1)";
		el.setAttributeNS(null, 'r', 1);
	});
}

function plotTrajectories(bodies, oldBodies) {
	var children = Array.from(document.getElementById('main').getElementsByTagName('path'));
	children.forEach(el => { el.remove(); });
	
	bodies.forEach(body => {
		var svgns = "http://www.w3.org/2000/svg", svg = document.getElementById("main");
		var path = document.createElementNS(svgns, 'path');
		path.setAttributeNS(null, 'id', body.id + '_path');
		path.setAttributeNS(null, 'stroke', body.color);
		path.setAttributeNS(null, 'stroke-width', 2);
		path.setAttributeNS(null, 'fill', 'transparent');
		path.setAttributeNS(null, 'style', 'opacity:0.5; filter: brightness(1);' );
		
		var pathArray = [];
		var i = 0;
		
		oldBodies.filter(oldBody => oldBody.id == body.id).forEach(oldBody => {
			positionDisplay = UniverseToDisplayCoordinates(oldBody.position);
		
			if(i == 0) {
				pathArray.push("M");
				pathArray.push(positionDisplay.x);
				pathArray.push(positionDisplay.y);
			}
			// else if(i == 1) {
				// pathArray.push("Q");
				// pathArray.push(positionDisplay.x);
				// pathArray.push(positionDisplay.y);
			// }
			// else if(i == 2) {
				// pathArray.push(",");
				// pathArray.push(positionDisplay.x);
				// pathArray.push(positionDisplay.y);
			// }
			else {
				pathArray.push("L");
				pathArray.push(positionDisplay.x);
				pathArray.push(positionDisplay.y);
			}
			
			i++;
		});
		
		path.setAttributeNS(null, 'd', pathArray.join(' '));
		svg.appendChild(path);
	});
}

function plotBodies(bodies) {
	var children = Array.from(document.getElementById('main').getElementsByTagName('circle'));
	children.forEach(el => { el.remove(); });
	
	bodies.forEach(body => {
		positionDisplay = UniverseToDisplayCoordinates(body.position);
		//console.log(body.position, positionDisplay);
		
		var svgns = "http://www.w3.org/2000/svg", svg = document.getElementById("main");
		var circle = document.createElementNS(svgns, 'circle');
		circle.setAttributeNS(null, 'id', body.id + "_t" + universe.time);
		circle.setAttributeNS(null, 'cx', positionDisplay.x);
		circle.setAttributeNS(null, 'cy', positionDisplay.y);
		circle.setAttributeNS(null, 'r', body.radius);
		circle.setAttributeNS(null, 'fill', body.color);
		circle.setAttributeNS(null, 'style', 'opacity:1; filter: brightness(2);' );
		svg.appendChild(circle);
		//console.log("Plotting a body at x=" + positionDisplay.x + ", y=" + positionDisplay.y + ", color=" + body.color);
	});
	
}

function zoom(newScale) {
	// Removes all displayed elements
	Array.from(document.getElementById("main").children).forEach(el => {
		el.remove();
	});
	
	// Changes universe size
	universe.size *= 1 / newScale;
}

window.addEventListener("wheel", event => {
	scale = (1 - event.deltaY * 0.002);
	zoom(scale);
});



function pause_play(caller_id) {
	universe.paused = ! universe.paused;
	
	if(universe.paused == true) {
		document.getElementById(caller_id).innerHTML = "&#x23F5;";
	}
	else {
		document.getElementById(caller_id).innerHTML = "&#x23F8;";
	}
}