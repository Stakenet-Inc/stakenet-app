import {
    CircleFadingArrowUp,
    Gem,
    LayoutDashboard,
    Settings,
    Sparkles,
    Ticket
} from "lucide-react";

export const sidebarTopItems = [
    {
        icon: LayoutDashboard,
        href: "/dashboard",
        label: "Dashboard",
    },
    {
        icon: Sparkles,
        href: "/",
        label: "Analyse",
    },
    {
        icon: Ticket,
        href: "/slips",
        label: "My Slips",
    },
    {
        icon: Gem,
        href: "/predictions",
        label: "Predictions",
    },
];

export const sidebarBottomItems = [
    {
        icon: CircleFadingArrowUp,
        href: "/upgrade",
        label: "Upgrade",
    },
    {
        icon: Settings,
        href: "/settings",
        label: "Settings",
    },
];
