"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MainFormSchema, MainFormValuesType } from "./schemas/MainFormSchema";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BookData } from "@/types/BookData";

export function SimpleForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
    size: string;
  } | null>(null);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MainFormValuesType>({
    resolver: zodResolver(MainFormSchema),
    defaultValues: {
      url: "",
    },
    mode: "onChange",
  });


  const onSubmit = (data: MainFormValuesType) => {
    setIsLoading(true);
    const hasUrl = data.url && data.url.trim() !== "";
    const hasFile = data.file && data.file.length > 0;

    if (!hasUrl && !hasFile) {
      console.error("Erreur: Aucun champ n'est rempli");
      setIsLoading(false);
      return;
    }

    if (hasUrl && hasFile) {
      console.error("Erreur: Les deux champs sont remplis");
      setIsLoading(false);
      return;
    }

    if (data.file && data.file.length > 0) {
      const file = data.file[0];
      const fileSizeInKB = file.size / 1024;
      const fileSizeStr =
          fileSizeInKB < 1024
              ? `${fileSizeInKB.toFixed(2)} KB`
              : `${(fileSizeInKB / 1024).toFixed(2)} MB`;

      console.log("Fichier PDF soumis:", {
        name: file.name,
        type: file.type,
        size: fileSizeStr,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });

      if (file.type !== "application/pdf") {
        console.error("Erreur: Le fichier n'est pas un PDF");
        return;
      }

      // Création d'un form-data et ajout du fichier
      const formData = new FormData();
      formData.append('file', file);

      // Envoi du fichier en POST via le proxy Next.js
      axios.post('/api/stay/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            console.log("Réponse du serveur:", response.data);
            // Stocker les données reçues
            setBookData(response.data);
            console.log("Formulaire valide, soumission réussie!");
            setIsSubmitted(true);
          })
          .catch(error => {
            console.error("Erreur lors de l'envoi du fichier:", error);
            setIsLoading(false);
          });
    } else if (hasUrl) {
      // Traitement de l'URL (à implémenter si nécessaire)
      console.log("Formulaire valide, soumission réussie!");
      setIsSubmitted(true);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {

    // Vérifier si nous avons un événement ou une valeur directe de react-hook-form
    const files = e.target?.files || e;

    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);

      const fileSizeInKB = file.size / 1024;
      const fileSizeStr =
        fileSizeInKB < 1024
          ? `${fileSizeInKB.toFixed(2)} KB`
          : `${(fileSizeInKB / 1024).toFixed(2)} MB`;

      setFileInfo({
        name: file.name,
        type: file.type,
        size: fileSizeStr,
      });

      setValue("file", files);

      // Forcer la mise à jour du formulaire
      setTimeout(() => {
        console.log("Valeurs du formulaire après import:", watch());
      }, 100);
    } else {
      setFileName("");
      setFileInfo(null);
      setValue("file", undefined);
    }
  };

  useEffect(() => {
    if(isSubmitted && bookData) {
      // Stocker les données dans le localStorage pour les récupérer sur la page suivante
      localStorage.setItem('bookData', JSON.stringify(bookData));
      router.push('/owner-edit-book');
    }
  }, [isSubmitted, bookData, router])

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">
        Pour commencer, quelques informations
      </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Je renseigne l'URL de mon logement
            </label>
            <Input
              id="url"
              type="text"
              placeholder="airbnb.com/mon-super-logement"
              {...register("url")}
              className={errors.url ? "border-destructive" : ""}
            />
          </div>

          <h3 className="text-xl font-bold text-center">ou</h3>

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              J'importe mon livret d'accueil (PDF uniquement)
            </label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="file"
                className={`flex items-center justify-center w-full h-10 px-4 py-2 text-sm border rounded-md cursor-pointer ${
                  errors.file ? "border-destructive" : "border-input"
                } hover:bg-secondary`}
              >
                <span className="truncate">
                  {fileName || "Choisir un fichier PDF"}
                </span>
                <input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {errors.url && (
            <p className="text-sm text-destructive">
              {errors.url.message?.toString()}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 my-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
            disabled={isSubmitting || isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? 'Chargement...' : 'Je crée mon livret'}
          </button>

          <Link
            href={"/customer"}
            className="block w-full text-center text-sm opacity-75 hover:underline"
          >
            Je n'ai aucune de ces solutions
          </Link>
        </form>

    </div>
  );
}
