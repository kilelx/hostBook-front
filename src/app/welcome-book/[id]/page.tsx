'use client';

import { useEffect, useState } from 'react';
import { BookData } from '@/types/BookData';
import { useParams } from 'next/navigation';

function ClientBook() {
  const params = useParams();
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3001/api/stay/${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setBookData(data);
      } catch (err) {
        setError('Impossible de récupérer les données du livret. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBookData();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <section className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Chargement du livret d'hébergement...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-xl">{error}</p>
        </div>
      </section>
    );
  }

  if (!bookData) {
    return (
      <section className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-xl">Livret d'hébergement introuvable.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">
            Bienvenue chez {bookData.ownerName}
          </h2>

          {/* Informations d'arrivée */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Arrivée</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Heure d'arrivée</p>
                <p>{bookData.arrivalTime}</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Instructions d'accès</p>
                <p>{bookData.accessInstructions}</p>
              </div>
            </div>
            {bookData.arrivalAdditionalInfo && (
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Informations supplémentaires</p>
                <p>{bookData.arrivalAdditionalInfo}</p>
              </div>
            )}
          </div>

          {/* Informations de départ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Départ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Heure de départ</p>
                <p>{bookData.departureTime}</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Instructions de sortie</p>
                <p>{bookData.exitInstructions}</p>
              </div>
            </div>
            {bookData.departureAdditionalInfo && (
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Informations supplémentaires</p>
                <p>{bookData.departureAdditionalInfo}</p>
              </div>
            )}
          </div>

          {/* Informations WiFi */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">WiFi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Nom du réseau</p>
                <p>{bookData.wifiName}</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Mot de passe</p>
                <p>{bookData.wifiPassword}</p>
              </div>
            </div>
          </div>

          {/* Règles de la maison */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Règles de la maison</h3>
            <div className="p-4 bg-muted/20 rounded-md">
              {bookData.houseRules.split('\n').map((rule, index) => (
                <div key={index} className="flex items-start mb-2">
                  <span className="mr-2">•</span>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommandations */}
          {bookData.recommendations && bookData.recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Recommandations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookData.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-muted/20 rounded-md">
                    <p className="font-medium">{rec.name}</p>
                    <p className="text-sm text-muted-foreground">{rec.type}</p>
                    {rec.address && <p className="text-sm">{rec.address}</p>}
                    {rec.description && <p className="mt-2">{rec.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact</h3>
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="font-medium">{bookData.ownerName}</p>
              <p>{bookData.ownerContact}</p>
            </div>
          </div>

          {/* Informations générales */}
          {bookData.generalInfo && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Informations générales</h3>
              <div className="p-4 bg-muted/20 rounded-md">
                <p>{bookData.generalInfo}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ClientBook;