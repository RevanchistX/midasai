function (a) {
    ksenia.util.showBackToMapIcon();
    ksenia.maps.currentMap = a;
    ksenia.controller.pageName = "mapsPage";
    ksenia.controller.parentMap = ksenia.maps.getPreviousMapPage(ksenia.dom.maps.maptree[0].map[0], a);
    var b = $("div#kseniaPanel").data("jsp").getContentPane();
    b.empty();
    var f = $("<div id='mapContainer'></div>");
    b.append(f);
    f.css("position", "relative");
    f.css("background-image", "url('" + a.background + "')");
    f.css("background-repeat", "no-repeat");
    f.css("background-size", "contain");
    f.css("background-position", "center");
    f.css("height", 254);
    f.css("width", 480);
    var g = a.map;
    var d = a.symbol;
    if (g) {
        for (var e = 0; e < g.length; e++) {
            ksenia.maps.createMapContainerDiv(g[e], f)
        }
    }
    if (d) {
        for (var c = 0; c < d.length; c++) {
            ksenia.maps.createMapSymbolDiv(d[c], f)
        }
    }
    $("#namePage").html(ksenia.maps.currentMap.name)
}