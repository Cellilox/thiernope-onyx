"use client";

import { useUser } from "@/components/user/UserProvider";
import CreateButton from "@/refresh-components/buttons/CreateButton";
import SimpleTooltip from "@/refresh-components/SimpleTooltip";
import Title from "@/components/ui/title";
import { FiHelpCircle } from "react-icons/fi";
import Separator from "@/refresh-components/Separator";

export default function RestrictedCreateButtons() {
    const { user } = useUser();
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

    // Only show if user is logged in and matches the super admin email
    if (!user || user.email !== superAdminEmail) {
        return null;
    }

    return (
        <>
            <Separator />

            <Title>Create Actions</Title>
            <div className="flex gap-4 mt-2 items-center">
                <CreateButton href="/admin/actions/new">
                    From OpenAPI schema
                </CreateButton>
                <CreateButton href="/admin/actions/edit-mcp">
                    From MCP server
                </CreateButton>
                <SimpleTooltip tooltip="MCP (Model Context Protocol) servers provide structured ways for AI models to interact with external systems and data sources. They offer a standardized interface for tools and resources.">
                    <FiHelpCircle className="h-4 w-4 cursor-help" />
                </SimpleTooltip>
            </div>
        </>
    );
}
