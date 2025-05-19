import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
export function Popover({ children }) {
  // expects [<PopoverTrigger />, <PopoverContent />] as children
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Clone children to inject open state and setOpen
  const trigger = React.Children.toArray(children).find(
    (child) => child.type.displayName === "PopoverTrigger"
  );
  const content = React.Children.toArray(children).find(
    (child) => child.type.displayName === "PopoverContent"
  );

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {React.cloneElement(trigger, { open, setOpen })}
      {open && content}
    </div>
  );
}

export function PopoverTrigger({ children, open, setOpen, asChild }) {
  const child = React.Children.only(children);
  const props = {
    onClick: (e) => {
      if (child.props.onClick) child.props.onClick(e);
      setOpen((prev) => !prev);
    },
    className: `${child.props.className || ""} max-w-[300px] truncate`, // Add max-width and truncate
    style: { ...(child.props.style || {}), maxWidth: "300px" }, // Inline style fallback
  };
  return asChild
    ? React.cloneElement(child, props)
    : (
      <Button type="button" {...props}>
        {children}
      </Button>
    );
}
PopoverTrigger.displayName = "PopoverTrigger";

export function PopoverContent({ children, className = "" }) {
  return (
    <div
      className={`absolute z-50 mt-2 left-0 w-[300px] rounded-md bg-white shadow-lg border p-2 ${className}`}
    >
      {children}
    </div>
  );
}
PopoverContent.displayName = "PopoverContent";