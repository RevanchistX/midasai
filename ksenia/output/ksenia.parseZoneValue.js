function (a, b, c) {
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
}