"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ILanguage } from "@/models/Language/type";

const languages: ILanguage[] = [
  {
    code: "vi",
    name: "Tiếng Việt",
    flag: "🇻🇳",
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "kr",
    name: "한국어",
    flag: "🇰🇷",
  }
];

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="relative">
          <span className="text-lg font-bold">
            {i18n.language?.toUpperCase() || "EN"}
          </span>
          <span className="sr-only">{t("language.selector")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-2 text-xl"
          >
            <span className="text-lg">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
