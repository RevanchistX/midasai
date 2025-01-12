function
(d, a) {
    var g = $('<div id="floatingSymbolPanel" class="floatingPanelGenerics"/>'), e = $("div#mapContainer"),
        c = $('<div id="floatingHiddenPane" class="floatingPanelGenerics"/>'), i = $('<div id="floatingImgDiv"/>'),
        h = null, f = null, b = null;
    g.css("left", parseInt(d.posx) + parseInt(10));
    g.css("top", parseInt(d.posy) + parseInt(10));
    g.css("width", 5);
    g.css("height", 5);
    ksenia.util.populateResizedImage(i, $(a).children("img")[0].src);
    g.append(i);
    if ((d.caption != undefined) && d.caption != "") {
        h = $('<div id="floatingButtonDiv" class="floatingPanelGenerics">' + d.caption + "</div>");
        h.click(function () {
            ksenia.maps.executeMapCommand()
        });
        g.append(h)
    } else {
        if (d.caption == undefined) {
            h = $('<div id="floatingButtonDiv" class="floatingPanelGenerics">' + ksenia.util.getStringValue("lang.executeAction") + "</div>");
            h.click(function () {
                ksenia.maps.executeMapCommand()
            });
            g.append(h)
        }
    }
    if ((d.name != undefined) && d.name != "") {
        f = $('<div id="floatingLabelDiv"><b>' + d.name + "</b></div>");
        g.append(f)
    }
    g.click(function () {
        $("div#floatingSymbolPanel").hide("slow", function () {
            $(this).remove()
        });
        $("div#floatingHiddenPane").remove()
    });
    c.click(function () {
        g.click()
    });
    e.append(c);
    e.append(g);
    g.show().animate({width: "206px", height: "60px", top: "97px", left: "137px"}, 100)
}