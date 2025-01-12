function () {
    for (var e = 0; e < ksenia.maps.partitionsStatus.length; e++) {
        var a = e;
        var b = ksenia.maps.parsePartitionValue(ksenia.maps.partitionsStatus[e].Text);
        var f = $('[id^="P' + String(a).lpad("0", 3) + '"]');
        if (f.length > 0) {
            for (var g = 0; g < f.length; g++) {
                var d = $(f[g]);
                var k = d.attr("provaId");
                var j = ksenia.maps.findMapElement(ksenia.dom.maps, "id", k);
                d = $(f[g]).children("img");
                var h = null;
                switch (b) {
                    case 0:
                        h = j[0].img1;
                        break;
                    case 1:
                        h = j[0].img2;
                        break;
                    case 2:
                        h = j[0].img3;
                        break;
                    case 3:
                        h = j[0].img4;
                        break;
                    case 4:
                        h = j[0].img5;
                        break;
                    case 5:
                        h = j[0].img6;
                        break;
                    case 6:
                        h = j[0].img7;
                        break;
                    default:
                        h = j[0].img1;
                        break
                }
                d[0].src = h;
                d.unbind("mouseenter mouseleave")
            }
        }
    }
}