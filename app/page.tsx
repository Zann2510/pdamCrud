import Link from "next/link";
import { Button } from "../components/ui/button";
import { 
  Droplet, 
  Users, 
  Clock, 
  Shield, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Home,
  FileText,
  CreditCard,
  Headphones,
  CheckCircle,
  Bell
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Navigation - Lebih besar dan jelas */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[#B8D1E6] z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Lebih besar */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1E4A7A] rounded-xl flex items-center justify-center shadow-md">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-bold text-2xl text-[#0A2A44]">PDAM</span>
                <span className="text-sm bg-[#E1EEFB] text-[#1E4A7A] px-3 py-1 rounded-full ml-3 font-medium">
                  Digital
                </span>
              </div>
            </Link>

            {/* Desktop Menu - Font lebih besar */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="#features" className="text-lg text-[#2C3E50] hover:text-[#1E4A7A] font-medium transition-colors">
                Fitur
              </Link>
              <Link href="#about" className="text-lg text-[#2C3E50] hover:text-[#1E4A7A] font-medium transition-colors">
                Tentang
              </Link>
              <Link href="#contact" className="text-lg text-[#2C3E50] hover:text-[#1E4A7A] font-medium transition-colors">
                Kontak
              </Link>
              <Link href="#faq" className="text-lg text-[#2C3E50] hover:text-[#1E4A7A] font-medium transition-colors">
                FAQ
              </Link>
            </div>

            {/* Auth Buttons - Lebih besar */}
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button 
                  variant="ghost" 
                  className="text-[#1E4A7A] hover:text-[#0A2A44] hover:bg-[#E1EEFB] text-lg px-6 py-6 h-auto"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-[#1E4A7A] hover:bg-[#0A2A44] text-white text-lg px-8 py-6 h-auto rounded-xl shadow-md">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dengan kontras tinggi */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-[#E1EEFB] to-[#F0F7FF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Font lebih besar */}
            <div className="space-y-10 animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-[#C2D9F0] px-6 py-3 rounded-full">
                <Droplet className="w-6 h-6 text-[#1E4A7A]" />
                <span className="text-lg font-semibold text-[#1E4A7A]">
                  Layanan Air Bersih Terpercaya Sejak 1985
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A2A44] leading-tight">
                Kelola Air Bersih
                <span className="text-[#1E4A7A] block mt-2">dengan Mudah & Aman</span>
              </h1>
              
              <p className="text-xl text-[#2C3E50] leading-relaxed max-w-2xl">
                Sistem manajemen PDAM yang dirancang khusus untuk kemudahan semua kalangan. 
                Pantau pemakaian, bayar tagihan, dan kelola layanan dengan antarmuka yang ramah pengguna.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-[#1E4A7A] hover:bg-[#0A2A44] text-white text-xl px-10 py-8 h-auto rounded-xl shadow-lg">
                    Daftar Sekarang
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-2 border-[#1E4A7A] text-[#1E4A7A] hover:bg-[#E1EEFB] text-xl px-10 py-8 h-auto rounded-xl">
                    Lihat Fitur
                  </Button>
                </Link>
              </div>

              {/* Stats - Dengan angka besar */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t-2 border-[#C2D9F0]">
                <div>
                  <p className="text-4xl font-bold text-[#1E4A7A]">50K+</p>
                  <p className="text-base text-[#2C3E50] font-medium mt-1">Pelanggan Aktif</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#1E4A7A]">99.9%</p>
                  <p className="text-base text-[#2C3E50] font-medium mt-1">Ketersediaan Air</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#1E4A7A]">24/7</p>
                  <p className="text-base text-[#2C3E50] font-medium mt-1">Layanan Darurat</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image dengan overlay biru */}
            <div className="relative lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1581092921461-39b9c1b7a9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Water Management"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E4A7A]/30 to-transparent" />
              </div>
              
              {/* Floating Card - Lebih besar */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 max-w-[250px] border-l-4 border-[#1E4A7A]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#E1EEFB] rounded-xl flex items-center justify-center">
                    <Shield className="w-7 h-7 text-[#1E4A7A]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Terakreditasi</p>
                    <p className="text-xl font-bold text-[#0A2A44]">Kualitas A</p>
                    <p className="text-sm text-[#1E4A7A]">SNI 01-6989-2004</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Dengan card yang jelas */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A2A44] mb-6">
              Layanan yang Ramah untuk Semua
            </h2>
            <p className="text-xl text-[#2C3E50] leading-relaxed">
              Kami merancang setiap fitur dengan mempertimbangkan kemudahan penggunaan 
              untuk semua kalangan, termasuk pengguna senior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#1E4A7A] rounded-xl flex items-center justify-center mb-6">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Monitoring Real-time</h3>
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                Pantau pemakaian air dengan tampilan angka besar dan grafik yang mudah dibaca.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#1E4A7A] rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Pembayaran Mudah</h3>
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                Bayar tagihan dengan sekali klik. Tersedia panduan langkah demi langkah.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#1E4A7A] rounded-xl flex items-center justify-center mb-6">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Layanan Prioritas</h3>
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                Hotline khusus untuk lansia dengan operator yang sabar dan membantu.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#1E4A7A] rounded-xl flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Pengingat Otomatis</h3>
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                Notifikasi tagihan via WhatsApp untuk yang lebih familiar dengan pesan singkat.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#1E4A7A] rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Tagihan Digital</h3>
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                Terima tagihan dalam format PDF dengan font besar yang mudah dicetak.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#1E4A7A] rounded-xl flex items-center justify-center mb-6">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Kunjungan Rumah</h3>
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                Petugas siap datang ke rumah untuk membantu pengaduan atau pendaftaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Dengan highlight biru */}
      <section id="about" className="py-20 md:py-28 bg-[#F0F7FF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-[#C2D9F0] px-6 py-3 rounded-full mb-8">
                <Heart className="w-6 h-6 text-[#1E4A7A]" />
                <span className="text-lg font-semibold text-[#1E4A7A]">Melayani dengan Hati</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A2A44] mb-6">
                Tentang PDAM Ramah Lansia
              </h2>
              
              <p className="text-xl text-[#2C3E50] leading-relaxed mb-8">
                Kami percaya bahwa akses air bersih adalah hak semua orang, termasuk para lansia. 
                Itulah mengapa kami merancang sistem yang mudah digunakan oleh semua kalangan usia.
              </p>
              
              <div className="space-y-5 mb-10">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-[#1E4A7A] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-bold text-[#0A2A44] mb-1">Antarmuka Ramah Lansia</h4>
                    <p className="text-lg text-[#2C3E50]">Font besar, kontras tinggi, dan navigasi sederhana</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-[#1E4A7A] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-bold text-[#0A2A44] mb-1">Layanan Prioritas</h4>
                    <p className="text-lg text-[#2C3E50]">Antrian khusus dan petugas sabar untuk lansia</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-[#1E4A7A] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-bold text-[#0A2A44] mb-1">Pendampingan Langsung</h4>
                    <p className="text-lg text-[#2C3E50]">Petugas siap datang ke rumah untuk membantu</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-[#C2D9F0] p-6">
                <p className="text-lg italic text-[#2C3E50]">
                  "Saya sangat terbantu dengan tampilannya yang besar dan jelas. 
                  Tidak perlu lagi menyipitkan mata untuk membaca tagihan."
                </p>
                <p className="text-[#1E4A7A] font-bold mt-3">- Ibu Siti, 72 tahun, Pelanggan Setia</p>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Elderly using tablet"
                className="rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#1E4A7A] text-white rounded-2xl p-6 shadow-xl max-w-[250px]">
                <p className="text-2xl font-bold">15+ Tahun</p>
                <p className="text-lg">Melayani Lansia dengan Sepenuh Hati</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Untuk pertanyaan umum */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A2A44] mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-[#2C3E50]">
              Jawaban untuk pertanyaan yang paling sering ditanyakan
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-6">
              <h3 className="text-xl font-bold text-[#0A2A44] mb-2">Bagaimana cara mendaftar sebagai pelanggan baru?</h3>
              <p className="text-lg text-[#2C3E50]">
                Anda dapat mendaftar melalui website ini atau datang langsung ke kantor PDAM terdekat. 
                Untuk lansia, petugas kami siap membantu proses pendaftaran.
              </p>
            </div>

            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-6">
              <h3 className="text-xl font-bold text-[#0A2A44] mb-2">Apada ada potongan khusus untuk lansia?</h3>
              <p className="text-lg text-[#2C3E50]">
                Ya, kami memberikan potongan 10% untuk pelanggan lansia di atas 65 tahun. 
                Silakan hubungi customer service untuk informasi lebih lanjut.
              </p>
            </div>

            <div className="bg-[#F8FBFF] rounded-2xl border-2 border-[#C2D9F0] p-6">
              <h3 className="text-xl font-bold text-[#0A2A44] mb-2">Bagaimana jika kesulitan menggunakan aplikasi?</h3>
              <p className="text-lg text-[#2C3E50]">
                Kami menyediakan layanan bantuan via telepon dan kunjungan rumah. 
                Petugas kami akan dengan sabar membimbing Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Biru solid */}
      <section className="py-20 md:py-28 bg-[#1E4A7A]">
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 lg:px-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Bergabung dengan Keluarga Besar PDAM?
          </h2>
          <p className="text-2xl text-[#E1EEFB] mb-10 leading-relaxed">
            Daftarkan diri Anda sekarang dan nikmati kemudahan layanan yang ramah untuk semua usia
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-[#1E4A7A] hover:bg-gray-100 text-2xl px-12 py-8 h-auto rounded-xl shadow-lg">
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="border-2 border-white text-[#1E4A7A] hover:bg-white/10 text-2xl px-12 py-8 h-auto rounded-xl">
                Masuk ke Akun
              </Button>
            </Link>
          </div>
          <p className="text-[#E1EEFB] text-lg mt-8">
            Butuh bantuan? Hubungi kami di 1500-123 (untuk lansia tekan 1)
          </p>
        </div>
      </section>

      {/* Contact Section - Dengan kontak prioritas lansia */}
      <section id="contact" className="py-20 md:py-28 bg-[#F0F7FF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A2A44] mb-6">
              Hubungi Kami
            </h2>
            <p className="text-xl text-[#2C3E50]">
              Ada yang ingin ditanyakan? Tim layanan prioritas kami siap membantu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border-2 border-[#C2D9F0] p-8 text-center hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-[#1E4A7A] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Layanan Prioritas</h3>
              <p className="text-3xl font-bold text-[#1E4A7A] mb-2">1500-123</p>
              <p className="text-lg text-[#2C3E50]">Tekan 1 untuk layanan lansia</p>
              <p className="text-base text-gray-500 mt-4">Senin - Minggu, 24 Jam</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#C2D9F0] p-8 text-center hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-[#1E4A7A] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Email Khusus</h3>
              <p className="text-2xl font-bold text-[#1E4A7A] mb-2">lansia@pdam.go.id</p>
              <p className="text-lg text-[#2C3E50]">Respon maksimal 1x24 jam</p>
              <p className="text-base text-gray-500 mt-4">info@pdam.go.id (umum)</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#C2D9F0] p-8 text-center hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-[#1E4A7A] rounded-xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">Kantor Pusat</h3>
              <p className="text-lg text-[#2C3E50] mb-2">Jl. Air Bersih No. 123</p>
              <p className="text-lg text-[#2C3E50]">Jakarta Pusat, 12345</p>
              <p className="text-base text-gray-500 mt-4">
                Senin - Jumat, 08:00 - 16:00<br />
                *Prioritas untuk lansia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2A44] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1E4A7A] rounded-xl flex items-center justify-center">
                  <Droplet className="w-7 h-7 text-white" />
                </div>
                <span className="font-bold text-2xl">PDAM Ramah</span>
              </div>
              <p className="text-[#B8D1E6] text-lg leading-relaxed">
                Melayani dengan hati untuk kenyamanan semua kalangan, terutama para lansia.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xl mb-6">Tautan Cepat</h4>
              <ul className="space-y-3 text-lg">
                <li><Link href="#features" className="text-[#B8D1E6] hover:text-white transition-colors">Fitur</Link></li>
                <li><Link href="#about" className="text-[#B8D1E6] hover:text-white transition-colors">Tentang</Link></li>
                <li><Link href="#contact" className="text-[#B8D1E6] hover:text-white transition-colors">Kontak</Link></li>
                <li><Link href="#faq" className="text-[#B8D1E6] hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xl mb-6">Layanan Khusus</h4>
              <ul className="space-y-3 text-lg text-[#B8D1E6]">
                <li>Pendaftaran Lansia</li>
                <li>Kunjungan Rumah</li>
                <li>Hotline Prioritas</li>
                <li>Panduan Cetak Besar</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xl mb-6">Jam Layanan Prioritas</h4>
              <ul className="space-y-3 text-lg text-[#B8D1E6]">
                <li>Senin - Jumat: 08:00 - 16:00</li>
                <li>Sabtu: 08:00 - 12:00</li>
                <li>Minggu: Tutup</li>
                <li className="mt-4 font-semibold text-white">Hotline: 1500-123</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1E4A7A] mt-12 pt-8 text-center">
            <p className="text-[#B8D1E6] text-lg">
              © 2026 PDAM Ramah Lansia. Seluruh hak cipta dilindungi.
            </p>
            <p className="text-[#B8D1E6] text-base mt-2">
              *Dirancang khusus dengan font besar dan kontras tinggi untuk kenyamanan pengguna lansia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}