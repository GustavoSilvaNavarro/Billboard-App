//CALL MODULES AND METHODS
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
);

//STYLE THE FILEPOND (METHODS AND OPTIONS)
FilePond.setOptions({ //CON IMAGE RESIZE Y ESTAS PORPIEDAD PUEDO CAMBIAR Y SETEAR TAMAÑO A LO QUE ETIPULE ALTURA 150 Y ANCHO 100
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
}); //le doy la propiedad de mejorar el ratio el aspecto y le doy la relacion de altura/anchura que es la que estoy poniendo

//TURN ALL FILES INPUT ELEMENTS INTO PONDS
FilePond.parse(document.body);