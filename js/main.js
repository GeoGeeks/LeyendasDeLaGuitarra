require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/VectorTileLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Expand",
    "esri/tasks/support/Query",
], function(Map, MapView, VectorTileLayer, FeatureLayer, Expand, Query) {

    var basemap = new VectorTileLayer({
        portalItem: {
            id: "de3e7d06f27d45c1a258d2678f930fb5"
        }
    });

    var layer = new FeatureLayer({
        url: 'https://services.arcgis.com/8DAUcrpQcpyLMznu/ArcGIS/rest/services/Guitarristas2/FeatureServer/0'
    });

    var map = new Map({
        layers: [basemap, layer]
    });

    var view = new MapView({
        container: "map",
        map: map,
        zoom: 1,
        // center: [15, 65]
    });

    var buttonLeft = document.createElement('div');
    buttonLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
    buttonLeft.className = 'esri-widget--button esri-widget esri-interactive btn-left';

    var buttonRight = document.createElement('div');
    buttonRight.innerHTML = '<i class="fas fa-chevron-right"></i>';
    buttonRight.className = 'esri-widget--button esri-widget esri-interactive btn-right';


    view.ui.add(buttonRight, 'bottom-right');
    view.ui.add(buttonLeft, 'bottom-right');

    const info = document.createElement("div");
    info.style.padding = "10px";
    info.style.backgroundColor = "white";
    info.style.width = "300px";
    info.innerHTML = `
        En este mapa se presenta los guitarristas que marcaron la historia de la música, en especial el Rock and Roll. Basado en el libro <a src="http://www.oceano.com.mx/obras/leyendas-de-la-guitarra-ernesto-assante-8657.aspx">Leyendas de la Guitarra de Ernesto Assante</a>.
    `;

    const instructionsExpand = new Expand({
        expandIconClass: "esri-icon-question",
        expandTooltip: "How to use this sample",
        view: view,
        content: info,
        expanded: view.widthBreakpoint !== "xsmall"
    });
    view.ui.add(instructionsExpand, "top-right");



    var rank = 0;

    function changeLocation(event) {

        if (event.data.direction === 'right') {
            rank++
        } else {
            rank--;
        }

        // Make query
        var query = new Query();
        query.where = `Id = '${rank}'`;
        query.outFields = '*';
        query.returnGeometry = true;

        layer.queryFeatures(query)
            .then(function(response){

                var feature = response.features[0];
                view.goTo({
                    center: [feature.geometry.x, feature.geometry.y],
                    zoom: 13,
                    tilt: 75,
                    heading: 0
                });

                // console.log(feature.geometry.x);
                // console.log(feature.geometry.y);

                var name = feature.attributes["Nombre"];
                var description = feature.attributes["Descripcion"];
                var birth = feature.attributes["F_Nacim"];
                var death = feature.attributes["F_Muerte"];
                var city = feature.attributes["Lugar_N"];
                var imgUrl = feature.attributes["Imagen"];

                $("#name").html(`${rank}. ${name}`);
                $("#description").html(description);
                $("#place").html(city);
                $("#birth").html(birth);
                $("#death").html(death);
                $("#thumbnail").attr('src', imgUrl);



            });
    }


    $(".btn-left").on('click', {direction: 'left'}, changeLocation);
    $(".btn-right").on('click', {direction: 'right'}, changeLocation);



});
