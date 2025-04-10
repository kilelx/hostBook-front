'use client';

import { BookEditForm } from '@/components/BookEditForm';

function EditFormBook() {
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

          <BookEditForm
            onSubmit={(data) => {
              console.log('Données du formulaire soumises:', data);
              // Ici, vous pourriez envoyer les données à votre API
              alert('Modifications enregistrées avec succès!');
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default EditFormBook;