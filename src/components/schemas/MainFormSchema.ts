import { z } from "zod";

export const MainFormSchema = z.object({
  url: z.string().optional(),
  file: z.any()
    .optional()
    .transform(val => {
      return val;
    })
    .superRefine((files, ctx) => {

      if (files && files instanceof FileList && files.length > 0) {
        const file = files[0];
        console.log('Fichier détecté dans superRefine:', file.name, file.type);

        if (file.type !== 'application/pdf') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Le fichier doit être au format PDF",
          });
        }
      }
    })
}).superRefine((data, ctx) => {
  const hasUrl = data.url && data.url.trim() !== '';
  const hasFile = data.file && data.file instanceof FileList && data.file.length > 0;


  // Vérifier qu'exactement un des deux champs est rempli
  if (!hasUrl && !hasFile) {
    // Aucun champ rempli
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Veuillez fournir une URL ou importer un fichier PDF",
      path: ['url'],
    });
  } else if (hasUrl && hasFile) {
    // Les deux champs sont remplis
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Veuillez fournir soit une URL, soit un fichier PDF, mais pas les deux",
      path: ['url'],
    });
  }
});

export type MainFormValuesType = z.infer<typeof MainFormSchema>;