"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function ImportToeflButton() {
    const router = useRouter();
    const [importing, setImporting] = useState(false);

    async function handleImportToefl() {
        try {
            setImporting(true);
            const res = await fetch("/api/topics/import/toefl", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: "TOEFL Vocabulary Test",
                    limit: 50,
                    num_choices: 4,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            router.push(`/topics/${data.topic_id}`);
        } catch (e) {
            console.error(e);
            alert("Import failed. Check server logs.");
        } finally {
            setImporting(false);
        }
    }

    return (
        <button
            onClick={handleImportToefl}
            disabled={importing}
            className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
            {importing ? "Importing..." : "➕ TOEFL Vocabulary Test 만들기"}
        </button>
    );
}