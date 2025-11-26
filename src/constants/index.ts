import {
    CircleFadingArrowUp,
    MessageCircleQuestionMark,
    Sparkles,
    Ticket
} from "lucide-react";

export const sidebarTopItems = [
    {
        icon: Sparkles,
        href: "/analyze",
        label: "Analyze",
    },
    {
        icon: Ticket,
        href: "/my-slips",
        label: "My Slips",
    },
];

export const sidebarBottomItems = [
    {
        icon: CircleFadingArrowUp,
        href: "/upgrade",
        label: "Upgrade",
    },
    {
        icon: MessageCircleQuestionMark,
        href: "/help",
        label: "Help",
    },
];
