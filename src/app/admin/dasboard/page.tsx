import { Admin } from "@/app/types";
import { cookies } from "next/headers";

type ResultData = {
  success: boolean;
  message: string;
  data: Admin;
};

async function getAdminProfile(): Promise<Admin | null> {
  try {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(`accessToken`);
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const responseData: ResultData = await response.json();
    
    if (!response.ok) {
      console.log(responseData?.message);
      return null;
    }

    return responseData.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const adminData = await getAdminProfile();
  
  if (adminData == null) {
    return (
      <div className="w-full p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">Data admin tidak tersedia</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Pelanggan */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Pelanggan</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
              <p className="text-sm text-green-600 mt-1">+12% dari bulan lalu</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
        
        {/* Card 2: Tagihan Bulan Ini */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tagihan Bulan Ini</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">Rp 45.2M</p>
              <p className="text-sm text-green-600 mt-1">85% terbayar</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
        
        {/* Card 3: Tunggakan */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tunggakan</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">Rp 8.1M</p>
              <p className="text-sm text-red-600 mt-1">234 pelanggan</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
        
        {/* Card 4: Penggunaan Air */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Penggunaan Air</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">89,453 m³</p>
              <p className="text-sm text-purple-600 mt-1">Bulan ini</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💧</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Profil Admin</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 font-medium">Nama Lengkap</label>
            <p className="text-gray-800 mt-1 text-lg">{adminData.name}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 font-medium">Username</label>
            <p className="text-gray-800 mt-1 text-lg">{adminData.user.username}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 font-medium">Nomor Telepon</label>
            <p className="text-gray-800 mt-1 text-lg">{adminData.phone}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 font-medium">Role</label>
            <p className="text-gray-800 mt-1 text-lg">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {adminData.user.role}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
        
        <div className="space-y-4">
          {[
            { action: "Pelanggan baru terdaftar", name: "Budi Santoso", time: "5 menit yang lalu" },
            { action: "Pembayaran diterima", name: "Siti Aminah", time: "1 jam yang lalu" },
            { action: "Laporan tagihan dibuat", name: "System", time: "2 jam yang lalu" },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">{activity.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.name}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}