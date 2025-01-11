import {NextRequest, NextResponse} from "next/server";
import {evaluateCallback, generateHashPasswords, generateSetPasswords} from "@/util/functions";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {length, amount, stress} = data;

        if (!length || !amount) {
            return NextResponse.json({error: 'Missing length or amount parameters'}, {status: 400});
        }
        const hashAvg = [];
        const setAvg = [];
        const timeData = [];
        for (let i = 0; i < stress; i++) {
            let hashTime = evaluateCallback(generateHashPasswords, {length, amount});
            let setTime = evaluateCallback(generateSetPasswords, {length, amount});
            hashAvg[i] = hashTime;
            setAvg[i] = setTime;
            timeData[i] = {iteration: i, hash: hashTime, set: setTime};
        }
        const responseData = {
            timeData: timeData, average: {
                hash: {
                    total: hashAvg.reduce((time, a) => time + a, 0),
                    average: (hashAvg.reduce((time, a) => time + a, 0) / hashAvg.length).toFixed(2)
                },
                set: {
                    total: setAvg.reduce((time, a) => time + a, 0),
                    average: (setAvg.reduce((time, a) => time + a, 0) / setAvg.length).toFixed(2)
                }
            }
        }
        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            error: "Failed to generate passwords, please try again or contact administrator."
        }, {status: 500});
    }
}