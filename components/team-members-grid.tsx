"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, Users } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  organization: string
  email: string
  phone?: string
  location: string
  expertise: string[]
  status: "active" | "busy" | "away"
  avatar?: string
  joinDate: string
  projectsCount: number
}

interface TeamMembersGridProps {
  organization: string
  members: TeamMember[]
  color: string
}

const organizationMembers: Record<string, TeamMember[]> = {
  SENUM: [
    {
      id: "senum-1",
      name: "Amadou DIALLO",
      role: "Directeur Technique",
      organization: "SENUM SA",
      email: "a.diallo@senum.sn",
      phone: "+221 77 123 4567",
      location: "Dakar, Sénégal",
      expertise: ["Infrastructure Fibre", "PPP", "Télécoms"],
      status: "active",
      joinDate: "2023-01-15",
      projectsCount: 4,
    },
    {
      id: "senum-2",
      name: "Fatou NDIAYE",
      role: "Chef de Projet Digital",
      organization: "SENUM SA",
      email: "f.ndiaye@senum.sn",
      location: "Dakar, Sénégal",
      expertise: ["Services Numériques", "E-Gov", "UX/UI"],
      status: "busy",
      joinDate: "2023-03-20",
      projectsCount: 3,
    },
    {
      id: "senum-3",
      name: "Moussa KANE",
      role: "Ingénieur Réseau",
      organization: "SENUM SA",
      email: "m.kane@senum.sn",
      location: "Dakar, Sénégal",
      expertise: ["Fibre Optique", "Réseaux", "Infrastructure"],
      status: "active",
      joinDate: "2023-02-10",
      projectsCount: 2,
    },
  ],
  ARTP: [
    {
      id: "artp-1",
      name: "Dr. Aissatou FALL",
      role: "Directrice Réglementation",
      organization: "ARTP",
      email: "a.fall@artp.sn",
      phone: "+221 77 234 5678",
      location: "Dakar, Sénégal",
      expertise: ["Réglementation", "Spectre", "Télécoms"],
      status: "active",
      joinDate: "2023-01-10",
      projectsCount: 5,
    },
    {
      id: "artp-2",
      name: "Ibrahima SARR",
      role: "Expert Technique",
      organization: "ARTP",
      email: "i.sarr@artp.sn",
      location: "Dakar, Sénégal",
      expertise: ["Gestion Spectre", "Analyse Technique", "USSD"],
      status: "active",
      joinDate: "2023-02-15",
      projectsCount: 3,
    },
  ],
  DTIC: [
    {
      id: "dtic-1",
      name: "Ousmane DIOP",
      role: "Directeur Cybersécurité",
      organization: "DTIC",
      email: "o.diop@dtic.gouv.sn",
      phone: "+221 77 345 6789",
      location: "Dakar, Sénégal",
      expertise: ["Cybersécurité", "LOSI", "Gouvernance IT"],
      status: "active",
      joinDate: "2023-01-20",
      projectsCount: 2,
    },
    {
      id: "dtic-2",
      name: "Mariama CISSE",
      role: "Juriste Numérique",
      organization: "DTIC",
      email: "m.cisse@dtic.gouv.sn",
      location: "Dakar, Sénégal",
      expertise: ["Droit Numérique", "RGPD", "Réglementation"],
      status: "away",
      joinDate: "2023-03-01",
      projectsCount: 2,
    },
  ],
  DT: [
    {
      id: "dt-1",
      name: "Cheikh MBAYE",
      role: "Ingénieur Télécoms",
      organization: "Direction Télécoms",
      email: "c.mbaye@telecom.gouv.sn",
      location: "Dakar, Sénégal",
      expertise: ["Infrastructure", "Connectivité", "Fibre Optique"],
      status: "busy",
      joinDate: "2023-02-01",
      projectsCount: 2,
    },
  ],
  FDSUT: [
    {
      id: "fdsut-1",
      name: "Awa DIAGNE",
      role: "Coordinatrice Projets",
      organization: "FDSUT",
      email: "a.diagne@fdsut.sn",
      phone: "+221 77 456 7890",
      location: "Dakar, Sénégal",
      expertise: ["Accès Universel", "Zones Rurales", "Gestion Projets"],
      status: "active",
      joinDate: "2023-01-25",
      projectsCount: 3,
    },
    {
      id: "fdsut-2",
      name: "Mamadou THIAM",
      role: "Ingénieur Terrain",
      organization: "FDSUT",
      email: "m.thiam@fdsut.sn",
      location: "Casamance, Sénégal",
      expertise: ["Déploiement", "Maintenance", "Terrain"],
      status: "active",
      joinDate: "2023-02-20",
      projectsCount: 2,
    },
  ],
  CSSDOS: [
    {
      id: "cssdos-1",
      name: "Dr. Khadija SECK",
      role: "Directrice e-Santé",
      organization: "CSSDOS",
      email: "k.seck@sante.gouv.sn",
      phone: "+221 77 567 8901",
      location: "Dakar, Sénégal",
      expertise: ["e-Santé", "Télémédecine", "SDIS"],
      status: "active",
      joinDate: "2023-01-30",
      projectsCount: 4,
    },
    {
      id: "cssdos-2",
      name: "Alioune BA",
      role: "Ingénieur Biomédical",
      organization: "CSSDOS",
      email: "a.ba@sante.gouv.sn",
      location: "Dakar, Sénégal",
      expertise: ["Équipements Médicaux", "Télémédecine", "IT Santé"],
      status: "busy",
      joinDate: "2023-02-25",
      projectsCount: 3,
    },
  ],
  SCP: [
    {
      id: "scp-1",
      name: "Bineta WADE",
      role: "Responsable Innovation",
      organization: "Senegal Connect",
      email: "b.wade@senegalconnect.sn",
      location: "Dakar, Sénégal",
      expertise: ["Innovation", "Start-ups", "Compétences Numériques"],
      status: "active",
      joinDate: "2023-03-10",
      projectsCount: 2,
    },
  ],
}

export function TeamMembersGrid({ organization, members, color }: TeamMembersGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "away":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Disponible"
      case "busy":
        return "Occupé"
      case "away":
        return "Absent"
      default:
        return "Inconnu"
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {members.map((member) => (
        <Card key={member.id} className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarFallback className="text-xs sm:text-sm font-semibold" style={{ backgroundColor: color }}>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${getStatusColor(
                    member.status,
                  )}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm sm:text-base truncate">{member.name}</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 pt-0">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{member.location}</span>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                <span className="hidden sm:inline">{member.projectsCount} projets actifs</span>
                <span className="sm:hidden">{member.projectsCount} projets</span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                <span className="hidden sm:inline">Depuis {new Date(member.joinDate).toLocaleDateString("fr-FR")}</span>
                <span className="sm:hidden">
                  {new Date(member.joinDate).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })}
                </span>
              </span>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium">Expertises :</p>
              <div className="flex flex-wrap gap-1">
                {member.expertise.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {member.expertise.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{member.expertise.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 sm:pt-2">
              <Badge variant="outline" className="text-xs">
                <span className="hidden sm:inline">{getStatusText(member.status)}</span>
                <span className="sm:hidden">
                  {member.status === "active" ? "✓" : member.status === "busy" ? "⚠" : "○"}
                </span>
              </Badge>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                {member.phone && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { organizationMembers }
