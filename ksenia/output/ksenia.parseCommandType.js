function (a) {
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
}