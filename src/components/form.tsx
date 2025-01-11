const PasswordGeneratorForm = ({
                                   length,
                                   amount,
                                   delimiter,
                                   stress,
                                   setLength,
                                   setAmount,
                                   setDelimiter,
                                   setStress,
                                   callbacks
                               }) => {
    const {handleSubmit, handleStressTest} = callbacks;
    return (
        <form className="max-w-sm mx-auto p-6 bg-black rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="length">Length</label>
                <input
                    type="number"
                    id="length"
                    value={length}
                    min="1"
                    onChange={(e) => setLength(Number(e.target.value))} // Convert input to number directly
                    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))} // Convert input to number directly
                    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="delimiter">Delimiter</label>
                <input
                    type="text"
                    id="delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="stress">Stress</label>
                <input
                    type="number"
                    id="stress"
                    min="2"
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                    className="appearance-none border rounded w-full py-2 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="flex justify-center items-center gap-10">
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Generate
                </button>
                <button
                    onClick={handleStressTest}
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Stress
                </button>
            </div>
        </form>
    )
};

export default PasswordGeneratorForm;