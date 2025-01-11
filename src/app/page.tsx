"use client";
import axios from "axios";

import React, {useState} from "react";
import PasswordGeneratorForm from "@/components/form";
import PasswordTable from "@/components/table";
import StressTable from "@/components/table-stress";

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
    }
    return (
        <div>
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
            {loading && <div className="flex justify-center items-center text-red-700">Loading...</div>}
            {loading && takeWhile &&
                <div className="flex justify-center items-center text-red-700">This might take a while...</div>}
            {!loading && passwords?.length !== 0 && <PasswordTable
                passwords={passwords}/>}
            {!loading && csv &&
                <div className="max-w-sm mx-auto pb-10 -my-5 bg-black rounded-lg shadow-md">
                    <div className="flex justify-center items-center my-auto mx-auto bg-black rounded-lg shadow-md">
                        <a href={csv} download="passwords.csv"
                           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Download
                        </a>
                    </div>
                </div>
            }
            {!loading && Object.keys(average).length !== 0 && <div className="flex justify-center items-center gap-10">
                <div>
                    <div>hash total: {average['hash']['total']}</div>
                    <div>hash average: {average['hash']['average']}</div>
                </div>
                <div>
                    <div>set total: {average['set']['total']}</div>
                    <div>set average: {average['set']['average']}</div>
                </div>
            </div>
            }
            {!loading && Object.keys(stressResult)?.length !== 0 && <StressTable stressResults={stressResult}/>}
        </div>
    );
}
