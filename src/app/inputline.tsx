"use client";

import {useState, ChangeEventHandler} from "react";

export default function InputLine() {
    const [input, setInput] = useState("");

    return <>
    <input type="text" placeholder="Your input here" value={input} onChange={(e) => setInput(e.target.value)}></input>
    </>
}