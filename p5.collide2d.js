 // test if the center of the circle is inside the polygon
 if(interior === true){
    var centerInside = this.collidePointPoly(cx,cy, vertices);
    if (centerInside) return true;
  }

  // otherwise, after all that, return false
  return false;
}

// p5.vector version of collideCirclePoly
p5.prototype.collideCirclePolyVector = function(c, diameter, vertices, interior){
  return p5.prototype.collideCirclePoly(c.x, c.y, diameter, vertices, interior);
}

p5.prototype.collideRectPoly = function( rx, ry, rw, rh, vertices, interior) {
  if (interior == undefined){
    interior = false;
  }

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    var vc = vertices[current];    // c for "current"
    var vn = vertices[next];       // n for "next"

    // check against all four sides of the rectangle
    var collision = this.collideLineRect(vc.x,vc.y,vn.x,vn.y, rx,ry,rw,rh);
    if (collision) return true;

    // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
    if(interior === true){
      var inside = this.collidePointPoly(rx,ry, vertices);
      if (inside) return true;
    }
  }

  return false;
}

// p5.vector version of collideRectPoly
p5.prototype.collideRectPolyVector = function(r, rsz, vertices, interior){
  return p5.prototype.collideRectPoly(r.x, r.y, rsz.x, rsz.y, vertices, interior);
}

p5.prototype.collideLinePoly = function(x1, y1, x2, y2, vertices) {

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position extract X/Y coordinates from each
    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y;

    // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
    var hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }
  // never got a hit
  return false;
}


// p5.vector version of collideLinePoly
p5.prototype.collideLinePolyVector = function(p1, p2, vertice){
  return p5.prototype.collideLinePoly(p1.x, p1.y, p2.x, p2.y, vertice);
}

p5.prototype.collidePolyPoly = function(p1, p2, interior) {
  if (interior === undefined){
    interior = false;
  }

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<p1.length; current++) {

    // get next vertex in list, if we've hit the end, wrap around to 0
    next = current+1;
    if (next === p1.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    var vc = p1[current];    // c for "current"
    var vn = p1[next];       // n for "next"

    //use these two points (a line) to compare to the other polygon's vertices using polyLine()
    var collision = this.collideLinePoly(vc.x,vc.y,vn.x,vn.y,p2);
    if (collision) return true;

    //check if the either polygon is INSIDE the other
    if(interior === true){
      collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
      if (collision) return true;
      collision = this.collidePointPoly(p1[0].x, p1[0].y, p2);
      if (collision) return true;
    }
  }

  return false;
}

p5.prototype.collidePolyPolyVector = function(p1, p2, interior) {
  return p5.prototype.collidePolyPoly(p1, p2, interior);
}

p5.prototype.collidePointTriangle = function(px, py, x1, y1, x2, y2, x3, y3) {

  // get the area of the triangle
  var areaOrig = this.abs( (x2-x1)*(y3-y1) - (x3-x1)*(y2-y1) );

  // get the area of 3 triangles made between the point and the corners of the triangle
  var area1 =    this.abs( (x1-px)*(y2-py) - (x2-px)*(y1-py) );
  var area2 =    this.abs( (x2-px)*(y3-py) - (x3-px)*(y2-py) );
  var area3 =    this.abs( (x3-px)*(y1-py) - (x1-px)*(y3-py) );

  // if the sum of the three areas equals the original, we're inside the triangle!
  if (area1 + area2 + area3 === areaOrig) {
    return true;
  }
  return false;
}

// p5.vector version of collidePointTriangle
p5.prototype.collidePointTriangleVector = function(p, p1, p2, p3){
  return p5.prototype.collidePointTriangle(p.x, p.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
}

p5.prototype.collidePointPoint = function (x,y,x2,y2, buffer) {
    if(buffer === undefined){
      buffer = 0;
    }

    if(this.dist(x,y,x2,y2) <= buffer){
      return true;
    }

  return false;
};

// p5.vector version of collidePointPoint
p5.prototype.collidePointPointVector = function(p1, p2, buffer){
  return p5.prototype.collidePointPoint(p1.x,p1.y,p2.x,p2.y, buffer);
}

p5.prototype.collidePointArc = function(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {

  if (buffer === undefined) {
    buffer = 0;
  }
  // point
  var point = this.createVector(px, py);
  // arc center point
  var arcPos = this.createVector(ax, ay);
  // arc radius vector
  var radius = this.createVector(arcRadius, 0).rotate(arcHeading);

  var pointToArc = point.copy().sub(arcPos);

  if (point.dist(arcPos) <= (arcRadius + buffer)) {
    var dot = radius.dot(pointToArc);
    var angle = radius.angleBetween(pointToArc);
    if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
      return true;
    }
  }
  return false;
}

// p5.vector version of collidePointArc
p5.prototype.collidePointArcVector = function(p1, a, arcRadius, arcHeading, arcAngle, buffer){
  return p5.prototype.collidePointArc(p1.x, p1.y, a.x, a.y, arcRadius, arcHeading, arcAngle, buffer);
}
