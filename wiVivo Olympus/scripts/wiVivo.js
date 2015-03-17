// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    document.addEventListener("menubutton", exitAppPopup, false);
    document.addEventListener("backbutton", exitAppPopup, false);
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

//variables Selfie
var tiposelfie = 0;
var filePath = null;

//variable Colorinees
var colorines = 0;

//ruta guardar fotos
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
var errordetectado = 0;
var errornotificaciones = 0;
var alertasactivadas = 1;

//funcion principal
function startConsultaServidor() {
    var newHTML1;
    var data, val, key;
    $.getJSON(servidor_lee)
        .done(function (data) {
            $.each(data, function (key, val) {
                comienzashow = val.comienzashow;
                alertasactivadas = val.alertasactivadas;
                tiposelfie = val.tiposelfie;
                colorines = val.colorines;
                startconsultaservidorsettimeout = val.startConsultaServidorsetTimeout;
                if (comienzashow === 0) {
                    newHTML1 = '<font color="black"><h2><p>TODAVÍA NON SE FIXERON SELFIES.</p></h2></font>';
                    document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
                } else {
                    if (tiposelfie !== 0) {
                        var data2, val2, key2;
                        var newHTMLselfie = '<button width="100%" class="boton-negro boton-centro boton-text-all-color"><h2>\
                            Pouco a pouco irás vendo os selfies que os membros de Olympus fagan.\
        	                Poderás gardalas con alta calidade no teu móbil pulsando sobre elas.</h2></button>';
                        document.getElementById("div-comienzaShow-selfie2").innerHTML = newHTMLselfie;
                        $.getJSON(servidor_selfie)
                            .done(function (data2) {
                                var newHTMLtmp1 = '';
                                $.each(data2, function (key2, val2) {
                                    foto = val.foto;
                                    posicion = val.posicion;
                                    newHTMLtmp1 = newHTMLtmp1 + '<button class="boton-negro boton-centro boton-text-all-color" onclick="descargaImagen(\'' + foto + '\');">';
                                    newHTMLtmp1 = newHTMLtmp1 + '<img src="' + servidor_thumbs + foto + '" /></button>';
                                });
                                document.getElementById("tabstrip-selfie-fotos").innerHTML = newHTMLtmp1;
                                errordetectado = 0;
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                if (errordetectado === 0) {
                                    errordetectado = 1;
                                    errornotificaciones = 8;
                                }
                                if (alertasactivadas === 1) {
                                    if (errornotificaciones === 5) {
                                        navigator.notification.alert("Espera un pouco, parece que non dou conectado con Internet.", irSelfie(), "ERRO NA COMUNICACION", "OK");
                                    } else if (errornotificaciones === 1) {
                                        navigator.notification.alert("Non dou conectado con Internet. Asegúrate de estar conectado.", irFogar(), "ERRO NA COMUNICACION", "OK");
                                    }
                                    errornotificaciones = errornotificaciones - 1;
                                }
                            });
                    }
                    if (colorines !== 0) {
                        window.location.href = 'colorines.html';
                    }
                }
            });
            errordetectado = 0;
        })
        .fail(function (jqxhr, textStatus, error) {
            if (errordetectado === 0) {
                errordetectado = 1;
                errornotificaciones = 8;
            }
            if (alertasactivadas === 1) {
                if (errornotificaciones === 5) {
                    navigator.notification.alert("Espera un pouco, parece que non dou conectado con Internet.", irFogar(), "ERRO NA COMUNICACION", "OK");
                } else if (errornotificaciones === 1) {
                    navigator.notification.alert("Non dou conectado con Internet. Asegúrate de estar conectado.", irFogar(), "ERRO NA COMUNICACION", "OK");
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

// Descarga Imagen
function descargaImagen(imagen) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(servidor_imagenes + imagen);
    var rutaImagen = filePath + imagen;
    document.getElementById("div-resultado-descarga").innerHTML = 'Descargando a foto. Espera un intre...';
    fileTransfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 50);
            document.getElementById("div-progreso-descarga").innerHTML = perc + '% descargado.';
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

//opcion de Exit
function exitAppPopup() {
    navigator.notification.confirm(
        "visita www.aerowi.es se queres saber como fixemos esta app",
        function (button) {
            if (button === 2) {
                stopConsultaServidor();
                navigator.app.exitApp();
            }
        }, "¿Sair do Show?", "Pois non, Pois si"
    );
    return false;
};

function irFogar() {
    window.location.href = 'index.html#tabstrip-fogar';
};

function irSelfie() {
    window.location.href = 'index.html#tabstrip-selfie';
};