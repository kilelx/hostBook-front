"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MainFormSchema, MainFormValuesType } from "./schemas/MainFormSchema";

export function SimpleForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
    size: string;
  } | null>(null);

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
    mode: "onChange", // Valider à chaque changement
  });

  // Observer les valeurs du formulaire pour le débogage
  const watchedValues = watch();

  const onSubmit = (data: MainFormValuesType) => {
    console.log("Données du formulaire:", data);

    // Vérification manuelle des champs
    const hasUrl = data.url && data.url.trim() !== "";
    const hasFile = data.file && data.file.length > 0;

    console.log("Vérification manuelle - hasUrl:", hasUrl, "hasFile:", hasFile);

    // Vérifier qu'un seul champ est rempli
    if (!hasUrl && !hasFile) {
      console.error("Erreur: Aucun champ n'est rempli");
      return;
    }

    if (hasUrl && hasFile) {
      console.error("Erreur: Les deux champs sont remplis");
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

      // Vérifier que le fichier est un PDF
      if (file.type !== "application/pdf") {
        console.error("Erreur: Le fichier n'est pas un PDF");
        return;
      }

      // Vous pourriez ici envoyer le fichier à un serveur ou le traiter
      // Par exemple : const formData = new FormData(); formData.append('file', file);
    }

    console.log("Formulaire valide, soumission réussie!");
    setIsSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    console.log("handleFileChange appelé");
    console.log("Event:", e);

    // Vérifier si nous avons un événement ou une valeur directe de react-hook-form
    const files = e.target?.files || e;

    console.log("Files détectés:", files);

    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);

      // Convertir la taille du fichier en format lisible
      const fileSizeInKB = file.size / 1024;
      const fileSizeStr =
        fileSizeInKB < 1024
          ? `${fileSizeInKB.toFixed(2)} KB`
          : `${(fileSizeInKB / 1024).toFixed(2)} MB`;

      // Stocker les informations du fichier
      setFileInfo({
        name: file.name,
        type: file.type,
        size: fileSizeStr,
      });

      console.log("Fichier importé:", {
        name: file.name,
        type: file.type,
        size: fileSizeStr,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });

      // Mettre à jour explicitement la valeur du champ file dans le formulaire
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

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">
        Pour commencer, quelques informations
      </h2>

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
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            Je crée mon livret
          </button>

          <Link
            href={"/customer"}
            className="block w-full text-center text-sm opacity-75 hover:underline"
          >
            Je n'ai aucune de ces solutions
          </Link>
        </form>
      )}
    </div>
  );
}
