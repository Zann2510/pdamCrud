import Image from "next/image";

const Header = () => {
    return (
        <header className="flex flex-row gap-4 bg-blue-500">
            <Image
            className="pl-4"
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            priority
            />
        </header>
    )
}

export default Header;