var Eclairement = 0; // valeur de l'éclairement reçu
var temps=0;
var data,layout; // variables globales pour le tracé du graphe plotly.js
var tempsDepart = 0;
var depart = true;//pour trouver le premier point du tracé
var LignePoints = true; // pour changer le type de tracé
var AffichePoints = true; // affiche les points sur la courbe

var dataJson;// les données reçues au format json

var RedSlider, GreenSlider, BlueSlider;
var gauge1;// Jauge luxmètre

var connected_flag= 0 // indicateur de connexion au serveur mqtt
var mqtt; // objet pour connexion au serveur mqtt
var reconnectTimeout = 2000;// reconnexion automatique si erreur
var host=""; // url du serveur (laisser vide ici)
var port=443;// 443 uns ou 8083 wp  port du serveur mqtt
var row=0; // ligne pour affichage des données reçues dans l'onglet paramètre
var clientId; // identification client pour le mqtt (ce n'est pas le login)
var out_msg=""; // message reçu
var mcount=0; // variable de comptage pour afficher un certain nombre de lignes des données reçues

var csvdata = [];// tableau qui contiendra les messures > pour faire un fichier .csv
var NbPointsMax = 500; // nombre de point maximum dans le fichier de données csv

var topicPub1 = "FABLAB_21_22/nom_prenom/ledLDR/in/";
var topicSub1 = "FABLAB_21_22/nom_prenom/ledLDR/out/";

// tracé du graphe plotly.js
data = [{ // les données
  x: [], 
  y: [],
  mode: 'lines+markers',
  marker: {
    color: 'red',
    size: 6,
    //line: {
    //  color: 'rgb(231, 99, 250)',
    //  width: 2
    //},
  },
  line: {color: '#80CAF6'}

}] 

layout = {// disposition présentation
	title: 'Acquisition éclairement',
  xaxis: {
	title: 't (s)',
    autorange: true
  }, 
  yaxis: {
    //type: 'log',
	title: 'E (lux)',
    autorange: true
  }
};


$(document).ready(function() {// attend que la page soit chargée avant de lancer le script javascript

			// action slider
			RedSlider = document.getElementById("redRange");
			GreenSlider = document.getElementById("greenRange");
			BlueSlider = document.getElementById("blueRange");
			
			RedSlider.oninput = function() {
				//output.innerHTML = this.value;
				console.log("slider change : "+this.value);
				publishLed(this.value, GreenSlider.value,BlueSlider.value);
			};
			
			GreenSlider.oninput = function() {
				//output.innerHTML = this.value;
				publishLed(RedSlider.value, GreenSlider.value,BlueSlider.value);
			};
			
			BlueSlider.oninput = function() {
				publishLed(RedSlider.value, GreenSlider.value,BlueSlider.value);
			};
			
			// cadran pour afficher l'éclairement : bibliothèque et documentation disponibles sur le site https://canvas-gauges.com/ 
						gauge1 = new RadialGauge({
						renderTo: 'LUXMETRE',
						width: 550, //dimensions peuvent être ajustées dans le css (fichier style1.css)
						height: 550,
						units: "lx (lux)",
						title: "Eclairement",
						minValue: 0,
						maxValue: 1000,
						value: 0,
						majorTicks: [
							0,
							100,
							200,
							300,
							400,
							500,
							600,
							700,
							800,
							900,
							1000
						],
						minorTicks: 2,
						strokeTicks: true,
						highlights: [
							{
								"from": 0,
								"to": 200,
								"color": "rgba(0,95, 123, 1)"
							},
							{
								"from": 200,
								"to": 600,
								"color": "rgba(0,194, 255, .94)"
							},
							{
								"from": 600,
								"to": 1000,
								"color": "rgba(255, 0, 0, 1)"
							}
						],
						ticksAngle: 225,
						startAngle: 67.5,
						colorMajorTicks: "#fff",
						colorMinorTicks: "#fff",
						colorTitle: "#fff",
						colorUnits: "#fff",
						colorNumbers: "#fff",
						colorPlate: "#908686",
						borderShadowWidth: 0,
						borders: true,
						needleType: "arrow",
						needleWidth: 4,
						needleCircleSize: 7,
						needleCircleOuter: true,
						needleCircleInner: true,
						animationDuration: 1000,
						animationRule: "linear",
						colorBorderOuter: "#333",
						colorBorderOuterEnd: "#111",
						colorBorderMiddle: "#222",
						colorBorderMiddleEnd: "#111",
						colorBorderInner: "#111",
						colorBorderInnerEnd: "#333",
						colorNeedleShadowDown: "#333",
						colorNeedleCircleOuter: "#F00",
						colorNeedleCircleOuterEnd: "#F00",
						colorNeedleCircleInner: "#F00",
						colorNeedleCircleInnerEnd: "#F00",
						colorNeedle: "rgba(255, 0, 0, 1)",
						colorNeedleEnd: "rgba(255, 50, 50, .75)",
						valueBox: true,
						valueBoxBorderRadius: 4,
						colorValueBoxRect: "#fff",
						colorValueBoxRectEnd: "#eee",
						valueDec: 0,// nombre de décimales
						animatedValue: true // animation des valeurs dans la boite
					}).draw();
					

// désactivation des slider

RedSlider.disabled=true;
GreenSlider.disabled=true;
BlueSlider.disabled=true;

Plotly.newPlot('graph', data, layout,{responsive: true,displaylogo: false});// important de définir le graphe

// Pour Bootstrap : quand le menu 1 est affiché on dessine la courbe 
	$('#monTab li:eq(1) a').on('shown.bs.tab', function(){ // quand le menu 1 est affiché on dessine le graphe pour l'ajuster correctement 
				Plotly.newPlot('graph', data, layout,{responsive: true,displaylogo: false});
				//console.log("OK menu 1");
	});
});// fin doc ready					


//autre fonctions
// initialisation de la jauge du luxmètre
function initGauge1(){
	Eclairement = 0;
	$('#ECL1').html(Eclairement);
	gauge1.value = 0;
	gauge1.update();
	//console.log("init gauge1 ok !");
}
function publishLed(red, green, blue){
	//publishMsg(topicPub1,'{"LEDRouge":'+red+'}',0,false);
	publishMsg(topicPub1,'{"LEDRouge":'+red+',"LEDVerte":'+green+',"LEDBleue":'+blue+'}',0,false);
}

