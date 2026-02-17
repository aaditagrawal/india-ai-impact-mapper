"use client"

import { useCallback, useSyncExternalStore } from "react"

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("dark")
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  // Initialize from localStorage/system preference on first subscribe
  const stored = localStorage.getItem("theme")
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
  const shouldBeDark = stored === "dark" || (!stored && prefersDark)
  document.documentElement.classList.toggle("dark", shouldBeDark)

  return () => observer.disconnect()
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }, [])

  return { dark, toggle }
}
