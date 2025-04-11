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
import { motion } from "framer-motion";
import { FileUp, Link2, Palmtree, Sun, Upload } from "lucide-react";

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

  // Définir les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

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
    const hasFile = data.file && data.file.length > 0;

    if (!hasFile) {
      console.error("Erreur: Aucun fichier n'est sélectionné");
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg border border-amber-100"
    >
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palmtree className="h-7 w-7 text-[#f04c23]" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f04c23] to-pink-500 bg-clip-text text-transparent">
            Créez votre livret d'accueil
          </h2>
          <Sun className="h-7 w-7 text-amber-400" />
        </div>
        <motion.p variants={itemVariants} className="text-gray-600">
          Pour commencer, importez votre livret existant ou indiquez l'URL de votre logement
        </motion.p>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-2 bg-white/80 p-5 rounded-lg shadow-sm border-l-4 border-gray-300 opacity-70">
            <div className="flex items-center justify-between">
              <label htmlFor="url" className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Link2 className="h-4 w-4 text-gray-400" />
                Je renseigne l'URL de mon logement
              </label>
              <span className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-600 rounded-full">Prochainement</span>
            </div>
            <Input
              id="url"
              type="text"
              placeholder="Fonctionnalité disponible prochainement"
              disabled
              className="bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center"
          >
            <span className="h-px w-16 bg-amber-200"></span>
            <h3 className="text-xl font-medium text-center px-4 text-amber-700">ou</h3>
            <span className="h-px w-16 bg-amber-200"></span>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3 bg-white/80 p-5 rounded-lg shadow-sm border-l-4 border-pink-400">
            <label htmlFor="file" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileUp className="h-4 w-4 text-pink-500" />
              J'importe mon livret d'accueil (PDF uniquement)
            </label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="file"
                className={`flex items-center justify-center w-full h-12 px-4 py-2 text-sm border border-amber-100 rounded-md cursor-pointer ${
                  errors.file ? "border-destructive" : ""
                } bg-white/90 hover:bg-pink-50 transition-all`}
              >
                <Upload className="h-4 w-4 mr-2 text-pink-500" />
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
            {fileInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-gray-500 bg-amber-50 p-2 rounded border border-amber-100"
              >
                <p>Fichier: <span className="font-medium">{fileInfo.name}</span></p>
                <p>Taille: <span className="font-medium">{fileInfo.size}</span></p>
              </motion.div>
            )}
          </motion.div>

          {/* Les erreurs d'URL sont désactivées car la fonctionnalité n'est pas encore disponible */}

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 my-4 bg-gradient-to-r from-[#f04c23] to-pink-500 text-white rounded-md hover:from-[#f04c23] hover:to-pink-400 transition-all shadow-md disabled:opacity-50 font-medium"
            disabled={isSubmitting || isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement...
              </div>
            ) : 'Je crée mon livret'}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center">
            <Link
              href={"/customer"}
              className="inline-block text-center text-sm text-amber-700 hover:text-[#f04c23] transition-colors hover:underline"
            >
              Je n'ai aucune de ces solutions
            </Link>
          </motion.div>
        </motion.form>

    </motion.div>
  );
}
