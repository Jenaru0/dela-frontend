import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-[#E6D5A8] bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-[#CC9F53] focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
