// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReadyLoteria, false);

// PhoneGap is ready
function onDeviceReadyLoteria() {
    document.addEventListener("menubutton", cerrarLoteria, false);
    document.addEventListener("backbutton", cerrarLoteria, false);
    startLoteria();
};

//variables Globales
//var servidor_wivivoLoteria = 'http://srv001.liveshowsync.local';
var servidor_wivivoLoteria = 'http://aerowi.ddns.net';
var webservice_wivivoLoteria = servidor_wivivoLoteria + '/olympus/';
var servidor_leeLoteria = webservice_wivivoLoteria + 'leeLoteria.php';

//variables Loto
var ganador = 0;
var lotoactivada = 0;
var loto = 0;
var repeLoto1 = null;
var archivo_pedo = 'sonidos/guapo.mp3';

//VARIABLES DE TIEMPO DE BUCLES
var startloteriasettimeout = 10000;

//Lanza Loteria
function startLoteria() {
    var data;
    var val;
    $.getJSON(servidor_leeLoteria, function (data) {
        $.each(data, function (key, val) {
            lotoactivada = val.lotoactivada;
            loto = val.loto;
            //                startloteriasettimeout = val.startLoteriasetTimeout;
            if (ganador === 1 || (loto === 1 && lotoactivada === 1)) {
                ganador = 1;
                document.getElementById("pantalla_loteria").style.backgroundPosition = "top right";
                document.getElementById("pantalla_loteria").style.backgroundRepeat = "no-repeat";
                document.getElementById("pantalla_loteria").style.backgroundSize = "100%";
                document.getElementById("pantalla_loteria").style.backgroundImage = "url('./imagenes/arale.jpeg')";
                if (lotoactivada === 1) playAudio(archivo_pedo);
            } else {
                document.getElementById("pantalla_loteria").style.backgroundPosition = "top right";
                document.getElementById("pantalla_loteria").style.backgroundRepeat = "no-repeat";
                document.getElementById("pantalla_loteria").style.backgroundSize = "100%";
//                document.getElementById("pantalla_loteria").style.backgroundImage = "url('./imagenes/banana.gif')";
            }
        });
    });
    repeLoto1 = setTimeout(startLoteria, startloteriasettimeout);
}

function playAudio(src) {
    var mi_sonido = null;
    if (device.platform === 'Android') {
        src = '/android_asset/www/' + src;
    }
    mi_sonido = new Media(src, playSuccess, playError);
    mi_sonido.setVolume('1.0');
    mi_sonido.play({
        playAudioWhenScreenIsLocked: true
    });
};

function playSuccess() {
};

function playError(error) {
};

// Cancela Loto
function cerrarLoteria() {
    if (repeLoto1 !== null) clearTimeout(repeLoto1);
    window.location.href = 'index.html#tabstrip-show';
}