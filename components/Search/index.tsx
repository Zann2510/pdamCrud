"use client"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

type Props = {
    search: string
}

const Search = ({ search }: Props) => {
    const [keyword, setKeyword] = useState<string>(search)
    const router = useRouter()

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const params = new URLSearchParams(window.location.search)

            if (keyword.trim()) {
                // Ada keyword → set param search, reset ke page 1
                params.set("search", keyword.trim())
                params.set("page", "1")
            } else {
                // Kosong → hapus param search, reset ke page 1
                params.delete("search")
                params.set("page", "1")
            }

            // ✅ FIX: router.push dipanggil di KEDUA kondisi
            // Sebelumnya hanya dipanggil di kondisi keyword kosong
            // sehingga mengetik keyword dan Enter tidak pernah trigger pencarian
            router.push(`?${params.toString()}`)
        }
    }

    return (
        <div className="w-full">
            <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Cari data... (tekan Enter)"
                className="w-full border border-primary rounded-md p-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
        </div>
    )
}

export default Search