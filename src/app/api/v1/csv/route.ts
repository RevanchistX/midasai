import {NextRequest, NextResponse} from "next/server";
import {validateOrigin} from "../../../../../util/functions";
import {stringify} from 'csv-stringify';
import {CSV_CONTENT_DISPOSITION, CSV_CONTENT_TYPE, CSV_HEADERS} from "../../../../../util/constants";

export async function GET(request: NextRequest) {
    if (!validateOrigin(request)) {
        return NextResponse.json({error: "Forbidden"}, {status: 403});
    }
    try {
        const {query: {passwords, delimiter}} = request;
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