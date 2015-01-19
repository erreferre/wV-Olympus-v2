// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    document.addEventListener("menubutton", exitAppPopup, false);
    document.addEventListener("backbutton", exitAppPopup, false);
    window.plugins.powerManagement.acquire();
    window.plugins.orientationLock.unlock();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemError);
    startConsultaServidor();
};

//variables Globales
//var servidor_wivivo = 'http://srv001.liveshowsync.local';
var servidor_wivivo = 'http://aerowi.ddns.net';
var webservice_wivivo = servidor_wivivo + '/olympus/';

var servidor_lee = webservice_wivivo + 'lee.php';
var servidor_selfie = webservice_wivivo + 'leeThumbs.php';
var servidor_imagenes = webservice_wivivo + 'subido/';
var servidor_thumbs = webservice_wivivo + 'subido/thumbs/';

//tiempos iteracion de bucles
var repeConsultaServidor1 = null;
var startconsultaservidorsettimeout = 10000;
var startselfiesettimeout = 20000;

//variables Guapo
var archivo_guapo = 'sonidos/guapo.mp3';
var guapoactivado = 0;
var guapoechado = 0;

//variables Aplauso
var archivo_aplauso = 'sonidos/aplauso1.mp3';
var aplausoactivado = 0;
var aplausoechado = 0;

//variables Selfie
var tiposelfie = 0;
var repeSelfie1 = null;
var filePath = null;

function onFileSystemSuccess(fileSystem) {
    //if (device.platform === 'Android'){
    filePath = fileSystem.root.fullPath + '\/' + 'wiVivo_';
    //} else {
    //	filePath = fileSystem.root.fullPath+"\/"+'DavidAmorSelfie_';
    //}
};

function onFileSystemError(error) {
    console.log(error.code);
};

//otras variables
var checkconexion = 0;
var comienzashow = 0;
var primeravezcomienzashow = 1;
var showcomenzado = 0;
var errordetectado = 0;
var errornotificaciones = 0;
var alertasactivadas = 1;

