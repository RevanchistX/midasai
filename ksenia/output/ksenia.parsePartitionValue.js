function (a) {
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
}