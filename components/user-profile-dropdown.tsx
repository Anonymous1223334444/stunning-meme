"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { UserProfile } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { User, Settings, CreditCard, CircleHelp as HelpCircle, LogOut, Moon, Sun, Activity, Bell, Shield } from "lucide-react"
import { useTheme } from "next-themes"

interface UserProfileDropdownProps {
  user?: UserProfile | null;
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return null; // Or a loading spinner
  }

  const handleLogout = async () => {
    await signOut()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const userName = user.full_name || "Utilisateur"
  const userEmail = user.email || ""
  const userRole = user.role === 'admin' ? 'Administrateur' : 'Utilisateur'
  const avatarSrc = user.avatar_url || "/placeholder-user.jpg"

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full overflow-hidden border border-border hover:bg-accent/50 transition-all duration-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarSrc} alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
              {userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 p-0 bg-background border-border overflow-hidden shadow-xl rounded-xl"
        align="end"
      >
        <div className="p-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={avatarSrc} alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                {userName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userRole}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">En ligne</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-1">
          <DropdownMenuLabel className="p-0">
            <div className="p-2 text-xs text-muted-foreground font-medium">Compte</div>
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="py-2">
            <User className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="p-0">
            <div className="p-2 text-xs text-muted-foreground font-medium">Paramètres</div>
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="py-2" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Thème {theme === "dark" ? "Clair" : "Sombre"}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-2">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="p-0">
            <div className="p-2 text-xs text-muted-foreground font-medium">Support</div>
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="py-2">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Aide & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-2">
            <Activity className="mr-2 h-4 w-4" />
            <span>Journal d'activité</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            className="py-2 text-destructive focus:text-destructive" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}