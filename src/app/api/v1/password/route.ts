import {NextRequest, NextResponse} from "next/server";
import {generatePasswords} from "@/util/functions";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {length, amount} = data;

        if (!length || !amount) {
            return NextResponse.json({error: 'Missing length or amount parameters'}, {status: 400});
        }
        return NextResponse.json(generatePasswords(length, amount));

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            error: "Failed to generate passwords, please try again or contact administrator."
        }, {status: 500});
    }
}