
var ferros;
var vals;
var coords,coordDict;

var centerPoint;
var centerDistA;
var centerDistB;
var t,s,d;
var sDial,fDial,miniCenter,tp;


function preload() {
  //ferro font
  ferros=loadFont("Fe2O3_Glyphs.otf");
  //json file which gives the ranked nodes/contours of each ferro to arrange them within the space
  //using another font would require you to decide how to choose the central nodes; 
  //could experiment with some of these: https://fonts2u.com/category.html?id=20
  //could use nodes/contours, but could also use some other metric
  //it makes boundaries based on euclidean distance from there 
  vals=loadJSON("ordinalFerros.json");
}

function setup() {
  createCanvas(800,800);
  background(200);
  textFont("Times");
  textSize(150);
  coords=[];
  coordDict = {};
  console.log(vals);
  for (var key in vals) {
    var nodeRank=vals[key]["nodeRank"];
    var contRank=vals[key]["contRank"];
    coords.push(createVector(nodeRank,contRank));
    coordDict[nodeRank.toString()+","+contRank.toString()] = key;
  }
  console.log(coordDict);
  
  fDial=new FerroDial(50,50,0,137);

  centerPoint=createVector(250,300);
  t=5;
  s=25;
  d=0.5;
  sDial=new SquiggleDial(90,300, -5,15, -30, 50);
  tp=createVector(0,0);

}

function draw() {
  background(255);
  stroke(0)
  //to show map of ferros uncomment 6 lines below. unless textFont(ferros) is called before text(), it will show normal alphabet rather than Ferros in the designated positions
  //line(50,50,50,750);
  //line(50,750,750,750);
  //for (var key in vals) {
  //  textSize(20);
  //  text(key,scalesev(vals[key]["nodeRank"])+20,scalesev(vals[key]["contRank"]+10));
  //}
  fDial.show();
  sDial.show();
  makeFerro(fDial.val);
  makeSquiggle(centerPoint,t,s,d);
}

function scalesev(coord) {
  return (700*coord)/137;
}
function makeFerro(pos) {
  var minDist = 200;
  var closestChar;
  for (var i=0;i<coords.length; i++) {
    if (dist(pos.x,pos.y, coords[i].x,coords[i].y)<minDist) {
      minDist=dist(pos.x,pos.y, coords[i].x,coords[i].y);
      closestChar=coordDict[coords[i].x.toString()+","+coords[i].y.toString()];
    }
  }
  textFont(ferros);
  fill(0);
  text(closestChar, 150,160);
}



function makeSquiggle(c,tVal, sVal, dVal) {
  var cDistA=sVal;
  var cDistB=sVal+30;
  curveTightness(tVal);
  noFill();
  beginShape();
  strokeWeight(dVal);
  stroke(0);
  curveVertex(c.x,c.y);
  curveVertex(c.x-cDistA, c.y+cDistB);
  curveVertex(c.x+cDistB, c.y+cDistA);
  curveVertex(c.x+cDistB, c.y-cDistA);
  curveVertex(c.x+cDistA, c.y+cDistB);
  curveVertex(c.x-cDistA, c.y-cDistB);
  curveVertex(c.x+cDistA, c.y+cDistB);
  curveVertex(c.x-cDistB, c.y-cDistA);
  curveVertex(c.x+cDistA, c.y-cDistB);
  curveVertex(c.x-cDistB, c.y-cDistA);
  curveVertex(c.x-cDistA, c.y+cDistB);
  curveVertex(c.x,c.y);
  endShape();
}





function FerroDial(theX, theY,tMin, tMax) {
  this.x=theX;
  this.y=theY;
  this.tMin=tMin;
  this.tMax=tMax;
  this.controlX = theX+40;
  this.controlY = theY+40;
  this.maxX=this.x+80;
  this.minX=this.x;
  this.maxY=this.y+80;
  this.minY=this.y;
  this.val=createVector(68.5,68.5);

  this.show = function () {
    noStroke();
    fill(200);
    rect(this.x, this.y, 80, 80);
    fill(115,45,45);
    ellipse(this.controlX,this.controlY,7.5,7.5);
  }

  this.onControl = function() {
    if (dist(this.controlX,this.controlY,mouseX,mouseY)>7.5/2) {
      return false;
    } else {
      return true;
    }
  }

  this.isInside = function() {
    if (mouseX<this.maxX&&mouseX>this.minX&&mouseY<this.maxY&&mouseY>this.minY) {
      return true;
    } else {
      return false;
    }
  }

  this.changeVal = function() {
    var propX=(mouseX-this.minX)/80;
    var propY=(mouseY-this.minY)/80;
    this.val.x=propX*137;
    this.val.y=propY*137;
  }

}



function SquiggleDial(theX, theY,tMin, tMax, sMin, sMax) {
  this.x=theX;
  this.y=theY;
  this.tMin=tMin;
  this.tMax=tMax;
  this.sMin=sMin;
  this.sMax=sMax;
  this.trange=tMax-tMin;
  this.srange=sMax-sMin;
  this.controlX = theX;
  this.controlY = theY;
  this.maxX=this.x+80/2;
  this.minX=this.x-80/2;
  this.maxY=this.y+80/2;
  this.minY=this.y-80/2;

  this.show = function () {
    noStroke();
    fill(200);
    ellipse(this.x, this.y, 80, 80);
    fill(115,45,45);
    ellipse(this.controlX,this.controlY,7.5,7.5);
  }

  this.onControl = function() {
    if (dist(this.controlX,this.controlY,mouseX,mouseY)>7.5/2) {
      return false;
    } else {
      return true;
    }
  }

  this.isInside = function() {
    if (dist(this.x,this.y,mouseX,mouseY)>80/2) {
      return false;
    } else {
      return true;
    }
  }

  this.changeShape = function() {
    var distFromLeft = (mouseX-this.minX)/80;//only called if inside when mouseX must be >minX
    var distFromTop = (mouseY-this.minY)/80;
    t=this.tMin+(this.trange*distFromLeft);
    s=this.sMin+(this.srange*distFromTop);
    d=dist(this.x,this.y,mouseX,mouseY)/10+0.5
  }
}

function mouseDragged() {
  if (fDial.isInside() && fDial.onControl) {
    fDial.controlX=mouseX;
    fDial.controlY=mouseY;
    fDial.changeVal();
  }
    if (sDial.isInside() && sDial.onControl) {
    sDial.controlX=mouseX;
    sDial.controlY=mouseY;
    sDial.changeShape();
  }
}





