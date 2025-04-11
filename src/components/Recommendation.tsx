import { Trash2, Utensils, Music, Tent, ShoppingBag } from 'lucide-react';
import React from 'react';
import InputForm from './InputForm';
import { RecommendationType } from '@/types/BookData';
import { Select } from '@/components/ui/select';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { BookFormValuesType } from './schemas/BookFormSchema';
import { motion } from 'framer-motion';

interface RecommendationProps {
  field: Record<string, any>;
  index: number;
  register: UseFormRegister<BookFormValuesType>;
  errors: FieldErrors<BookFormValuesType>;
  remove: (index: number) => void;
}

function Recommendation({ field, index, register, errors, remove }: RecommendationProps) {
  // Animation pour les recommandations
  const recommendationVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      key={field.id}
      variants={recommendationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="p-5 border border-teal-100 rounded-md bg-gradient-to-br from-white to-teal-50/30 shadow-sm relative"
    >
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      type="button"
      onClick={() => remove(index)}
      className="absolute top-3 right-3 text-pink-500 hover:text-pink-700 transition-colors cursor-pointer bg-white rounded-full p-1 shadow-sm"
      aria-label="Supprimer cette recommandation"
    >
      <Trash2 size={18} />
    </motion.button>

    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
      <InputForm
        label="Nom"
        name={`recommendations.${index}.name`}
        placeholder="Nom de la recommandation"
        register={register}
        errors={errors}
      />

      <div className="space-y-2">
        <label htmlFor={`recommendations.${index}.type`} className="text-sm font-medium">
          Type
        </label>
        <Select
          id={`recommendations.${index}.type`}
          {...register(`recommendations.${index}.type`, { required: true })}
          className={errors.recommendations?.[index]?.type ? 'border-destructive' : ''}
          required
        >
          <option value="" disabled>Sélectionnez un type</option>
          <option value={RecommendationType.RESTAURANT}>Restaurant</option>
          <option value={RecommendationType.ACTIVITY}>Activité</option>
          <option value={RecommendationType.BAR}>Bar</option>
          <option value={RecommendationType.TOURISM}>Tourisme</option>
          <option value={RecommendationType.GROCERY}>Épicerie</option>
        </Select>
        {errors.recommendations?.[index]?.type && (
          <p className="text-sm text-destructive">Le type est requis</p>
        )}
      </div>

      <InputForm
        label="Adresse"
        name={`recommendations.${index}.address`}
        placeholder="Adresse"
        register={register}
        errors={errors}
      />

      <div className="space-y-2">
        <label htmlFor={`recommendations.${index}.description`} className="text-sm font-medium">
          Description
        </label>
        <textarea
          id={`recommendations.${index}.description`}
          placeholder="Description de la recommandation"
          {...register(`recommendations.${index}.description`)}
          className={`w-full min-h-[80px] rounded-md border ${errors.recommendations?.[index]?.description ? 'border-destructive' : 'border-input'} bg-transparent px-3 py-2 text-sm shadow-sm`}
        />
      </div>
    </motion.div>
  </motion.div>
  )
}

export default Recommendation