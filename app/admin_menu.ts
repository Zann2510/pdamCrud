import { Home, UserPen, User, Users, Toolbox, Receipt, CreditCard} from "lucide-react"

export const Items = [
    {
        title: "Home",
        url: "/admin/dashboard",
        icon: Home
    },
    {
        title: "Profile",
        url: "/admin/profile",
        icon: UserPen
    },
    {
        title: "Admin Data",
        url: "/admin/admins",
        icon: User
    },
    {
        title: "Customer Data",
        url: "/admin/customers",
        icon: Users
    },
    {
        title: "Services",
        url: "/admin/services",
        icon: Toolbox
    },
    {
        title: "Bill",
        url: "/admin/bill",
        icon: Receipt
    },
    {
        title: "Payments",
        url: "/admin/payments",
        icon: CreditCard
    }
]