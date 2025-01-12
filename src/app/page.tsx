"use client";
import axios from "axios";

import React, {useState} from "react";
import PasswordGeneratorForm from "@/components/form";
import PasswordTable from "@/components/table";
import StressTable from "@/components/table-stress";
import Image from "next/image";
import icon from "./favicon.ico"

export default function Home() {
    const [length, setLength] = useState<number>(12);
    const [amount, setAmount] = useState<number>(100000);
    const [passwords, setPasswords] = useState([]);
    const [delimiter, setDelimiter] = useState(",");
    const [csv, setCsv] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [stress, setStress] = useState(15);
    const [stressResult, setStressResult] = useState({});
    const [takeWhile, setTakeWhile] = useState(false);
    const [average, setAverage] = useState({});


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await axios.post("/api/v1/password", {length, amount})
            .then(async (passwordResponse) => {
                const passwordList = passwordResponse.data.map((password, index) => ({
                    entry: index + 1,
                    password: password
                }));
                setPasswords(passwordList);
                await axios.post("/api/v1/csv", {
                    passwords: passwordList,
                    delimiter
                }, {responseType: "blob"})
                    .then((csvResponse) => {
                        setCsv(URL.createObjectURL(csvResponse.data));
                        setLoading(false);
                    })
                    .catch(() => {
                        alert("the values you inserted make Vercel cry, please try again");
                        window.location.reload();
                    })
            })
            .catch(() => {
                alert("the values you inserted make Vercel cry, please try again");
                window.location.reload();
            })
    }

    const handleStressTest = async (event) => {
        event.preventDefault();
        setLoading(true);
        setTakeWhile(true);
        await axios.post("/api/v1/stresstest", {length, amount, stress})
            .then(async (stressResponse) => {
                const stressList = stressResponse.data.timeData.map((entry) => ({
                    iteration: entry['iteration'],
                    hash: entry['hash'],
                    set: entry['set']
                }));
                setStressResult(stressList);
                setLoading(false)
                setTakeWhile(false);
                setAverage(stressResponse.data.average);
            })
            .catch(() => {
                alert("the values you inserted make Vercel cry, please try again");
                window.location.reload();
            })
    }
    return (
        <div>
            <div>
                <div
                    className="bg-blue-800 shadow-2xl text-xs md:text-xl rounded-b-xl drop-shadow-2xl pb-5 mb-5 mx-auto overflow-hidden">
                    <ul className="text-center grid-cols-1 place-items-center">
                        <li><Image src={icon} width={100} alt={"icon"}/></li>
                        <li className="text-3xl text-center"> Password Generator</li>
                        <li>
                            Choose length and amount to generate passwords
                        </li>
                        <li>
                            Use delimiter for CSV export
                        </li>
                        <li>
                            Set the stress amount to see statistics
                        </li>
                    </ul>

                </div>
            </div>
            <PasswordGeneratorForm
                length={length}
                amount={amount}
                delimiter={delimiter}
                stress={stress}
                setLength={setLength}
                setAmount={setAmount}
                setDelimiter={setDelimiter}
                setStress={setStress}
                callbacks={{handleSubmit, handleStressTest}}
            />
            {
                loading &&
                <div className="flex justify-center items-center text-red-600 font-bold pt-5">Loading...</div>
            }
            {
                loading && takeWhile &&
                <div className="flex justify-center items-center text-red-800 font-bold">This might take a
                    while...</div>
            }
            {
                !loading && passwords?.length !== 0 && <PasswordTable
                    passwords={passwords}/>
            }
            {
                !loading && csv &&
                <div className="max-w-sm mx-auto pb-10 mb-5 -my-5 bg-black rounded-lg shadow-2xl drop-shadow-2xl">
                    <div
                        className="flex justify-center items-center my-auto mx-auto bg-black rounded-lg shadow-2xl drop-shadow-2xl">
                        <a href={csv} download="passwords.csv"
                           className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Download
                        </a>
                    </div>
                </div>
            }
            {!loading && Object.keys(average).length !== 0 &&
                <div className="flex justify-center items-center gap-10 py-5">
                    <div
                        className="w-fit bg-blue-800 rounded-2xl grid-cols-1 text-center p-5 shadow-2xl drop-shadow-2xl">
                        HASH
                        <div>total: {average['hash']['total']} ms</div>
                        <div>average: {average['hash']['average']} ms</div>
                    </div>
                    <div className="bg-blue-800 rounded-2xl grid-cols-1 text-center p-5 shadow-2xl drop-shadow-2xl">
                        SET
                        <div>total: {average['set']['total']} ms</div>
                        <div>average: {average['set']['average']} ms</div>
                    </div>
                </div>
            }
            {
                !loading && Object.keys(stressResult)?.length !== 0 && <StressTable stressResults={stressResult}/>
            }
        </div>
    );
}
