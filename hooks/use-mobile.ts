import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        // ✅ FIX 1: Tambahkan tanda kurung () di media query
        // Tanpa kurung: `max-width: 767px`  → INVALID, tidak pernah match
        // Dengan kurung: `(max-width: 767px)` → VALID, bekerja dengan benar
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }

        mql.addEventListener("change", onChange)
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

        // ✅ FIX 2: Return cleanup function untuk remove listener
        // Cleanup dijalankan saat komponen unmount atau sebelum effect jalan ulang
        return () => mql.removeEventListener("change", onChange)

    // ✅ FIX 3: Tambahkan dependency array [] yang kosong
    // Tanpa [] → useEffect jalan setiap render → listener dipasang berulang → memory leak
    // Dengan [] → useEffect hanya jalan sekali saat komponen pertama kali mount
    }, [])

    return !!isMobile
}