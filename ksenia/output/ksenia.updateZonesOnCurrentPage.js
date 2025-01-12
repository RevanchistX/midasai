function () {
    for (var d = 0; d < ksenia.maps.zonesStatus.length; d++) {
        var h = d;
        var a = ksenia.maps.parseZoneValue(ksenia.maps.zonesStatus[d].status[0].Text, ksenia.maps.zonesStatus[d].bypass[0].Text, ksenia.maps.zonesStatus[d].memoryAlarm[0].Text);
        var e = $('[id^="Z' + String(h).lpad("0", 3) + '"]');
        if (e.length > 0) {
            for (var f = 0; f < e.length; f++) {
                var b = $(e[f]);
                var k = b.attr("provaId");
                var j = ksenia.maps.findMapElement(ksenia.dom.maps, "id", k);
                b = $(e[f]).children("img");
                var g = null;
                switch (a) {
                    case 0:
                        g = j[0].img1;
                        break;
                    case 1:
                        g = j[0].img2;
                        break;
                    case 2:
                        g = j[0].img3;
                        break;
                    case 3:
                        g = j[0].img4;
                        break;
                    case 4:
                        g = j[0].img5;
                        break;
                    case 5:
                        g = j[0].img6;
                        break;
                    default:
                        g = j[0].img1;
                        break
                }
                b[0].src = g;
                b.unbind("mouseenter mouseleave")
            }
        }
    }
}