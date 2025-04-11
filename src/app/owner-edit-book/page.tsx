'use client';

import { BookEditForm } from '@/components/BookEditForm';
import { useEffect, useState } from 'react';
import { BookData } from '@/types/BookData';
import { useRouter } from 'next/navigation';

function EditFormBook() {
  const router = useRouter();
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Récupérer les données du localStorage
    const storedData = localStorage.getItem('bookData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBookData(parsedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <section className="min-h-screen w-full bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">
            Le contenu de votre livret
          </h2>
          <div>
            <p className="text-center">
              Voici ce que nous avons pu générer pour votre livret.
            </p>
            <p className="text-center">N'hésitez pas à relire les informations, et à les modifier si nécessaire.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Chargement des données...</div>
          ) : (
            <BookEditForm
              initialData={bookData || undefined}
              onSubmit={async (data) => {
                try {
                  setIsSaving(true);
                  console.log('Données du formulaire soumises:', data);

                  // Envoyer les données à l'API
                  const response = await fetch('http://localhost:3001/api/stay', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(data),
                  });

                  if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                  }

                  const result = await response.json();
                  console.log('Réponse de l\'API:', result);

                  // Rediriger vers la page du livret avec l'ID retourné par l'API
                  router.push(`/welcome-book/${result.id}`);
                } catch (error) {
                  console.error('Erreur lors de l\'enregistrement des données:', error);
                  alert('Une erreur est survenue lors de l\'enregistrement des données. Veuillez réessayer.');
                } finally {
                  setIsSaving(false);
                }
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default EditFormBook;