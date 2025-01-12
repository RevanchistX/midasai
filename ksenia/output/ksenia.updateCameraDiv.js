function
(d) {
    var c = $("img#IPCamImage"), a = ksenia.maps.camCounter++;
    c.one("load", function () {
        ksenia.maps.replaceImage(c, d)
    }).one("error", function () {
        if (ksenia.maps.currentPostfix == "?") {
            ksenia.maps.currentPostfix = "&"
        } else {
            if (ksenia.maps.currentPostfix == "&") {
                ksenia.maps.currentPostfix = ","
            } else {
                ksenia.maps.currentPostfix = "?"
            }
        }
        ksenia.maps.replaceImage(c, d)
    });
    try {
        if ((d.auth) && (d.link.indexOf("auth=") < 0)) {
            if (d.link.indexOf("?") >= 0) {
                d.link += "&auth=" + d.auth
            } else {
                d.link += "?auth=" + d.auth;
                ksenia.maps.currentPostfix = "&"
            }
        }
        c[0].src = d.link + ksenia.maps.currentPostfix + "dummy=" + a
    } catch (b) {
    }
}