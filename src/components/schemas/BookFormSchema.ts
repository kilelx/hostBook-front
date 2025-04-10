import { z } from "zod";
import { RecommendationType } from "@/types/BookData";

// Schéma pour les recommandations
const recommendationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(RecommendationType)
});

// Schéma de validation pour le formulaire
export const BookFormSchema = z.object({
  id: z.string().optional(),
  
  // Arrivée
  arrivalTime: z.string().min(1, "L'heure d'arrivée est requise"),
  accessInstructions: z.string().min(1, "Les instructions d'accès sont requises"),
  arrivalAdditionalInfo: z.string().optional(),
  
  // Départ
  departureTime: z.string().min(1, "L'heure de départ est requise"),
  exitInstructions: z.string().min(1, "Les instructions de sortie sont requises"),
  departureAdditionalInfo: z.string().optional(),
  
  // Hébergement
  wifiName: z.string().min(1, "Le nom du réseau WiFi est requis"),
  wifiPassword: z.string().min(1, "Le mot de passe WiFi est requis"),
  houseRules: z.string().min(1, "Les règles de la maison sont requises"),
  ownerContact: z.string().min(1, "Le contact du propriétaire est requis"),
  ownerName: z.string().min(1, "Le nom du propriétaire est requis"),
  generalInfo: z.string().optional(),
  
  // Recommandations
  recommendations: z.array(recommendationSchema).optional().default([])
});

export type BookFormValuesType = z.infer<typeof BookFormSchema>;
