'use client';

import { useEffect, useState } from 'react';
import { BookData } from '@/types/BookData';
import { useParams } from 'next/navigation';
import { Plane, Home, MapPin, Phone, Info, Wifi } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    <section className="min-h-screen w-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-white/90 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-amber-800">
            Bienvenue chez {bookData.ownerName}
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {/* Informations d'arrivée */}
            <AccordionItem value="arrival" className="border-none">
              <div className="bg-white/80 rounded-lg shadow-sm border-l-4 border-[#f04c23] overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-orange-50/50 transition-all">
                  <span className="text-xl font-semibold text-[#f04c23] flex items-center gap-2">
                    <Plane className="h-5 w-5" /> Arrivée
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50/30 rounded-md">
                      <p className="font-medium">Heure d'arrivée</p>
                      <p>{bookData.arrivalTime}</p>
                    </div>
                    <div className="p-4 bg-orange-50/30 rounded-md">
                      <p className="font-medium">Instructions d'accès</p>
                      <p>{bookData.accessInstructions}</p>
                    </div>
                  </div>
                  {bookData.arrivalAdditionalInfo && (
                    <div className="p-4 bg-orange-50/30 rounded-md">
                      <p className="font-medium">Informations supplémentaires</p>
                      <p>{bookData.arrivalAdditionalInfo}</p>
                    </div>
                  )}
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Informations de départ */}
            <AccordionItem value="departure" className="border-none">
              <div className="bg-white/80 rounded-lg shadow-sm border-l-4 border-pink-400 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-pink-50/50 transition-all">
                  <span className="text-xl font-semibold text-pink-500 flex items-center gap-2">
                    <Plane className="h-5 w-5 rotate-180" /> Départ
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-pink-50/30 rounded-md">
                      <p className="font-medium">Heure de départ</p>
                      <p>{bookData.departureTime}</p>
                    </div>
                    <div className="p-4 bg-pink-50/30 rounded-md">
                      <p className="font-medium">Instructions de sortie</p>
                      <p>{bookData.exitInstructions}</p>
                    </div>
                  </div>
                  {bookData.departureAdditionalInfo && (
                    <div className="p-4 bg-pink-50/30 rounded-md">
                      <p className="font-medium">Informations supplémentaires</p>
                      <p>{bookData.departureAdditionalInfo}</p>
                    </div>
                  )}
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Hébergement */}
            <AccordionItem value="accommodation" className="border-none">
              <div className="bg-white/80 rounded-lg shadow-sm border-l-4 border-amber-400 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-amber-50/50 transition-all">
                  <span className="text-xl font-semibold text-amber-500 flex items-center gap-2">
                    <Home className="h-5 w-5" /> Hébergement
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 space-y-4">
                  {/* WiFi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50/30 rounded-md">
                      <p className="font-medium flex items-center gap-2">
                        <Wifi className="h-4 w-4" /> Nom du réseau
                      </p>
                      <p>{bookData.wifiName}</p>
                    </div>
                    <div className="p-4 bg-amber-50/30 rounded-md">
                      <p className="font-medium flex items-center gap-2">
                        <Wifi className="h-4 w-4" /> Mot de passe
                      </p>
                      <p>{bookData.wifiPassword}</p>
                    </div>
                  </div>

                  {/* Règles de la maison */}
                  <div className="p-4 bg-amber-50/30 rounded-md">
                    <p className="font-medium mb-2">Règles de la maison</p>
                    {bookData.houseRules.split('\n').map((rule, index) => (
                      <div key={index} className="flex items-start mb-2">
                        <span className="mr-2 text-amber-600">•</span>
                        <p>{rule}</p>
                      </div>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50/30 rounded-md">
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Contact
                      </p>
                      <p>{bookData.ownerContact}</p>
                    </div>
                    {bookData.generalInfo && (
                      <div className="p-4 bg-amber-50/30 rounded-md">
                        <p className="font-medium flex items-center gap-2">
                          <Info className="h-4 w-4" /> Informations générales
                        </p>
                        <p>{bookData.generalInfo}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Recommandations */}
            {bookData.recommendations && bookData.recommendations.length > 0 && (
              <AccordionItem value="recommendations" className="border-none">
                <div className="bg-white/80 rounded-lg shadow-sm border-l-4 border-teal-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-teal-50/50 transition-all">
                    <span className="text-xl font-semibold text-teal-600 flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Recommandations
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookData.recommendations.map((rec) => (
                        <div key={rec.id} className="p-4 bg-teal-50/30 rounded-md">
                          <p className="font-medium">{rec.name}</p>
                          <p className="text-sm text-teal-700/70">{rec.type}</p>
                          {rec.address && <p className="text-sm mt-1">{rec.address}</p>}
                          {rec.description && <p className="mt-2 text-gray-700">{rec.description}</p>}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default ClientBook;