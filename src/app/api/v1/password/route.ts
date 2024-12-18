import {NextRequest, NextResponse} from "next/server";
import {Worker} from 'worker_threads';

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const length = searchParams.get('length');
        const amount = searchParams.get('amount');

        if (!length || !amount) {
            return NextResponse.json({error: 'Missing length or amount parameters'}, {status: 400});
        }

        const worker = new Worker(new URL('../../../../../util/worker.js', import.meta.url), {
            workerData: {
                length,
                amount
            }
        });

        return new Promise((resolve) => {
            worker.on('message', (passwords) => {
                resolve(NextResponse.json(passwords));
            });

            worker.on('error', (error) => {
                console.error('Worker error:', error);
                resolve(NextResponse.json({error: 'Failed to generate passwords'}, {status: 500}));
            });
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            error: "Failed to generate passwords, please try again or contact administrator."
        }, {status: 500});
    }
}