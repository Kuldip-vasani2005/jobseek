import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

class Avatar extends React.Component<React.ComponentProps<typeof AvatarPrimitive.Root>> {
  render() {
    const { className, ...props } = this.props;
    return (
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    );
  }
}

class AvatarImage extends React.Component<React.ComponentProps<typeof AvatarPrimitive.Image>> {
  render() {
    const { className, ...props } = this.props;
    return (
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        className={cn("aspect-square size-full", className)}
        {...props}
      />
    );
  }
}

class AvatarFallback extends React.Component<React.ComponentProps<typeof AvatarPrimitive.Fallback>> {
  render() {
    const { className, ...props } = this.props;
    return (
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className={cn(
          "bg-muted flex size-full items-center justify-center rounded-full",
          className
        )}
        {...props}
      />
    );
  }
}

export { Avatar, AvatarImage, AvatarFallback };