'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookData } from '@/types/BookData';
import { BookFormSchema, BookFormValuesType } from './schemas/BookFormSchema';
import InputForm from './InputForm';
import { PlusCircle, Palmtree, Plane, Home, MapPin } from 'lucide-react';
import Recommendation from './Recommendation';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const convertBookDataToFormValues = (data: BookData | undefined): BookFormValuesType => {
  return {
    id: data?.id,
    arrivalTime: data?.arrivalTime || '',
    accessInstructions: data?.accessInstructions || '',
    arrivalAdditionalInfo: data?.arrivalAdditionalInfo || '',
    departureTime: data?.departureTime || '',
    exitInstructions: data?.exitInstructions || '',
    departureAdditionalInfo: data?.departureAdditionalInfo || '',
    wifiName: data?.wifiName || '',
    wifiPassword: data?.wifiPassword || '',
    houseRules: data?.houseRules || '',
    ownerContact: data?.ownerContact || '',
    ownerName: data?.ownerName || '',
    generalInfo: data?.generalInfo || '',
    recommendations: data?.recommendations || [],
  };
};

const convertFormValuesToBookData = (values: BookFormValuesType): BookData => {
  return {
    id: values.id,
    arrivalTime: values.arrivalTime,
    accessInstructions: values.accessInstructions,
    arrivalAdditionalInfo: values.arrivalAdditionalInfo || '',
    departureTime: values.departureTime,
    exitInstructions: values.exitInstructions,
    departureAdditionalInfo: values.departureAdditionalInfo || '',
    wifiName: values.wifiName,
    wifiPassword: values.wifiPassword,
    houseRules: values.houseRules,
    ownerContact: values.ownerContact,
    ownerName: values.ownerName,
    generalInfo: values.generalInfo || '',
    recommendations: values.recommendations || [],
  };
};

interface BookEditFormProps {
  initialData?: BookData;
  onSubmit?: (data: BookData) => void;
}

