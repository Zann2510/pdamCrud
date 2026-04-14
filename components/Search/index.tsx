"use client"

import { useRouter } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"
import { useState, useEffect } from "react"

interface Props {
    search?: string
    placeholder: string
    className?: string
    onSearch?: (value: string) => void
}

export default function Search({ search = "", placeholder = "Cari...", className = "", onSearch }: Props) {
    const router = useRouter()
    const [value, setValue] = useState(search)

    // Update value when search prop changes
    useEffect(() => {
        setValue(search)
    }, [search])

    const handleSearch = () => {
        if (onSearch) {
            onSearch(value)
        } else {
            const params = new URLSearchParams(window.location.search)
            if (value) {
                params.set("search", value)
                params.set("page", "1") // Reset ke halaman pertama
            } else {
                params.delete("search")
            }
            router.push(`?${params.toString()}`)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full p-4 pr-12 text-lg border-2 border-[#C2D9F0] rounded-xl bg-white focus:outline-none focus:border-[#1E4A7A] focus:ring-4 focus:ring-[#1E4A7A]/20 transition-all placeholder:text-gray-400"
            />
            <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#1E4A7A] transition-colors"
                aria-label="Cari"
            >
                <SearchIcon className="w-6 h-6" />
            </button>
        </div>
    )
}