"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  label: string;
  value: string;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const isInteractive = (element: React.ReactNode): boolean => {
    if (React.isValidElement(element)) {
      const type = element.type;
      return typeof type === "string" && ["button", "a", "input", "select", "textarea"].includes(type);
    }
    return false;
  };

  const renderTrigger = () => {
    if (isInteractive(trigger) && React.isValidElement<{
      onClick?: (e: React.MouseEvent) => void;
      onKeyDown?: (e: React.KeyboardEvent) => void;
      "aria-haspopup"?: string;
      "aria-expanded"?: boolean;
    }>(trigger)) {
      // For native interactive elements like <button>, Enter and Space
      // automatically trigger the onClick event. We don't need to add
      // our own onKeyDown handler for Enter/Space to avoid double-toggling.
      return React.cloneElement(trigger, {
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        onClick: (e: React.MouseEvent) => {
          setIsOpen(!isOpen);
          if (trigger.props.onClick) {
            trigger.props.onClick(e);
          }
        }
      });
    }

    // For non-interactive elements, we must provide full keyboard semantics
    return (
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="cursor-pointer inline-block"
      >
        {trigger}
      </div>
    );
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {renderTrigger()}

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "end-0" : "start-0"
          } mt-2 w-56 rounded-[var(--radius-md)] bg-[var(--background)] border border-[var(--border)] shadow-[var(--shadow-lg)] ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card)] hover:text-[var(--text-primary)] transition-colors duration-100 flex items-center justify-between rtl:text-right"
                role="menuitem"
                onClick={() => handleItemClick(item)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
