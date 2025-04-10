import { Trash2 } from 'lucide-react';
import React from 'react';
import InputForm from './InputForm';
import { RecommendationType } from '@/types/BookData';
import { Select } from '@/components/ui/select';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { BookFormValuesType } from './schemas/BookFormSchema';

interface RecommendationProps {
  field: Record<string, any>;
  index: number;
  register: UseFormRegister<BookFormValuesType>;
  errors: FieldErrors<BookFormValuesType>;
  remove: (index: number) => void;
}

function Recommendation({ field, index, register, errors, remove }: RecommendationProps) {
  return (
    <div key={field.id} className="p-4 border rounded-md bg-muted/10 relative">
    <button
      type="button"
      onClick={() => remove(index)}
      className="absolute top-2 right-2 text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
      aria-label="Supprimer cette recommandation"
    >
      <Trash2 size={18} />
    </button>

    <div className="space-y-4">
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
    </div>
  </div>
  )
}

export default Recommendation