/*************************
 
 *************************/

var APIToken ="pk.eyJ1IjoibGlhbW9zdWxsaXZhbiIsImEiOiJjajNkYjhyZnAwMDAyMzNsN2FyZnY3cWQzIn0.c1qL12vFZfc2weViolmnTw";
var canvasMap,canvasBar;
var mapimg;

var headerSize = 100;

//var clat = 0;
//var clon = 0;

var dubLongs = [ -6.630249020937526, -6.266155, -6.041107175234401]; //west, centre, east
var dubLats = [53.48025658959726, 53.350140, 53.142213951523466]; //north, centre, south

var ww = 1024;
var hh = 512;

var timeSlider;
var prevTime = 0;

var zoom = 11; //min 10 - max 20
var sourceData = [];
var sourceLink = "https://data.dublinked.ie/dataset/b1a0ce0a-bfd4-4d0b-b787-69a519c61672/resource/5552e43c-ba3c-4a24-ad1d-dea301f21af5/download/walk-dublin-where-am-i-data-samplep20130415-1512.csv";
var divideBy = 1; //portion of file to use, given as divisor 
var spots = [];



function preload(){

//Get Map
	var url = "https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/" +
    dubLongs[1] + "," + dubLats[1] + "," + zoom + "/" +
    ww + "x" + hh +
    "?access_token="+APIToken;
  mapimg = loadImage(url, "jpg");
  println(url);

//Get data
  //sourceData = loadStrings(sourceLink);
  if (fileExists(sourceLink)) //this has slowed load down a lot
  {
    println("Found file on database");
    sourceData = loadStrings(sourceLink);
    //TODO: save as cached version
  } else
  {
    println("ERROR: File not found on database --- opening cached version");
    sourceData = loadStrings("cache.csv");
  } 
  //console.log(sourceData);
}

function  setup() {
  	canvasMap = createCanvas(1024, 512);
	canvasMap.position(0, 0);
	canvasMap.translate(width / 2, height / 2);
	imageMode(CENTER);
	canvasMap.image(mapimg, 0, 0);
	timeSlider = createSlider(0,5,prevTime); 
	timeSlider.position(0, 10+canvas.height);
	timeSlider.size(1024, 36);
	
	//stroke(5);
  // rectMode(CORNER);
  // rect(,0,width,height);
   var cx = mercX(dubLongs[1]);
   var cy = mercY(dubLats[1]);
  //var centre = new PVector(cx, cy);
  
  if (sourceData!=null) {
    //spots=new Spot[sourceData.length-1]; //ignore first line
    for (var i = 1; i < floor (sourceData.length/divideBy); i+=1) {
      var cells = sourceData[i].split("/");
      var lt = float(cells[2]);
      var lg = float(cells[3]);
      
      var yr, m, d;
      for (var j = 0; j < cells.length; j+=1) {
	    var date = cells[0].split("-"); 
	       //print("Date has n = "+date.length+"\t");
	       //for (var k=0; k<date.length; k+=1) {
	       //  print("Date "+k+": "+date[k]);
	       //}
	    yr=int(date[0]);
	    m=int(date[1]);
	    d=int(date[2]);
	       //print("\tYear: "+year+"\tMonth: "+month+"\tDay: "+day+"\t");
	       //print("\tLong: "+lng+"\tLat: "+lat);
	      
	   }
      spots[i] = {
      	id: i,
      	string: sourceData[i],
      	lat: lt,
      	long: lg,
      	x: mercX(lg) - cx,
		y: mercY(lt) - cy, 
		year: yr,
		month: m,
		day: d,
		show: function(){
			noStroke();
			fill(109, 153, 224, 100);
			ellipse(this.x, this.y, 10, 10);
		}
      }	
      //spots[i].show();
      //console.log("| Spot #"+spots[i].id+"\t" +spots[i].string);
      // console.log("| Spot #"+spots[i].id+"\t" +spots[i].lat+"\t" 
      // 	+spots[i].long+"\t" +spots[i].x+"\t" +spots[i].y+"\t"
      // +spots[i].year+"\t" +spots[i].month+"\t"+spots[i].day);

    }
    
  } else {
    println("ERROR! No data file found.");
  }
 //console.log("No of occurances in 2013 was "+showYear(2013));
   //console.log("No of occurances in 03/2013 was "+showMonth(2013, 3));
    //console.log("No of occurances on 01/03/2013 was "+showDay(2013, 3, 1));
}

function draw(){
	translate(width/2, height/2)
	image(mapimg, 0, 0);
	var t = timeSlider.value();
	//only update on change
	if(t!=prevTime){
 	console.log("slider: "+t);
	prevTime = t;
	}
	showMonth(2013, t);
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

// function fetchStatus(address) {
//   var client = new XMLHttpRequest();
//   client.onload = function() {
//     // in case of network errors this might not give reliable results
//     returnStatus(this.status);
//   }
//   client.open("HEAD", address);
//   client.send();
// }

function showYear(y_) {
  //var time =millis();
  var count = 0;
  for (var i=1; i<spots.length; i+=1) {
    if (spots[i].year===y_) {
      count+=1;
      spots[i].show();
    }
  }
  //time=millis()-time;
  //console.log("Year count took "+time+"ms");
  return count;
}

function showMonth(y_, m_) {
  //var time =millis();
  var count = 0;
  for (var i=1; i<spots.length; i+=1) {
    if (spots[i].year===y_&& spots[i].month===m_) {
      count+=1;
      spots[i].show();
    }
  }
  //time=millis()-time;
  //println("Month count took "+time+"ms");
  return count;
}

function showDay(y_, m_, d_) {
  //var time =millis();
  var count = 0;
  for (var i=1; i<spots.length; i+=1) {
    if ((spots[i].year===y_) && (spots[i].month===m_) && (spots[i].day===d_)) {
      count+=1;
      spots[i].show();
    }
  }
  //time=millis()-time;
  //println("Day count took "+time+"ms");
  return count;
}
