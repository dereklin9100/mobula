
import { LanguageItem } from "@repo/ui/components/languageSwitcher"
import { US, CN } from "country-flag-icons/react/3x2"

export const LANGUAGES:LanguageItem[] = [
  {
    locale: "en",
    label: "English",
    Flag: US,
  },
  {
    locale: "zh",
    label: "中文",
    Flag: CN,
  },
]