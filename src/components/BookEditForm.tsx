'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookData, RecommendationType } from '@/types/BookData';
import { BookFormSchema, BookFormValuesType } from './schemas/BookFormSchema';
import InputForm from './InputForm';
import { PlusCircle } from 'lucide-react';
import Recommendation from './Recommendation';

// Fonction pour convertir les données du backend au format du formulaire
const convertBookDataToFormValues = (data: BookData): BookFormValuesType => {
  return {
    id: data.id,

    // Arrivée
    arrivalTime: data.arrivalTime || '',
    accessInstructions: data.accessInstructions || '',
    arrivalAdditionalInfo: data.arrivalAdditionalInfo || '',

    // Départ
    departureTime: data.departureTime || '',
    exitInstructions: data.exitInstructions || '',
    departureAdditionalInfo: data.departureAdditionalInfo || '',

    // Hébergement
    wifiName: data.wifiName || '',
    wifiPassword: data.wifiPassword || '',
    houseRules: data.houseRules || '',
    ownerContact: data.ownerContact || '',
    ownerName: data.ownerName || '',
    generalInfo: data.generalInfo || '',

    // Recommandations
    recommendations: data.recommendations || [],
  };
};

// Fonction pour convertir les valeurs du formulaire au format du backend
const convertFormValuesToBookData = (values: BookFormValuesType): BookData => {
  return {
    id: values.id,

    // Arrivée
    arrivalTime: values.arrivalTime,
    accessInstructions: values.accessInstructions,
    arrivalAdditionalInfo: values.arrivalAdditionalInfo || '',

    // Départ
    departureTime: values.departureTime,
    exitInstructions: values.exitInstructions,
    departureAdditionalInfo: values.departureAdditionalInfo || '',

    // Hébergement
    wifiName: values.wifiName,
    wifiPassword: values.wifiPassword,
    houseRules: values.houseRules,
    ownerContact: values.ownerContact,
    ownerName: values.ownerName,
    generalInfo: values.generalInfo || '',

    // Recommandations
    recommendations: values.recommendations || [],
  };
};

// Données d'exemple (à remplacer par les données réelles du backend)
const sampleBookData: BookData = {
  id: "sample-id",

  // Arrivée
  arrivalTime: "15:00",
  accessInstructions: "La clé se trouve dans la boîte à clés à côté de la porte. Code: 1234",
  arrivalAdditionalInfo: "Merci de me prévenir 30 minutes avant votre arrivée",

  // Départ
  departureTime: "11:00",
  exitInstructions: "Veuillez laisser les clés sur la table de la cuisine et fermer la porte derrière vous",
  departureAdditionalInfo: "Merci d'éteindre tous les appareils électriques avant de partir",

  // Hébergement
  wifiName: "VillaBella_WiFi",
  wifiPassword: "welcome2023",
  houseRules: "Pas de fête\nPas de fumée à l'intérieur\nAnimaux non autorisés",
  ownerContact: "+33 6 12 34 56 78",
  ownerName: "Jean Dupont",
  generalInfo: "Bienvenue dans notre villa avec vue sur la mer. Profitez de votre séjour!",

  // Recommandations
  recommendations: [
    {
      id: "rec1",
      name: "Le Bistrot Méditerranéen",
      address: "10 Rue de la Mer, 06000 Nice",
      description: "Excellent restaurant avec vue sur la mer",
      type: RecommendationType.RESTAURANT
    },
    {
      id: "rec2",
      name: "Plage de la Promenade",
      address: "Promenade des Anglais, 06000 Nice",
      description: "Magnifique plage de sable fin",
      type: RecommendationType.ACTIVITY
    },
    {
      id: "rec3",
      name: "Bar du Port",
      address: "5 Quai des Bateaux, 06000 Nice",
      description: "Bar avec vue sur le port et cocktails délicieux",
      type: RecommendationType.BAR
    },
    {
      id: "rec4",
      name: "Musée d'Art Moderne",
      address: "Place des Arts, 06000 Nice",
      description: "Musée avec une collection impressionnante d'art contemporain",
      type: RecommendationType.TOURISM
    },
    {
      id: "rec5",
      name: "Supermarché Bio",
      address: "15 Avenue Principale, 06000 Nice",
      description: "Supermarché proposant des produits bio et locaux",
      type: RecommendationType.GROCERY
    }
  ]
};

interface BookEditFormProps {
  initialData?: BookData;
  onSubmit?: (data: BookData) => void;
}

export function BookEditForm({ initialData = sampleBookData, onSubmit }: BookEditFormProps) {
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

  // Utilisation de useFieldArray pour gérer les recommandations
  const { fields, append, remove } = useFieldArray({
    control,
    name: "recommendations",
  });

  const handleFormSubmit = (data: BookFormValuesType) => {
    setIsSaving(true);

    // Convertir les données du formulaire au format attendu par le backend
    const bookData = convertFormValuesToBookData(data);

    // Appeler la fonction onSubmit si elle est fournie
    if (onSubmit) {
      onSubmit(bookData);
    }

    console.log('Données soumises:', bookData);

    // Simuler un délai de sauvegarde
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-8">
      {/* Arrivée */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Arrivée</h2>

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
      </div>

      {/* Départ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Départ</h2>

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
      </div>

      {/* Hébergement */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hébergement</h2>

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
      </div>

      {/* Recommandations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommandations</h2>
        <p className="text-sm text-muted-foreground">Ajoutez des recommandations pour vos invités (restaurants, activités, bars, etc.)</p>

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

          <button
            type="button"
            onClick={() => append({ name: '', type: '' as any, address: '', description: '' })}
            className="flex items-center justify-center w-full py-2 px-4 border border-dashed rounded-md hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <PlusCircle size={18} className="mr-2" />
            Ajouter une recommandation
          </button>
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
