import {
    LayoutDashboard,
    ShieldCheck,
    Globe,
    FileText,
    Package,
    House,
    MessageSquare,
    Users,
    Calendar,
    Settings,
    BookOpen,
    Award,
    Building,
    Bell,
    Heart,
    User2,
    UsersRound,
} from "lucide-react";

export const ROLE_NAV_CONFIG = {
    super_admin: {
        mainPath: "SuperAdmin",
        appName: "Super Admin",
        subText: "Control Panel",
        logoIcon: ShieldCheck,
        logoColor: "from-violet-600 to-indigo-700",
        navGroups: [
            {
                group: "Core",
                items: [
                    { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },

                ],
            },
            {
                group: "Management",
                items: [
                    { label: "Users", icon: Users, path: "users" },
                    { label: "Communities", icon: Building, path: "communities" },

                ],
            },
        ],
    },

    community_admin: {
        mainPath: "Admin",
        appName: "Community",
        subText: "Admin Portal",
        logoIcon: Users,
        logoColor: "from-blue-500 to-cyan-600",
        navGroups: [
            {
                group: "Community",
                items: [
                    { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
                    { label: "Users", icon: Users, path: "user" },

                ],
            },
            {
                group: "Management",
                items: [
                    { label: "Families", icon: UsersRound, path: "family" },
                    { label: "Registers", icon: BookOpen, path: "register" },
                    { label: "Supports", icon: FileText, path: "support" },
                    { label: "Messages", icon: MessageSquare, path: "sendMessage" },

                ],
            },
            {
                group: "Settings",
                items: [
                    { label: "Settings", icon: Settings, path: "settings" },

                ],
            },
        ],
    },

    community_manager: {
        mainPath: "Admin",
        appName: "Community",
        subText: "Manager Portal",
        logoIcon: Award,
        logoColor: "from-amber-500 to-orange-600",
        navGroups: [
            {
                group: "Overview",
                items: [
                    { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
                    { label: "Activities", icon: Calendar, path: "activities" },
                    { label: "Members", icon: Users, path: "members" },
                ],
            },
            {
                group: "Operations",
                items: [
                    { label: "Events", icon: Globe, path: "events" },
                    { label: "Tasks", icon: BookOpen, path: "tasks" },
                    { label: "Resources", icon: Package, path: "resources" },
                ],
            },
            {
                group: "Communication",
                items: [
                    {
                        label: "Messages",
                        icon: MessageSquare,
                        path: "messages",
                    },
                    { label: "Announcements", icon: Bell, path: "announcements" },
                    { label: "Feedback", icon: Heart, path: "feedback" },
                ],
            },
        ],
    },

    family: {
        mainPath: "Family",
        appName: "Family",
        subText: "Home Portal",
        logoIcon: House,
        logoColor: "from-emerald-500 to-teal-600",
        navGroups: [
            {
                group: "Family",
                items: [
                    { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
                    {
                        label: "Messages",
                        icon: MessageSquare,
                        path: "message",
                    },
                ],
            },
            {
                group: "Activities",
                items: [
                    { label: "Events", icon: Globe, path: "event" },
                    { label: "Meetings", icon: House, path: "meeting" },
                ],
            },
        ],
    },


};