// Se lanza onDeviceready
// chequea conexion, habilita los botones, popup alerta indicando que empezamos, espera sonidos.
function startConsultaServidor() {
    var newHTML1;
    var newHTMLshow, newHTMLshowb1, newHTMLshowb2, newHTMLshowb3, newHTMLshowb4, newHTMLshowb5;
    var newHTMLselfie;
    var data;
    var val;
    $.getJSON(servidor_lee)
        .done(function (data) {
            $.each(data, function (key, val) {
                comienzashow = val.comienzashow;
                showcomenzado = val.showcomenzado;
                alertasactivadas = val.alertasactivadas;
                guapoactivado = val.guapoactivado;
                aplausoactivado = val.aplausoactivado;
                tiposelfie = val.tiposelfie;
                startconsultaservidorsettimeout = val.startConsultaServidorsetTimeout;
                startselfiesettimeout = val.startSelfiesetTimeout;
                if (comienzashow === 0) {
                    newHTML1 = '<font color="black"><h2><p>TODAVÍA NON COMEZOU O ESPECTÁCULO E A MOITAS DAS FUNCIÓNS DESTA APP ESTÁN DESHABILITADAS<p>\
					<p>PRESTA ATENCIÓN ÁS INSTRUCCIÓN QUE VOS IREMOS DANDO</p></h2></font>';
                    document.getElementById("div-comienzaShow-show").innerHTML = newHTML1;
                    document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
                } else {
                    newHTML1 = '';
//                    newHTMLshowb1 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
//        			onclick="mensajeGuapoActivado();if (repeConsultaServidor1===null) startConsultaServidor();">\
//                	<h1>::::::::::::::::::::::::::<br/>lector de mentes<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
//                    newHTMLshowb2 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
//        			onclick="mensajeAplausoActivado();if (repeConsultaServidor1===null) startConsultaServidor();">\
//                	<h1>::::::::::::::::::::::::::<br/>comodidade<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                    newHTMLshowb3 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="window.open(\'loteria.html\');">\
        			<h1>::::::::::::::::::::::::::<br/>lotaria<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                    newHTMLshowb4 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="window.location.href=\'#tabstrip-selfie\';if (repeSelfie1===null) startSelfie();">\
        			<h1>::::::::::::::::::::::::::<br/>selfies<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                    newHTMLshowb5 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="window.open(\'colorines.html\');">\
        			<h1>::::::::::::::::::::::::::<br/>colorines<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                    newHTMLselfie = '';
                    document.getElementById("div-comienzaShow-show").innerHTML = newHTML1;
                    document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
//                    document.getElementById("div-comienzaShow-showb1").innerHTML = newHTMLshowb1;
//                    document.getElementById("div-comienzaShow-showb2").innerHTML = newHTMLshowb2;
                    document.getElementById("div-comienzaShow-showb3").innerHTML = newHTMLshowb3;
                    document.getElementById("div-comienzaShow-showb4").innerHTML = newHTMLshowb4;
                    document.getElementById("div-comienzaShow-showb5").innerHTML = newHTMLshowb5;
                    if ((primeravezcomienzashow === 1) && (showcomenzado === 0)) {
                        primeravezcomienzashow = 0;
                        navigator.notification.beep(2);
                        navigator.notification.vibrate(4000)
                        navigator.notification.alert("Isto arrinca... Agora podes ver uns botóns. Non te preocupes, irémosche dicindo cal pulsar...", comienzaShow(), "COMEZA O ESPECTÁCULO!!!", "OK");
                    }
                }
                if ((guapoechado === 0) && (guapoactivado === 1)) {
                    //suena guapo en todos
                    playAudio(archivo_guapo);
                    guapoechado = 1;
                } else if (guapoactivado === 0) {
                    guapoechado = 0;
                }
                if ((aplausoechado === 0) && (aplausoactivado === 1)) {
                    //suena aplauso en todos
                    playAudio(archivo_aplauso);
                    aplausoechado = 1;
                } else if (aplausoactivado === 0) {
                    aplausoechado = 0;
                }
            });
            if (errordetectado === 1) {
                if (alertasactivadas === 1) {
                    navigator.notification.alert("Parece que xa vai...", irShow(), "COMUNICACION RECUPERADA", "OK");
                }
            }
            errordetectado = 0;
        })
        .fail(function (jqxhr, textStatus, error) {
            newHTML1 = '<font color="black"><h2><p>NON ESTÁS CORRECTAMENTE CONECTADO Ó ESPECTÁCULO.</p>\
        	<p>REVISA QUE TEÑAS CONEXIÓN A INTERNET.</p></h2></font>';
            document.getElementById("div-comienzaShow-show").innerHTML = newHTML1;
            document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
            if (errordetectado === 0) {
                errordetectado = 1;
                errornotificaciones = 8;
            }
            if (alertasactivadas === 1) {
                if (errornotificaciones === 5) {
                    navigator.notification.alert("Proba de novo... parece que non dou conectado con Internet", irFogar(), "ERRO NA COMUNICACION", "OK");
                } else if (errornotificaciones === 1) {
                    navigator.notification.alert("Non recupero a conexión. Sae da App (pulsando o botón menú do teu móbil) e volve a lanza-la", irFogar(), "ERRO NA COMUNICACION", "OK");
                }
                errornotificaciones = errornotificaciones - 1;
            }
        });
    repeConsultaServidor1 = setTimeout(startConsultaServidor, startconsultaservidorsettimeout);
};

//STOP startConsultaServidor()
function stopConsultaServidor() {
    if (repeConsultaServidor1 !== null) clearTimeout(repeConsultaServidor1);
    repeConsultaServidor1 = null;
};

// se lanza al comerzar el Show
function comienzaShow() {
    window.location.href = 'index.html#tabstrip-show';
};

