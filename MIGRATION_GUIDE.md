# Panduan Migrasi — PDAM Fix

Semua perbaikan dikelompokkan berdasarkan prioritas.
Ikuti urutan ini agar tidak ada dependency yang putus.

---

## TAHAP 1 — Kritis: Keamanan (Wajib sebelum production)

### 1.1 Update Environment Variables

```bash
# Rename/hapus variabel lama yang tidak aman:
# NEXT_PUBLIC_BASE_API_URL  →  BASE_API_URL   (hapus prefix NEXT_PUBLIC_)
# NEXT_PUBLIC_APP_KEY       →  APP_KEY        (hapus prefix NEXT_PUBLIC_)
```

Salin `.env.local.example` menjadi `.env.local` dan isi semua nilai.

**Penting:** Setelah menghapus `NEXT_PUBLIC_APP_KEY`, semua server components
yang menggunakan `process.env.NEXT_PUBLIC_APP_KEY` harus diganti menjadi
`process.env.APP_KEY`. Cari dengan:

```bash
grep -r "NEXT_PUBLIC_APP_KEY" app/ lib/
grep -r "NEXT_PUBLIC_BASE_API_URL" app/ lib/
```

### 1.2 Tambah API Proxy Route

Salin file berikut ke project:
```
app/api/backend/[...path]/route.ts
```

Setelah ini, semua fetch di client components yang sebelumnya memanggil
`${process.env.NEXT_PUBLIC_BASE_API_URL}/xxx` dengan `APP-KEY` header
harus diubah menjadi `/api/backend/xxx` (tanpa APP-KEY header).

Jalankan search untuk menemukan semua yang perlu diubah:
```bash
grep -r "NEXT_PUBLIC_BASE_API_URL" app/admin app/costumer --include="*.tsx"
```

### 1.3 Tambah Admin Registration Route

Salin file berikut:
```
app/api/auth/register/route.ts
```

### 1.4 Tambah Middleware

Salin file berikut ke root project (sejajar dengan `app/`):
```
middleware.ts
```

### 1.5 Update Sign-Up Page

Salin file berikut:
```
app/sign-up/page.tsx
```

Halaman sign-up sekarang memerlukan `registrationToken`.
Set nilai token di `.env.local` → `ADMIN_REGISTRATION_TOKEN`.

---

## TAHAP 2 — Bug: Logout Tidak Berfungsi

Salin file berikut:
```
components/ui/logoutbutton.tsx
```

**Perubahan:** Tambah `onClick={handleLogout}` ke elemen `<button>`.

---

## TAHAP 3 — Bug: DialogFooter di Dalam FieldGroup

Salin semua file berikut (semua fix DialogFooter placement):
```
app/admin/admins/edit.tsx
app/admin/admins/resetPassword.tsx
app/admin/customers/edit.tsx
app/admin/customers/resetPassword.tsx
app/admin/services/edit.tsx
```

---

## TAHAP 4 — Bug: Password Pre-fill dari API

File yang sama dengan Tahap 3 sudah memperbaiki ini.

**Perubahan di tiap file:**
- `setPassword(selectedData.user.password)` → `setPassword("")`
- Payload hanya menyertakan password jika user mengisinya (optional)
- Ditambah field "Konfirmasi Password" di form reset

---

## TAHAP 5 — Bug: Status REJECTED pada Pembayaran

### 5.1 Tambah Payment Utility

Salin file berikut:
```
lib/payment-utils.ts
```

**Perhatian:** Sesuaikan nama field di `mapPaymentStatus()` dengan
response API backend kamu. Kemungkinan nama field:
- `item.rejected`
- `item.is_rejected`
- `item.status === "rejected"`

Cek dengan `console.log` atau Postman terlebih dahulu.

### 5.2 Update Halaman Pembayaran

Salin file berikut:
```
app/admin/payments/page.tsx
app/costumer/payments/page.tsx
```

---

## TAHAP 6 — Kualitas: Loading States

Salin file berikut:
```
app/admin/admins/add.tsx
app/admin/bill/delete.tsx
```

Untuk file CRUD lain yang belum memiliki loading state,
tambahkan pattern yang sama:

```tsx
const [loading, setLoading] = useState(false)

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)          // ← tambah ini
    try {
        // ... fetch logic ...
    } finally {
        setLoading(false)     // ← tambah ini
    }
}

// Di tombol submit:
<Button type="submit" disabled={loading}>
    {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
    {loading ? "Menyimpan..." : "Save Changes"}
</Button>
```

---

## Ringkasan File yang Perlu Disalin

| File | Kategori |
|------|----------|
| `middleware.ts` | Kritis — Route protection |
| `app/api/backend/[...path]/route.ts` | Kritis — APP-KEY proxy |
| `app/api/auth/register/route.ts` | Kritis — Secure registration |
| `.env.local.example` | Kritis — Env vars |
| `app/sign-up/page.tsx` | Kritis — Registration token |
| `components/ui/logoutbutton.tsx` | Bug — onClick missing |
| `app/admin/admins/edit.tsx` | Bug — DialogFooter + password |
| `app/admin/admins/resetPassword.tsx` | Bug — DialogFooter + password |
| `app/admin/customers/edit.tsx` | Bug — DialogFooter + password |
| `app/admin/customers/resetPassword.tsx` | Bug — DialogFooter + password + unused import |
| `app/admin/services/edit.tsx` | Bug — DialogFooter |
| `lib/payment-utils.ts` | Bug + Quality — REJECTED + centralized |
| `app/admin/payments/page.tsx` | Bug — REJECTED status |
| `app/costumer/payments/page.tsx` | Bug — REJECTED status |
| `app/admin/admins/add.tsx` | Quality — Loading state |
| `app/admin/bill/delete.tsx` | Quality — Loading state |