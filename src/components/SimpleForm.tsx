'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Définition du schéma de validation avec Zod
const formSchema = z.object({
  url: z.string().optional(),
  file: z.instanceof(FileList).optional()
    .superRefine((files, ctx) => {
      if (files && files.length > 0) {
        const file = files[0];
        if (file && file.type !== 'application/pdf') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Le fichier doit être au format PDF",
          });
        }
      }
    })
}).superRefine((data, ctx) => {
  // Vérifier qu'au moins l'URL ou le fichier est fourni
  if ((!data.url || data.url.trim() === '') && (!data.file || data.file.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Veuillez fournir une URL ou importer un fichier PDF",
      path: ['url'], // Afficher l'erreur sous le champ URL
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

export function SimpleForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    if (data.file && data.file.length > 0) {
      console.log('Fichier PDF:', data.file[0].name, data.file[0].type);
    }
    setIsSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Pour commencer, quelques informations</h2>

      {isSubmitted ? (
        <div className="p-4 bg-success/20 text-success rounded-md">
          <p className="text-center">Formulaire soumis avec succès!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Je renseigne l'URL de mon logement
            </label>
            <Input
              id="url"
              type="text"
              placeholder="airbnb.com/mon-super-logement"
              {...register('url')}
              className={errors.url ? 'border-destructive' : ''}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>

          <h3 className='text-xl font-bold text-center'>ou</h3>

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              J'importe mon livret d'accueil (PDF uniquement)
            </label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="file"
                className={`flex items-center justify-center w-full h-10 px-4 py-2 text-sm border rounded-md cursor-pointer ${errors.file ? 'border-destructive' : 'border-input'} hover:bg-secondary`}
              >
                <span className="truncate">
                  {fileName || "Choisir un fichier PDF"}
                </span>
                <input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  {...register('file')}
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.file && (
              <p className="text-sm text-destructive">{errors.file.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Je crée mon livret
          </button>

          <Link href={'/customer'} className='block w-full text-center text-sm opacity-75 hover:underline'>Je n'ai aucune de ces solutions</Link>
        </form>
      )}
    </div>
  );
}
