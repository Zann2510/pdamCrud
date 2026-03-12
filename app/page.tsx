import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center font-sans">
      <div className="w-full min-h-screen">
        <Image src={'/images/dam.webp'} alt="Background" fill priority className="cover -z-1 blur-sm"/>
        <div className="m-10 my-30">
          <h1 className="mb-8 font-bold text-3xl tracking-wide text-blue-800 justify-self-center">Perusahaan Daerah Air Minum</h1>
          <h3 className="font-semibold tracking-wide text-blue-500 justify-self-center">Cepat, Mudah, Ramah</h3>
        </div>
        <div className="min-h-[420] p-10 bg-blue-50">
          <h3 className="font-bold text-blue-800 text-xl mb-10">Login Sekarang!</h3>
          <a href="/sign-in" className="m-5 justify-self-center bg-blue-800 text-white p-2 py-3 rounded-lg font-semibold">Login</a>
        </div>
      </div>
    </div>
  );
}
