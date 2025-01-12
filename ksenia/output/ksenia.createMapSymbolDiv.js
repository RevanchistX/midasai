function (f, h) {
    var n = ksenia.maps.parseDisplayKind(f.display[0].kind), e = f.action,
        d = $("<div class='map_point' id='" + n + f.display[0].index.lpad("0", 3) + f.id + "'></div>"),
        l = $("<img width=" + f.w + " height=" + f.h + " />");
    d.attr("provaId", f.id);
    h.append(d);
    l[0].src = f.img2;
    d.append(l);
    d.css("cursor", "pointer");
    d.click(function () {
        ksenia.controller.parentMap = ksenia.maps.currentMap;
        if (e && e.length > 0) {
            ksenia.maps.commandList = new Array();
            for (var p = 0; p < e.length; p++) {
                var o = new Object();
                o.commandType = ksenia.maps.parseCommandType(e[p].kind);
                o.itemId = e[p].value;
                o.itemValue = e[p].type;
                o.locallink = e[p].localvalue;
                o.remotelink = e[p].remotevalue;
                o.nopin = e[p].nopin;
                if (e[p].auth) {
                    o.auth = e[p].auth
                }
                ksenia.maps.commandList.push(o)
            }
            ksenia.maps.actionFlags.firstAction = true;
            ksenia.maps.actionFlags.lastAction = false
        }
        if (f.name !== "") {
            ksenia.maps.createPointPanel(f, this)
        } else {
            ksenia.maps.executeMapCommand()
        }
    });
    d.css("position", "absolute");
    d.css("left", parseInt(f.posx));
    d.css("top", parseInt(f.posy));
    d.css("width", f.w);
    d.css("height", f.h);
    switch (n) {
        case"Z":
            if (ksenia.maps.zonesStatus) {
                var m = f.display[0].index;
                var b = ksenia.maps.parseZoneValue(ksenia.maps.zonesStatus[m].status[0].Text, ksenia.maps.zonesStatus[m].bypass[0].Text, ksenia.maps.zonesStatus[m].memoryAlarm[0].Text);
                var k = null;
                switch (b) {
                    case 0:
                        k = f.img1;
                        break;
                    case 1:
                        k = f.img2;
                        break;
                    case 2:
                        k = f.img3;
                        break;
                    case 3:
                        k = f.img4;
                        break;
                    case 4:
                        k = f.img5;
                        break;
                    case 5:
                        k = f.img6;
                        break;
                    default:
                        k = f.img1;
                        break
                }
                l[0].src = k
            } else {
                l[0].src = f.img1
            }
            break;
        case"O":
            if (ksenia.maps.outputsStatus) {
                var g = f.display[0].index;
                var j = ksenia.maps.outputsStatus[g].status[0].Text == "OFF" ? 0 : 1;
                k = null;
                var i = null;
                if (j == 0) {
                    k = f.img1;
                    i = f.img2
                } else {
                    k = f.img2;
                    i = f.img1
                }
                l[0].src = k
            } else {
                l[0].src = f.img1
            }
            break;
        case"P":
            if (ksenia.maps.partitionsStatus) {
                var a = f.display[0].index;
                var c = ksenia.maps.parsePartitionValue(ksenia.maps.partitionsStatus[a].Text);
                k = null;
                switch (c) {
                    case 0:
                        k = f.img1;
                        break;
                    case 1:
                        k = f.img2;
                        break;
                    case 2:
                        k = f.img3;
                        break;
                    case 3:
                        k = f.img4;
                        break;
                    case 4:
                        k = f.img5;
                        break;
                    case 5:
                        k = f.img6;
                        break;
                    case 6:
                        k = f.img7;
                        break;
                    default:
                        k = f.img1;
                        break
                }
                l[0].src = k
            } else {
                l[0].src = f.img1
            }
            break;
        default:
            l[0].src = f.img1;
            break
    }
}