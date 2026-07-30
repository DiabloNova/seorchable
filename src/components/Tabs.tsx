"use client";

import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  activeTabId,
  onTabChange,
  className = "",
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const isControlled = activeTabId !== undefined;
  const activeTab = isControlled ? activeTabId : localActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!isControlled) {
      setLocalActiveTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tabs Header */}
      <div className="border-b border-[var(--border)]">
        <nav className="-mb-px flex gap-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? "border-[var(--color-accent-600)] text-[var(--color-accent-600)] font-semibold"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
