"use client"
import type, { ElementType } from "react"

import { Check } from "lucide-react"

import { Button } from "./base/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./base/dropdown-menu"

export type LanguageItem = {
    locale: string
    label: string
    Flag: ElementType
}

interface LanguageSwitcherProps {
    value: string
    languages: LanguageItem[]
    onChange: (locale: string) => void
}

export function LanguageSwitcher({
    value,
    languages,
    onChange,
}: LanguageSwitcherProps) {
    console.log("LanguageSwitcher value:", value)
    const current = languages.find((l) => l.locale === value)
    console.log("LanguageSwitcher current:", current)

    if (!current) return null

    const CurrentFlag = current.Flag

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <CurrentFlag className="h-4 w-6" />
                    <span className="text-sm">{current.label}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {
                    languages.map(({ locale, label, Flag }) => (
                        <DropdownMenuItem
                            key={locale}
                            className="flex items-center gap-2"
                            onClick={() => onChange(locale)}
                        >
                            <Flag className="h-4 w-6" />
                            <span className="flex-1">{label}</span>
                            {locale === value && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}