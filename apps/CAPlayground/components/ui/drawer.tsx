"use client"

import * as React from "react"
import { cn } from "@/lib/utils"


type DivProps = React.ComponentProps<"div">

function Drawer(props: DivProps) {
  return <div data-slot="drawer" {...props} />
}

function DrawerTrigger(props: React.ComponentProps<"button">) {
  return <button data-slot="drawer-trigger" {...props} />
}

function DrawerPortal(props: { children?: React.ReactNode }) {
  return <>{props.children}</>
}

function DrawerClose(props: React.ComponentProps<"button">) {
  return <button data-slot="drawer-close" {...props} />
}

function DrawerOverlay({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  )
}

function DrawerContent({ className, children, ...props }: DivProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <div
        data-slot="drawer-content"
        className={cn(
          "bg-background fixed bottom-0 inset-x-0 z-50 flex max-h-[80vh] flex-col rounded-t-lg border-t",
          className,
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full" />
        {children}
      </div>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-0.5 p-4 text-center md:text-left", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: DivProps) {
  return (
    <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="drawer-title" className={cn("text-foreground font-semibold", className)} {...props} />
}

function DrawerDescription({ className, ...props }: DivProps) {
  return <div data-slot="drawer-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
