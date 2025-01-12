String.prototype.contains = function (a) {
    return this.indexOf(a) != -1
};

function IncludeJavaScript(a) {
    document.write('<script type="text/javascript" src="' + a + '"><\/script>')
}

var ksenia = {
    settings: {
        slowDevice: false,
        remoteConnection: false,
        remotePrefix: "",
        imageLoadingFileName: "img/loader.gif",
        downloadLoadingImage: false,
        imageLoadListFileName: "img/AllImage.xml",
        imageLoadListRemoteFileName: "img/AllImageRemote.xml",
        delayBeforeShowPage: 500,
        delayBeforeActivateAnalogOutput: 1000,
        timedStatesNumber: 32,
        scrollsettings: {showArrows: true, autoReinitialise: true},
        debug: {
            allcompleteOnLoading: false,
            allcompleteImageLoader: false,
            messageError: false,
            showBuildPageMessageBox: false
        },
        timeout: {pinTo: 30},
        language: "it_IT",
        languageFileName: "language/languageString_",
        dateTimeLares: "xml/info/dateTime.xml",
        generalInfoLares: "xml/info/generalInfo.xml",
        basisInfo: "xml/info/basisInfo.xml",
        faultsLares: "xml/faults/faults.xml",
        schedulerLares: "xml/scheduler/scheduler",
        codesLares: "xml/codes/codes",
        tagsLares: "xml/tags/tags",
        remotesLares: "xml/remotes/remotes",
        zonesDescriptionLares: "xml/zones/zonesDescription",
        zonesStatusLares: "xml/zones/zonesStatus",
        outputsDescriptionLares: "xml/outputs/outputsDescription",
        outputsStatusLares: "xml/outputs/outputsStatus",
        partitionsDescriptionLares: "xml/partitions/partitionsDescription",
        partitionsStatusLares: "xml/partitions/partitionsStatus",
        scenariosDescriptionLares: "xml/scenarios/scenariosDescription",
        scenariosOptionLares: "xml/scenarios/scenariosOptions",
        logDataFileName: "xml/log/log60.xml",
        stateFileName: "xml/state/laresStatus.xml",
        timedStatesFileName: "xml/timedStates/timedStates.xml",
        cmdSentFileName: "xml/cmd/cmdOk.xml",
        cmdErrorFileName: "xml/cmd/cmdError.xml",
        mapsFileName: "xml/map/map.ksm",
        configFileName: "xml/config/config.xml",
        updateDataPage: {logPage: 2000, faultsPage: 2000, zonesPage: 2000, outputsPage: 2000, partitionsPage: 2000},
        ergoPassword: "likeAndroid"
    },
    runtimeData: {laresType: "UNKNOWN", laresPartitions: 0, laresZones: 0, langStringValue: null, fgs: false},
    loadingString: function () {
        ksenia.runtimeData.langStringValue = new Array();
        ksenia.settings.language = ksenia.util.getLaresLanguage(productBuildRevision);
        $.ajax({
            type: "GET",
            url: (ksenia.settings.languageFileName + ksenia.settings.language + ".xml"),
            dataType: "xml",
            cache: false,
            success: function (a) {
                $(a).find("text").each(function () {
                    var c = $(this).attr("id");
                    var b = $(this).text();
                    ksenia.runtimeData.langStringValue[c] = b
                })
            },
            error: function () {
            },
            complete: function () {
                ksenia.loading()
            }
        })
    },
    loading: function () {
        if (ksenia.settings.slowDevice == false) {
            if (ksenia.settings.downloadLoadingImage == true) {
                $({}).imageLoader({
                    images: [ksenia.settings.imageLoadingFileName], async: 2, complete: function (c, b) {
                        var a = (b.i + 1)
                    }, error: function (c, b) {
                        var a = (b.i + 1);
                        if (ksenia.settings.debug.messageError == true) {
                            alert("errorOnloading")
                        }
                    }, allcomplete: function (b, a) {
                        if (ksenia.settings.debug.allcompleteOnLoading == true) {
                            alert("allcompleteOnLoading")
                        }
                        ksenia.util.setLoadingImg();
                        ksenia.util.showLoadingMsg();
                        ksenia.init()
                    }
                })
            } else {
                ksenia.init()
            }
        } else {
            ksenia.init()
        }
    },
    init: function () {
        ksenia.dom.autoZoom();
        $(".scroll-pane").jScrollPane(ksenia.settings.scrollsettings);
        ksenia.service.init(ksenia.settings.updateDataPage);
        if (ksenia.settings.slowDevice == false) {
            if (ksenia.settings.remoteConnection == false) {
                ksenia.service.getImageList(ksenia.settings.imageLoadListFileName)
            } else {
                ksenia.service.getImageList(ksenia.settings.imageLoadListRemoteFileName)
            }
        } else {
            ksenia.dom.buildLoadingDataInProgressPage();
            setTimeout("ksenia.controller.init()", ksenia.settings.delayBeforeShowPage)
        }
    },
    setLaresType: function (a) {
        if (a.indexOf("128IP") >= 0) {
            ksenia.runtimeData.laresType = "128IP";
            ksenia.runtimeData.laresPartitions = 20;
            ksenia.runtimeData.laresZones = 128
        } else {
            if (a.indexOf("48IP") >= 0) {
                ksenia.runtimeData.laresType = "48IP";
                ksenia.runtimeData.laresPartitions = 12;
                ksenia.runtimeData.laresZones = 48
            } else {
                if (a.indexOf("16IP") >= 0) {
                    ksenia.runtimeData.laresType = "16IP";
                    ksenia.runtimeData.laresPartitions = 8;
                    ksenia.runtimeData.laresZones = 16
                } else {
                    if (a == "~read(0,0,0,1)~") {
                        ksenia.runtimeData.laresType = "16IP";
                        ksenia.runtimeData.laresPartitions = 8;
                        ksenia.runtimeData.laresZones = 16
                    } else {
                        ksenia.runtimeData.laresType = "UNKNOWN";
                        ksenia.runtimeData.laresPartitions = 0;
                        ksenia.runtimeData.laresZones = 0
                    }
                }
            }
        }
        ksenia.runtimeData.fgs = a.indexOf("FGS") >= 0
    },
    getLaresZone: function () {
        if (ksenia.runtimeData.laresType == "128IP") {
            return ksenia.runtimeData.laresZones
        } else {
            if (ksenia.runtimeData.laresType == "48IP") {
                return ksenia.runtimeData.laresZones
            } else {
                if (ksenia.runtimeData.laresType == "16IP") {
                    return ksenia.runtimeData.laresZones
                } else {
                    return 0
                }
            }
        }
    },
    getLaresPartition: function () {
        if (ksenia.runtimeData.laresType == "128IP") {
            return ksenia.runtimeData.laresPartitions
        } else {
            if (ksenia.runtimeData.laresType == "48IP") {
                return ksenia.runtimeData.laresPartitions
            } else {
                if (ksenia.runtimeData.laresType == "16IP") {
                    return ksenia.runtimeData.laresPartitions
                } else {
                    return 0
                }
            }
        }
    }
};
ksenia.util = {
    laresDateTime: {syncro: false, laresTimestamp: 0},
    languages: {stringValue: null},
    populateResizedImage: function (c, b) {
        var d = b, a = $('<img id="pointImageDiv" src=' + d + " />").load(function () {
            var g = $(this).height();
            var e = $(this).width();
            var f = null;
            if (e > g) {
                f = e / 50
            } else {
                f = g / 50
            }
            e = e / f;
            g = g / f;
            $(this).css("width", e);
            $(this).css("height", g);
            c.append($(this));
            $("div#pointImageDiv").remove()
        }).error(function () {
            $("div#pointImageDiv").remove()
        });
        $("body").append(a)
    },
    parseImageUrl: function (d) {
        var c = d.split("("), b = c[1].split(")"), a = b[0];
        return a
    },
    checkFirmwareVersionisOk: function (a, c, f) {
        if ((a == "~read(0,0,1,2)~") && (c == "~read(0,0,2,2)~") && (f == "~read(0,0,3,9)~")) {
            return true
        } else {
            var e = Number(a);
            var b = Number(c);
            var d = Number(f);
            if ((e >= 1) && (b >= 5) && (d > 1038)) {
                return true
            } else {
                return false
            }
        }
    },
    loadImg: function (b, c) {
        var a = $("<img src='" + b + "' alt='noneAlt' title='noneTitle'/>");
        a.css("visibility", "hidden");
        a.load(function () {
            if (c) {
                c.call()
            }
            $(this).remove()
        });
        $("body").append(a)
    },
    refreshTime: function (d, c, i, g, b, f) {
        var h = null;
        if (ksenia.util.laresDateTime.syncro == true) {
            h = new Date(ksenia.util.laresDateTime.laresTimestamp * 1000);
            localTime = h.getTime();
            UTCoffset = h.getTimezoneOffset();
            UTCTime = localTime + (UTCoffset * 60 * 1000);
            h = new Date(UTCTime);
            ksenia.util.laresDateTime.syncro = false
        } else {
            h = new Date(i, c, d, g, b, f + 1, 0)
        }
        ksenia.controller.systemTimestamp = h.getTime();
        var m = h.getDate();
        if (m <= 9) {
            m = "0" + m
        }
        var k = h.getMonth() + 1;
        if (k <= 9) {
            k = "0" + k
        }
        var a = h.getFullYear();
        var l = h.getHours();
        if (l <= 9) {
            l = "0" + l
        }
        var j = h.getMinutes();
        if (j <= 9) {
            j = "0" + j
        }
        var e = h.getSeconds();
        if (e <= 9) {
            e = "0" + e
        }
        $("#dataTime").html(" " + m + "/" + k + "/" + a + "<br>" + l + ":" + j + ":" + e);
        setTimeout("ksenia.util.refreshTime(" + m + "," + (k - 1) + "," + a + "," + l + "," + j + "," + e + ")", 1000)
    },
    sincroTimeLares: function (a) {
        ksenia.util.laresDateTime.laresTimestamp = a;
        ksenia.util.laresDateTime.syncro = true
    },
    getStringDataFormat: function (c) {
        var b = null;
        var a = null;
        b = new Date(c * 1000);
        localTime = b.getTime();
        UTCoffset = b.getTimezoneOffset();
        UTCTime = localTime + (UTCoffset * 60 * 1000);
        b = new Date(UTCTime);
        a = b.getDate() + "/" + (b.getMonth() + 1) + "/" + (b.getFullYear().toString()).substr(2, 2);
        b = null;
        return a
    },
    setLoadingImg: function () {
        $("#dialogWaitLoading").css("background-image", "url('./img/loader.gif')");
        $("#dialogWaitLoading").css("background-repeat", "no-repeat");
        $("#dialogWaitLoading").css("background-position", "center");
        $("#dialogWaitLoading").css("background-size", "center")
    },
    showLoadingMsg: function () {
        $("#dialog:ui-dialog").dialog("destroy");
        $("#dialogWaitLoading").dialog({title: " ", height: 140, modal: true, closeOnEscape: false})
    },
    hideLoadingMsg: function () {
        $("#dialogWaitLoading").dialog("close")
    },
    isArray: function (a) {
        return !(!a || (!a.length || a.length == 0) || typeof a !== "object" || !a.constructor || a.nodeType || a.item)
    },
    isUndefined: function (a) {
        return typeof a == "undefined"
    },
    getAsArray: function (a) {
        if (!a) {
            return new Array()
        }
        if (!ksenia.util.isArray(a)) {
            return new Array(a)
        }
        return a
    },
    addActionToAnalogList: function (c) {
        found = false;
        for (var a = 0; a < ksenia.util.getAsArray(ksenia.dom.analogCommands).length; a++) {
            if (ksenia.dom.analogCommands[a]) {
                try {
                    if (ksenia.dom.analogCommands[a].outIndex == c.outIndex) {
                        ksenia.dom.analogCommands[a].outTimeout = new Date().getTime() + ksenia.settings.delayBeforeActivateAnalogOutput;
                        ksenia.dom.analogCommands[a].outValue += c.outOffset;
                        if (ksenia.dom.analogCommands[a].outValue > 244) {
                            ksenia.dom.analogCommands[a].outValue = 244
                        }
                        if (ksenia.dom.analogCommands[a].outValue < 0) {
                            ksenia.dom.analogCommands[a].outValue = 0
                        }
                        found = true
                    }
                } catch (b) {
                    found = false
                }
            }
        }
        if (!found) {
            c.outTimeout = new Date().getTime() + ksenia.settings.delayBeforeActivateAnalogOutput;
            c.outValue = c.outValue + c.outOffset;
            if (c.outValue > 244) {
                c.outValue = 244
            }
            if (c.outValue < 0) {
                c.outValue = 0
            }
            try {
                ksenia.dom.analogCommands.push(c);
                if (ksenia.dom.analogCommands.length == 1) {
                    setTimeout("ksenia.controller.analogOutputTimer()", 200)
                }
            } catch (b) {
            }
        }
    },
    getLaresLanguage: function (c) {
        var b = "it_IT";
        var a = Number(c);
        if (OPZIONI_INTERNAZIONALI != "") {
            if (a < 866) {
                if (OPZIONI_INTERNAZIONALI == 0) {
                    b = VERSIONE_MENU_0
                } else {
                    if (OPZIONI_INTERNAZIONALI == 1) {
                        b = VERSIONE_MENU_1
                    } else {
                        if (OPZIONI_INTERNAZIONALI == 2) {
                            b = VERSIONE_MENU_2
                        } else {
                            if (OPZIONI_INTERNAZIONALI == 3) {
                                b = VERSIONE_MENU_3
                            } else {
                                if (OPZIONI_INTERNAZIONALI == 4) {
                                    b = VERSIONE_MENU_4
                                } else {
                                    b = ksenia.settings.language
                                }
                            }
                        }
                    }
                }
            } else {
                if (OPZIONI_INTERNAZIONALI == 0) {
                    b = VERSIONE_MENU_0
                } else {
                    if (OPZIONI_INTERNAZIONALI == 1) {
                        b = VERSIONE_MENU_1
                    } else {
                        if (OPZIONI_INTERNAZIONALI == 2) {
                            b = VERSIONE_MENU_2
                        } else {
                            if (OPZIONI_INTERNAZIONALI == 3) {
                                b = VERSIONE_MENU_3
                            } else {
                                if (OPZIONI_INTERNAZIONALI == 4) {
                                    b = VERSIONE_MENU_4
                                } else {
                                    if (OPZIONI_INTERNAZIONALI == 5) {
                                        b = VERSIONE_MENU_5
                                    } else {
                                        if (OPZIONI_INTERNAZIONALI == 6) {
                                            b = VERSIONE_MENU_6
                                        } else {
                                            if (OPZIONI_INTERNAZIONALI == 7) {
                                                b = VERSIONE_MENU_7
                                            } else {
                                                if (OPZIONI_INTERNAZIONALI == 8) {
                                                    b = VERSIONE_MENU_8
                                                } else {
                                                    if (OPZIONI_INTERNAZIONALI == 9) {
                                                        b = VERSIONE_MENU_9
                                                    } else {
                                                        b = ksenia.settings.language
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return ($.trim(b.substr(0, 5)))
    },
    getStringValue: function (b) {
        var a = "???";
        if (b != null) {
            a = ksenia.runtimeData.langStringValue[b]
        } else {
            a = "unknown"
        }
        return a
    },
    userMsgAdd: function (a) {
        var b = "";
        b = $("#userMsg").html();
        $("#scrollMex").empty();
        if ((b != undefined) && (b != null) && (b != "")) {
            $("#scrollMex").html('<marquee id="userMsg" onmouseover="this.scrollAmount=1" onmouseout="this.scrollAmount=6"  direction="left">' + b + a + "</marquee>")
        } else {
            $("#scrollMex").html('<marquee id="userMsg" onmouseover="this.scrollAmount=1" onmouseout="this.scrollAmount=6"  direction="left">' + a + "</marquee>")
        }
    },
    userMsgSet: function (a) {
        $("#scrollMex").empty();
        $("#scrollMex").html('<marquee id="userMsg" onmouseover="this.scrollAmount=1" onmouseout="this.scrollAmount=6"  direction="left">' + a + "</marquee>")
    },
    userMsgClear: function () {
        $("#scrollMex").empty()
    },
    getLogEventTypecolor: function (a) {
        if (a == "0") {
            return "#888"
        } else {
            if (a == "1") {
                return "#FFF"
            } else {
                if (a == "2") {
                    return "#0F0"
                } else {
                    if (a == "3") {
                        return "#FF0"
                    } else {
                        if (a == "4") {
                            return "#F00"
                        } else {
                            return "#080"
                        }
                    }
                }
            }
        }
    },
    getZoneStatusColor: function (b, a) {
        if (a == "BYPASS") {
            return "#ccc"
        } else {
            if (b == "NORMAL") {
                return "#0F0"
            } else {
                if (b == "ALARM") {
                    return "#F00"
                } else {
                    if (b == "TAMPER") {
                        return "gold"
                    } else {
                        if (b == "MASK") {
                            return "blue"
                        } else {
                            if (b == "NOT_USED") {
                                return "white"
                            } else {
                                if (b == "ANALOG_BAND_1") {
                                    return "black"
                                } else {
                                    if (b == "ANALOG_BAND_2") {
                                        return "black"
                                    } else {
                                        if (b == "ANALOG_BAND_3") {
                                            return "black"
                                        } else {
                                            if (b == "ANALOG_BAND_4") {
                                                return "black"
                                            } else {
                                                if (b == "ANALOG_BAND_5") {
                                                    return "black"
                                                } else {
                                                    if (b == "LOST") {
                                                        return "#222"
                                                    } else {
                                                        return "#080"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getZonesStatusIcon: function (b, a, c) {
        if (c == "1") {
            if (b == "BYPASS") {
                return "" + ksenia.settings.remotePrefix + "img/partitionAlarm_gr.png"
            } else {
                if (a == "ALARM") {
                    return "" + ksenia.settings.remotePrefix + "img/partitionAlarm.png"
                } else {
                    return "" + ksenia.settings.remotePrefix + "img/partitionAlarm_gr.png"
                }
            }
        } else {
            return "" + ksenia.settings.remotePrefix + "img/partitionEmpty.png"
        }
    },
    getOutputStatusColor: function (a) {
        if (a == "ON") {
            return "#F00"
        } else {
            if (a == "OFF") {
                return "#0F0"
            } else {
                return "#0F0"
            }
        }
    },
    getPartitionsStatusIcon: function (a) {
        if (a == "DISARMED") {
            return "" + ksenia.settings.remotePrefix + "img/partitionEmpty.png"
        } else {
            if (a == "EXIT") {
                return "" + ksenia.settings.remotePrefix + "img/partitionExit.png"
            } else {
                if (a == "ARMED") {
                    return "" + ksenia.settings.remotePrefix + "img/partitionEmpty.png"
                } else {
                    if (a == "PREALARM") {
                        return "" + ksenia.settings.remotePrefix + "img/partitionPrealarm.png"
                    } else {
                        if (a == "READY_TO_ARM") {
                            return "" + ksenia.settings.remotePrefix + "img/partitionEmpty.png"
                        } else {
                            if (a == "ALARM") {
                                return "" + ksenia.settings.remotePrefix + "img/partitionAlarm.png"
                            } else {
                                if (a == "ARMED_IMMEDIATE") {
                                    return "" + ksenia.settings.remotePrefix + "img/partitionEmpty.png"
                                } else {
                                    if (a == "TAMPER") {
                                        return "" + ksenia.settings.remotePrefix + "img/partitionTamper.png"
                                    } else {
                                        return "" + ksenia.settings.remotePrefix + "img/partitionEmpty.png"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getPartitionsStatusColor: function (a) {
        if (a == "DISARMED") {
            return "#093"
        } else {
            if (a == "EXIT") {
                return "#fd0"
            } else {
                if (a == "ARMED") {
                    return "#fd0"
                } else {
                    if (a == "PREALARM") {
                        return "#fd0"
                    } else {
                        if (a == "READY_TO_ARM") {
                            return "#fd0"
                        } else {
                            if (a == "ALARM") {
                                return "#222"
                            } else {
                                if (a == "ARMED_IMMEDIATE") {
                                    return "#f10"
                                } else {
                                    if (a == "TAMPER") {
                                        return "#222"
                                    } else {
                                        return "#093"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getSchedulerStatusColor: function (a) {
        if (a == "TRUE") {
            return "#0F0"
        } else {
            if (a == "FALSE") {
                return "#ccc"
            } else {
                return "#FF0"
            }
        }
    },
    getCodesTypeColor: function (a) {
        if (a == "TRUE") {
            return "#0F0"
        } else {
            if (a == "FALSE") {
                return "FF0"
            } else {
                if ((a == "FALSE_TIMED") || (a == "FALSE_USER")) {
                    return "FF8C00"
                } else {
                    return "#ccc"
                }
            }
        }
    },
    showHelpIcon: function () {
        if (ksenia.settings.slowDevice == false) {
            var a = $("<img src='" + ksenia.settings.remotePrefix + "img/help.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#helpPage").empty();
            $("#helpPage").append(a)
        } else {
            $("#helpPage").css("font-size", "13px");
            $("#helpPage").css("top", "6px");
            $("#helpPage").css("text-align", "center");
            $("#helpPage").html("help")
        }
        $("#helpPage").unbind("click");
        $("#helpPage").click(function () {
            ksenia.controller.helpPage()
        });
        $("#helpPage").show()
    },
    hideHelpIcon: function () {
        $("#helpPage").hide()
    },
    showBackToMapIcon: function () {
        if (ksenia.settings.slowDevice == false) {
            $("#helpPage").empty();
            var a = $("<img src='" + ksenia.settings.remotePrefix + "/img/footerMap.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#helpPage").append(a)
        } else {
            $("#helpPage").css("font-size", "13px");
            $("#helpPage").css("top", "6px");
            $("#helpPage").css("text-align", "center");
            $("#helpPage").html("map")
        }
        $("#helpPage").unbind("click");
        $("#helpPage").click(function () {
            ksenia.controller.mapsPage()
        });
        $("#helpPage").show()
    },
    clearCookies: function () {
        for (var a in $.cookie()) {
            $.removeCookie(a)
        }
    }
};
ksenia.dom = {
    logEvents: null,
    generalInfo: null,
    basisInfo: null,
    faults: null,
    zonesDescription: null,
    zonesStatus: null,
    outputsDescription: null,
    outputsStatus: null,
    partitionsDescription: null,
    partitionsStatus: null,
    scenariosDescription: null,
    scenariosOptions: null,
    stateLares: null,
    schedulers: null,
    codes: null,
    tags: null,
    remotes: null,
    maps: null,
    config: null,
    firstStart: 1,
    analogCommands: new Array(),
    workingOnAnalogScrollbars: false,
    init: function () {
        ksenia.dom.buildHeader();
        ksenia.dom.buildFooter();
        ksenia.controller.mainPage()
    },
    autoZoom: function () {
        var a = window.innerWidth;
        var d = window.innerHeight;
        var c = a / 490;
        var b = d / 330;
        $(window).unbind("resize", ksenia.dom.autoZoom);
        if (a >= 320 && d >= 200) {
            if (320 * c > d) {
                $("body").css("zoom", function () {
                    return ((b * 100) | 0) + "%"
                })
            } else {
                $("body").css("zoom", function () {
                    return ((c * 100) | 0) + "%"
                })
            }
        }
        $(window).bind("resize", ksenia.dom.autoZoom)
    },
    buildHeader: function () {
        if (ksenia.settings.slowDevice == false) {
            var a = $("<img src='" + ksenia.settings.remotePrefix + "img/back.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#backPage").append(a)
        } else {
            $("#backPage").css("font-size", "13px");
            $("#backPage").css("top", "10px");
            $("#backPage").css("text-align", "center");
            $("#backPage").html("back")
        }
        $("#backPage").click(function () {
            ksenia.controller.backPage()
        });
        if (ksenia.settings.slowDevice == false) {
            a = $("<img src='" + ksenia.settings.remotePrefix + "img/scenarios.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#homePage").append(a)
        } else {
            $("#homePage").css("font-size", "13px");
            $("#homePage").css("top", "10px");
            $("#homePage").css("text-align", "center");
            $("#homePage").html("home")
        }
        $("#homePage").click(function () {
            ksenia.controller.mainPage()
        });
        if (ksenia.settings.slowDevice == false) {
            a = $("<img src='" + ksenia.settings.remotePrefix + "img/reload.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#reloadPage").append(a)
        } else {
            $("#reloadPage").css("font-size", "13px");
            $("#reloadPage").css("top", "10px");
            $("#reloadPage").css("text-align", "center");
            $("#reloadPage").html("load")
        }
        $("#reloadPage").click(function () {
            ksenia.controller.reloadPage()
        });
        if (ksenia.settings.slowDevice == false) {
            if (ksenia.runtimeData.fgs) {
                $("#logoTopRight").append("<img src='" + ksenia.settings.remotePrefix + "img/fgs_logo-keypad.png' align='right' height='32px'/>")
            } else {
                $("#logoTopRight").append("<img src='" + ksenia.settings.remotePrefix + "img/logo-keypad.png' align='right' height='32px'/>")
            }
        } else {
            $("#logoTopRight").css("font-size", "20px");
            $("#logoTopRight").css("top", "3px");
            $("#logoTopRight").css("text-align", "center");
            $("#logoTopRight").css("position", "relative");
            $("#logoTopRight").html('<div><div style="float:left;margin-left:10px"><b>Ks</b></div><div style="float:left;color:#ccc;">enia</div></div>')
        }
    },
    setHeaderNamePage: function (a) {
        $("#namePage").html(ksenia.util.getStringValue(a))
    },
    buildFooter: function () {
        if (ksenia.settings.slowDevice == false) {
            var a = $("<img src='" + ksenia.settings.remotePrefix + "img/infoLares.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#statePage").append(a)
        } else {
            $("#statePage").css("font-size", "13px");
            $("#statePage").css("top", "6px");
            $("#statePage").css("text-align", "center");
            $("#statePage").html("info")
        }
        $("#statePage").click(function () {
            ksenia.controller.infoPage()
        });
        if (ksenia.settings.slowDevice == false) {
            a = $("<img src='" + ksenia.settings.remotePrefix + "img/help.png' width='32px' height='32px' style='cursor:pointer;'/>");
            $("#helpPage").append(a)
        } else {
            $("#helpPage").css("font-size", "13px");
            $("#helpPage").css("top", "6px");
            $("#helpPage").css("text-align", "center");
            $("#helpPage").html("help")
        }
        $("#helpPage").click(function () {
            ksenia.controller.helpPage()
        });
        if (ksenia.settings.slowDevice == false) {
            if (ksenia.runtimeData.fgs) {
                a = $("<img src='" + ksenia.settings.remotePrefix + "img/fgs_footer.png' width='137px' height='20px' style='margin-top: 8px; margin-left: 8px;'/>")
            } else {
                a = $("<img src='" + ksenia.settings.remotePrefix + "img/ks_footer.gif' width='137px' height='20px' style='margin-top: 8px; margin-left: 8px;'/>")
            }
            $("#logoBottomRight").append(a)
        } else {
            $("#logoBottomRight").css("font-size", "17px");
            $("#logoBottomRight").css("top", "5px");
            $("#logoBottomRight").css("text-align", "center");
            $("#logoBottomRight").html('<div><div style="float:left;color:#ccc;margin-left:3px">security</div><div style="float:left;color:#EE2722;margin-left:5px">innovation</div></div>')
        }
    },
    buildCheckFirmwareKoPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        var b = "";
        b = $('<div id="loadingDataPage" style="position:absolute;color:#D00;background:transparent;top:100px;left:40px;height:40px;width:400px;font-size:25px;text-align:center;">\n                            <b>' + ksenia.util.getStringValue("lang.checkFirmwareKo") + "</b>\n                        </div>");
        a.append(b)
    },
    buildLoadingDataInProgressPage: function () {
        ksenia.controller.pageName = "loadingDataInProgressPage";
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        var b = "";
        b = $('<div id="loadingDataPage" style="position:absolute;color:#D00;background:transparent;top:100px;left:40px;height:40px;width:400px;font-size:25px;text-align:center;">\n                            <b>' + ksenia.util.getStringValue("lang.waitLoadingDataPage") + "</b>\n                        </div>");
        a.append(b);
        a.css("height", 252)
    },
    buildCheckingPinInProgressPage: function () {
        ksenia.controller.pageName = "checkingPinInProgressPage";
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        var b = "";
        b = $('<div id="loadingDataPage" style="position:absolute;color:#D00;background:transparent;top:100px;left:40px;height:40px;width:400px;font-size:25px;text-align:center;">\n                            <b>' + ksenia.util.getStringValue("lang.waitCheckingPinPage") + "</b>\n                        </div>");
        a.append(b)
    },
    buildCmdInProgressPage: function () {
        ksenia.controller.pageName = "cmdInProgressPage";
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        var b = "";
        b = $('<div id="loadingDataPage" style="position:absolute;color:#D00;background:transparent;top:100px;left:40px;height:40px;width:400px;font-size:25px;text-align:center;">\n                            <b>' + ksenia.util.getStringValue("lang.waitCmdInProgressPage") + "</b>\n                        </div>");
        a.append(b);
        a.css("height", "252px")
    },
    buildMessagePage: function (a, b) {
        ksenia.controller.pageName = "messagePage";
        var c = $("div#kseniaPanel").data("jsp").getContentPane();
        c.empty();
        var d = "";
        d = $('<div id="messagePanel"><div id="message"><b>' + a + "</b></div></div>");
        d.click(function () {
            if ((b != null) && (b != undefined) && (b != "")) {
                eval(b)
            }
        });
        c.append(d);
        c.css("height", "252px");
        ksenia.dom.setHeaderNamePage("lang.messagePage")
    },
    buildIPCameraPanel: function (a, b) {
        var c = $('<div id="ipcam"/>'), kseniaScrollPane = $("div#kseniaPage"),
            hiddenPane = $('<div id="camHiddenPane"/>'),
            camContainer = $('<img id="IPCamImage" name="newPosition" src="' + a.link + '" width="320" height="240" border="0">'),
            camLoading = $('<div id="camLoading"><b>' + ksenia.util.getStringValue("lang.loadingCamera") + "</b></div>");
        camLoading.css("width", 320);
        camLoading.css("height", 20);
        camLoading.css("position", "absolute");
        camLoading.css("left", 0);
        camLoading.css("top", 110);
        camLoading.css("text-align", "center");
        c.click(function () {
            $("div#IPCamImage").remove();
            $("div#ipcam").remove();
            $("div#camHiddenPane").remove();
            ksenia.maps.stopBackgroundPolling = false;
            if ((b != null) && (b != undefined) && (b != "")) {
                eval(b)
            }
        });
        c.css("width", 320);
        c.css("height", 240);
        c.css("position", "absolute");
        c.css("top", 39);
        c.css("left", 80);
        c.css("background-color", "#111");
        hiddenPane.css("width", "100%");
        hiddenPane.css("height", "100%");
        hiddenPane.css("position", "absolute");
        hiddenPane.css("top", "0");
        hiddenPane.css("left", "0");
        hiddenPane.css("filter", "alpha(opacity=70)");
        hiddenPane.css("opacity", "0.7");
        kseniaScrollPane.append(hiddenPane);
        kseniaScrollPane.append(c);
        c.append(camContainer);
        c.append(camLoading);
        ksenia.maps.currentPostfix = a.link.indexOf("?") >= 0 ? "&" : "?";
        ksenia.maps.updateCameraDiv(a)
    },
    buildMainPage: function () {
        var b = $("div#kseniaPanel").data("jsp").getContentPane();
        b.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildMainPage")
        }
        var c = null;
        if (ksenia.settings.slowDevice == false) {
            c = $("<div class='mainPageButton' style='top:7px; left:21px' id='burglaryButton'><img src='" + ksenia.settings.remotePrefix + "img/burglary.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.burglaryButton") + "</div></div>")
        } else {
            c = $("<div class='mainPageButton' style='top:7px; left:21px' id='burglaryButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.burglaryButton") + "</div></div>")
        }
        b.append(c);
        if (ksenia.settings.slowDevice == false) {
            c = $("<div class='mainPageButton' style='top:7px; left:170px' id='scenariosButton'><img src='" + ksenia.settings.remotePrefix + "img/scenarios.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.scenariosButton") + "</div></div>")
        } else {
            c = $("<div class='mainPageButton' style='top:7px; left:170px' id='scenariosButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.scenariosButton") + "</div></div>")
        }
        b.append(c);
        if (ksenia.settings.slowDevice == false) {
            c = $("<div class='mainPageButton' style='top:7px; left:319px' id='outputsButton'><img src='" + ksenia.settings.remotePrefix + "img/outputs.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.outputsButton") + "</div></div>")
        } else {
            c = $("<div class='mainPageButton' style='top:7px; left:319px' id='outputsButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.outputsButton") + "</div></div>")
        }
        b.append(c);
        if (ksenia.settings.slowDevice == false) {
            c = $("<div class='mainPageButton' style='top:132px; left:21px' id='stateButton'><img src='" + ksenia.settings.remotePrefix + "img/status.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.stateButton") + "</div></div>")
        } else {
            c = $("<div class='mainPageButton' style='top:132px; left:21px' id='stateButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.stateButton") + "</div></div>")
        }
        b.append(c);
        if (ksenia.settings.slowDevice == false) {
            c = $("<div class='mainPageButton' style='top:132px; left:170px;' id='mapsButton'><img src='" + ksenia.settings.remotePrefix + "img/maps.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.mapsButton") + "</div></div>")
        } else {
            c = $("<div class='mainPageButton' style='top:132px; left:170px;' id='mapsButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.mapsButton") + "</div></div>")
        }
        b.append(c);
        if (ksenia.settings.slowDevice == false) {
            c = $("<div class='mainPageButton' style='top:132px; left:319px;' id='kseniaLogo'></div>");
            c.css("border", "0");
            c.css("background-color", "black");
            c.css("cursor", "auto");
            b.append(c);
            var a;
            if (ksenia.runtimeData.fgs) {
                a = $("<img src='" + ksenia.settings.remotePrefix + "img/fgs_bg.png' width='140px' height='115px'/>")
            } else {
                a = $("<img src='" + ksenia.settings.remotePrefix + "img/ks_bg.png' width='140px' height='115px'/>")
            }
            c.append(a)
        }
        $("#burglaryButton").click(function () {
            ksenia.controller.burglaryPage()
        });
        $("#scenariosButton").click(function () {
            ksenia.controller.scenariosPage()
        });
        $("#outputsButton").click(function () {
            ksenia.controller.outputsPage()
        });
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            $("#stateButton").click(function () {
                ksenia.controller.statePage()
            })
        } else {
            $("#stateButton").click(function () {
                ksenia.controller.checkFirmwareKoPage()
            })
        }
        $("#mapsButton").click(function () {
            ksenia.controller.mapsPage()
        });
        b.css("height", "252px");
        ksenia.dom.setHeaderNamePage("lang.mainPage");
        ksenia.maps.stopBackgroundPolling = false
    },
    buildInfoPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildInfoPage")
        }
        var b = "";
        b = ('   <div id="infoPanel">\n                            <div id="infoTitle"><b>' + ksenia.util.getStringValue("lang.infoTitle") + '</b></div>\n                            <div id="infoProductName"><b>' + ksenia.util.getStringValue("lang.infoProductName") + '</b></div><div id="infoProductNameValue">' + ksenia.dom.generalInfo.productName[0].Text + '</div>\n                            <div id="infoFwVersion"><b>' + ksenia.util.getStringValue("lang.infoProductVersion") + '</b></div><div id="infoFwVersionValue">' + ksenia.dom.generalInfo.productHighRevision[0].Text + "." + ksenia.dom.generalInfo.productLowRevision[0].Text + '</div> <div id="infoFwBuild"><b>' + ksenia.util.getStringValue("lang.infoProductBuild") + '</b></div><div id="infoFwBuildValue">' + ksenia.dom.generalInfo.productBuildRevision[0].Text + '</div>\n                            <div id="infoWsFwVersion"><b>' + ksenia.util.getStringValue("lang.infoWsFwVersion") + '</b></div><div id="infoWsFwVersionValue">' + ksenia.dom.generalInfo.webServerFW[0].Text + '</div><div id="infoWsHtmlVersion"><b>' + ksenia.util.getStringValue("lang.infoWsHtmlVersion") + '</b></div><div id="infoWsHtmlVersionValue">' + ksenia.dom.generalInfo.webServerHTML[0].Text + '</div>\n                            <div id="infoAux1">' + ksenia.dom.generalInfo.info1[0].Text + '</div>\n                            <div id="infoAux2">' + ksenia.dom.generalInfo.info2[0].Text + "</div>\n                        </div>");
        ksenia.dom.generalInfo = null;
        a.append(b);
        a.css("height", 252);
        ksenia.dom.setHeaderNamePage("lang.infoPage")
    },
    buildBurglaryPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildBurglaryPage")
        }
        var b = null;
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:7px; left:21px' id='zonesButton'><img src='" + ksenia.settings.remotePrefix + "img/burglary.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.zonesButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:7px; left:21px' id='zonesButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.zonesButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:7px; left:170px' id='logButton'><img src='" + ksenia.settings.remotePrefix + "img/logs.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.logButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:7px; left:170px' id='logButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.logButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:7px; left:319px' id='partitionsButton'><img src='" + ksenia.settings.remotePrefix + "img/partitions.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.partitionsButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:7px; left:319px' id='partitionsButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.partitionsButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:132px; left:21px' id='faultsButton'><img src='" + ksenia.settings.remotePrefix + "img/faults.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.faultsButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:132px; left:21px' id='faultsButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.faultsButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:132px; left:170px' id='usersButton'><img src='" + ksenia.settings.remotePrefix + "img/users.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.usersButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:132px; left:170px' id='usersButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.usersButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:132px; left:319px' id='schedulerButton'><img src='" + ksenia.settings.remotePrefix + "img/scheduler.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.schedulerButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:132px; left:319px' id='schedulerButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.schedulerButton") + "</div></div>")
        }
        a.append(b);
        $("#zonesButton").click(function () {
            ksenia.controller.zonesPage()
        });
        $("#logButton").click(function () {
            ksenia.controller.logPage()
        });
        $("#partitionsButton").click(function () {
            ksenia.controller.partitionsPage()
        });
        $("#faultsButton").click(function () {
            ksenia.controller.faultsPage()
        });
        $("#usersButton").click(function () {
            ksenia.controller.usersPage()
        });
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            $("#schedulerButton").click(function () {
                ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.schedulerPage(true)", "ksenia.controller.burglaryPage()")
            })
        } else {
            $("#schedulerButton").click(function () {
                ksenia.controller.checkFirmwareKoPage()
            })
        }
        a.css("height", "252px");
        ksenia.dom.setHeaderNamePage("lang.burglaryPage")
    },
    buildScenariosPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildScenariosPage")
        }
        var e = 0;
        var d = "";
        for (var c = 0; c < ksenia.dom.scenariosDescription.length; c++) {
            if ((ksenia.dom.scenariosOptions[c].abil[0].Text != "FALSE")) {
                e++;
                d += ('<div class="scenario" id="scenario' + c + '" scenarioId="' + c + '" ');
                d += ('><div class="scenarioState"');
                if (ksenia.settings.slowDevice == false) {
                    d += ('><div class="scenarioStateImg"><img src="' + ksenia.settings.remotePrefix + 'img/scenario.png" width="24px" height="24px" /></div>')
                } else {
                    d += (' ><div class="scenarioId" ><b>' + (c + 1) + "</b></div>")
                }
                d += ('</div><div class="scenarioDescription"');
                if ((ksenia.dom.scenariosDescription[c].Text == undefined) || (ksenia.dom.scenariosDescription[c].Text == "") || (ksenia.dom.scenariosDescription[c].Text == null)) {
                    d += (">" + ksenia.util.getStringValue("lang.scenariosNoDescriptionSet") + " " + (c + 1) + "</div>")
                } else {
                    d += (">" + ksenia.dom.scenariosDescription[c].Text + "</div>")
                }
                d += ("</div>")
            }
        }
        var b = Math.round(e / 2) * 50;
        if (e == 0) {
            d = ('<div id="infoPanel"><div id="infoNoProgrammedPartitions"><b>' + ksenia.util.getStringValue("lang.infoNoProgrammedScenarios") + "</b></div><div>");
            b = 252
        }
        e = null;
        ksenia.dom.zonesStatus = null;
        a.append(d);
        for (c = 0; c < ksenia.dom.scenariosDescription.length; c++) {
            $(("#scenario" + c)).click(function () {
                askPIN = ksenia.dom.scenariosOptions[$(this).attr("scenarioId")].nopin[0].Text == "FALSE";
                if (askPIN) {
                    if (ksenia.controller.pinIsAvailable() != true) {
                        ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setMacroCmd(" + $(this).attr("scenarioId") + ")", "ksenia.controller.scenariosPage()")
                    } else {
                        ksenia.controller.setMacroCmd($(this).attr("scenarioId"))
                    }
                } else {
                    ksenia.controller.pin = ksenia.dom.basisInfo.PINToUse[0].Text;
                    ksenia.ergoHandler.runtimeData.buffer = ksenia.controller.pin;
                    ksenia.controller.setMacroCmd($(this).attr("scenarioId"));
                    ksenia.controller.setPinNotAvailable()
                }
            })
        }
        a.css("height", b);
        ksenia.dom.setHeaderNamePage("lang.scenariosPage")
    },
    buildLogPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildLogPage")
        }
        var d = "";
        try {
            for (var c = 0; c < ksenia.dom.logEvents.length; c++) {
                if ((ksenia.dom.logEvents[c].trace[0]) && (ksenia.dom.logEvents[c].type[0])) {
                    if ((ksenia.dom.logEvents[c].trace[0].data[0]) && (ksenia.dom.logEvents[c].trace[0].time[0]) && (ksenia.dom.logEvents[c].trace[0].event[0]) && (ksenia.dom.logEvents[c].trace[0].generator[0]) && (ksenia.dom.logEvents[c].trace[0].means[0])) {
                        d += ('    <div id="logRow">\n                                <div id="logType" style="background-color:' + ksenia.util.getLogEventTypecolor(ksenia.dom.logEvents[c].type[0].Text) + '"></div>\n                                <div id="logData">' + ksenia.dom.logEvents[c].trace[0].data[0].Text + '</div>\n                                <div id="logTime">' + ksenia.dom.logEvents[c].trace[0].time[0].Text + '</div>\n                                <div id="logEvent"><b>' + ksenia.dom.logEvents[c].trace[0].event[0].Text + '</b></div>\n                                <div id="logGenerator">' + (ksenia.dom.logEvents[c].trace[0].generator[0].Text == undefined ? " " : ksenia.dom.logEvents[c].trace[0].generator[0].Text) + '</div>\n                                <div id="logMeans">' + (ksenia.dom.logEvents[c].trace[0].means[0].Text == undefined ? " " : ksenia.dom.logEvents[c].trace[0].means[0].Text) + "</div>\n                            </div>")
                    }
                }
            }
            if (d != "") {
                a.empty();
                a.append(d);
                a.css("height", ksenia.dom.logEvents.length * 50)
            }
        } catch (b) {
            d = ""
        }
        ksenia.dom.logEvents = null;
        ksenia.dom.setHeaderNamePage("lang.logPage")
    },
    buildStatePage: function () {
        var f = $("div#kseniaPanel").data("jsp").getContentPane();
        f.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildStatePage")
        }
        var h = "";
        var k = "";
        k = ('  <div class="stateLaresPanel">');
        k += ('      <div class="stateLaresItem" id="stateLaresZones">');
        if (ksenia.settings.slowDevice == false) {
            k += ('  <div class="stateLaresImg"><img src="' + ksenia.settings.remotePrefix + 'img/burglary.png" width="24px" height="24px"/></div>')
        } else {
            k += ('  <div class="stateLaresImg"></div>')
        }
        var e;
        var m = 0;
        var b = 0;
        var l = 0;
        var n = 0;
        for (e = 0; e < ksenia.dom.zonesStatus.length; e++) {
            if (ksenia.dom.zonesStatus[e].status[0].Text != "NOT_USED") {
                n++;
                if (ksenia.dom.zonesStatus[e].bypass[0].Text == "UN_BYPASS") {
                    if (ksenia.dom.zonesStatus[e].status[0].Text == "TAMPER") {
                        m++
                    }
                    if (ksenia.dom.zonesStatus[e].status[0].Text == "MASK") {
                        m++
                    }
                    if (ksenia.dom.zonesStatus[e].status[0].Text == "ALARM") {
                        b++
                    }
                } else {
                    l++
                }
            }
        }
        if (m > 0) {
            k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateZoneTamper") + "</div></div>");
            h += ksenia.util.getStringValue("lang.stateZoneTamper")
        } else {
            if (b > 0) {
                k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateZoneAlarm") + "</div></div>");
                h += ksenia.util.getStringValue("lang.stateZoneAlarm")
            } else {
                if (l > 0) {
                    k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateZoneByPass") + "</div></div>");
                    h += ksenia.util.getStringValue("lang.stateZoneByPass")
                } else {
                    if (n == 0) {
                        k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoZoneUsed") + "</div></div>");
                        h += ksenia.util.getStringValue("lang.stateNoZoneUsed")
                    } else {
                        k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoZoneAlarm") + "</div></div>");
                        h += ksenia.util.getStringValue("lang.stateNoZoneAlarm")
                    }
                }
            }
        }
        k += ('      <div class="stateLaresItem" id="stateLaresOuputs">');
        if (ksenia.settings.slowDevice == false) {
            k += ('  <div class="stateLaresImg"><img src="' + ksenia.settings.remotePrefix + 'img/outputs.png" width="24px" height="24px"/></div>')
        } else {
            k += ('  <div class="stateLaresImg"></div>')
        }
        n = 0;
        var j = 0;
        var c = 0;
        for (e = 0; e < ksenia.dom.outputsStatus.length; e++) {
            if (ksenia.dom.outputsStatus[e].type[0].Text != "NOT_USED") {
                n++;
                if (ksenia.dom.outputsStatus[e].status[0].Text == "ON") {
                    j++
                } else {
                    c++
                }
            }
        }
        if (j > 0) {
            k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateSomeOutputSet") + "</div></div>");
            h += " --- " + ksenia.util.getStringValue("lang.stateSomeOutputSet")
        } else {
            if (n == 0) {
                k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoOutputUsed") + "</div></div>");
                h += " --- " + ksenia.util.getStringValue("lang.stateNoOutputUsed")
            } else {
                k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoOutputSet") + "</div></div>");
                h += " --- " + ksenia.util.getStringValue("lang.stateNoOutputSet")
            }
        }
        k += ('      <div class="stateLaresItem" id="stateLaresPartitions">');
        if (ksenia.settings.slowDevice == false) {
            k += ('  <div class="stateLaresImg"><img src="' + ksenia.settings.remotePrefix + 'img/partitions.png" width="24px" height="24px"/></div>')
        } else {
            k += ('  <div class="stateLaresImg"></div>')
        }
        n = 0;
        m = 0;
        b = 0;
        var a = 0;
        var d = 0;
        for (e = 0; e < ksenia.dom.partitionsDescription.length; e++) {
            if ((ksenia.dom.partitionsDescription[e].Text != undefined) && (ksenia.dom.partitionsDescription[e].Text != "") || (ksenia.dom.partitionsDescription[e].Text != null)) {
                n++;
                if ((ksenia.dom.partitionsStatus[e].Text == "ARMED") || (ksenia.dom.partitionsStatus[e].Text == "ARMED_IMMEDIATE") || (ksenia.dom.partitionsStatus[e].Text == "PREALARM") || (ksenia.dom.partitionsStatus[e].Text == "READY_TO_ARM") || (ksenia.dom.partitionsStatus[e].Text == "EXIT")) {
                    a++
                } else {
                    if (ksenia.dom.partitionsStatus[e].Text == "TAMPER") {
                        m++
                    } else {
                        if (ksenia.dom.partitionsStatus[e].Text == "ALARM") {
                            b++
                        } else {
                            d++
                        }
                    }
                }
            }
        }
        if (n == 0) {
            k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoPartitionUsed") + "</div></div>");
            h += " --- " + ksenia.util.getStringValue("lang.stateNoPartitionUsed")
        } else {
            if (m > 0) {
                k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.statePartitionTamper") + "</div></div>");
                h += " --- " + ksenia.util.getStringValue("lang.statePartitionTamper")
            } else {
                if (b > 0) {
                    k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.statePartitionAlarm") + "</div></div>");
                    h += " --- " + ksenia.util.getStringValue("lang.statePartitionAlarm")
                } else {
                    if (a > 0) {
                        k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateSomePartitionArm") + "</div></div>");
                        h += " --- " + ksenia.util.getStringValue("lang.stateSomePartitionArm")
                    } else {
                        k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoPartitionArm") + "</div></div>");
                        h += " --- " + ksenia.util.getStringValue("lang.stateNoPartitionArm")
                    }
                }
            }
        }
        k += ('      <div class="stateLaresItem" id="stateLaresFaults">');
        if (ksenia.settings.slowDevice == false) {
            k += ('  <div class="stateLaresImg"><img src="' + ksenia.settings.remotePrefix + 'img/faults.png" width="24px" height="24px"/></div>')
        } else {
            k += ('  <div class="stateLaresImg"></div>')
        }
        var g = 0;
        if ((ksenia.dom.faults.battery[0].bad[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowBattery[0].Text == 1) && (ksenia.dom.faults.enabled[0].badBattery[0].Text == 1)) {
            g++
        }
        if ((ksenia.dom.faults.battery[0].low[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowBattery[0].Text == 1) && (ksenia.dom.faults.enabled[0].badBattery[0].Text == 1)) {
            g++
        }
        if ((ksenia.dom.faults.powerSupply[0].no[0].Text == 1) && (ksenia.dom.faults.enabled[0].noPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].koPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowPowerSupply[0].Text == 1)) {
            g++
        }
        if ((ksenia.dom.faults.powerSupply[0].ko[0].Text == 1) && (ksenia.dom.faults.enabled[0].noPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].koPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowPowerSupply[0].Text == 1)) {
            g++
        }
        if ((ksenia.dom.faults.powerSupply[0].low[0].Text == 1) && (ksenia.dom.faults.enabled[0].noPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].koPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowPowerSupply[0].Text == 1)) {
            g++
        }
        if ((ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != undefined) && (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != "") && (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != "NO_PERIPHERAL")) {
            if ((ksenia.dom.faults.gsm[0].networkKo[0].Text == 1) && (ksenia.dom.faults.enabled[0].koGsm[0].Text == 1)) {
                g++
            }
        }
        if ((ksenia.dom.faults.pstn[0].peripheral[0].state[0].Text != undefined) && (ksenia.dom.faults.pstn[0].peripheral[0].state[0].Text != "") && (ksenia.dom.faults.pstn[0].peripheral[0].state[0].Text != "NO_PERIPHERAL")) {
            if ((ksenia.dom.faults.pstn[0].networkKo[0].Text == 1) && (ksenia.dom.faults.enabled[0].koPstn[0].Text == 1)) {
                g++
            }
        }
        if ((ksenia.dom.faults.fuses[0].ko[0].Text == 1) && (ksenia.dom.faults.enabled[0].koFuses[0].Text == 1)) {
            g++
        }
        if (ksenia.dom.faults.busPeripherals[0].Text != "OK") {
            g++
        }
        if (ksenia.dom.faults.panelStatus[0].Text == 1) {
            g++
        }
        if (g > 0) {
            k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateFaults") + "</div></div>");
            h += " --- " + ksenia.util.getStringValue("lang.stateFaults")
        } else {
            k += ('      <div class="stateLaresLabelItem" style="width:160px;">' + ksenia.util.getStringValue("lang.stateNoFaults") + "</div></div>");
            h += " --- " + ksenia.util.getStringValue("lang.stateNoFaults")
        }
        k += ("  </div>");
        k += ('<div class="temperaturePanel">');
        k += ('      <div class="temperatureItem" style="cursor:default">');
        if (ksenia.settings.slowDevice == false) {
            k += ('  <div class="temperatureImg"><img src="' + ksenia.settings.remotePrefix + 'img/temp_int.png" width="24px" height="24px"/></div>')
        } else {
            k += ('  <div class="temperatureImg"></div>')
        }
        k += ('       <div class="temperatureLabelItem" style="top:7px;left:32px;">' + ksenia.util.getStringValue("lang.inTemp") + '</div>\n                            <div class="temperatureValueItem">' + ksenia.dom.stateLares.temperature[0].indoor[0].Text + "</div>\n                            </div>");
        if (!(ksenia.dom.stateLares.temperature[0].indoor[0].Text.contains("------"))) {
            h += " --- " + ksenia.util.getStringValue("lang.inTemp") + " " + ksenia.dom.stateLares.temperature[0].indoor[0].Text
        }
        k += ('      <div class="temperatureItem" style="cursor:default">');
        if (ksenia.settings.slowDevice == false) {
            k += ('  <div class="temperatureImg"><img src="' + ksenia.settings.remotePrefix + 'img/temp_est.png" width="24px" height="24px"/></div>')
        } else {
            k += ('  <div class="temperatureImg"></div>')
        }
        k += ('       <div class="temperatureLabelItem" style="top:7px;left:32px;">' + ksenia.util.getStringValue("lang.outTemp") + '</div>\n                            <div class="temperatureValueItem">' + ksenia.dom.stateLares.temperature[0].outdoor[0].Text + "</div>\n                            </div>");
        if (!(ksenia.dom.stateLares.temperature[0].outdoor[0].Text.contains("------"))) {
            h += " --- " + ksenia.util.getStringValue("lang.outTemp") + " " + ksenia.dom.stateLares.temperature[0].outdoor[0].Text
        }
        k += ("</div>");
        if ((ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != undefined) && (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != "") && (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != "NO_PERIPHERAL")) {
            k += ('<div class="gsmPanel">');
            if (ksenia.dom.faults.gsm[0].networkKo[0].Text != 1) {
                k += ('      <div class="gsmItem" style="cursor:default">');
                if (ksenia.settings.slowDevice == false) {
                    k += ('  <div class="gsmImg"><img src="' + ksenia.settings.remotePrefix + 'img/gsmNetwork.png" width="24px" height="24px"/></div>')
                } else {
                    k += ('  <div class="gsmImg"></div>')
                }
                if ((ksenia.dom.stateLares.gsm[0].operator[0].Text != null) && (ksenia.dom.stateLares.gsm[0].operator[0].Text != undefined)) {
                    k += ('      <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmOperator") + '</div>\n                                        <div class="gsmValueItem">' + ksenia.dom.stateLares.gsm[0].operator[0].Text + "</div>\n                                        </div>");
                    h += " --- " + ksenia.util.getStringValue("lang.stateGsmOperator") + " " + ksenia.dom.stateLares.gsm[0].operator[0].Text
                } else {
                    k += ('      <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmOperator") + "</div></div>");
                    h += " --- " + ksenia.util.getStringValue("lang.stateGsmOperator") + " "
                }
                k += ('      <div class="gsmItem" style="cursor:default">');
                if (ksenia.settings.slowDevice == false) {
                    if (ksenia.dom.stateLares.gsm[0].signalStrenght[0].Text <= 10) {
                        k += ('  <div class="gsmImg"><img src="' + ksenia.settings.remotePrefix + 'img/lowSignal.png" width="24px" height="24px"/></div>')
                    } else {
                        if (ksenia.dom.stateLares.gsm[0].signalStrenght[0].Text <= 20) {
                            k += ('  <div class="gsmImg"><img src="' + ksenia.settings.remotePrefix + 'img/mediumSignal.png" width="24px" height="24px"/></div>')
                        } else {
                            k += ('  <div class="gsmImg"><img src="' + ksenia.settings.remotePrefix + 'img/highSignal.png" width="24px" height="24px"/></div>')
                        }
                    }
                } else {
                    k += ('  <div class="gsmImg"></div>')
                }
                k += ('      <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmSignalStrenght") + '</div>\n                                    <div class="gsmValueItem">' + ksenia.dom.stateLares.gsm[0].signalStrenght[0].Text + "/31</div>\n                                    </div>");
                h += " --- " + ksenia.util.getStringValue("lang.stateGsmSignalStrenght") + " " + ksenia.dom.stateLares.gsm[0].signalStrenght[0].Text + "/31";
                k += ('      <div class="gsmItem" style="cursor:default">\n                                    <div class="gsmImg"></div>\n                                    <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmSim1Credit") + "</div>");
                if (ksenia.dom.stateLares.gsm[0].sim1[0].credit[0].Text == 4294967295) {
                    k += ('  <div class="gsmValueItem">' + ksenia.util.getStringValue("lang.stateGsmSimCreditDisabled") + "</div></div>")
                } else {
                    k += ('  <div class="gsmValueItem">' + ksenia.dom.stateLares.gsm[0].sim1[0].credit[0].Text + "</div></div>")
                }
                k += ('      <div class="gsmItem" style="cursor:default">\n                                    <div class="gsmImg"></div>\n                                    <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmSim1ExpiryDate") + "</div>");
                if (ksenia.dom.stateLares.gsm[0].sim1[0].expiry[0].Text == 0) {
                    k += ('  <div class="gsmValueItem">' + ksenia.util.getStringValue("lang.stateGsmExpiryDateDisabled") + "</div></div>")
                } else {
                    k += ('  <div class="gsmValueItem">' + ksenia.util.getStringDataFormat(ksenia.dom.stateLares.gsm[0].sim1[0].expiry[0].Text) + "</div></div>")
                }
                k += ('      <div class="gsmItem" style="cursor:default">\n                                    <div class="gsmImg"></div>\n                                    <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmSim2Credit") + "</div>");
                if (ksenia.dom.stateLares.gsm[0].sim2[0].credit[0].Text == 4294967295) {
                    k += ('  <div class="gsmValueItem">' + ksenia.util.getStringValue("lang.stateGsmSimCreditDisabled") + "</div></div>")
                } else {
                    k += ('  <div class="gsmValueItem">' + ksenia.dom.stateLares.gsm[0].sim2[0].credit[0].Text + "</div></div>")
                }
                k += ('      <div class="gsmItem" style="cursor:default">\n                                    <div class="gsmImg"></div>\n                                    <div class="gsmLabelItem">' + ksenia.util.getStringValue("lang.stateGsmSim2ExpiryDate") + "</div>");
                if (ksenia.dom.stateLares.gsm[0].sim2[0].expiry[0].Text == 0) {
                    k += ('  <div class="gsmValueItem">' + ksenia.util.getStringValue("lang.stateGsmExpiryDateDisabled") + "</div></div>")
                } else {
                    k += ('  <div class="gsmValueItem">' + ksenia.util.getStringDataFormat(ksenia.dom.stateLares.gsm[0].sim2[0].expiry[0].Text) + "</div></div>")
                }
            } else {
                k += ('<div class="gsmItemMex" id="gsmMex"><div class="gsmMex">' + ksenia.util.getStringValue("lang.stateGsmFault") + "</div></div>");
                h += " --- " + ksenia.util.getStringValue("lang.stateGsmFault")
            }
            k += ("</div>")
        }
        ksenia.dom.faults = null;
        ksenia.dom.zonesStatus = null;
        ksenia.dom.partitionsDescription = null;
        ksenia.dom.partitionsStatus = null;
        ksenia.dom.outputsStatus = null;
        ksenia.dom.stateLares = null;
        f.append(k);
        $("#stateLaresZones").click(function () {
            ksenia.controller.zonesPage()
        });
        $("#stateLaresOuputs").click(function () {
            ksenia.controller.outputsPage()
        });
        $("#stateLaresPartitions").click(function () {
            ksenia.controller.partitionsPage()
        });
        $("#stateLaresFaults").click(function () {
            ksenia.controller.faultsPage()
        });
        $("#gsmMex").click(function () {
            ksenia.controller.faultsPage()
        });
        f.css("height", 252);
        ksenia.util.userMsgSet(h);
        ksenia.dom.setHeaderNamePage("lang.statePage")
    },
    buildMapsPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildMapsPage")
        }
        ksenia.maps.buildMappa(ksenia.dom.maps.maptree[0].map[0]);
        a.css("height", 252)
    },
    buildSettingsPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildMapsPage")
        }
        var b = "";
        b = $('  <div id="loadingDataPage" style="position:absolute;color:#D00;background:transparent;top:100px;left:40px;height:30px;width:400px;font-size:25px;text-align:center;">\n                            <b>' + ksenia.util.getStringValue("lang.waitUnderConstructPage") + "</b>\n                        </div>");
        a.append(b);
        a.css("height", 252);
        ksenia.dom.setHeaderNamePage("lang.settingsPage")
    },
    buildErgoPage: function (b, d, e, c, j, h, i) {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildErgoPage")
        }
        var f;
        f = $('  <div id="ergo">\n                            <div id="ergoDisplay">\n                                <div id="ergoDisplaybg"/>\n                                <input id="ergoRow1" maxlength="16" value="" readonly="true" style="font-weight: bold"/>\n                                <input id="ergoRow2" maxlength="16" value="" readonly="true" style="font-weight: bold"/>\n                                <div id="ergoLogo"/>\n                            </div>\n                            <div id="ergoTouchPanel" >\n                                <div id="ergoTouch">\n                                    <div id="ergoTouchKeys">\n                                        <div class="ergoKey" id="key1"></div>\n                                        <div class="ergoKey" id="key2"></div>\n                                        <div class="ergoKey" id="key3"></div>\n                                        <div class="ergoKey" id="key4"></div>\n                                        <div class="ergoKey" id="key5"></div>\n                                        <div class="ergoKey" id="key6"></div>\n                                        <div class="ergoKey" id="key7"></div>\n                                        <div class="ergoKey" id="key8"></div>\n                                        <div class="ergoKey" id="key9"></div>\n                                        <div class="ergoKey" id="keyA"></div>\n                                        <div class="ergoKey" id="key0"></div>\n                                        <div class="ergoKey" id="keyB"></div>\n                                    </div>\n                                    <div id="ergoTouchRoll">\n                                        <div class="ergoRoll" id="roll1"></div>\n                                        <div class="ergoRoll" id="roll2"></div>\n                                        <div class="ergoRoll" id="roll3"></div>\n                                        <div class="ergoRoll" id="roll4"></div>\n                                        <div class="ergoRoll" id="roll5"></div>\n                                        <div class="ergoRoll" id="roll6"></div>\n                                        <div class="ergoRoll" id="roll7"></div>\n                                        <div class="ergoRoll" id="roll8"></div>\n                                        <div class="ergoRoll" id="roll9"></div>\n                                    </div>\n                                    <div id="ergoTouchEsc" ></div>\n                               </div>\n                            </div>\n                        </div>');
        a.append(f);
        if (ksenia.settings.slowDevice == false) {
            var g;
            if (ksenia.runtimeData.fgs) {
                g = $("<img src='" + ksenia.settings.remotePrefix + "img/fgs_logo-keypad.png' width='91px' height='40px' style='cursor:pointer;'/>")
            } else {
                g = $("<img src='" + ksenia.settings.remotePrefix + "img/logo-keypad.png' width='91px' height='40px' style='cursor:pointer;'/>")
            }
            $("#ergoLogo").append(g)
        } else {
            $("#ergoLogo").html('<div style="font-size:28px;overflow:hidden;text-overflow:ellipsis;"><div style="float:left;margin-left:10px;overflow:hidden;text-overflow:ellipsis;"><b>Ks</b></div><div style="float:left;color:#ccc;overflow:hidden;text-overflow:ellipsis;">enia</div></div>')
        }
        if (ksenia.settings.slowDevice == false) {
            $("#ergoTouch").css("background-image", "url('" + ksenia.settings.remotePrefix + "/img/bg-keypad.gif')")
        } else {
            $("#key1").html("1");
            $("#key2").html("2");
            $("#key3").html("3");
            $("#key4").html("4");
            $("#key5").html("5");
            $("#key6").html("6");
            $("#key7").html("7");
            $("#key8").html("8");
            $("#key9").html("9");
            $("#keyA").html("*");
            $("#key0").html("0");
            $("#keyB").html("#");
            $("#roll5").html("o");
            $("#ergoTouchEsc").html("ESC")
        }
        $("#ergoTouch").css("background-repeat", "no-repeat");
        $("#ergoTouch").css("background-position", "center");
        $("#ergoTouch").css("background-size", "cover");
        ksenia.ergoHandler.reset();
        ksenia.ergoHandler.setPwdType(b);
        ksenia.ergoHandler.setState(d);
        ksenia.ergoHandler.clearDisplay();
        if ((e != null) && (e != undefined)) {
            ksenia.ergoHandler.setStringDisplayRow1(e)
        }
        if ((c != null) && (c != undefined)) {
            ksenia.ergoHandler.setStringDisplayRow2(c)
        }
        ksenia.ergoHandler.setNextAction(h);
        ksenia.ergoHandler.setBackAction(i);
        ksenia.ergoHandler.enableTouch(j);
        $("#key1").click(function () {
            ksenia.ergoHandler.keyPressed("key1")
        });
        $("#key2").click(function () {
            ksenia.ergoHandler.keyPressed("key2")
        });
        $("#key3").click(function () {
            ksenia.ergoHandler.keyPressed("key3")
        });
        $("#key4").click(function () {
            ksenia.ergoHandler.keyPressed("key4")
        });
        $("#key5").click(function () {
            ksenia.ergoHandler.keyPressed("key5")
        });
        $("#key6").click(function () {
            ksenia.ergoHandler.keyPressed("key6")
        });
        $("#key7").click(function () {
            ksenia.ergoHandler.keyPressed("key7")
        });
        $("#key8").click(function () {
            ksenia.ergoHandler.keyPressed("key8")
        });
        $("#key9").click(function () {
            ksenia.ergoHandler.keyPressed("key9")
        });
        $("#keyA").click(function () {
            ksenia.ergoHandler.keyPressed("keyA")
        });
        $("#key0").click(function () {
            ksenia.ergoHandler.keyPressed("key0")
        });
        $("#keyB").click(function () {
            ksenia.ergoHandler.keyPressed("keyB")
        });
        $("#roll1").click(function () {
            ksenia.ergoHandler.rollPressed("roll1")
        });
        $("#roll2").click(function () {
            ksenia.ergoHandler.rollPressed("roll2")
        });
        $("#roll3").click(function () {
            ksenia.ergoHandler.rollPressed("roll3")
        });
        $("#roll4").click(function () {
            ksenia.ergoHandler.rollPressed("roll4")
        });
        $("#roll5").click(function () {
            ksenia.ergoHandler.rollPressed("roll5")
        });
        $("#roll6").click(function () {
            ksenia.ergoHandler.rollPressed("roll6")
        });
        $("#roll7").click(function () {
            ksenia.ergoHandler.rollPressed("roll7")
        });
        $("#roll8").click(function () {
            ksenia.ergoHandler.rollPressed("roll8")
        });
        $("#roll9").click(function () {
            ksenia.ergoHandler.rollPressed("roll9")
        });
        $("#ergoTouchEsc").click(function () {
            ksenia.ergoHandler.escPressed()
        });
        $(document).unbind("keydown");
        $(document).keydown(function (k) {
            if (ksenia.controller.pageName == "ergoPage") {
                switch (k.keyCode) {
                    case 8:
                        ksenia.ergoHandler.keyPressed("keyA");
                        return false;
                    case 48:
                        ksenia.ergoHandler.keyPressed("key0");
                        break;
                    case 49:
                        ksenia.ergoHandler.keyPressed("key1");
                        break;
                    case 50:
                        ksenia.ergoHandler.keyPressed("key2");
                        break;
                    case 51:
                        ksenia.ergoHandler.keyPressed("key3");
                        break;
                    case 52:
                        ksenia.ergoHandler.keyPressed("key4");
                        break;
                    case 53:
                        ksenia.ergoHandler.keyPressed("key5");
                        break;
                    case 54:
                        ksenia.ergoHandler.keyPressed("key6");
                        break;
                    case 55:
                        ksenia.ergoHandler.keyPressed("key7");
                        break;
                    case 56:
                        ksenia.ergoHandler.keyPressed("key8");
                        break;
                    case 57:
                        ksenia.ergoHandler.keyPressed("key9");
                        break
                }
            }
        });
        a.css("height", 252);
        ksenia.dom.setHeaderNamePage("lang.ergoPage")
    },
    buildZonesPage: function () {
        if (ksenia.dom.zonesStatus != undefined) {
            var a = $("div#kseniaPanel").data("jsp").getContentPane();
            a.empty();
            if (ksenia.settings.debug.showBuildPageMessageBox == true) {
                alert("BuildZonesPage")
            }
            var d = "";
            var c;
            var e = 0;
            for (c = 0; c < ksenia.dom.zonesDescription.length; c++) {
                if (ksenia.dom.zonesStatus[c].status[0].Text != "NOT_USED") {
                    e++;
                    d += ('<div class="zone" id="zone' + (c + 1) + '" zoneId="' + (c + 1) + '" status="' + ksenia.dom.zonesStatus[c].status[0].Text + '" bypassState="' + ksenia.dom.zonesStatus[c].bypass[0].Text + '"');
                    d += ('><div class="zoneState" style="background-color:' + ksenia.util.getZoneStatusColor(ksenia.dom.zonesStatus[c].status[0].Text, ksenia.dom.zonesStatus[c].bypass[0].Text) + ';"');
                    d += ("></div>");
                    d += ('<div class="zoneDescription" ');
                    if (ksenia.dom.zonesStatus[c].bypass[0].Text == "BYPASS") {
                        d += ('style="font-style:oblique;color:#ccc;"')
                    }
                    if ((ksenia.dom.zonesDescription[c].Text == undefined) || (ksenia.dom.zonesDescription[c].Text == "") || (ksenia.dom.zonesDescription[c].Text == null)) {
                        d += (">" + ksenia.util.getStringValue("lang.zonesNoDescriptionSet") + " " + (c + 1) + "</div>")
                    } else {
                        if (ksenia.dom.zonesStatus[c].status[0].Text != "LOST") {
                            d += (">" + ksenia.dom.zonesDescription[c].Text + "</div>")
                        } else {
                            d += ("><s>" + ksenia.dom.zonesDescription[c].Text + "</s></div>")
                        }
                    }
                    if (ksenia.settings.slowDevice == false) {
                        d += ('<div class="zoneStateImg"><img src="' + ksenia.util.getZonesStatusIcon(ksenia.dom.zonesStatus[c].bypass[0].Text, ksenia.dom.zonesStatus[c].status[0].Text, ksenia.dom.zonesStatus[c].memoryAlarm[0].Text) + '" width="24px" height="24px" /></div>')
                    }
                    d += ("</div>");
                    d += ('<div class="zoneAnalogBand">');
                    if ((ksenia.dom.zonesStatus[c].status[0].Text == "ANALOG_BAND_1") || (ksenia.dom.zonesStatus[c].status[0].Text == "ANALOG_BAND_2") || (ksenia.dom.zonesStatus[c].status[0].Text == "ANALOG_BAND_3") || (ksenia.dom.zonesStatus[c].status[0].Text == "ANALOG_BAND_4") || (ksenia.dom.zonesStatus[c].status[0].Text == "ANALOG_BAND_5")) {
                        if (ksenia.dom.zonesStatus[c].bypass[0].Text == "UN_BYPASS") {
                            switch (ksenia.dom.zonesStatus[c].status[0].Text) {
                                case"ANALOG_BAND_5":
                                    d += ('<div class="analogLevel" style="left:  0px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 33px"></div>');
                                    d += ('<div class="analogLevel" style="left: 66px"></div>');
                                    d += ('<div class="analogLevel" style="left: 99px"></div>');
                                    d += ('<div class="analogLevel" style="left:132px"></div>');
                                    break;
                                case"ANALOG_BAND_4":
                                    d += ('<div class="analogLevel" style="left:  0px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 33px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 66px"></div>');
                                    d += ('<div class="analogLevel" style="left: 99px"></div>');
                                    d += ('<div class="analogLevel" style="left:132px"></div>');
                                    break;
                                case"ANALOG_BAND_3":
                                    d += ('<div class="analogLevel" style="left:  0px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 33px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 66px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 99px"></div>');
                                    d += ('<div class="analogLevel" style="left:132px"></div>');
                                    break;
                                case"ANALOG_BAND_2":
                                    d += ('<div class="analogLevel" style="left:  0px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 33px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 66px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 99px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left:132px"></div>');
                                    break;
                                case"ANALOG_BAND_1":
                                    d += ('<div class="analogLevel" style="left:  0px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 33px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 66px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left: 99px;background-color:red"></div>');
                                    d += ('<div class="analogLevel" style="left:132px;background-color:red"></div>');
                                    break
                            }
                        } else {
                            d += ('<div class="analogLevel" style="left:  0px"></div>');
                            d += ('<div class="analogLevel" style="left: 33px"></div>');
                            d += ('<div class="analogLevel" style="left: 66px"></div>');
                            d += ('<div class="analogLevel" style="left: 99px"></div>');
                            d += ('<div class="analogLevel" style="left:132px"></div>')
                        }
                    }
                    d += ("</div>")
                }
            }
            var b = Math.round(e / 2) * 50;
            ksenia.dom.zonesStatus = null;
            a.append(d);
            for (c = 0; c < ksenia.dom.zonesDescription.length; c++) {
                $(("#zone" + (c + 1))).click(function () {
                    if (ksenia.controller.pinIsAvailable() != true) {
                        ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setByPassZoneCmd(" + $(this).attr("zoneId") + ',"' + $(this).attr("status") + '","' + $(this).attr("bypassState") + '")', "ksenia.controller.zonesPage()")
                    } else {
                        ksenia.controller.setByPassZoneCmd($(this).attr("zoneId"), $(this).attr("status"), $(this).attr("bypassState"))
                    }
                })
            }
            a.css("height", b);
            ksenia.dom.setHeaderNamePage("lang.zonesPage")
        }
    },
    buildOutputsPage: function () {
        if (ksenia.dom.outputsStatus != undefined) {
            var a = $("div#kseniaPanel").data("jsp").getContentPane();
            a.empty();
            if (ksenia.settings.debug.showBuildPageMessageBox == true) {
                alert("BuildOutputsPage")
            }
            var e = "";
            var d = 0;
            for (var c = 0; c < ksenia.dom.outputsDescription.length; c++) {
                addOut = (ksenia.dom.outputsStatus[c].type[0].Text == "ANALOG") || (ksenia.dom.outputsStatus[c].type[0].Text == "DIGITAL");
                if (addOut) {
                    e += ('<div class="output" id="output' + c + '" outputId="' + c + '" status="' + ksenia.dom.outputsStatus[c].status[0].Text + '" type="' + ksenia.dom.outputsStatus[c].type[0].Text + '" nopin="' + ksenia.dom.outputsStatus[c].noPIN[0].Text + '"');
                    e += ('><div class="outputState" style="background-color:' + ksenia.util.getOutputStatusColor(ksenia.dom.outputsStatus[c].status[0].Text) + ';"');
                    e += (' ></div>\n                                    <div class="outputDescription" ');
                    if (ksenia.dom.outputsStatus[c].type[0].Text == "ANALOG") {
                        e += ('style="font-style:oblique;top:2px"')
                    }
                    if ((ksenia.dom.outputsDescription[c].Text == undefined) || (ksenia.dom.outputsDescription[c].Text == "") || (ksenia.dom.outputsDescription[c].Text == null)) {
                        if (ksenia.dom.outputsStatus[c].status[0].Text == "LOST") {
                            e += ("><s>" + ksenia.util.getStringValue("lang.outputsNoDescriptionSet") + " " + (c + 1) + "</s></div>")
                        } else {
                            e += (">" + ksenia.util.getStringValue("lang.outputsNoDescriptionSet") + " " + (c + 1) + "</div>")
                        }
                    } else {
                        if (ksenia.dom.outputsStatus[c].status[0].Text == "LOST") {
                            e += ("><s>" + ksenia.dom.outputsDescription[c].Text + "</s></div>")
                        } else {
                            e += (">" + ksenia.dom.outputsDescription[c].Text + "</div>")
                        }
                    }
                    if (ksenia.dom.outputsStatus[c].type[0].Text == "ANALOG") {
                        e += '<div class="outputAnalogBand"><div class="analogButton" id="output' + c + 'minus" outputId="' + c + '" outputValue="' + ksenia.dom.outputsStatus[c].value[0].Text + '"><img src="img/minus.png"/></div><div class="analogOutputLevel" style="left: 13px"><div class="analogOutputLevelIndicator" id="output' + c + 'bar" style="width: ';
                        e += parseInt(ksenia.dom.outputsStatus[c].value[0].Text) / 244 * 138;
                        e += 'px"></div></div><div class="analogButton" id="output' + c + 'plus" outputId="' + c + '" outputValue="' + ksenia.dom.outputsStatus[c].value[0].Text + '" style="left: 152px"><img src="img/plus.png"/></div></div>'
                    }
                    e += ("</div>");
                    d++
                }
            }
            var b = Math.round(d / 2);
            a.append(e);
            a.css("height", b * 50);
            for (c = 0; c < ksenia.dom.outputsDescription.length; c++) {
                if (ksenia.dom.outputsStatus[c].type[0].Text == "ANALOG") {
                    $(("#output" + c + "minus")).click(function () {
                        ksenia.dom.workingOnAnalogScrollbars = true;
                        action = new Object();
                        action.outIndex = parseInt($(this).attr("outputId"));
                        action.outValue = parseInt($(this).attr("outputValue"));
                        action.outOffset = -12;
                        $(("#output" + $(this).attr("outputId") + "bar")).animate({width: "-=6.78"}, 100);
                        if (parseInt($(("#output" + $(this).attr("outputId") + "bar")).css("width")) <= 0) {
                            $(("#output" + $(this).attr("outputId") + "bar")).css("width", "0")
                        }
                        ksenia.util.addActionToAnalogList(action)
                    });
                    $(("#output" + c + "plus")).click(function () {
                        ksenia.dom.workingOnAnalogScrollbars = true;
                        action = new Object();
                        action.outIndex = parseInt($(this).attr("outputId"));
                        action.outValue = parseInt($(this).attr("outputValue"));
                        $(("#output" + $(this).attr("outputId") + "bar")).animate({width: "+=6.78"}, 100);
                        if (parseInt($(("#output" + $(this).attr("outputId") + "bar")).css("width")) >= 138) {
                            $(("#output" + $(this).attr("outputId") + "bar")).css("width", "138")
                        }
                        action.outOffset = +12;
                        ksenia.util.addActionToAnalogList(action)
                    })
                } else {
                    $(("#output" + c)).click(function () {
                        askPIN = $(this).attr("nopin") == "FALSE";
                        if (askPIN) {
                            if (ksenia.controller.pinIsAvailable() != true) {
                                ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setOutputCmd(" + $(this).attr("outputId") + ',"' + $(this).attr("status") + '","' + $(this).attr("type") + '")', "ksenia.controller.outputsPage()")
                            } else {
                                ksenia.controller.setOutputCmd($(this).attr("outputId"), $(this).attr("status"), $(this).attr("type"))
                            }
                        } else {
                            ksenia.controller.pin = ksenia.dom.basisInfo.PINToUse[0].Text;
                            ksenia.ergoHandler.runtimeData.buffer = ksenia.controller.pin;
                            ksenia.controller.setOutputCmd($(this).attr("outputId"), $(this).attr("status"), $(this).attr("type"));
                            ksenia.controller.setPinNotAvailable()
                        }
                    })
                }
            }
            ksenia.dom.outputsStatus = null;
            ksenia.dom.setHeaderNamePage("lang.outputsPage")
        }
    },
    buildPartitionsPage: function () {
        if (ksenia.dom.partitionsStatus != undefined) {
            var a = $("div#kseniaPanel").data("jsp").getContentPane();
            a.empty();
            if (ksenia.settings.debug.showBuildPageMessageBox == true) {
                alert("BuildPartitionsPage")
            }
            var d = 0;
            var e = "";
            for (var c = 0; c < ksenia.dom.partitionsDescription.length; c++) {
                if ((ksenia.dom.partitionsDescription[c].Text != undefined) && (ksenia.dom.partitionsDescription[c].Text != "") || (ksenia.dom.partitionsDescription[c].Text != null)) {
                    d++;
                    e += ('    <div class="partition" id="partition' + c + '" partitionId="' + c + '" status="' + ksenia.dom.partitionsStatus[c].Text + '"');
                    e += ('><div class="partitionState" style="background-color:' + ksenia.util.getPartitionsStatusColor(ksenia.dom.partitionsStatus[c].Text) + ';"');
                    e += (' ></div>\n                                    <div class="partitionDescription" "');
                    if ((ksenia.dom.partitionsDescription[c].Text == undefined) || (ksenia.dom.partitionsDescription[c].Text == "") || (ksenia.dom.partitionsDescription[c].Text == null)) {
                        e += (">" + ksenia.util.getStringValue("lang.partitionsNoDescriptionSet") + " " + (c + 1) + "</div>")
                    } else {
                        e += (">" + ksenia.dom.partitionsDescription[c].Text + "</div>")
                    }
                    if (ksenia.settings.slowDevice == false) {
                        e += ('<div class="partitionStateImg"><img src="' + ksenia.util.getPartitionsStatusIcon(ksenia.dom.partitionsStatus[c].Text) + '" width="24px" height="24px" /></div>')
                    }
                    e += ("</div>")
                }
            }
            var b = Math.round(d / 2) * 50;
            if (d == 0) {
                e += e = ('<div id="infoPanel"><div id="infoNoProgrammedPartitions"><b>' + ksenia.util.getStringValue("lang.infoNoProgrammedPartitions") + "</b></div><div>");
                b = 252
            }
            d = null;
            ksenia.dom.partitionsStatus = null;
            a.append(e);
            for (c = 0; c < ksenia.dom.partitionsDescription.length; c++) {
                $(("#partition" + c)).click(function () {
                    if (ksenia.controller.pinIsAvailable() != true) {
                        if ($(this).attr("status") == "DISARMED") {
                            ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setArmPartitionCmd(" + $(this).attr("partitionid") + ", 1)", "ksenia.controller.partitionsPage()")
                        } else {
                            ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setArmPartitionCmd(" + $(this).attr("partitionid") + ", 3)", "ksenia.controller.partitionsPage()")
                        }
                    } else {
                        if ($(this).attr("status") == "DISARMED") {
                            ksenia.controller.setArmPartitionCmd($(this).attr("partitionid"), 1)
                        } else {
                            ksenia.controller.setArmPartitionCmd($(this).attr("partitionid"), 3)
                        }
                    }
                })
            }
            a.css("height", b);
            ksenia.dom.setHeaderNamePage("lang.partitionsPage")
        }
    },
    buildFaultsPage: function () {
        var c = 0;
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildFaultsPage")
        }
        var b = "";
        b = ('    <div id="faultsPanel">');
        b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultPanel") + '</div><div class="faultValue" ');
        if (ksenia.dom.faults.panelStatus[0].Text == 1) {
            b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultPanelValueTamper") + "</div>")
        } else {
            b += (">" + ksenia.util.getStringValue("lang.faultPanelValueOk") + "</div>")
        }
        c++;
        if ((ksenia.dom.faults.enabled[0].badBattery[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowBattery[0].Text == 1)) {
            b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultBattery") + '</div><div class="faultValue" ');
            if ((ksenia.dom.faults.battery[0].bad[0].Text == 1) && (ksenia.dom.faults.enabled[0].badBattery[0].Text == 1)) {
                b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultBatteryValueBad") + "</div>")
            } else {
                if ((ksenia.dom.faults.battery[0].low[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowBattery[0].Text == 1)) {
                    b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultBatteryValueLow") + "</div>")
                } else {
                    b += (">" + ksenia.util.getStringValue("lang.faultBatteryValueOk") + "</div>")
                }
            }
            c++
        }
        if ((ksenia.dom.faults.enabled[0].noPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].koPowerSupply[0].Text == 1) && (ksenia.dom.faults.enabled[0].lowPowerSupply[0].Text == 1)) {
            b += ('<div class="faultType">' + ksenia.util.getStringValue("lang.faultPowerSupply") + '</div><div class="faultValue" ');
            if (ksenia.dom.faults.powerSupply[0].no[0].Text == 1) {
                b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultPowerSupplyValueNotOk") + "</div>")
            } else {
                if (ksenia.dom.faults.powerSupply[0].ko[0].Text == 1) {
                    b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultPowerSupplyValueKo") + "</div>")
                } else {
                    if (ksenia.dom.faults.powerSupply[0].low[0].Text == 1) {
                        b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultPowerSupplyValueLow") + "</div>")
                    } else {
                        b += (">" + ksenia.util.getStringValue("lang.faultPowerSupplyValueOk") + "</div>")
                    }
                }
            }
            c++
        }
        if ((ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != undefined) && (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != "") && (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text != "NO_PERIPHERAL") && (ksenia.dom.faults.enabled[0].koGsm[0].Text == 1)) {
            b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultGsm") + '</div><div class="faultValue" ');
            if ((ksenia.dom.faults.gsm[0].networkKo[0].Text == 1) || (ksenia.dom.faults.gsm[0].peripheral[0].state[0].Text == "NO_COM_PERIPHERAL")) {
                b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultGsmValueNotOk") + "</div>")
            } else {
                b += (">" + ksenia.util.getStringValue("lang.faultGsmValueOk") + "</div>")
            }
            c++
        }
        if ((ksenia.dom.faults.pstn[0].peripheral[0].state[0].Text != undefined) && (ksenia.dom.faults.pstn[0].peripheral[0].state[0].Text != "") && (ksenia.dom.faults.pstn[0].peripheral[0].state[0].Text != "NO_PERIPHERAL") && (ksenia.dom.faults.enabled[0].koPstn[0].Text == 1)) {
            b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultPstn") + '</div><div class="faultValue" ');
            if (ksenia.dom.faults.pstn[0].networkKo[0].Text == 1) {
                b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultPstnValueNotOk") + "</div>")
            } else {
                b += (">" + ksenia.util.getStringValue("lang.faultPstnValueOk") + "</div>")
            }
            c++
        }
        if (ksenia.dom.faults.enabled[0].koEth[0].Text == 1) {
            b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultEthernet") + '</div><div class="faultValue" >' + ksenia.util.getStringValue("lang.faultEthernetValueOk") + "</div>");
            c++
        }
        b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultBusPeripherals") + '</div><div class="faultValue" ');
        if (ksenia.dom.faults.busPeripherals[0].Text == "TAMPER") {
            b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultfaultBusPeripheralsValueTamper") + "</div>")
        } else {
            if (ksenia.dom.faults.busPeripherals[0].Text == "LOST") {
                b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultfaultBusPeripheralsValueLost") + "</div>")
            } else {
                if (ksenia.dom.faults.busPeripherals[0].Text == "OK") {
                    b += (">" + ksenia.util.getStringValue("lang.faultfaultBusPeripheralsValueOk") + "</div>")
                }
            }
        }
        c++;
        if (ksenia.dom.faults.enabled[0].koFuses[0].Text == 1) {
            b += ('<div class="faultType" >' + ksenia.util.getStringValue("lang.faultFuses") + '</div><div class="faultValue" ');
            if (ksenia.dom.faults.fuses[0].ko[0].Text == 0) {
                b += (">" + ksenia.util.getStringValue("lang.faultFusesValueOk") + "</div>");
                c++
            } else {
                b += ('style="color:#EE2722;">' + ksenia.util.getStringValue("lang.faultFusesValueNotOk") + "</div>");
                c++
            }
        }
        b += ("</div>");
        ksenia.dom.faults = null;
        a.append(b);
        a.css("height", 252);
        ksenia.dom.setHeaderNamePage("lang.faultsPage")
    },
    buildUsersPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildUsersPage")
        }
        var b = null;
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:7px; left:21px' id='codesButton'><img src='" + ksenia.settings.remotePrefix + "img/codes.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.codesButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:7px; left:21px' id='codesButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.codesButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:7px; left:170px' id='tagsButton'><img src='" + ksenia.settings.remotePrefix + "img/tags.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.tagsButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:7px; left:170px' id='tagsButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.tagsButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.settings.slowDevice == false) {
            b = $("<div class='mainPageButton' style='top:7px; left:319px' id='remotesButton'><img src='" + ksenia.settings.remotePrefix + "img/remotes.png' width='90px' height='90px' style='cursor:pointer;'/><div>" + ksenia.util.getStringValue("lang.remotesButton") + "</div></div>")
        } else {
            b = $("<div class='mainPageButton' style='top:7px; left:319px' id='remotesButton'><div style='font-size:20px;margin-top:43px'>" + ksenia.util.getStringValue("lang.remotesButton") + "</div></div>")
        }
        a.append(b);
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            $("#codesButton").click(function () {
                ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.codesPage(true)", "ksenia.controller.usersPage()")
            })
        } else {
            $("#codesButton").click(function () {
                ksenia.controller.checkFirmwareKoPage()
            })
        }
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            $("#tagsButton").click(function () {
                ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.tagsPage(true)", "ksenia.controller.usersPage()")
            })
        } else {
            $("#tagsButton").click(function () {
                ksenia.controller.checkFirmwareKoPage()
            })
        }
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            $("#remotesButton").click(function () {
                ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.remotesPage(true)", "ksenia.controller.usersPage()")
            })
        } else {
            $("#remotesButton").click(function () {
                ksenia.controller.checkFirmwareKoPage()
            })
        }
        a.css("height", "252px");
        ksenia.dom.setHeaderNamePage("lang.usersPage")
    },
    buildSchedulerPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildSchedulerPage")
        }
        var b = "";
        b += ('<div id="schedulerRow1" status="' + ksenia.dom.schedulers.schedulers[0].armModes[0].Text + '">\n                        <div id="schedulerType" style="background-color:' + ksenia.util.getSchedulerStatusColor(ksenia.dom.schedulers.schedulers[0].armModes[0].Text) + '"></div>\n                        <div id="schedulerDescrition"');
        if (ksenia.dom.schedulers.schedulers[0].armModes[0].Text == "FALSE") {
            b += ('style="font-style:oblique;color:#ccc;"')
        }
        b += ("><b>" + ksenia.util.getStringValue("lang.armModes") + "</b></div>\n                    </div>");
        b += ('<div id="schedulerRow2" status="' + ksenia.dom.schedulers.schedulers[0].actions[0].Text + '">\n                        <div id="schedulerType" style="background-color:' + ksenia.util.getSchedulerStatusColor(ksenia.dom.schedulers.schedulers[0].actions[0].Text) + '"></div>\n                        <div id="schedulerDescrition"');
        if (ksenia.dom.schedulers.schedulers[0].actions[0].Text == "FALSE") {
            b += ('style="font-style:oblique;color:#ccc;"')
        }
        b += ("><b>" + ksenia.util.getStringValue("lang.actions") + "</b></div>\n                    </div>");
        b += ('<div id="schedulerRow3" status="' + ksenia.dom.schedulers.schedulers[0].groups[0].Text + '">\n                        <div id="schedulerType" style="background-color:' + ksenia.util.getSchedulerStatusColor(ksenia.dom.schedulers.schedulers[0].groups[0].Text) + '"></div>\n                        <div id="schedulerDescrition"');
        if (ksenia.dom.schedulers.schedulers[0].groups[0].Text == "FALSE") {
            b += ('style="font-style:oblique;color:#ccc;"')
        }
        b += ("><b>" + ksenia.util.getStringValue("lang.groups") + "</b></div>\n                    </div>");
        b += ('<div id="schedulerRow4">\n                        <div id="schedulerDescrition"');
        b += ("><b>" + ksenia.util.getStringValue("lang.timedStates") + "</b></div>\n                    </div>");
        a.append(b);
        $("#schedulerRow1").click(function () {
            ksenia.controller.enableSchedulerCmd("1", $(this).attr("status"))
        });
        $("#schedulerRow2").click(function () {
            ksenia.controller.enableSchedulerCmd("2", $(this).attr("status"))
        });
        $("#schedulerRow3").click(function () {
            ksenia.controller.enableSchedulerCmd("3", $(this).attr("status"))
        });
        $("#schedulerRow4").click(function () {
            ksenia.controller.timedStatesPage()
        });
        ksenia.dom.Scheduler = null;
        ksenia.dom.setHeaderNamePage("lang.schedulerPage")
    },
    buildCodesPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildCodesPage")
        }
        var d = "";
        var c = 0;
        for (var b = 0; b < ksenia.dom.codes.codes[0].code.length; b++) {
            if ((ksenia.dom.codes.codes[0].code[b].enable[0].Text != null) && (ksenia.dom.codes.codes[0].code[b].enable[0].Text != undefined) && (ksenia.dom.codes.codes[0].code[b].enable[0].Text != "")) {
                if (ksenia.dom.codes.codes[0].code[b].enable[0].Text == "FALSE") {
                    d += ('    <div id="codeRow" >\n                        <div id="codeType" style="background-color:' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                        <div id="codeDescription"')
                } else {
                    d += ('    <div id="codeRow" >\n                        <div id="codeType" style="background-color:' + ksenia.util.getCodesTypeColor(ksenia.dom.codes.codes[0].code[b].master[0].Text) + '"></div>\n                        <div id="codeDescription"')
                }
                if (ksenia.dom.codes.codes[0].code[b].enable[0].Text == "FALSE") {
                    d += ('style="font-style:oblique;color:#ccc;"')
                }
                if ((ksenia.dom.codes.codes[0].code[b].description[0].Text != null) && (ksenia.dom.codes.codes[0].code[b].description[0].Text != undefined) && (ksenia.dom.codes.codes[0].code[b].description[0].Text != "")) {
                    d += ("><b>" + ksenia.dom.codes.codes[0].code[b].description[0].Text + "</b></div>")
                } else {
                    d += ("><b>" + ksenia.util.getStringValue("lang.CodeWithNoDescription") + " " + (b + 2) + "</b></div>")
                }
                if (ksenia.dom.codes.codes[0].code[b].master[0].Text == "FALSE") {
                    d += ('  <div class="enableCodesImg" id="enableCodeImg' + b + '" codeposition="' + (b + 1) + '" enable="' + ksenia.dom.codes.codes[0].code[b].enable[0].Text + '"><img src="' + ksenia.settings.remotePrefix + 'img/enablePins.png" width="32px" height="32px"/></div>')
                }
                d += ('  <div class="changeCodesImg" id="changeCodeImg' + b + '" codeposition="' + (b + 1) + '"><img src="' + ksenia.settings.remotePrefix + 'img/changePins.png" width="32px" height="32px"/></div>');
                d += ("</div>");
                c++
            }
        }
        a.append(d);
        for (b = 0; b < ksenia.dom.codes.codes[0].code.length; b++) {
            if (c >= 1) {
                $(("#enableCodeImg" + b)).click(function () {
                    ksenia.controller.enablePinCmd($(this).attr("codeposition"), $(this).attr("enable"))
                })
            } else {
                $(("#enableCodeImg" + b)).remove()
            }
            if (c >= 1) {
                if (ksenia.dom.codes.codes[0].code[b].master[0].Text == "TRUE") {
                    $(("#changeCodeImg" + b)).click(function () {
                        ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterNewPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), 'ksenia.controller.changeMyPinCmd("' + ksenia.controller.pinToHandlerCodes + '",' + $(this).attr("codePosition") + ")", 'ksenia.controller.codesPage(true,"' + ksenia.controller.pinToHandlerCodes + '")')
                    })
                } else {
                    $(("#changeCodeImg" + b)).click(function () {
                        ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterNewPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), 'ksenia.controller.changePinCmd("' + ksenia.controller.pinToHandlerCodes + '",' + $(this).attr("codePosition") + ")", 'ksenia.controller.codesPage(true,"' + ksenia.controller.pinToHandlerCodes + '")')
                    })
                }
            } else {
                $(("#changeCodeImg" + b)).click(function () {
                    ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterNewPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), 'ksenia.controller.changeMyPinCmd("' + ksenia.controller.pinToHandlerCodes + '",' + $(this).attr("codePosition") + ")", 'ksenia.controller.codesPage(true,"' + ksenia.controller.pinToHandlerCodes + '")')
                })
            }
        }
        a.css("height", c * 50);
        ksenia.dom.codes = null;
        ksenia.dom.setHeaderNamePage("lang.codesPage")
    },
    buildTagsPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildTagsPage")
        }
        var c = "";
        var d = 0;
        for (var b = 0; b < ksenia.dom.tags.tags[0].tag.length; b++) {
            if ((ksenia.dom.tags.tags[0].tag[b].enable[0].Text != null) && (ksenia.dom.tags.tags[0].tag[b].enable[0].Text != undefined) && (ksenia.dom.tags.tags[0].tag[b].enable[0].Text != "")) {
                if (ksenia.dom.tags.tags[0].tag[b].enable[0].Text == "FALSE") {
                    c += ('<div id="tagRow" >\n                                <div id="tagType" style="background-color:' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                                <div id="tagDescription"')
                } else {
                    c += ('<div id="tagRow" >\n                                <div id="tagType" style="background-color:' + ksenia.util.getCodesTypeColor(ksenia.dom.tags.tags[0].tag[b].enable[0].Text) + '"></div>\n                                <div id="tagDescription"')
                }
                if (ksenia.dom.tags.tags[0].tag[b].enable[0].Text == "FALSE") {
                    c += ('style="font-style:oblique;color:#ccc;"')
                }
                if ((ksenia.dom.tags.tags[0].tag[b].description[0].Text != null) && (ksenia.dom.tags.tags[0].tag[b].description[0].Text != undefined) && (ksenia.dom.tags.tags[0].tag[b].description[0].Text != "")) {
                    c += ("><b>" + ksenia.dom.tags.tags[0].tag[b].description[0].Text + "</b></div>")
                } else {
                    c += ("><b>" + ksenia.util.getStringValue("lang.TagWithNoDescription") + " " + (b + 1) + "</b></div>")
                }
                c += ('<div class="enableTagsImg" id="enableTagImg' + b + '" tagposition="' + (b + 1) + '" enable="' + ksenia.dom.tags.tags[0].tag[b].enable[0].Text + '"><img src="' + ksenia.settings.remotePrefix + 'img/enableTags.png" width="32px" height="32px"/></div>');
                c += ("</div>");
                d++
            }
        }
        a.append(c);
        for (b = 0; b < ksenia.dom.tags.tags[0].tag.length; b++) {
            if (d >= 1) {
                $(("#enableTagImg" + b)).click(function () {
                    ksenia.controller.enableTagCmd($(this).attr("tagposition"), $(this).attr("enable"))
                })
            } else {
                $(("#enableTagImg" + b)).remove()
            }
        }
        a.css("height", d * 50);
        ksenia.dom.tags = null;
        ksenia.dom.setHeaderNamePage("lang.tagsPage")
    },
    buildRemotesPage: function () {
        var c = $("div#kseniaPanel").data("jsp").getContentPane();
        c.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildRemotesPage")
        }
        var a = "";
        var b = 0;
        for (var d = 0; d < ksenia.dom.remotes.remotes[0].remote.length; d++) {
            if ((ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text != null) && (ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text != undefined) && (ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text != "")) {
                if (ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text == "FALSE") {
                    a += ('<div id="remoteRow" >\n                                    <div id="remoteType" style="background-color:' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                                    <div id="remoteDescription"')
                } else {
                    a += ('<div id="remoteRow" >\n                                    <div id="remoteType" style="background-color:' + ksenia.util.getCodesTypeColor(ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text) + '"></div>\n                                    <div id="remoteDescription"')
                }
                if (ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text == "FALSE") {
                    a += ('style="font-style:oblique;color:#ccc;"')
                }
                if ((ksenia.dom.remotes.remotes[0].remote[d].description[0].Text != null) && (ksenia.dom.remotes.remotes[0].remote[d].description[0].Text != undefined) && (ksenia.dom.remotes.remotes[0].remote[d].description[0].Text != "")) {
                    a += ("><b>" + ksenia.dom.remotes.remotes[0].remote[d].description[0].Text + "</b></div>")
                } else {
                    a += ("><b>" + ksenia.util.getStringValue("lang.RemoteWithNoDescription") + " " + (d + 1) + "</b></div>")
                }
                a += ('<div class="enableRemotesImg" id="enableRemoteImg' + d + '" remoteposition="' + (d + 1) + '" enable="' + ksenia.dom.remotes.remotes[0].remote[d].enable[0].Text + '"><img src="' + ksenia.settings.remotePrefix + 'img/enableRemotes.png" width="32px" height="32px"/></div>');
                a += ("</div>");
                b++
            }
        }
        c.append(a);
        for (d = 0; d < ksenia.dom.remotes.remotes[0].remote.length; d++) {
            if (b >= 1) {
                $(("#enableRemoteImg" + d)).click(function () {
                    ksenia.controller.enableRemoteCmd($(this).attr("remoteposition"), $(this).attr("enable"))
                })
            } else {
                $(("#enableRemoteImg" + d)).remove()
            }
        }
        c.css("height", b * 50);
        ksenia.dom.remotes = null;
        ksenia.dom.setHeaderNamePage("lang.remotesPage")
    },
    buildTimedStatesPage: function () {
        var a = $("div#kseniaPanel").data("jsp").getContentPane();
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildTimedStatesPage")
        }
        var d = "";
        var c = 0;
        for (var b = 0; b < ksenia.dom.timedStates.timedStates[0].timedState.length; b++) {
            if (ksenia.dom.timedStates.timedStates[0].timedState[b].enable[0].Text == "FALSE") {
                d += ('<div id="tagRow" >\n                                <div id="tagType" style="background-color:' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                                <div id="tagDescription"')
            } else {
                d += ('<div id="tagRow" >\n                                <div id="tagType" style="background-color:' + ksenia.util.getCodesTypeColor(ksenia.dom.timedStates.timedStates[0].timedState[b].enable[0].Text) + '"></div>\n                                <div id="tagDescription"')
            }
            if (ksenia.dom.timedStates.timedStates[0].timedState[b].enable[0].Text == "FALSE") {
                d += ('style="font-style:oblique;color:#ccc;"')
            }
            if ((ksenia.dom.timedStates.timedStates[0].timedState[b].description[0].Text != null) && (ksenia.dom.timedStates.timedStates[0].timedState[b].description[0].Text != undefined) && (ksenia.dom.timedStates.timedStates[0].timedState[b].description[0].Text != "")) {
                d += ("><b>" + ksenia.dom.timedStates.timedStates[0].timedState[b].description[0].Text + "</b></div>")
            } else {
                d += ("><b>" + ksenia.util.getStringValue("lang.TimedStateWithNoDescription") + " " + (b + 1) + "</b></div>")
            }
            d += ('<div class="enableTagsImg" id="enableTimedStateImg' + b + '" timedstateposition="' + (b + 1) + '" enable="' + ksenia.dom.timedStates.timedStates[0].timedState[b].enable[0].Text + '"><img src="' + ksenia.settings.remotePrefix + 'img/enableTags.png" width="32px" height="32px"/></div>');
            d += ("</div>");
            c++
        }
        a.append(d);
        for (b = 0; b < ksenia.dom.timedStates.timedStates[0].timedState.length; b++) {
            $(("#enableTimedStateImg" + b)).click(function () {
                ksenia.controller.enableTimedStateCmd($(this).attr("timedstateposition"), $(this).attr("enable"))
            })
        }
        a.css("height", c * 50);
        ksenia.dom.setHeaderNamePage("lang.timedStatesPage")
    },
    helpLogPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpLogPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getLogEventTypecolor(2) + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpLogInfo") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getLogEventTypecolor(3) + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpLogWarning") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getLogEventTypecolor(4) + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpLogError") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 220);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 62);
        a.animate({width: "80", opacity: 0.9}, 300)
    },
    helpZonesPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpZonesPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color:' + ksenia.util.getZoneStatusColor("NORMAL", "UN_BYPASS") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpZoneNormal") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getZoneStatusColor("ALARM", "UN_BYPASS") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpZoneAllarm") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getZoneStatusColor("TAMPER", "UN_BYPASS") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpZoneTamper") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getZoneStatusColor("MASK", "UN_BYPASS") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpZoneMask") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getZoneStatusColor("ANALOG_BAND_1", "UN_BYPASS") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpZoneAnalog") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getZoneStatusColor("NOT_USED", "BYPASS") + '"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpZoneByPass") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" ><s>' + ksenia.util.getStringValue("lang.helpZoneLost") + '</s></div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpZoneAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 140);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 142);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpOutputsPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpOutputsPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color:' + ksenia.util.getOutputStatusColor("ON") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpOutputOn") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getOutputStatusColor("OFF") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpOutputOff") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color:transparent"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpOutputType") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription"><s>' + ksenia.util.getStringValue("lang.helpOutputLost") + '</s></div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpOutputAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 180);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 102);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpPartitionsPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpPartitionsPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color:' + ksenia.util.getPartitionsStatusColor("DISARMED") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionDisarmed") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getPartitionsStatusColor("ARMED") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionArmed") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getPartitionsStatusColor("ARMED_IMMEDIATE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionArmedImmediate") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.util.getPartitionsStatusIcon("EXIT") + '" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionExit") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.util.getPartitionsStatusIcon("PREALARM") + '" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionPrealarm") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.util.getPartitionsStatusIcon("ALARM") + '" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionAlarm") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.util.getPartitionsStatusIcon("TAMPER") + '" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpPartitionTamper") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpPartitionAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 148);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 137);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpScenariosPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpScenariosPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpScenariosAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 260);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 25);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpMapsPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpMapsPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpMapsAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 260);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 25);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpSettingsPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpMapsPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpSettingsAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 260);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 25);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpSchedulerPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpSchedulerPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color:' + ksenia.util.getSchedulerStatusColor("TRUE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpSchedulerOn") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getSchedulerStatusColor("FALSE") + '"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpSchedulerOff") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"></div>\n                            <div class="helpDescription" >' + ksenia.util.getStringValue("lang.helpSchedulerAction") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 220);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 62);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpCodesPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpCodesPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color:' + ksenia.util.getCodesTypeColor("TRUE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpCodesMaster") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("FALSE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpCodesNormal") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("FALSE_TIMED") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpCodesDisabledTimed") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpCodesDisabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.settings.remotePrefix + 'img/enablePins.png" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpCodesEnable") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.settings.remotePrefix + 'img/changePins.png" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpCodesModify") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 190);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 102);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpTagsPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpTagsPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("TRUE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpTagsEnabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpTagsDisabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("FALSE_TIMED") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpTagsDisabledTimed") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.settings.remotePrefix + 'img/enableTags.png" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpTagsEnable") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 230);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 68);
        a.animate({width: "150", opacity: 0.9}, 300)
    },
    helpRemotesPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpRemotesPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("TRUE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpRemotesEnabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpRemotesDisabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.settings.remotePrefix + 'img/enableRemotes.png" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpRemotesEnable") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 230);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 53);
        a.animate({width: "155", opacity: 0.9}, 300)
    },
    helpTimedStatesPage: function () {
        var a = $("#kseniaPageEffects");
        a.empty();
        if (ksenia.settings.debug.showBuildPageMessageBox == true) {
            alert("BuildHelpRemotesPage")
        }
        var b;
        b = $('  <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("TRUE") + '"></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpTimedStatesEnabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType" style="background-color: ' + ksenia.util.getCodesTypeColor("DISABLE") + '"></div>\n                            <div class="helpDescription" style="font-style:oblique">' + ksenia.util.getStringValue("lang.helpTimedStatesDisabled") + '</div>\n                        </div>\n                        <div id="helpRow">\n                            <div class="helpType"><img src="' + ksenia.settings.remotePrefix + 'img/enableRemotes.png" width="10px" height="10px" /></div>\n                            <div class="helpDescription">' + ksenia.util.getStringValue("lang.helpTimedStatesEnable") + "</div>\n                        </div>");
        a.append(b);
        a.css("opacity", "0.0");
        a.css("top", 230);
        a.css("left", 0);
        a.css("width", 0);
        a.css("height", 53);
        a.animate({width: "155", opacity: 0.9}, 300)
    }
};
ksenia.controller = {
    pageName: "mainPage",
    helpIsActive: false,
    systemTimestamp: 0,
    pinTimestamp: 0,
    pin: 0,
    parentMap: null,
    pinToHandlerScheduler: 0,
    pinToHandlerCodes: 0,
    pinToHandlerTags: 0,
    pinToHandlerRemotes: 0,
    newPin: 0,
    init: function () {
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            var a = new Date();
            ksenia.util.refreshTime(a.getDate(), a.getMonth(), a.getFullYear(), a.getHours(), a.getMinutes(), a.getSeconds());
            a = null;
            ksenia.dom.init();
            ksenia.util.userMsgSet(ksenia.util.getStringValue("lang.userMexKs"))
        } else {
            ksenia.controller.checkFirmwareKoPage();
            if (ksenia.settings.slowDevice == false) {
                ksenia.util.hideLoadingMsg()
            }
        }
    },
    backPage: function () {
        ksenia.util.clearCookies();
        if (ksenia.controller.pageName == "mainPage") {
            ksenia.controller.mainPage()
        } else {
            if (ksenia.controller.pageName == "infoPage") {
                ksenia.controller.mainPage()
            } else {
                if (ksenia.controller.pageName == "burglaryPage") {
                    ksenia.controller.mainPage()
                } else {
                    if (ksenia.controller.pageName == "scenariosPage") {
                        ksenia.controller.mainPage()
                    } else {
                        if (ksenia.controller.pageName == "outputsPage") {
                            ksenia.controller.mainPage()
                        } else {
                            if (ksenia.controller.pageName == "statePage") {
                                ksenia.controller.mainPage()
                            } else {
                                if (ksenia.controller.pageName == "mapsPage") {
                                    if (ksenia.controller.parentMap) {
                                        ksenia.maps.buildMappa(ksenia.controller.parentMap)
                                    } else {
                                        ksenia.controller.mainPage()
                                    }
                                } else {
                                    if (ksenia.controller.pageName == "settingsPage") {
                                        ksenia.controller.mainPage()
                                    } else {
                                        if (ksenia.controller.pageName == "zonesPage") {
                                            ksenia.controller.burglaryPage()
                                        } else {
                                            if (ksenia.controller.pageName == "logPage") {
                                                ksenia.controller.burglaryPage()
                                            } else {
                                                if (ksenia.controller.pageName == "partitionsPage") {
                                                    ksenia.controller.burglaryPage()
                                                } else {
                                                    if (ksenia.controller.pageName == "faultsPage") {
                                                        ksenia.controller.burglaryPage()
                                                    } else {
                                                        if (ksenia.controller.pageName == "usersPage") {
                                                            ksenia.controller.burglaryPage()
                                                        } else {
                                                            if (ksenia.controller.pageName == "schedulerPage") {
                                                                ksenia.controller.burglaryPage()
                                                            } else {
                                                                if (ksenia.controller.pageName == "codesPage") {
                                                                    ksenia.controller.usersPage()
                                                                } else {
                                                                    if (ksenia.controller.pageName == "tagsPage") {
                                                                        ksenia.controller.usersPage()
                                                                    } else {
                                                                        if (ksenia.controller.pageName == "remotesPage") {
                                                                            ksenia.controller.usersPage()
                                                                        } else {
                                                                            if (ksenia.controller.pageName == "timedStatesPage") {
                                                                                ksenia.controller.schedulerPage()
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    reloadPage: function () {
        ksenia.util.clearCookies();
        ksenia.service.ajax.stopRequest();
        if (ksenia.controller.pageName == "mainPage") {
            ksenia.controller.mainPage()
        } else {
            if (ksenia.controller.pageName == "infoPage") {
                ksenia.controller.infoPage()
            } else {
                if (ksenia.controller.pageName == "burglaryPage") {
                    ksenia.controller.burglaryPage()
                } else {
                    if (ksenia.controller.pageName == "scenariosPage") {
                        ksenia.controller.scenariosPage()
                    } else {
                        if (ksenia.controller.pageName == "logPage") {
                            ksenia.controller.logPage()
                        } else {
                            if (ksenia.controller.pageName == "statePage") {
                                ksenia.controller.statePage()
                            } else {
                                if (ksenia.controller.pageName == "mapsPage") {
                                    ksenia.controller.mapsPage()
                                } else {
                                    if (ksenia.controller.pageName == "settingsPage") {
                                        ksenia.controller.settingsPage()
                                    } else {
                                        if (ksenia.controller.pageName == "zonesPage") {
                                            ksenia.controller.zonesPage()
                                        } else {
                                            if (ksenia.controller.pageName == "outputsPage") {
                                                ksenia.controller.outputsPage()
                                            } else {
                                                if (ksenia.controller.pageName == "partitionsPage") {
                                                    ksenia.controller.partitionsPage()
                                                } else {
                                                    if (ksenia.controller.pageName == "faultsPage") {
                                                        ksenia.controller.faultsPage()
                                                    } else {
                                                        if (ksenia.controller.pageName == "usersPage") {
                                                            ksenia.controller.usersPage()
                                                        } else {
                                                            if (ksenia.controller.pageName == "schedulerPage") {
                                                                ksenia.controller.schedulerPage()
                                                            } else {
                                                                if (ksenia.controller.pageName == "codesPage") {
                                                                    ksenia.controller.codesPage()
                                                                } else {
                                                                    if (ksenia.controller.pageName == "tagsPage") {
                                                                        ksenia.controller.tagsPage()
                                                                    } else {
                                                                        if (ksenia.controller.pageName == "remotesPage") {
                                                                            ksenia.controller.remotesPage()
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    messagePage: function (b, a) {
        ksenia.util.clearCookies();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "messagePage";
        ksenia.dom.buildMessagePage(b, a)
    },
    IPCameraPanel: function (b, a) {
        ksenia.util.clearCookies();
        ksenia.maps.stopBackgroundPolling = true;
        ksenia.dom.buildIPCameraPanel(b, a)
    },
    checkFirmwareKoPage: function () {
        ksenia.util.clearCookies();
        ksenia.controller.pageName = "checkFirmwareKoPage";
        ksenia.dom.buildCheckFirmwareKoPage()
    },
    mainPage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "mainPage";
        ksenia.service.getMainData()
    },
    infoPage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "infoPage";
        ksenia.service.getInfoData()
    },
    helpPage: function () {
        ksenia.util.clearCookies();
        if (ksenia.controller.helpIsActive == false) {
            ksenia.controller.helpIsActive = true;
            if (ksenia.controller.pageName == "logPage") {
                ksenia.dom.helpLogPage()
            } else {
                if (ksenia.controller.pageName == "zonesPage") {
                    ksenia.dom.helpZonesPage()
                } else {
                    if (ksenia.controller.pageName == "outputsPage") {
                        ksenia.dom.helpOutputsPage()
                    } else {
                        if (ksenia.controller.pageName == "partitionsPage") {
                            ksenia.dom.helpPartitionsPage()
                        } else {
                            if (ksenia.controller.pageName == "scenariosPage") {
                                ksenia.dom.helpScenariosPage()
                            } else {
                                if (ksenia.controller.pageName == "mapsPage") {
                                    ksenia.dom.helpMapsPage()
                                } else {
                                    if (ksenia.controller.pageName == "settingsPage") {
                                        ksenia.dom.helpSettingsPage()
                                    } else {
                                        if (ksenia.controller.pageName == "schedulerPage") {
                                            ksenia.dom.helpSchedulerPage()
                                        } else {
                                            if (ksenia.controller.pageName == "codesPage") {
                                                ksenia.dom.helpCodesPage()
                                            } else {
                                                if (ksenia.controller.pageName == "tagsPage") {
                                                    ksenia.dom.helpTagsPage()
                                                } else {
                                                    if (ksenia.controller.pageName == "remotesPage") {
                                                        ksenia.dom.helpRemotesPage()
                                                    } else {
                                                        if (ksenia.controller.pageName == "timedStatesPage") {
                                                            ksenia.dom.helpTimedStatesPage()
                                                        } else {
                                                            ksenia.controller.helpIsActive = false
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            $("#kseniaPageEffects").animate({width: "0", opacity: 0}, 300).empty();
            ksenia.controller.helpIsActive = false
        }
    },
    checkHelpPage: function () {
        ksenia.util.clearCookies();
        if (ksenia.controller.helpIsActive == true) {
            $("#kseniaPageEffects").animate({width: "0", height: "0", opacity: 0}, 0).empty();
            ksenia.controller.helpIsActive = false
        }
    },
    burglaryPage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "burglaryPage";
        ksenia.dom.buildBurglaryPage();
        ksenia.util.hideHelpIcon()
    },
    scenariosPage: function (a) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildLoadingDataInProgressPage()
            }
        } else {
            ksenia.dom.buildLoadingDataInProgressPage()
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "scenariosPage";
        ksenia.service.getScenariosDescriptionData()
    },
    logPage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "logPage";
        ksenia.service.getLogData()
    },
    statePage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "statePage";
        ksenia.service.getStateFaultsData()
    },
    mapsPage: function (a) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildLoadingDataInProgressPage()
            }
        } else {
            ksenia.dom.buildLoadingDataInProgressPage()
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "mapsPage";
        ksenia.service.getMapsData()
    },
    settingsPage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "settingsPage";
        ksenia.dom.buildSettingsPage();
        ksenia.util.showHelpIcon()
    },
    ergoPage: function (g, f, c, b, d, a, e) {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "ergoPage";
        ksenia.dom.buildErgoPage(g, f, c, b, d, a, e);
        ksenia.util.hideHelpIcon();
        $("#backPage").hide();
        $("#homePage").hide();
        $("#reloadPage").hide();
        $("#statePage").hide()
    },
    zonesPage: function (a) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildLoadingDataInProgressPage()
            }
        } else {
            ksenia.dom.buildLoadingDataInProgressPage()
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "zonesPage";
        ksenia.service.getZonesDescriptionData()
    },
    outputsPage: function (a) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildLoadingDataInProgressPage()
            }
        } else {
            ksenia.dom.buildLoadingDataInProgressPage()
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "outputsPage";
        ksenia.service.getOutputsDescriptionData()
    },
    partitionsPage: function () {
        ksenia.util.clearCookies();
        ksenia.dom.buildLoadingDataInProgressPage();
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "partitionsPage";
        ksenia.service.getPartitionsDescriptionData()
    },
    faultsPage: function () {
        ksenia.util.clearCookies();
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            ksenia.dom.buildLoadingDataInProgressPage();
            ksenia.controller.checkHelpPage();
            ksenia.controller.pageName = "faultsPage";
            ksenia.service.getFaultsData()
        } else {
            ksenia.controller.checkFirmwareKoPage()
        }
    },
    usersPage: function () {
        ksenia.util.clearCookies();
        if (ksenia.util.checkFirmwareVersionisOk(productHighRevision, productLowRevision, productBuildRevision) == true) {
            ksenia.dom.buildLoadingDataInProgressPage();
            ksenia.controller.checkHelpPage();
            ksenia.controller.pageName = "usersPage";
            ksenia.dom.buildUsersPage();
            ksenia.util.hideHelpIcon()
        } else {
            ksenia.controller.checkFirmwareKoPage()
        }
    },
    schedulerPage: function (a, c) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildCheckingPinInProgressPage()
            }
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "schedulerPage";
        var b = "";
        if ((c != "") && (c != undefined) && (c != null)) {
            b = "cmd=getScheduler&pin=" + c
        } else {
            ksenia.controller.getPinToHandlerScheduler();
            b = "cmd=getScheduler&pin=" + ksenia.controller.pinToHandlerScheduler
        }
        ksenia.service.getSchedulerData(b)
    },
    codesPage: function (a, c) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildCheckingPinInProgressPage()
            }
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "codesPage";
        var b = "";
        if ((c != "") && (c != undefined) && (c != null)) {
            b = "cmd=getCodes&pin=" + c
        } else {
            ksenia.controller.getPinToHandlerCodes();
            b = "cmd=getCodes&pin=" + ksenia.controller.pinToHandlerCodes
        }
        ksenia.service.getCodesData(b)
    },
    tagsPage: function (a, c) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildCheckingPinInProgressPage()
            }
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "tagsPage";
        var b = "";
        if ((c != "") && (c != undefined) && (c != null)) {
            b = "cmd=getTags&pin=" + c
        } else {
            ksenia.controller.getPinToHandlerTags();
            b = "cmd=getTags&pin=" + ksenia.controller.pinToHandlerTags
        }
        ksenia.service.getTagsData(b)
    },
    timedStatesPage: function (a, c) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildCheckingPinInProgressPage()
            }
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "timedStatesPage";
        var b = "";
        if ((c != "") && (c != undefined) && (c != null)) {
            b = "cmd=getTimedStates&pin=" + c
        } else {
            ksenia.controller.getPinToHandlerTimedStates();
            b = "cmd=getTimedStates&pin=" + ksenia.controller.pinToHandlerTimedStates
        }
        ksenia.service.getTimedStatesData(b)
    },
    remotesPage: function (a, c) {
        ksenia.util.clearCookies();
        if ((a != null) && (a != undefined)) {
            if (a == true) {
                ksenia.dom.buildCheckingPinInProgressPage()
            }
        }
        ksenia.controller.checkHelpPage();
        ksenia.controller.pageName = "remotesPage";
        var b = "";
        if ((c != "") && (c != undefined) && (c != null)) {
            b = "cmd=getRemotes&pin=" + c
        } else {
            ksenia.controller.getPinToHandlerRemotes();
            b = "cmd=getRemotes&pin=" + ksenia.controller.pinToHandlerRemotes
        }
        ksenia.service.getRemotesData(b)
    },
    outputsCmd: function () {
        ksenia.controller.getPin();
        ksenia.controller.outputsPage()
    },
    getPin: function () {
        if (ksenia.dom.basisInfo.askPIN[0].Text == "0") {
            ksenia.controller.pin = ksenia.dom.basisInfo.PINToUse[0].Text;
            ksenia.controller.pinTimestamp = ksenia.controller.systemTimestamp;
            return
        }
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.pin = a;
                ksenia.controller.pinTimestamp = ksenia.controller.systemTimestamp
            } else {
                ksenia.controller.pin = "000000";
                ksenia.controller.pinTimestamp = 0
            }
        } else {
            ksenia.controller.pin = "000000";
            ksenia.controller.pinTimestamp = 0
        }
    },
    getPinToHandlerScheduler: function () {
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.pinToHandlerScheduler = a
            } else {
                ksenia.controller.pinToHandlerScheduler = "000000"
            }
        } else {
            ksenia.controller.pinToHandlerScheduler = "000000"
        }
    },
    getPinToHandlerCodes: function () {
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.pinToHandlerCodes = a
            } else {
                ksenia.controller.pinToHandlerCodes = "000000"
            }
        } else {
            ksenia.controller.pinToHandlerCodes = "000000"
        }
    },
    getPinToHandlerTags: function () {
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.pinToHandlerTags = a
            } else {
                ksenia.controller.pinToHandlerTags = "000000"
            }
        } else {
            ksenia.controller.pinToHandlerTags = "000000"
        }
    },
    getPinToHandlerRemotes: function () {
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.pinToHandlerRemotes = a
            } else {
                ksenia.controller.pinToHandlerRemotes = "000000"
            }
        } else {
            ksenia.controller.pinToHandlerRemotes = "000000"
        }
    },
    getPinToHandlerTimedStates: function () {
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.pinToHandlerTimedStates = a
            } else {
                ksenia.controller.pinToHandlerTimedStates = "000000"
            }
        } else {
            ksenia.controller.pinToHandlerTimedStates = "000000"
        }
    },
    getNewPin: function () {
        var a = ksenia.ergoHandler.getData();
        if ((a != "") && (a != undefined) && (a != null)) {
            if ((a.length == 6) && (a != "000000")) {
                ksenia.controller.newPin = a
            } else {
                ksenia.controller.newPin = "000000"
            }
        } else {
            ksenia.controller.newPin = "000000"
        }
    },
    pinIsAvailable: function () {
        var a = false;
        if (ksenia.dom.basisInfo.askPIN[0].Text == "0") {
            ksenia.controller.pin = ksenia.dom.basisInfo.PINToUse[0].Text;
            a = true;
            return a
        }
        if (ksenia.controller.pin.length == 6) {
            if ((ksenia.controller.pin != null) && (ksenia.controller.pin != "000000")) {
                if (ksenia.controller.pinTimestamp != 0) {
                    if (ksenia.controller.systemTimestamp - ksenia.controller.pinTimestamp <= (ksenia.settings.timeout.pinTo * 1000)) {
                        a = true;
                        ksenia.controller.pinTimestamp = ksenia.controller.systemTimestamp
                    }
                }
            }
        }
        return a
    },
    setPinNotAvailable: function () {
        if (ksenia.dom.basisInfo.askPIN[0].Text == "0") {
            ksenia.controller.pin = ksenia.dom.basisInfo.PINToUse[0].Text
        } else {
            ksenia.controller.pin = "000000"
        }
        ksenia.controller.pinTimestamp = 0
    },
    setByPassZoneCmd: function (a, b, d) {
        ksenia.dom.buildCmdInProgressPage();
        ksenia.controller.getPin();
        var c = "cmd=setByPassZone&pin=" + ksenia.controller.pin + "&zoneId=" + a + "&zoneValue=";
        if (d == "BYPASS") {
            c += "0"
        } else {
            c += "1"
        }
        c += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
        ksenia.service.setByPassZoneCmd(c)
    },
    setOutputCmd: function (b, a, d) {
        ksenia.dom.buildCmdInProgressPage();
        ksenia.controller.getPin();
        var c = "cmd=setOutput&pin=" + ksenia.controller.pin + "&outputId=" + b + "&outputValue=";
        if (a == "ON") {
            c += "0"
        } else {
            if (a == "OFF") {
                c += "255"
            } else {
                c += a
            }
        }
        c += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
        ksenia.service.setOutputCmd(c)
    },
    setMapCmd: function () {
        ksenia.dom.buildCmdInProgressPage();
        ksenia.controller.getPin();
        ksenia.maps.executeMapCommand()
    },
    setMacroCmd: function (a) {
        ksenia.dom.buildCmdInProgressPage();
        ksenia.controller.getPin();
        var b = "cmd=setMacro&pin=" + ksenia.controller.pin + "&macroId=" + a;
        b += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
        ksenia.service.setMacroCmd(b)
    },
    setArmPartitionCmd: function (b, c) {
        ksenia.dom.buildCmdInProgressPage();
        ksenia.controller.getPin();
        var a = "cmd=setArmPartition&pin=" + ksenia.controller.pin + "&partitionId=" + b + "&partitionValue=" + c;
        a += "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
        ksenia.service.setArmPartitionCmd(a)
    },
    analogOutputTimer: function () {
        currentTime = new Date().getTime();
        action = null;
        if (ksenia.util.getAsArray(ksenia.dom.analogCommands).length > 0) {
            for (var a = 0; a < ksenia.dom.analogCommands.length; a++) {
                listElement = ksenia.dom.analogCommands[a];
                if (listElement.outTimeout < currentTime) {
                    action = listElement
                }
            }
            if (action != null) {
                ksenia.dom.analogCommands = new Array();
                ksenia.dom.workingOnAnalogScrollbars = false;
                askPIN = $(("#output" + action.outIndex)).attr("nopin") == "FALSE";
                if (askPIN) {
                    if (ksenia.controller.pinIsAvailable() != true) {
                        ksenia.controller.ergoPage(ksenia.settings.ergoPassword, "inputPin", ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow1"), ksenia.util.getStringValue("lang.ergoEnterPinDisplayRow2"), new Array("key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key0", "keyA", "keyB", "ergoTouchEsc"), "ksenia.controller.setOutputCmd(" + action.outIndex + ',"' + action.outValue + '",null)', "ksenia.controller.outputsPage()")
                    } else {
                        ksenia.controller.setOutputCmd(action.outIndex, action.outValue, null)
                    }
                } else {
                    ksenia.controller.pin = ksenia.dom.basisInfo.PINToUse[0].Text;
                    ksenia.ergoHandler.runtimeData.buffer = ksenia.controller.pin;
                    ksenia.controller.setOutputCmd(action.outIndex, action.outValue, null);
                    ksenia.controller.setPinNotAvailable()
                }
            } else {
                setTimeout("ksenia.controller.analogOutputTimer()", 500)
            }
        }
    },
    enablePinCmd: function (c, b) {
        var a = "";
        if (b == "FALSE") {
            a = a + "cmd=enablePin&pin=" + ksenia.controller.pinToHandlerCodes + "&pinPosition=" + c + "&enable=TRUE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        } else {
            a = a + "cmd=enablePin&pin=" + ksenia.controller.pinToHandlerCodes + "&pinPosition=" + c + "&enable=FALSE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        }
        ksenia.service.enablePinCmd(a)
    },
    changePinCmd: function (b, c) {
        var a = "";
        ksenia.controller.getNewPin();
        a = a + "cmd=changePin&pin=" + b + "&pinPosition=" + c + "&newPin=" + ksenia.controller.newPin + "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
        ksenia.service.changePinCmd(a)
    },
    changeMyPinCmd: function (b, c) {
        var a = "";
        ksenia.controller.getNewPin();
        a = a + "cmd=changePin&pin=" + b + "&pinPosition=" + c + "&newPin=" + ksenia.controller.newPin + "&redirectPage=/" + ksenia.settings.cmdErrorFileName;
        ksenia.service.changeMyPinCmd(a)
    },
    enableTagCmd: function (c, b) {
        var a = "";
        if (b == "FALSE") {
            a = a + "cmd=enableTag&pin=" + ksenia.controller.pinToHandlerTags + "&tagPosition=" + c + "&enable=TRUE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        } else {
            a = a + "cmd=enableTag&pin=" + ksenia.controller.pinToHandlerTags + "&tagPosition=" + c + "&enable=FALSE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        }
        ksenia.service.enableTagCmd(a)
    },
    enableRemoteCmd: function (a, c) {
        var b = "";
        if (c == "FALSE") {
            b = b + "cmd=enableRemote&pin=" + ksenia.controller.pinToHandlerRemotes + "&remotePosition=" + a + "&enable=TRUE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        } else {
            b = b + "cmd=enableRemote&pin=" + ksenia.controller.pinToHandlerRemotes + "&remotePosition=" + a + "&enable=FALSE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        }
        ksenia.service.enableRemoteCmd(b)
    },
    enableSchedulerCmd: function (c, b) {
        var a = "";
        if (b == "FALSE") {
            a = a + "cmd=enableScheduler&pin=" + ksenia.controller.pinToHandlerScheduler + "&schedulerOption=" + c + "&enable=TRUE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        } else {
            a = a + "cmd=enableScheduler&pin=" + ksenia.controller.pinToHandlerScheduler + "&schedulerOption=" + c + "&enable=FALSE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        }
        ksenia.service.enableSchedulerCmd(a)
    },
    enableTimedStateCmd: function (c, b) {
        var a = "";
        if (b == "FALSE") {
            a = a + "cmd=enableTimedState&pin=" + ksenia.controller.pinToHandlerTimedStates + "&timedState=" + c + "&enable=TRUE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        } else {
            a = a + "cmd=enableTimedState&pin=" + ksenia.controller.pinToHandlerTimedStates + "&timedState=" + c + "&enable=FALSE&redirectPage=/" + ksenia.settings.cmdErrorFileName
        }
        ksenia.service.enableTimedStateCmd(a)
    }
};
ksenia.ergoHandler = {
    runtimeData: {
        state: "unknown",
        buffer: "",
        bufferLen: 0,
        enableKey: null,
        nextAction: null,
        backAction: null,
        pwdType: "normal"
    }, reset: function () {
        ksenia.ergoHandler.runtimeData.state = "unknown";
        ksenia.ergoHandler.runtimeData.buffer = "";
        ksenia.ergoHandler.runtimeData.bufferLen = 0;
        ksenia.ergoHandler.runtimeData.enableKey = null;
        ksenia.ergoHandler.runtimeData.nextAction = null;
        ksenia.ergoHandler.runtimeData.backAction = null;
        ksenia.ergoHandler.runtimeData.pwdType = "normal"
    }, setState: function (a) {
        ksenia.ergoHandler.runtimeData.state = a
    }, setPwdType: function (a) {
        if (a == "likeAndroid") {
            ksenia.ergoHandler.runtimeData.pwdType = a
        } else {
            ksenia.ergoHandler.runtimeData.pwdType = "normal"
        }
    }, getData: function () {
        return ksenia.ergoHandler.runtimeData.buffer
    }, clearDisplay: function () {
        $("#ergoRow1").val("");
        $("#ergoRow2").val("")
    }, setStringDisplayRow1: function (a) {
        if (a.length > 16) {
            a = a.substr(0, 16)
        }
        $("#ergoRow1").val(a)
    }, appendStringDisplayRow1: function (a) {
        var b = $("#ergoRow1").val();
        b = b + a;
        if (b.length > 16) {
            b = b.substr(0, 16)
        }
        $("#ergoRow1").val(b)
    }, clearDisplayRow1: function () {
        $("#ergoRow1").val("")
    }, setStringDisplayRow2: function (a) {
        if (a.length > 16) {
            a = a.substr(0, 16)
        }
        $("#ergoRow2").val(a)
    }, appendStringDisplayRow2: function (a) {
        var b = $("#ergoRow2").val();
        b = b + a;
        if (b.length > 16) {
            b = b.substr(0, 16)
        }
        $("#ergoRow2").val(b)
    }, clearDisplayRow2: function () {
        $("#ergoRow2").val("")
    }, enableTouch: function (b) {
        ksenia.ergoHandler.runtimeData.enableKey = new Array();
        ksenia.ergoHandler.runtimeData.enableKey.key1 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key2 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key3 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key4 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key5 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key6 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key7 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key8 = false;
        ksenia.ergoHandler.runtimeData.enableKey.key9 = false;
        ksenia.ergoHandler.runtimeData.enableKey.keyA = false;
        ksenia.ergoHandler.runtimeData.enableKey.key0 = false;
        ksenia.ergoHandler.runtimeData.enableKey.keyB = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll1 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll2 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll3 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll4 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll5 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll6 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll7 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll8 = false;
        ksenia.ergoHandler.runtimeData.enableKey.roll9 = false;
        ksenia.ergoHandler.runtimeData.enableKey.ergoTouchEsc = false;
        for (var a = 0; a < b.length; a++) {
            $("#" + b[a]).css("cursor", "pointer");
            ksenia.ergoHandler.runtimeData.enableKey[b[a]] = true
        }
    }, keyPressed: function (c) {
        if (ksenia.ergoHandler.runtimeData.enableKey[c] == true) {
            switch (ksenia.ergoHandler.runtimeData.state) {
                case"inputPin":
                    var b = ksenia.ergoHandler.getKeyPressedString(c);
                    if ((b != "A") && (b != "B")) {
                        if (ksenia.ergoHandler.runtimeData.bufferLen < 5) {
                            ksenia.ergoHandler.runtimeData.buffer += b;
                            ksenia.ergoHandler.runtimeData.bufferLen++;
                            ksenia.ergoHandler.clearDisplayRow2();
                            var a;
                            if (ksenia.ergoHandler.runtimeData.pwdType == "likeAndroid") {
                                for (a = 1; a < ksenia.ergoHandler.runtimeData.bufferLen; a++) {
                                    ksenia.ergoHandler.appendStringDisplayRow2("*")
                                }
                                ksenia.ergoHandler.appendStringDisplayRow2(b)
                            } else {
                                for (a = 0; a < ksenia.ergoHandler.runtimeData.bufferLen; a++) {
                                    ksenia.ergoHandler.appendStringDisplayRow2("*")
                                }
                            }
                            for (a = ksenia.ergoHandler.runtimeData.bufferLen; a < 6; a++) {
                                ksenia.ergoHandler.appendStringDisplayRow2("-")
                            }
                        } else {
                            ksenia.ergoHandler.runtimeData.buffer += b;
                            ksenia.ergoHandler.runtimeData.bufferLen++;
                            ksenia.ergoHandler.setStringDisplayRow2("******");
                            ksenia.ergoHandler.executeNextAction()
                        }
                    } else {
                        if (b == "A") {
                            if (ksenia.ergoHandler.runtimeData.bufferLen > 0) {
                                if (ksenia.ergoHandler.runtimeData.bufferLen == 1) {
                                    ksenia.ergoHandler.setStringDisplayRow2("------");
                                    ksenia.ergoHandler.runtimeData.buffer = "";
                                    ksenia.ergoHandler.runtimeData.bufferLen = 0
                                } else {
                                    ksenia.ergoHandler.runtimeData.buffer = ksenia.ergoHandler.runtimeData.buffer.substr(0, (ksenia.ergoHandler.runtimeData.bufferLen - 1));
                                    ksenia.ergoHandler.runtimeData.bufferLen--;
                                    ksenia.ergoHandler.clearDisplayRow2();
                                    var a;
                                    if (ksenia.ergoHandler.runtimeData.pwdType == "likeAndroid") {
                                        for (a = 1; a < ksenia.ergoHandler.runtimeData.bufferLen; a++) {
                                            ksenia.ergoHandler.appendStringDisplayRow2("*")
                                        }
                                        ksenia.ergoHandler.appendStringDisplayRow2(ksenia.ergoHandler.runtimeData.buffer.substring((ksenia.ergoHandler.runtimeData.bufferLen - 1), ksenia.ergoHandler.runtimeData.bufferLen))
                                    } else {
                                        for (a = 0; a < ksenia.ergoHandler.runtimeData.bufferLen; a++) {
                                            ksenia.ergoHandler.appendStringDisplayRow2("*")
                                        }
                                    }
                                    for (a = ksenia.ergoHandler.runtimeData.bufferLen; a < 6; a++) {
                                        ksenia.ergoHandler.appendStringDisplayRow2("-")
                                    }
                                }
                            }
                        } else {
                            if (b == "B") {
                                if (ksenia.ergoHandler.runtimeData.bufferLen > 0) {
                                    ksenia.ergoHandler.setStringDisplayRow2("------");
                                    ksenia.ergoHandler.runtimeData.buffer = "";
                                    ksenia.ergoHandler.runtimeData.bufferLen = 0
                                }
                            }
                        }
                    }
                    break;
                case"unknown":
                default:
                    break
            }
        } else {
        }
    }, rollPressed: function (a) {
        if (ksenia.ergoHandler.runtimeData.enableKey[a] == true) {
            switch (ksenia.ergoHandler.runtimeData.state) {
                case"inputPin":
                case"unknown":
                default:
                    break
            }
        } else {
        }
    }, escPressed: function () {
        if (ksenia.ergoHandler.runtimeData.enableKey.ergoTouchEsc == true) {
            switch (ksenia.ergoHandler.runtimeData.state) {
                case"inputPin":
                case"unknown":
                default:
                    ksenia.ergoHandler.runtimeData.buffer = "";
                    ksenia.ergoHandler.runtimeData.bufferLen = 0;
                    ksenia.ergoHandler.executeBackAction();
                    break
            }
        } else {
        }
    }, setNextAction: function (a) {
        ksenia.ergoHandler.runtimeData.nextAction = a
    }, setBackAction: function (a) {
        ksenia.ergoHandler.runtimeData.backAction = a
    }, executeNextAction: function () {
        $("#backPage").show();
        $("#homePage").show();
        $("#reloadPage").show();
        $("#statePage").show();
        if ((ksenia.ergoHandler.runtimeData.nextAction != null) && (ksenia.ergoHandler.runtimeData.nextAction != undefined) && (ksenia.ergoHandler.runtimeData.nextAction != "")) {
            eval(ksenia.ergoHandler.runtimeData.nextAction)
        }
    }, executeBackAction: function () {
        $("#backPage").show();
        $("#homePage").show();
        $("#reloadPage").show();
        $("#statePage").show();
        if ((ksenia.ergoHandler.runtimeData.backAction != null) && (ksenia.ergoHandler.runtimeData.backAction != undefined) && (ksenia.ergoHandler.runtimeData.backAction != "")) {
            eval(ksenia.ergoHandler.runtimeData.backAction)
        }
    }, getKeyPressedString: function (b) {
        var a = "";
        switch (b) {
            case"key1":
                a = "1";
                break;
            case"key2":
                a = "2";
                break;
            case"key3":
                a = "3";
                break;
            case"key4":
                a = "4";
                break;
            case"key5":
                a = "5";
                break;
            case"key6":
                a = "6";
                break;
            case"key7":
                a = "7";
                break;
            case"key8":
                a = "8";
                break;
            case"key9":
                a = "9";
                break;
            case"keyA":
                a = "A";
                break;
            case"key0":
                a = "0";
                break;
            case"keyB":
                a = "B";
                break;
            case"roll1":
                a = "1";
                break;
            case"roll2":
                a = "2";
                break;
            case"roll3":
                a = "3";
                break;
            case"roll4":
                a = "4";
                break;
            case"roll5":
                a = "5";
                break;
            case"roll6":
                a = "6";
                break;
            case"roll7":
                a = "7";
                break;
            case"roll8":
                a = "8";
                break;
            case"roll9":
                a = "9";
                break
        }
        return a
    }
};
ksenia.service = {
    imagesArray: null,
    updateSettings: {
        logPage: 2000,
        faultsPage: 1000,
        zonesPage: 1000,
        outputsPage: 1000,
        partitionsPage: 1000,
        mapsPage: 2000
    },
    init: function (a) {
        if ((a != null) && (a != undefined)) {
            ksenia.service.updateSettings.logPage = a.logPage;
            ksenia.service.updateSettings.faultsPage = a.faultsPage;
            ksenia.service.updateSettings.zonesPage = a.zonesPage;
            ksenia.service.updateSettings.outputsPage = a.outputsPage;
            ksenia.service.updateSettings.partitionsPage = a.partitionsPage
        }
        ksenia.service.ajax.init()
    },
    getImageList: function (a) {
        $("#dialogWaitLoading").append('<div id="progressBarMessage"></div><div id="progressBarMessageOver"></div>');
        $("#waitMessage").html(ksenia.util.getStringValue("lang.waitLoading"));
        ksenia.service.ajax.getData(a, null, function () {
            ksenia.service.callBacks.getImageListCallBack(this)
        })
    },
    getMainData: function () {
        ksenia.service.ajax.getData(ksenia.settings.dateTimeLares, null, function () {
            ksenia.service.callBacks.getMainDataCallBack(this)
        })
    },
    getInfoData: function () {
        ksenia.service.ajax.getData(ksenia.settings.generalInfoLares, null, function () {
            ksenia.service.callBacks.getInfoDataCallBack(this)
        })
    },
    getBasisData: function () {
        ksenia.service.ajax.getData(ksenia.settings.basisInfo, null, function () {
            ksenia.service.callBacks.getBasisDataCallBack(this)
        })
    },
    getFaultsData: function () {
        ksenia.service.ajax.getData(ksenia.settings.faultsLares, null, function () {
            ksenia.service.callBacks.getFaultsDataCallBack(this)
        })
    },
    getSchedulerData: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.schedulerLares + ".xml", a, function () {
            ksenia.service.callBacks.getSchedulerDataCallBack(this)
        })
    },
    getCodesData: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.codesLares + ksenia.runtimeData.laresType + ".xml", a, function () {
            ksenia.service.callBacks.getCodesDataCallBack(this)
        })
    },
    getTagsData: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.tagsLares + ksenia.runtimeData.laresType + ".xml", a, function () {
            ksenia.service.callBacks.getTagsDataCallBack(this)
        })
    },
    getRemotesData: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.remotesLares + ksenia.runtimeData.laresType + ".xml", a, function () {
            ksenia.service.callBacks.getRemotesDataCallBack(this)
        })
    },
    getZonesDescriptionData: function () {
        ksenia.service.ajax.getData(ksenia.settings.zonesDescriptionLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getZonesDescriptionDataCallBack(this)
        })
    },
    getZonesStatusData: function () {
        ksenia.service.ajax.getData(ksenia.settings.zonesStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getZonesStatusDataCallBack(this)
        })
    },
    getZonesStatusUpdateData: function () {
        ksenia.service.ajax.getData(ksenia.settings.zonesStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getZonesStatusUpdateDataCallBack(this)
        })
    },
    getOutputsDescriptionData: function () {
        ksenia.service.ajax.getData(ksenia.settings.outputsDescriptionLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getOutputsDescriptionDataCallBack(this)
        })
    },
    getOutputsStatusData: function () {
        ksenia.service.ajax.getData(ksenia.settings.outputsStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getOutputsStatusDataCallBack(this)
        })
    },
    getPartitionsDescriptionData: function () {
        ksenia.service.ajax.getData(ksenia.settings.partitionsDescriptionLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getPartitionsDescriptionDataCallBack(this)
        })
    },
    getPartitionsStatusData: function () {
        ksenia.service.ajax.getData(ksenia.settings.partitionsStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getPartitionsStatusDataCallBack(this)
        })
    },
    getScenariosDescriptionData: function () {
        ksenia.service.ajax.getData(ksenia.settings.scenariosDescriptionLares + ".xml", null, function () {
            ksenia.service.callBacks.getScenariosDescriptionDataCallBack(this)
        })
    },
    getScenariosOptionData: function () {
        ksenia.service.ajax.getData(ksenia.settings.scenariosOptionLares + ".xml", null, function () {
            ksenia.service.callBacks.getScenariosOptionDataCallBack(this)
        })
    },
    getLogData: function () {
        ksenia.service.ajax.getData(ksenia.settings.logDataFileName, null, function () {
            ksenia.service.callBacks.getLogDataCallBack(this)
        })
    },
    getStateFaultsData: function () {
        ksenia.service.ajax.getData(ksenia.settings.faultsLares, null, function () {
            ksenia.service.callBacks.getStateFaultsDataCallBack(this)
        })
    },
    getStateZonesData: function () {
        ksenia.service.ajax.getData(ksenia.settings.zonesStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getStateZonesDataCallBack(this)
        })
    },
    getStatePartitionsDescriptionData: function () {
        ksenia.service.ajax.getData(ksenia.settings.partitionsDescriptionLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getStatePartitionsDescriptionDataCallBack(this)
        })
    },
    getStatePartitionsData: function () {
        ksenia.service.ajax.getData(ksenia.settings.partitionsStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getStatePartitionsDataCallBack(this)
        })
    },
    getStateOutputsData: function () {
        ksenia.service.ajax.getData(ksenia.settings.outputsStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getStateOutputsDataCallBack(this)
        })
    },
    getStateLaresData: function () {
        ksenia.service.ajax.getData(ksenia.settings.stateFileName, null, function () {
            ksenia.service.callBacks.getStateLaresDataCallBack(this)
        })
    },
    getMapsData: function () {
        ksenia.service.ajax.getData(ksenia.settings.mapsFileName, null, function () {
            ksenia.service.callBacks.getMap(this)
        }, {"Content-Type": "application/ksmap+xml;charset=UTF-8"})
    },
    getWebserverConfig: function () {
        ksenia.service.ajax.getData(ksenia.settings.configFileName, null, function () {
            ksenia.service.callBacks.getConfig(this)
        })
    },
    getTimedStatesData: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.timedStatesFileName, a, function () {
            ksenia.service.callBacks.getTimedStatesDataCallBack(this)
        })
    },
    setByPassZoneCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.setByPassZoneCmdCallBack(this)
        })
    },
    setOutputCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.setOutputCmdCallBack(this)
        })
    },
    setMacroCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.setMacroCmdCallBack(this)
        })
    },
    setArmPartitionCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.setArmPartitionCmdCallBack(this)
        })
    },
    setMapCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.setMapCmdCallBack(this)
        })
    },
    enablePinCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.enablePinCmdCallBack(this)
        })
    },
    changePinCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.changePinCmdCallBack(this)
        })
    },
    changeMyPinCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.changeMyPinCmdCallBack(this)
        })
    },
    enableTagCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.enableTagCmdCallBack(this)
        })
    },
    enableRemoteCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.enableRemoteCmdCallBack(this)
        })
    },
    enableSchedulerCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.enableSchedulerCmdCallBack(this)
        })
    },
    enableTimedStateCmd: function (a) {
        ksenia.service.ajax.getData(ksenia.settings.cmdSentFileName, a, function () {
            ksenia.service.callBacks.enableTimedStateCmdCallBack(this)
        })
    },
    getOutputsStatusBackground: function () {
        ksenia.service.ajax.getData(ksenia.settings.outputsStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getOutputsStatusBackgroundCB(this)
        })
    },
    getZonesStatusBackground: function () {
        ksenia.service.ajax.getData(ksenia.settings.zonesStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getZonesStatusBackgroundCB(this)
        })
    },
    getPartitionsStatusBackground: function () {
        ksenia.service.ajax.getData(ksenia.settings.partitionsStatusLares + ksenia.runtimeData.laresType + ".xml", null, function () {
            ksenia.service.callBacks.getPartitionsStatusBackgroundCB(this)
        })
    },
    callBacks: {
        getImageListCallBack: function (d) {
            if (d) {
                var b = $("#progressBarMessage").width();
                var c = 0;
                ksenia.service.imagesArray = new Array();
                for (var a = 0; a < d.image.length; a++) {
                    ksenia.service.imagesArray[a] = d.image[a].Text
                }
                $({}).imageLoader({
                    images: ksenia.service.imagesArray, async: 3, complete: function (h, g) {
                        var f = (g.i + 1);
                        c += ((b / d.image.length) - 1);
                        $("#progressBarMessageOver").css("width", c)
                    }, error: function (h, g) {
                        var f = (g.i + 1);
                        if (ksenia.settings.debug.messageError == true) {
                            alert("errorOnGetImageListCallBack")
                        }
                    }, allcomplete: function (g, f) {
                        if (ksenia.settings.debug.allcompleteImageLoader == true) {
                            alert("allcompleteImageLoader")
                        }
                        $("#progressBarMessageOver").css("width", b);
                        setTimeout("ksenia.controller.init()", ksenia.settings.delayBeforeShowPage);
                        ksenia.service.imagesArray = null
                    }
                })
            }
        }, getMainDataCallBack: function (a) {
            if (ksenia.controller.pageName == "mainPage") {
                ksenia.util.sincroTimeLares(a.timestamp[0].Text);
                ksenia.service.getBasisData()
            }
        }, getBasisDataCallBack: function (a) {
            if (ksenia.controller.pageName == "mainPage") {
                ksenia.dom.basisInfo = a;
                ksenia.settings.timeout.pinTo = parseInt(ksenia.dom.basisInfo.PINTimeout[0].Text);
                if (ksenia.dom.basisInfo.startFromMap[0].Text == "1" && ksenia.dom.firstStart != 0) {
                    ksenia.dom.firstStart = 0;
                    ksenia.controller.mapsPage()
                } else {
                    ksenia.dom.buildMainPage();
                    ksenia.util.hideHelpIcon()
                }
            }
        }, getInfoDataCallBack: function (a) {
            if (ksenia.controller.pageName == "infoPage") {
                ksenia.dom.generalInfo = a;
                ksenia.util.sincroTimeLares(a.timestamp[0].Text);
                ksenia.dom.buildInfoPage();
                ksenia.util.hideHelpIcon()
            }
        }, getFaultsDataCallBack: function (a) {
            if (ksenia.controller.pageName == "faultsPage") {
                ksenia.dom.faults = a;
                ksenia.dom.buildFaultsPage();
                ksenia.util.hideHelpIcon();
                setTimeout("ksenia.service.getFaultsData()", ksenia.service.updateSettings.faultsPage)
            }
        }, getSchedulerDataCallBack: function (a) {
            if (ksenia.controller.pageName == "schedulerPage") {
                if (a.checkPin[0].Text == "OK") {
                    ksenia.dom.schedulers = a;
                    ksenia.dom.buildSchedulerPage();
                    ksenia.util.showHelpIcon()
                } else {
                    if (a.checkPin[0].Text == "NOT_OK") {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.burglaryPage()")
                    } else {
                        alert("Unknown Command Reply!!!")
                    }
                }
            }
        }, getCodesDataCallBack: function (a) {
            if (ksenia.controller.pageName == "codesPage") {
                if (a.checkPin[0].Text == "OK") {
                    ksenia.dom.codes = a;
                    ksenia.dom.buildCodesPage();
                    ksenia.util.showHelpIcon()
                } else {
                    if (a.checkPin[0].Text == "NOT_OK") {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.usersPage()")
                    } else {
                        alert("Unknown Command Reply!!!")
                    }
                }
            }
        }, getTagsDataCallBack: function (a) {
            if (ksenia.controller.pageName == "tagsPage") {
                if (a.checkPin[0].Text == "OK") {
                    ksenia.dom.tags = a;
                    ksenia.dom.buildTagsPage();
                    ksenia.util.showHelpIcon()
                } else {
                    if (a.checkPin[0].Text == "NOT_OK") {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.usersPage()")
                    } else {
                        alert("Unknown Command Reply!!!")
                    }
                }
            }
        }, getTimedStatesDataCallBack: function (a) {
            if (ksenia.controller.pageName == "timedStatesPage") {
                if (a.checkPin[0].Text == "OK") {
                    ksenia.dom.timedStates = a;
                    ksenia.dom.buildTimedStatesPage();
                    ksenia.util.showHelpIcon()
                } else {
                    if (a.checkPin[0].Text == "NOT_OK") {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.schedulerPage()")
                    } else {
                        alert("Unknown Command Reply!!!")
                    }
                }
            }
        }, getRemotesDataCallBack: function (a) {
            if (ksenia.controller.pageName == "remotesPage") {
                if (a.checkPin[0].Text == "OK") {
                    ksenia.dom.remotes = a;
                    ksenia.dom.buildRemotesPage();
                    ksenia.util.showHelpIcon()
                } else {
                    if (a.checkPin[0].Text == "NOT_OK") {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.usersPage()")
                    } else {
                        alert("Unknown Command Reply!!!")
                    }
                }
            }
        }, getZonesDescriptionDataCallBack: function (a) {
            if (ksenia.controller.pageName == "zonesPage") {
                ksenia.dom.zonesDescription = a.zone;
                ksenia.service.getZonesStatusData()
            }
        }, getZonesStatusDataCallBack: function (a) {
            if (ksenia.controller.pageName == "zonesPage") {
                ksenia.dom.zonesStatus = a.zone;
                ksenia.dom.buildZonesPage();
                ksenia.util.showHelpIcon();
                setTimeout("ksenia.service.getZonesStatusData()", ksenia.service.updateSettings.zonesPage)
            }
        }, getZonesStatusUpdateDataCallBack: function (a) {
            if (ksenia.controller.pageName == "zonesPage") {
                ksenia.dom.zonesStatus = a.zone;
                ksenia.dom.buildUpdateZonesPage();
                setTimeout("ksenia.service.getZonesStatusUpdateData()", ksenia.service.updateSettings.zonesPage)
            }
        }, getOutputsDescriptionDataCallBack: function (a) {
            if (ksenia.controller.pageName == "outputsPage") {
                ksenia.dom.outputsDescription = a.output;
                ksenia.service.getOutputsStatusData()
            }
        }, getOutputsStatusDataCallBack: function (a) {
            if (ksenia.controller.pageName == "outputsPage") {
                ksenia.dom.outputsStatus = a.output;
                if (!ksenia.dom.workingOnAnalogScrollbars) {
                    ksenia.dom.buildOutputsPage()
                }
                ksenia.util.showHelpIcon();
                setTimeout("ksenia.service.getOutputsStatusData()", ksenia.service.updateSettings.outputsPage)
            }
        }, getPartitionsDescriptionDataCallBack: function (a) {
            if (ksenia.controller.pageName == "partitionsPage") {
                ksenia.dom.partitionsDescription = a.partition;
                ksenia.service.getPartitionsStatusData()
            }
        }, getPartitionsStatusDataCallBack: function (a) {
            if (ksenia.controller.pageName == "partitionsPage") {
                ksenia.dom.partitionsStatus = a.partition;
                ksenia.dom.buildPartitionsPage();
                ksenia.util.showHelpIcon();
                setTimeout("ksenia.service.getPartitionsStatusData()", ksenia.service.updateSettings.partitionsPage)
            }
        }, getScenariosDescriptionDataCallBack: function (a) {
            if (ksenia.controller.pageName == "scenariosPage") {
                ksenia.dom.scenariosDescription = a.scenario;
                ksenia.service.getScenariosOptionData()
            }
        }, getScenariosOptionDataCallBack: function (a) {
            if (ksenia.controller.pageName == "scenariosPage") {
                ksenia.dom.scenariosOptions = a.scenario;
                ksenia.dom.buildScenariosPage();
                ksenia.util.showHelpIcon()
            }
        }, getLogDataCallBack: function (a) {
            if (ksenia.controller.pageName == "logPage") {
                ksenia.dom.logEvents = a.log;
                ksenia.dom.buildLogPage();
                ksenia.util.showHelpIcon();
                setTimeout("ksenia.service.getLogData()", ksenia.service.updateSettings.logPage)
            }
        }, getStateFaultsDataCallBack: function (a) {
            if (ksenia.controller.pageName == "statePage") {
                ksenia.dom.faults = a;
                ksenia.service.getStateZonesData()
            }
        }, getStateZonesDataCallBack: function (a) {
            if (ksenia.controller.pageName == "statePage") {
                ksenia.dom.zonesStatus = a.zone;
                ksenia.service.getStatePartitionsDescriptionData()
            }
        }, getStatePartitionsDescriptionDataCallBack: function (a) {
            if (ksenia.controller.pageName == "statePage") {
                ksenia.dom.partitionsDescription = a.partition;
                ksenia.service.getStatePartitionsData()
            }
        }, getStatePartitionsDataCallBack: function (a) {
            if (ksenia.controller.pageName == "statePage") {
                ksenia.dom.partitionsStatus = a.partition;
                ksenia.service.getStateOutputsData()
            }
        }, getStateOutputsDataCallBack: function (a) {
            if (ksenia.controller.pageName == "statePage") {
                ksenia.dom.outputsStatus = a.output;
                ksenia.service.getStateLaresData()
            }
        }, getStateLaresDataCallBack: function (a) {
            if (ksenia.controller.pageName == "statePage") {
                ksenia.dom.stateLares = a;
                ksenia.dom.buildStatePage()
            }
        },
        getConfig: function (a) {
            if (ksenia.controller.pageName == "mapsPage") {
                ksenia.dom.config = a;
                $.ajax({
                    url: "http://" + ksenia.dom.config.currentIP[0].Text + ":" + ksenia.dom.config.currentPort[0].Text + "/upload",
                    dataType: "text",
                    timeout: 5000,
                    success: function (b) {
                        if (b.contains('<h1 id="FileNotFound">Lares WebServer File Not Found</h1>')) {
                            ksenia.maps.localConnection = false
                        } else {
                            ksenia.maps.localConnection = true
                        }
                    },
                    error: function (b) {
                        ksenia.maps.localConnection = false
                    }
                });
                ksenia.service.getZonesStatusBackground()
            }
        }, getMap: function (a) {
            if (ksenia.maps.stopBackgroundPolling) {
                return
            }
            if (ksenia.controller.pageName == "mapsPage") {
                ksenia.dom.maps = a;
                ksenia.dom.buildMapsPage();
                ksenia.service.getWebserverConfig()
            }
        }, getZonesStatusBackgroundCB: function (a) {
            if (ksenia.maps.stopBackgroundPolling) {
                ksenia.maps.backgroundPollingStopped = true;
                return
            }
            if (ksenia.controller.pageName == "mapsPage") {
                ksenia.maps.backgroundPollingStopped = false;
                ksenia.maps.zonesStatus = a.zone;
                ksenia.maps.updateZonesOnCurrentPage();
                setTimeout("ksenia.service.getOutputsStatusBackground()", ksenia.service.updateSettings.mapsPage)
            }
        }, getOutputsStatusBackgroundCB: function (a) {
            if (ksenia.maps.stopBackgroundPolling) {
                ksenia.maps.backgroundPollingStopped = true;
                return
            }
            if (ksenia.controller.pageName == "mapsPage") {
                ksenia.maps.backgroundPollingStopped = false;
                ksenia.maps.outputsStatus = a.output;
                ksenia.maps.updateOutputsOnCurrentPage();
                setTimeout("ksenia.service.getPartitionsStatusBackground()", ksenia.service.updateSettings.mapsPage)
            }
        }, getPartitionsStatusBackgroundCB: function (a) {
            if (ksenia.maps.stopBackgroundPolling) {
                ksenia.maps.backgroundPollingStopped = true;
                return
            }
            if (ksenia.controller.pageName == "mapsPage") {
                ksenia.maps.backgroundPollingStopped = false;
                ksenia.maps.partitionsStatus = a.partition;
                ksenia.maps.updatePartitionsOnCurrentPage();
                setTimeout("ksenia.service.getZonesStatusBackground()", ksenia.service.updateSettings.mapsPage)
            }
        }, setByPassZoneCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.zonesPage(false)
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.zonesPage()")
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, setArmPartitionCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.partitionsPage(false)
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.partitionsPage()")
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, setOutputCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.outputsPage(false)
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.outputsPage()")
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, setMacroCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdActionOk"), "ksenia.controller.scenariosPage(false)")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.controller.scenariosPage()")
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, setMapCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.maps.actionFlags.firstAction = false;
                if (ksenia.maps.actionFlags.lastAction) {
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdActionsOk"), "ksenia.maps.executeMapCommand()")
                } else {
                    ksenia.maps.executeMapCommand()
                }
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.maps.commandList = new Array();
                    if (ksenia.maps.actionFlags.firstAction) {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdWrongPin"), "ksenia.maps.executeMapCommand();")
                    } else {
                        ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdPartialKo"), "ksenia.maps.executeMapCommand();")
                    }
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, enablePinCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.codesPage(false, "" + ksenia.controller.pinToHandlerCodes + "")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.codesPage(true,""+ksenia.controller.pinToHandlerCodes+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, changePinCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.codesPage(true, "" + ksenia.controller.pinToHandlerCodes + "")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.codesPage(true,""+ksenia.controller.pinToHandlerCodes+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, changeMyPinCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.burglaryPage()
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.codesPage(true,""+ksenia.controller.pinToHandlerCodes+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, enableTagCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.tagsPage(false, "" + ksenia.controller.pinToHandlerTags + "")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.tagsPage(true,""+ksenia.controller.pinToHandlerTags+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, enableRemoteCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.remotesPage(false, "" + ksenia.controller.pinToHandlerRemotes + "")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.remotesPage(true,""+ksenia.controller.pinToHandlerRemotes+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, enableSchedulerCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.schedulerPage(false, "" + ksenia.controller.pinToHandlerScheduler + "")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.schedulerPage(true,""+ksenia.controller.pinToHandlerScheduler+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }, enableTimedStateCmdCallBack: function (a) {
            if (a.Text == "cmdSent") {
                ksenia.controller.timedStatesPage(false, "" + ksenia.controller.pinToHandlerTimedStates + "")
            } else {
                if (a.Text == "cmdNotSent") {
                    ksenia.controller.setPinNotAvailable();
                    ksenia.controller.messagePage(ksenia.util.getStringValue("lang.cmdGenericError"), 'ksenia.controller.timedStatesPage(true,""+ksenia.controller.pinToHandlerTimedStates+"")')
                } else {
                    alert("Unknown Command Reply!!!")
                }
            }
        }
    }
};
ksenia.service.ajax = {
    ajaxReqHandler: null, init: function () {
        $.ajaxSetup({
            type: "GET",
            dataType: "xml",
            beforeSend: ksenia.service.ajax.events.onBeforeSendAjax,
            complete: ksenia.service.ajax.events.onCompleteAjax,
            error: ksenia.service.ajax.events.onErrorAjax,
            cache: false
        });
        ksenia.service.ajax.ajaxReqHandler = null
    }, stopRequest: function () {
        if (ksenia.service.ajax.ajaxReqHandler != null) {
            ksenia.service.ajax.ajaxReqHandler.abort();
            ksenia.service.ajax.ajaxReqHandler = null
        }
    }, getData: function (a, d, b, c) {
        $.ajax({
            url: a, data: d, success: function (e) {
                var f = $.xmlToJSON(e);
                if (!f) {
                    alert("Json Object is Null!!!\n")
                } else {
                    b.call(f)
                }
            }, headers: c || {}
        })
    }, events: {
        onBeforeSendAjax: function () {
            for (var a in $.cookie()) {
                $.removeCookie(a)
            }
        }, onCompleteAjax: function () {
        }, onErrorAjax: function (b, a, c) {
        }
    }
};
String.prototype.lpad = function (a, b) {
    var c = this;
    while (c.length < b) {
        c = a + c
    }
    return c
};
ksenia.maps = {
    currentMap: null,
    commandList: null,
    zonesStatus: null,
    partitionsStatus: null,
    outputsStatus: null,
    stopBackgroundPolling: false,
    backgroundPollingStopped: false,
    localConnection: true,
    actionFlags: {firstAction: null, lastAction: null},
    camCounter: 0,
    currentPostfix: "&",
    buildMappa: function (a) {
        ksenia.util.showBackToMapIcon();
        ksenia.maps.currentMap = a;
        ksenia.controller.pageName = "mapsPage";
        ksenia.controller.parentMap = ksenia.maps.getPreviousMapPage(ksenia.dom.maps.maptree[0].map[0], a);
        var b = $("div#kseniaPanel").data("jsp").getContentPane();
        b.empty();
        var f = $("<div id='mapContainer'></div>");
        b.append(f);
        f.css("position", "relative");
        f.css("background-image", "url('" + a.background + "')");
        f.css("background-repeat", "no-repeat");
        f.css("background-size", "contain");
        f.css("background-position", "center");
        f.css("height", 254);
        f.css("width", 480);
        var g = a.map;
        var d = a.symbol;
        if (g) {
            for (var e = 0; e < g.length; e++) {
                ksenia.maps.createMapContainerDiv(g[e], f)
            }
        }
        if (d) {
            for (var c = 0; c < d.length; c++) {
                ksenia.maps.createMapSymbolDiv(d[c], f)
            }
        }
        $("#namePage").html(ksenia.maps.currentMap.name)
    },
    createMapContainerDiv: function (b, a) {
        theDiv = $("<div class='map_container'>" + b.name + "</div>");
        a.append(theDiv);
        theDiv.click(function () {
            ksenia.controller.parentMap = ksenia.maps.currentMap;
            ksenia.maps.buildMappa(b)
        });
        theDiv.hover(function () {
            $(this).addClass("mapHilite")
        }, function () {
            $(this).removeClass("mapHilite")
        });
        theDiv.css("position", "absolute");
        theDiv.css("border", "solid 2px #d00");
        theDiv.css("-webkit-border-radius", "5");
        theDiv.css("-moz-border-radius", "5");
        theDiv.css("text-align", "center");
        theDiv.css("overflow", "hidden");
        theDiv.css("left", parseInt(b.posx));
        theDiv.css("top", parseInt(b.posy));
        theDiv.css("width", b.w);
        theDiv.css("height", b.h);
        theDiv.css("color", "black")
    },
    updateCameraDiv: function (d) {
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
    },
    replaceImage: function (b, c, a) {
        if (b.length > 0) {
            $("div#camLoading").remove();
            setTimeout(function () {
                ksenia.maps.updateCameraDiv(c)
            }, parseInt(c.refresh) * 1000);
            a = null
        }
    },
    createPointPanel: function (d, a) {
        var g = $('<div id="floatingSymbolPanel" class="floatingPanelGenerics"/>'), e = $("div#mapContainer"),
            c = $('<div id="floatingHiddenPane" class="floatingPanelGenerics"/>'), i = $('<div id="floatingImgDiv"/>'),
            h = null, f = null, b = null;
        g.css("left", parseInt(d.posx) + parseInt(10));
        g.css("top", parseInt(d.posy) + parseInt(10));
        g.css("width", 5);
        g.css("height", 5);
        ksenia.util.populateResizedImage(i, $(a).children("img")[0].src);
        g.append(i);
        if ((d.caption != undefined) && d.caption != "") {
            h = $('<div id="floatingButtonDiv" class="floatingPanelGenerics">' + d.caption + "</div>");
            h.click(function () {
                ksenia.maps.executeMapCommand()
            });
            g.append(h)
        } else {
            if (d.caption == undefined) {
                h = $('<div id="floatingButtonDiv" class="floatingPanelGenerics">' + ksenia.util.getStringValue("lang.executeAction") + "</div>");
                h.click(function () {
                    ksenia.maps.executeMapCommand()
                });
                g.append(h)
            }
        }
        if ((d.name != undefined) && d.name != "") {
            f = $('<div id="floatingLabelDiv"><b>' + d.name + "</b></div>");
            g.append(f)
        }
        g.click(function () {
            $("div#floatingSymbolPanel").hide("slow", function () {
                $(this).remove()
            });
            $("div#floatingHiddenPane").remove()
        });
        c.click(function () {
            g.click()
        });
        e.append(c);
        e.append(g);
        g.show().animate({width: "206px", height: "60px", top: "97px", left: "137px"}, 100)
    },
    createMapSymbolDiv: function (f, h) {
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
    },
    parseDisplayKind: function (a) {
        switch (a) {
            case"zone":
                return "Z";
            case"output":
                return "O";
            case"partition":
                return "P";
            default:
                return "X"
        }
    },
    getPreviousMapPage: function (d, b) {
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
    },
    updateOutputsOnCurrentPage: function () {
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
    },
    parseZoneValue: function (a, b, c) {
        if (c == "1") {
            return 5
        }
        if (b == "BYPASS") {
            return 0
        }
        switch (a) {
            case"NORMAL":
                return 1;
            case"ALARM":
                return 3;
            case"TAMPER":
                return 2;
            case"MASK":
                return 4;
            default:
                return -1
        }
    },
    updateZonesOnCurrentPage: function () {
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
    },
    parsePartitionValue: function (a) {
        if (a == "DISARMED") {
            return 0
        } else {
            if (a == "EXIT") {
                return 1
            } else {
                if (a == "ARMED") {
                    return 2
                } else {
                    if (a == "PREALARM") {
                        return 3
                    } else {
                        if (a == "ALARM") {
                            return 4
                        } else {
                            if (a == "ARMED_IMMEDIATE") {
                                return 5
                            } else {
                                if (a == "TAMPER") {
                                    return 6
                                } else {
                                    return -1
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    updatePartitionsOnCurrentPage: function () {
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
    },
    parseCommandType: function (a) {
        switch (a) {
            case"output":
                return 0;
            case"zone":
                return 1;
            case"externallink":
                return 2;
            case"internallink":
                return 3;
            case"scenario":
                return 4;
            case"ipcam":
            case"onvif":
                return 5;
            default:
                return -1
        }
    },
    parseCommandOutputValue: function (d, a) {
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
    },
    parseCommandZoneValue: function (b, c) {
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
    },
    executeMapCommand: function () {
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
                                break;
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
    },
    findMapElement: function (d, b, e) {
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
};