export function BookEditForm({ initialData, onSubmit }: BookEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookFormValuesType>({
    resolver: zodResolver(BookFormSchema) as any,
    defaultValues: convertBookDataToFormValues(initialData),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recommendations",
  });

  const handleFormSubmit = (data: BookFormValuesType) => {
    setIsSaving(true);

    const bookData = convertFormValuesToBookData(data);

    if (onSubmit) {
      onSubmit(bookData);
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

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

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      onSubmit={handleSubmit(handleFormSubmit as any)}
      className="space-y-8 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-8 shadow-lg border border-amber-100"
    >
      <Accordion type="single" collapsible  className="w-full space-y-4">
      <AccordionItem value="arrival" className="border-none" >
        <motion.div
          variants={itemVariants}
          className="bg-white/80 rounded-lg shadow-sm border-l-4 border-[#f04c23] overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-orange-50/50 transition-all">
            <span className="text-xl font-semibold text-[#f04c23] flex items-center gap-2">
              <Plane className="h-5 w-5" /> Arrivée
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 space-y-4">

        <InputForm
          label="Heure d'arrivée"
          name="arrivalTime"
          placeholder="Ex: 15:00"
          register={register}
          errors={errors}
        />

        <InputForm
          label="Instructions d'accès"
          name="accessInstructions"
          placeholder="Comment accéder au logement"
          register={register}
          errors={errors}
        />

        <InputForm
          label="Informations supplémentaires"
          name="arrivalAdditionalInfo"
          placeholder="Autres informations utiles pour l'arrivée"
          register={register}
          errors={errors}
        />
          </AccordionContent>
        </motion.div>
      </AccordionItem>

      <AccordionItem value="departure" className="border-none">
        <motion.div
          variants={itemVariants}
          className="bg-white/80 rounded-lg shadow-sm border-l-4 border-pink-400 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-pink-50/50 transition-all">
            <span className="text-xl font-semibold text-pink-500 flex items-center gap-2">
              <Plane className="h-5 w-5 rotate-180" /> Départ
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 space-y-4">

        <InputForm
          label="Heure de départ"
          name="departureTime"
          placeholder="Ex: 11:00"
          register={register}
          errors={errors}
        />

        <InputForm
          label="Instructions de sortie"
          name="exitInstructions"
          placeholder="Comment quitter le logement"
          register={register}
          errors={errors}
        />

        <InputForm
          label="Informations supplémentaires"
          name="departureAdditionalInfo"
          placeholder="Autres informations utiles pour le départ"
          register={register}
          errors={errors}
        />
          </AccordionContent>
        </motion.div>
      </AccordionItem>

      <AccordionItem value="accommodation" className="border-none">
        <motion.div
          variants={itemVariants}
          className="bg-white/80 rounded-lg shadow-sm border-l-4 border-amber-400 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-amber-50/50 transition-all">
            <span className="text-xl font-semibold text-amber-500 flex items-center gap-2">
              <Home className="h-5 w-5" /> Hébergement
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <InputForm
            label="Nom du réseau Wifi"
            name="wifiName"
            placeholder="Nom du réseau Wifi"
            register={register}
            errors={errors}
          />

          <InputForm
            label="Mot de passe Wifi"
            name="wifiPassword"
            placeholder="Mot de passe Wifi"
            register={register}
            errors={errors}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="houseRules" className="text-sm font-medium">
            Règles de la maison
          </label>
          <textarea
            id="houseRules"
            placeholder="Entrez chaque règle sur une nouvelle ligne"
            {...register('houseRules')}
            className={`w-full min-h-[100px] rounded-md border ${errors.houseRules ? 'border-destructive' : 'border-input'} bg-transparent px-3 py-2 text-sm shadow-sm`}
          />
          <p className="text-xs text-muted-foreground">Entrez chaque règle sur une nouvelle ligne</p>
          {errors.houseRules && (
            <p className="text-sm text-destructive">{errors.houseRules.message?.toString()}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputForm
            label="Nom du propriétaire"
            name="ownerName"
            placeholder="Votre nom"
            register={register}
            errors={errors}
          />

          <InputForm
            label="Contact du propriétaire"
            name="ownerContact"
            placeholder="Votre numéro de téléphone"
            register={register}
            errors={errors}
          />
        </div>

        <InputForm
          label="Informations générales"
          name="generalInfo"
          placeholder="Autres informations utiles sur le logement"
          register={register}
          errors={errors}
        />
          </AccordionContent>
        </motion.div>
      </AccordionItem>

      <AccordionItem value="recommendations" className="border-none">
        <motion.div
          variants={itemVariants}
          className="bg-white/80 rounded-lg shadow-sm border-l-4 border-teal-400 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-teal-50/50 transition-all">
            <span className="text-xl font-semibold text-teal-600 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Recommandations
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 space-y-4">
            <p className="text-sm text-teal-700/70">Ajoutez des recommandations pour vos invités (restaurants, activités, bars, etc.)</p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Recommendation
              key={field.id}
              field={field}
              index={index}
              register={register}
              errors={errors}
              remove={remove}
            />
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => append({ name: '', type: '' as any, address: '', description: '' })}
            className="flex items-center justify-center w-full py-3 px-4 border border-dashed rounded-md bg-gradient-to-r from-teal-400 to-teal-300 text-white hover:from-teal-500 hover:to-teal-400 transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle size={18} className="mr-2" />
            Ajouter une recommandation
          </motion.button>
        </div>
          </AccordionContent>
        </motion.div>
      </AccordionItem>
      </Accordion>

      <motion.div
        variants={itemVariants}
        className="flex justify-end mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-[#f04c23] to-pink-500 text-white rounded-md hover:from-[#f04c23] hover:to-pink-400 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {isSaving ? 'Création en cours...' : 'Créer mon livret'}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
