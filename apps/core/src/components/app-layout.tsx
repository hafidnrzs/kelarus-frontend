import { KeyRoundIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useNavigate } from "react-router"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/features/auth/session-context"

/** Shell for signed-in pages: top bar with the user menu. */
export function AppLayout() {
  const { session, signOut } = useSession()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          KELARUS
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
              <UserIcon />
              <span className="max-w-48 truncate">{session?.email}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="truncate">{session?.email}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings/password")}>
                <KeyRoundIcon />
                {t("userMenu.changePassword")}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => void signOut()}>
                <LogOutIcon />
                {t("userMenu.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
