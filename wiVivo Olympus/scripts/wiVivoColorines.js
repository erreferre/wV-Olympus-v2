// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReadyColorines, false);

// PhoneGap is ready
function onDeviceReadyColorines() {
    document.addEventListener("menubutton", cerrarColorines, false);
    document.addEventListener("backbutton", cerrarColorines, false);
    window.brightness = cordova.require("cordova.plugin.Brightness.Brightness");
    brightness.getBrightness(function(status){brillo = status;},function(status){});
    brightness.setBrightness('1.0', function(status){},function(status){});
    window.plugins.powerManagement.acquire();
    window.plugins.orientationLock.unlock();
    startColorines();
};

//variables Globales
//var servidor_wivivoColorines = 'http://srv001.liveshowsync.local';
var servidor_wivivoColorines = 'http://aerowi.ddns.net';
var webservice_wivivoColorines = servidor_wivivoColorines + '/olympus/'; 
var servidor_leeColorines = webservice_wivivoColorines + 'lee.php';

//VARIABLES DE TIEMPO DE BUCLES
var startcolorinessettimeout = 10000;
var startcolorinessetinterval = 200;

//variables Colorines
var colorines = 0;
var colorColorines = null;
var coloresColorines = null;
var colorseleccionadoColorines = null;
var intermitenciaColorines = null;
var repeColorines1Colorines = null;
var repeColorines2Colorines = null;
var brillo = -1;

var checkconexionColorines = 0;
var errordetectadoColorines = 0;
var errornotificacionesColorines = 0;
var alertasactivadasColorines = 1;
var primeravez = 1;

function leeConfiguracionColorines() {
    //tendra siempre el COLOR1
    colorColorines = 0;
};

// Lanza Colorines
function startColorines(){
    if (primeravez !== 0) {leeConfiguracionColorines(); primeravez = 0;}
	$.getJSON(servidor_leeColorines)
	.done(function(data) {  
        $.each(data, function(key, val) {
            colorines = val.colorines;
            if (colorines === 0) {cerrarColorines();}
            alertasactivadasColorines = val.alertasactivadas;
	        intermitenciaColorines = val.intermitencia;
            startcolorinessettimeout = val.startColorinessetTimeout;
            startcolorinessetinterval = val.startColorinessetInterval;
            if (intermitenciaColorines === 0) {
        		coloresColorines = val.color1;    
                if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
                document.getElementById("pantalla_colorines").style.backgroundImage = "none";
            	colorseleccionadoColorines = coloresColorines;
            	document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
        	}
        	if (intermitenciaColorines === 1) {
                if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
                document.getElementById("pantalla_colorines").style.backgroundImage = "none";
	    		coloresColorines = [val.color2,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1,val.color1];
        		repeColorines1Colorines = setInterval(function() {
        			var indice = Math.floor(Math.random() * coloresColorines.length);
            		colorseleccionadoColorines = coloresColorines[indice];
            		document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
	        	}, startcolorinessetinterval);    
       	 	}
        	if (intermitenciaColorines === 2) {
                if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
                document.getElementById("pantalla_colorines").style.backgroundImage = "none";
        		coloresColorines = [val.color1,val.color2];
                var esimpar = 0;
        		repeColorines1Colorines = setInterval(function() {
        			if (esimpar === 0) {esimpar = 1;} else {esimpar = 0;}
            		colorseleccionadoColorines = coloresColorines[esimpar];
            		document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
	        	}, startcolorinessetinterval);    
        	}
    	});
        errordetectadoColorines = 0;
	})
	.fail(function(jqxhr, textStatus, error){
		if (errordetectadoColorines === 0){
            errordetectadoColorines = 1;
            errornotificacionesColorines = 3;
        }
        if (alertasactivadasColorines === 1){
            if (errornotificacionesColorines === 1){
	        }
            errornotificacionesColorines = errornotificacionesColorines - 1;
        }
	});
    repeColorines2Colorines = setTimeout(startColorines, startcolorinessettimeout);
}

// Cancela Colorines
function stopColorines(){
    if (repeColorines1Colorines !== null) {
        clearInterval(repeColorines1Colorines);
        repeColorines1Colorines = null;
    }
    if (repeColorines2Colorines !== null) {
        clearTimeout(repeColorines2Colorines);
        repeColorines2Colorines = null;
    }
}

function cerrarColorines(){
    window.plugins.orientationLock.unlock();
    stopColorines();
    window.plugins.powerManagement.release();
    brightness.setBrightness(brillo, function(status){},function(status){});
	window.location.href='index.html#tabstrip-fogar';
}
