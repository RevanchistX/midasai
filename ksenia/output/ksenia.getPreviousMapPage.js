function (d, b) {
    var c = null;
    if (d.map) {
        for (var a = 0; a < d.map.length; a++) {
            if (d.map[a].name == b.name) {
                return d
            }
        }
        for (a = 0; a < d.map.length; a++) {
            c = ksenia.maps.getPreviousMapPage(d.map[a], b);
            if (c) {
                break
            }
        }
        return c
    }
    return null
}