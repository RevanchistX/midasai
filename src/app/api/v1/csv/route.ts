import {NextRequest, NextResponse} from "next/server";
import {stringify} from 'csv-stringify';
import {CSV_CONTENT_DISPOSITION, CSV_CONTENT_TYPE, CSV_HEADERS} from "@/util/constants";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {passwords, delimiter} = data;

        const csv = await new Promise((resolve, reject) => {
            stringify(passwords, {
                header: true,
                columns: CSV_HEADERS,
                delimiter: delimiter
            }, (err, output) => {
                if (err) reject(err);
                resolve(output);
            });
        });
        return new NextResponse(csv, {
            headers: {
                'Content-Type': CSV_CONTENT_TYPE,
                'Content-Disposition': CSV_CONTENT_DISPOSITION,
            },
        });
    } catch (error) {
        return NextResponse.json({
            error: "Failed to generate CSV, please try again or contact administrator."
        }, {status: 500});
    }

}