// Lanza Selfie
function startSelfie() {
    var data;
    var val;
    var newHTMLselfie2;
    newHTMLselfie2 = '<button width="100%" class="boton-negro boton-centro boton-text-all-color"><h2>\
            Pouco a pouco irás vendo as fotos que os membros de Olympus fagan.\
        	Poderás gardalas con alta calidade no teu móbil pulsando sobre as que che gusten.</h2></button>';
    document.getElementById("div-comienzaShow-selfie2").innerHTML = newHTMLselfie2;
    if (tiposelfie === 1) {
        var newHTMLtmp1 = '<img src="./imagenes/portada.png" width="100%" />';
        document.getElementById("tabstrip-selfie-fotos").innerHTML = newHTMLtmp1;
    } else if (tiposelfie === 2) {
        $.getJSON(servidor_selfie)
            .done(function (data) {
                var newHTMLtmp2 = '';
                $.each(data, function (key, val) {
                    foto = val.foto;
                    posicion = val.posicion;
                    newHTMLtmp2 = newHTMLtmp2 + '<button class="boton-negro boton-centro boton-text-all-color" onclick="descargaImagen(\'' + foto + '\');">';
                    newHTMLtmp2 = newHTMLtmp2 + '<img src="' + servidor_thumbs + foto + '" /></button>';
                });
                document.getElementById("tabstrip-selfie-fotos").innerHTML = newHTMLtmp2;
                if (errordetectado === 1) {
                    if (alertasactivadas === 1) {
                        navigator.notification.alert("Parece que xa vai...", irSelfie(), "COMUNICACION RECUPERADA", "OK");
                    }
                }
                errordetectado = 0;
            })
            .fail(function (jqxhr, textStatus, error) {
                if (errordetectado === 0) {
                    errordetectado = 1;
                    errornotificaciones = 8;
                }
                if (alertasactivadas === 1) {
                    if (errornotificaciones === 5) {
                        navigator.notification.alert("Proba de novo... parece que non dou conectado con Internet", irShow(), "ERRO NA COMUNICACION", "OK");
                    } else if (errornotificaciones === 1) {
                        navigator.notification.alert("Non recupero a conexión. Sae da App (pulsando o botón menú do teu móbil) e volve a lanza-la", irFogar(), "ERRO NA COMUNICACION", "OK");
                    }
                    errornotificaciones = errornotificaciones - 1;
                }
            });
    }
    repeSelfie1 = setTimeout(startSelfie, startselfiesettimeout);
};

// Cancela Selfie
function stopSelfie() {
    if (repeSelfie1 !== null) clearTimeout(repeSelfie1);
    repeSelfie1 = null;
};


// Descarga Imagen
function descargaImagen(imagen) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(servidor_imagenes + imagen);
    var rutaImagen = filePath + imagen;
    document.getElementById("div-resultado-descarga").innerHTML = 'Descargando a foto. Espera un intre...';
    fileTransfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 50);
            document.getElementById("div-progreso-descarga").innerHTML = perc + '% descargado...';
        } else {
            document.getElementById("div-progreso-descarga").innerHTML += '.';
        }
    };
    fileTransfer.download(
        uri,
        rutaImagen,
        function (entry) {
            document.getElementById("div-resultado-descarga").innerHTML = '';
            document.getElementById("div-resultado-descarga-ruta").innerHTML += 'Foto gardada en: ' + entry.fullPath + '<br/>';
        },
        function (error) {
            document.getElementById("div-resultado-descarga").innerHTML = 'Houbo un erro, volve a descargala';
        });
};

// Play sonidos
var mi_sonido = null;

function playAudio(src) {
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
    console.log("playAudio():Audio Success");
};

function playError(error) {
    navigator.notification.alert("non se puido reproduci-la son", irShow(), "ERRO NA REPRODUCCION", "OK");
};

//opcion de Exit
function exitAppPopup() {
    navigator.notification.confirm(
        "visita www.aerowi.es se queres saber como fixemos esta app",
        function (button) {
            if (button === 2) {
                window.plugins.powerManagement.release();
                stopConsultaServidor();
                stopSelfie();
                navigator.app.exitApp();
            }
        }, "¿Sair do Show?", "Pois non, Pois si"
    );
    return false;
};

function irShow() {
    window.location.href = 'index.html#tabstrip-show';
};

function irFogar() {
    window.location.href = 'index.html#tabstrip-fogar';
};

function irSelfie() {
    window.location.href = 'index.html#tabstrip-selfie';
};