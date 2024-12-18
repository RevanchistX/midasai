"use client";
import axios from "axios";

import React, {useState} from "react";
import PasswordGeneratorForm from "@/components/form";
import PasswordTable from "@/components/table";

export default function Home() {
    const [length, setLength] = useState<number>(12);
    const [amount, setAmount] = useState<number>(100000);
    const [passwords, setPasswords] = useState([]);
    const [delimiter, setDelimiter] = useState(",");
    const [csv, setCsv] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


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
    return (
        <div>
            <PasswordGeneratorForm
                length={length}
                amount={amount}
                delimiter={delimiter}
                setLength={setLength}
                setAmount={setAmount}
                setDelimiter={setDelimiter}
                handleSubmit={handleSubmit}
            />
            {loading && <div className="flex justify-center items-center text-red-700">Loading...</div>}
            {!loading && passwords?.length !== 0 && <PasswordTable
                passwords={passwords}
                csv={csv}/>}
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
        </div>
    );
}
