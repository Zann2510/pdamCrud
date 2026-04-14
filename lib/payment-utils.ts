import type { Payment, PaymentStatus } from "../app/types"

/**
 * ✅ QUALITY FIX — Centralized payment mapping utility
 *
 * Sebelumnya logika mapping ini duplikat di:
 *   - app/admin/payments/page.tsx
 *   - app/costumer/payments/page.tsx
 *
 * Sekarang cukup import dari sini.
 *
 * ✅ BUG FIX — Status REJECTED ditangani dengan benar.
 * Sebelumnya hanya: verified=true → APPROVED, sisanya → PENDING (salah!)
 * Sekarang: verified=true → APPROVED, rejected=true → REJECTED, sisanya → PENDING
 */
export function mapPaymentStatus(item: Record<string, unknown>): PaymentStatus {
    if (item.verified === true) return "APPROVED"
    // ✅ FIX: Handle REJECTED — sesuaikan field name dengan response API backend kamu
    // Kemungkinan: item.rejected, item.is_rejected, atau item.status === "rejected"
    if (item.rejected === true) return "REJECTED"
    if (typeof item.status === "string" && item.status.toUpperCase() === "REJECTED") return "REJECTED"
    return "PENDING"
}

export function mapPaymentItem(item: Record<string, unknown>): Payment {
    const billData = item.bill as Record<string, unknown> | undefined
    const customerData = (item.customer ?? billData?.customer) as Record<string, unknown> | undefined

    return {
        ...item,
        id: item.id as number,
        bill_id: item.bill_id as number,
        customer_id: item.customer_id as number,
        owner_token: (item.owner_token ?? "") as string,
        updatedAt: (item.updatedAt ?? new Date().toISOString()) as string,
        // ✅ Amount: ambil total_amount dari API, fallback ke kalkulasi manual
        amount: (item.total_amount as number)
            ?? (billData
                ? ((billData.usage_value as number) ?? 0) * ((billData.price as number) ?? 0)
                : 0),
        // ✅ Status yang sudah dipetakan dengan benar
        status: mapPaymentStatus(item),
        // ✅ Customer diambil dari berbagai kemungkinan struktur API
        customer: customerData
            ? { name: customerData.name as string, customer_number: customerData.customer_number as string }
            : { name: "Tidak diketahui", customer_number: "-" },
        payment_method: (item.payment_method as string) ?? "Transfer",
        createdAt: (item.createdAt as string) ?? new Date().toISOString(),
        notes: (item.notes as string) ?? "",
        bill: billData as Payment["bill"],
    } as Payment
}

export function mapPaymentList(rawList: Record<string, unknown>[]): Payment[] {
    return rawList.map(mapPaymentItem)
}