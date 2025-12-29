"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminSidebarContextType {
    folded: boolean;
    setFolded: (folded: boolean | ((prev: boolean) => boolean)) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
    undefined
);

const ADMIN_SIDEBAR_FOLDED_KEY = "admin_sidebar_folded";

export function AdminSidebarProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [folded, setFoldedState] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load initial state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(ADMIN_SIDEBAR_FOLDED_KEY);
        if (stored !== null) {
            setFoldedState(stored === "true");
        }
        setIsInitialized(true);
    }, []);

    // Persist to localStorage whenever folded changes
    const setFolded = (value: boolean | ((prev: boolean) => boolean)) => {
        setFoldedState((prev) => {
            const newValue = typeof value === "function" ? value(prev) : value;
            if (isInitialized) {
                localStorage.setItem(ADMIN_SIDEBAR_FOLDED_KEY, String(newValue));
            }
            return newValue;
        });
    };

    return (
        <AdminSidebarContext.Provider value={{ folded, setFolded }}>
            {children}
        </AdminSidebarContext.Provider>
    );
}

export function useAdminSidebarContext() {
    const context = useContext(AdminSidebarContext);
    if (context === undefined) {
        throw new Error(
            "useAdminSidebarContext must be used within an AdminSidebarProvider"
        );
    }
    return context;
}
