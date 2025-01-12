function () {
    var g = "", f = null, b = null, c = null, e = null;
    var a = true;
    for (var d = 0; d < ksenia.maps.commandList.length && a; d++) {
        a = ksenia.maps.commandList[d].nopin == "true"
    }
    if (ksenia.maps.commandList.length > 0) {
        ksenia.maps.stopBackgroundPolling = true;
        if ((ksenia.controller.pinIsAvailable() != true) && (!a)) {
            ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setMapCmd()", "ksenia.maps.buildMappa(ksenia.maps.currentMap)")
        } else {
            if (ksenia.maps.commandList.length == 1) {
                ksenia.maps.actionFlags.lastAction = true
            }
            f = ksenia.maps.commandList.shift();
            switch (f.commandType) {
                case 0:
                    if (a) {
                        c = "cmd=setOutput&pin=" + ksenia.dom.basisInfo.PINToUse[0].Text + "&outputId=" + f.itemId + "&outputValue=" + ksenia.maps.parseCommandOutputValue(f.itemValue, f.itemId)
                    } else {
                        c = "cmd=setOutput&pin=" + ksenia.controller.pin + "&outputId=" + f.itemId + "&outputValue=" + ksenia.maps.parseCommandOutputValue(f.itemValue, f.itemId)
                    }
                    c += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
                    ksenia.maps.updateOutputsOnCurrentPage();
                    ksenia.service.setMapCmd(c);
                    break;
                case 1:
                    b = parseInt(f.itemId) + 1;
                    c = "cmd=setByPassZone&pin=" + ksenia.controller.pin + "&zoneId=" + b + "&zoneValue=" + ksenia.maps.parseCommandZoneValue(f.itemValue, f.itemId);
                    c += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
                    ksenia.maps.updateZonesOnCurrentPage();
                    ksenia.service.setMapCmd(c);
                    break;
                case 2:
                    if (ksenia.maps.localConnection) {
                        g = f.locallink
                    } else {
                        g = f.remotelink
                    }
                    if (!(g.contains("http://") || g.contains("https://"))) {
                        g = "http://" + g
                    }
                    window.open(g);
                    ksenia.maps.executeMapCommand();
                    break;
                case 3:
                    switch (f.itemValue) {
                        case"main":
                            ksenia.controller.mainPage();
                            break;
                        case"burglary":
                            ksenia.controller.burglaryPage();
                            break;
                        case"zones":
                            ksenia.controller.burglaryPage();
                            break;
                        case"outputs":
                            ksenia.controller.outputsPage();
                            break;a
                        case"partitions":
                            ksenia.controller.partitionsPage();
                            break;
                        case"faults":
                            ksenia.controller.faultsPage();
                            break;
                        case"scenarios":
                            ksenia.controller.scenariosPage();
                            break;
                        case"log":
                            ksenia.controller.logPage();
                            break;
                        case"status":
                            ksenia.controller.statePage();
                            break
                    }
                    ksenia.maps.stopBackgroundPolling = true;
                    break;
                case 4:
                    c = "cmd=setMacro&pin=" + ksenia.controller.pin + "&macroId=" + f.itemId;
                    c += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
                    ksenia.service.setMapCmd(c);
                    break;
                case 5:
                    if (ksenia.maps.localConnection) {
                        g = f.locallink
                    } else {
                        g = f.remotelink
                    }
                    if (!(g.contains("http://") || g.contains("https://"))) {
                        g = "http://" + g
                    }
                    e = new Object();
                    e.link = g;
                    e.refresh = f.itemId;
                    if (f.auth) {
                        e.auth = f.auth
                    }
                    ksenia.controller.IPCameraPanel(e, null);
                    ksenia.maps.executeMapCommand();
                    break;
                default:
                    alert("Unknown command!");
                    ksenia.maps.executeMapCommand();
                    break
            }
        }
    } else {
        ksenia.maps.commandList = null;
        ksenia.maps.stopBackgroundPolling = false;
        ksenia.maps.buildMappa(ksenia.maps.currentMap);
        ksenia.maps.actionFlags.firstAction = null;
        ksenia.maps.actionFlags.lastAction = null;
        if (ksenia.maps.backgroundPollingStopped) {
            ksenia.service.getZonesStatusBackground()
        }
    }
}