function (d, b, e) {
    var c = [];
    for (var a in d) {
        if (!d.hasOwnProperty(a)) {
            continue
        }
        if (typeof d[a] == "object") {
            c = c.concat(ksenia.maps.findMapElement(d[a], b, e))
        } else {
            if (a == b && d[b] == e) {
                c.push(d)
            }
        }
    }
    return c
}