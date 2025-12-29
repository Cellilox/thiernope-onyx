"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ConnectorSidebarContextType {
    folded: boolean;
    setFolded: (folded: boolean | ((prev: boolean) => boolean)) => void;
}

const ConnectorSidebarContext = createContext<ConnectorSidebarContextType | undefined>(
    undefined
);

const CONNECTOR_SIDEBAR_FOLDED_KEY = "connector_sidebar_folded";

export function ConnectorSidebarProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [folded, setFoldedState] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load initial state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(CONNECTOR_SIDEBAR_FOLDED_KEY);
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
                localStorage.setItem(CONNECTOR_SIDEBAR_FOLDED_KEY, String(newValue));
            }
            return newValue;
        });
    };

    return (
        <ConnectorSidebarContext.Provider value={{ folded, setFolded }}>
            {children}
        </ConnectorSidebarContext.Provider>
    );
}

export function useConnectorSidebarContext() {
    const context = useContext(ConnectorSidebarContext);
    if (context === undefined) {
        throw new Error(
            "useConnectorSidebarContext must be used within a ConnectorSidebarProvider"
        );
    }
    return context;
}
