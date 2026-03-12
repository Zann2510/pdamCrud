"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"

type Props = {
    count: number
    perPage: number
    currentPage: number
}

export default function SimplePagination({ count, perPage, currentPage }: Props) {
    let totalPage = Math.ceil(count / perPage)
    let isFirstPage = currentPage <= 1
    let isLastPage = currentPage >= totalPage

    const router = useRouter()
    const searchParams = useSearchParams()

    const changePage = (page: number) => {
        const safePage = Math.min(Math.max(page, 1), totalPage)

        const params = new URLSearchParams(searchParams.toString())

        params.set("page", safePage.toString())
        router.push(`?${params.toString()}`)
    }

    const generatePages = () => {
        const pages = []

        let start = Math.max(currentPage - 2, 1)
        let end = Math.min(currentPage + 2, totalPage)

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious size="default" onClick={() => !isFirstPage && changePage(currentPage - 1)} className={isFirstPage ? "pointer-events-none opacity-50" : ""} />
                </PaginationItem>

                {currentPage > 3 && (
                    <>
                    <PaginationItem>
                        <PaginationLink size="default" onClick={() => changePage(1)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                    </>
                )}

                {generatePages().map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink size="default" isActive={page === currentPage} onClick={() => changePage(page)}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {currentPage < totalPage - 2 && (
                    <>
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink size="default" onClick={() => changePage(totalPage)}>
                            {totalPage}
                        </PaginationLink>
                    </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext size="default" onClick={() => !isLastPage && changePage(Number(currentPage) + 1)} className={isLastPage ? "pointer-events-none opacity-50" : ""}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
