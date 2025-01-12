function (b, c) {
    if (b == "bypass") {
        ksenia.maps.zonesStatus[c].bypass[c].Text = "BYPASS";
        return 1
    }
    if (b == "unbypass") {
        ksenia.maps.zonesStatus[c].bypass[c].Text = "UN_BYPASS";
        return 2
    }
    if (b == "toggle") {
        if (ksenia.maps.zonesStatus) {
            var a = ksenia.maps.zonesStatus[c].bypass[0].Text == "BYPASS" ? 1 : 0;
            a ? ksenia.maps.zonesStatus[c].bypass[0].Text = "UN_BYPASS" : ksenia.maps.zonesStatus[c].bypass[0].Text = "BYPASS";
            return a ? 0 : 1
        } else {
            return 1
        }
    }
    return 1
}