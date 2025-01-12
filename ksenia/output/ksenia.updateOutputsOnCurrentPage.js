function () {
    if (null == ksenia.maps.outputsStatus) {
        return
    }
    for (var b = 0; b < ksenia.maps.outputsStatus.length; b++) {
        var e = b;
        var j = ksenia.maps.outputsStatus[b].status[0].Text == "OFF" ? 0 : 1;
        var d = $('[id^="O' + String(e).lpad("0", 3) + '"]');
        if (d.length > 0) {
            for (var f = 0; f < d.length; f++) {
                var a = $(d[f]);
                var l = a.attr("provaId");
                var k = ksenia.maps.findMapElement(ksenia.dom.maps, "id", l);
                a = $(d[f]).children("img");
                var h = null;
                var g = null;
                if (j == 0) {
                    h = k[0].img1;
                    g = k[0].img2
                } else {
                    h = k[0].img2;
                    g = k[0].img1
                }
                a[0].src = h
            }
        }
    }
}