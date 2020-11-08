//PARA HACERLO FUNCIONAR DEBO ASEGURAR DE LLAMAR MIS ESTILOS CSS YA QUE SI LOS TAMAÑOS AQUI LOS LLAMO DESDE CSS SERAN LOS ULTIMO EN CARGARSE POR ESO DEBO LLAMARLO DESDE ESTE CSS
const rootStyles = window.getComputedStyle(document.documentElement); //lo que hace es obtener todos los estilos desde la raiz de mis elemento de nuestro documento ES DECIR TODOS LOS ESTILOS DENTRO DE MI ROOT TAG EN CSS

//HAGO UNA VALIDACION DEL VALOR DE MI PROPIEDAD QUE NO SEA NULO
if(rootStyles.getPropertyValue('--book-cover-width-large') != null && rootStyles.getPropertyValue('--book-cover-width-large') !== '') { //si esto no es nulo eso quiere decir que esta listo para que nosotros las llamemos mediante funcion
    ready();
} else {
    document.getElementById('main-css').addEventListener('load', ready); //EN CASO DE NULO EL VALOR ESTE VA A DAR EL CSS PRINCIPAL QUE ESTA EN LAYOYUTS
} //practicamente esto solo funciona para ver si se cargo el docuemnto o no sino ademas para chequear que main-css esta cargado ya que con esto le digo que carge el docuemtno main.css cuando el valor sea null es decir le dijo carga el javascrip despues de cargar el css y en la parte de arriba chequeo si ya esta cargado que solo tome el valor sino que cargue primero el css

//READY FUNCTION TO MODIFY THE SIZE OF THE COVER INPUT USING FILEPOND
function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large')); //OBTENGO LA ANCHURA DESDE CSS
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio')); //obtengo el ratio
    const coverHeigth = coverWidth / coverAspectRatio; //determino la altura

    //CALL MODULES AND METHODS
    FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
    );

    //STYLE THE FILEPOND (METHODS AND OPTIONS)
    FilePond.setOptions({ //CON IMAGE RESIZE Y ESTAS PORPIEDAD PUEDO CAMBIAR Y SETEAR TAMAÑO A LO QUE ETIPULE ALTURA 150 Y ANCHO 100
        stylePanelAspectRatio: 1 / coverAspectRatio, // 150/100 recordar que mi coverapsetc ratio esta en decimal se lo debo dar como n numero al comienzo por eos le doy la inversa,
        imageResizeTargetWidth: coverWidth, //100,
        imageResizeTargetHeight: coverHeigth //150
    }); //le doy la propiedad de mejorar el ratio el aspecto y le doy la relacion de altura/anchura que es la que estoy poniendo

    //TURN ALL FILES INPUT ELEMENTS INTO PONDS
    FilePond.parse(document.body);
}