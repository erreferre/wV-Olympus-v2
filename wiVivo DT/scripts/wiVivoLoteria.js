// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReadyLoteria, false);

// PhoneGap is ready
function onDeviceReadyLoteria() {
    document.addEventListener("menubutton", cerrarLoteria, false);
    document.addEventListener("backbutton", cerrarLoteria, false);
    //document.addEventListener("backbutton", exitAppPopupColorines, false);
    window.brightness = cordova.require("cordova.plugin.Brightness.Brightness");
    //brightness.setKeepScreenOn(true);
    brightness.getBrightness(function (status) {
        brillo = status;
    }, function (status) {});
    brightness.setBrightness('1.0', function (status) {}, function (status) {});
    window.plugins.powerManagement.acquire();
    //var pantallahorizontal = [{landscaperight:true}];
    //cordova.exec(null, null, "Orientation", "setOrientation", options);
    //setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    //window.plugins.orientationLock.lock("landscape");
    startLoteria();
};

//variables Globales
//var servidor_wivivoLoteria = 'http://srv001.liveshowsync.local';
var servidor_wivivoLoteria = 'http://aerowi.ddns.net';
//alert(servidor_wivivoColorines);
var webservice_wivivoLoteria = servidor_wivivoLoteria + '/david/';
var servidor_leeLoteria = webservice_wivivoLoteria + 'leeLoteria.php';

//variables Loto
var ganador = 0;
var lotoactivada = 0;
var loto = 0;
var repeLoto1 = null;

//VARIABLES DE TIEMPO DE BUCLES
var startloteriasettimeout = 10000;

//variables
var brillo = -1;

//Lanza Loteria
function startLoteria() {
        var data;
        var val;
        $.getJSON(servidor_leeLoteria, function (data) {
            $.each(data, function (key, val) {
                lotoactivada = val.lotoactivada;
                loto = val.loto;
                startloteriasettimeout = val.startLoteriasetTimeout;
                if (ganador === 1 || (loto === 1 && lotoactivada === 1)) {
                    ganador = 1;
                    document.getElementById("pantalla_loteria").style.backgroundPosition = "top right";
                    document.getElementById("pantalla_loteria").style.backgroundRepeat = "no-repeat";
                    document.getElementById("pantalla_loteria").style.backgroundSize = "100%";
                    document.getElementById("pantalla_loteria").style.backgroundImage = "url('./imagenes/bengala2.gif')";
                    if (lotoactivada === 1) playAudio(archivo_pedo);
                }
            });
        });
        repeLoto1 = setTimeout(startLoto, startloteriasettimeout);
    }

// Cancela Loto
function cerrarLoteria(){
    if (repeLoto1 !== null) clearTimeout(repeLoto1);
    window.plugins.powerManagement.release();
    brightness.setBrightness(brillo, function(status){},function(status){});
	window.location.href='index.html#tabstrip-show';
}