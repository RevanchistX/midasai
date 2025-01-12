function (d, a) {
    if (d == "on") {
        try {
            ksenia.maps.outputsStatus[a].status[0].Text = "ON"
        } catch (c) {
        }
        return 255
    }
    if (d == "off") {
        ksenia.maps.outputsStatus[a].status[0].Text = "OFF";
        return 0
    }
    if (d == "toggle") {
        if (ksenia.maps.outputsStatus) {
            var b = ksenia.maps.outputsStatus[a].status[0].Text == "OFF" ? 0 : 1;
            b ? ksenia.maps.outputsStatus[a].status[0].Text = "OFF" : ksenia.maps.outputsStatus[a].status[0].Text = "ON";
            return b ? 0 : 1
        } else {
            return 1
        }
    }
    return 1
}