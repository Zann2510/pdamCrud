import { Customer } from "@/app/types";
import { getCookies } from "../../../../lib/server-cookies";

type ResultData = {
  success: boolean;
  message: string;
  data: Customer[];
};

async function getCustomers(): Promise<Customer[] | null> {
  try {
    const token = await getCookies("accessToken");
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData: ResultData = await response.json();
    console.log(responseData);

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

export default async function CustomerDashboardPage() {
  const customersData = await getCustomers();

  if (customersData == null || customersData.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-5">
        <div className="w-full p-8 bg-white rounded shadow">
          <h1 className="font-bold text-gray-800 text-2xl mb-6">
            Profil Pelanggan
          </h1>
          <p className="text-gray-500">Data pelanggan tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-5">
      <div className="space-y-6">
        {customersData.map((customer, index) => (
          <div
            key={customer.id || index}
            className="w-full p-8 bg-white rounded shadow"
          >
            <h1 className="font-bold text-gray-800 text-2xl mb-6">
              Profil Pelanggan
            </h1>

            <div className="space-y-4">
              <div>
                <div className="text-gray-500 text-sm mb-1">Nama</div>
                <div className="text-gray-700 font-medium">{customer.name}</div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">Username</div>
                <div className="text-gray-700 font-medium">
                  {customer.username}
                </div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">Nomor Telepon</div>
                <div className="text-gray-700 font-medium">
                  {customer.phone}
                </div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">Alamat</div>
                <div className="text-gray-700 font-medium">
                  {customer.address}
                </div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">
                  Nomor Pelanggan
                </div>
                <div className="text-gray-700 font-medium">
                  {customer.service_id}
                </div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">
                  Tanggal Pendaftaran
                </div>
                <div className="text-gray-700 font-medium">
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}