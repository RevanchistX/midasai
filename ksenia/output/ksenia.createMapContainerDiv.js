function (b, a) {
    theDiv = $("<div class='map_container'>" + b.name + "</div>");
    a.append(theDiv);
    theDiv.click(function () {
        ksenia.controller.parentMap = ksenia.maps.currentMap;
        ksenia.maps.buildMappa(b)
    });
    theDiv.hover(function () {
        $(this).addClass("mapHilite")
    }, function () {
        $(this).removeClass("mapHilite")
    });
    theDiv.css("position", "absolute");
    theDiv.css("border", "solid 2px #d00");
    theDiv.css("-webkit-border-radius", "5");
    theDiv.css("-moz-border-radius", "5");
    theDiv.css("text-align", "center");
    theDiv.css("overflow", "hidden");
    theDiv.css("left", parseInt(b.posx));
    theDiv.css("top", parseInt(b.posy));
    theDiv.css("width", b.w);
    theDiv.css("height", b.h);
    theDiv.css("color", "black")
}