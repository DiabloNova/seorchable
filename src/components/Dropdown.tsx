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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const renderTrigger = () => {
    if (React.isValidElement(trigger) && (trigger.type === 'button' || trigger.type === 'a' || (trigger.props as any).onClick !== undefined)) {
      return React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          if ((trigger.props as any).onClick) {
            (trigger.props as any).onClick(e);
          }
          toggleDropdown();
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if ((trigger.props as any).onKeyDown) {
            (trigger.props as any).onKeyDown(e);
          }
          handleKeyDown(e);
        },
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
      });
    }

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
    );
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef} onKeyDown={(e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    }}>
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
