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
    <section className="min-h-screen min-w-screen bg-[#222222] text-black flex justify-center items-center">
      <div className="mx-auto px-4 w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] rounded-lg bg-white overflow-auto">
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
          <h2 className="text-3xl font-bold text-center bg-white/80 p-4">
            Bienvenue chez {bookData.ownerName}
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-6">
            {/* Informations d'arrivée */}
            <AccordionItem value="arrival" className="border-none">
              <div className="bg-[#fee4cb] rounded-xl shadow-md overflow-hidden">
                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-orange-100 transition-all">
                  <span className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-orange-200 p-2 rounded-full">
                      <Plane className="h-6 w-6 text-orange-600" />
                    </div>
                    Arrivée
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-50 rounded-md">
                        <p className="font-medium">Heure d'arrivée</p>
                        <p>{bookData.arrivalTime}</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-md">
                        <p className="font-medium">Instructions d'accès</p>
                        <p>{bookData.accessInstructions}</p>
                      </div>
                    </div>
                    {bookData.arrivalAdditionalInfo && (
                      <div className="p-4 bg-orange-50 rounded-md">
                        <p className="font-medium">Informations supplémentaires</p>
                        <p>{bookData.arrivalAdditionalInfo}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Informations de départ */}
            <AccordionItem value="departure" className="border-none">
              <div className="bg-[#f8e1ee] rounded-xl shadow-md overflow-hidden text-black">
                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-pink-100 transition-all">
                  <span className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-pink-200 p-2 rounded-full">
                      <Plane className="h-6 w-6 rotate-180 text-pink-600" />
                    </div>
                    Départ
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-pink-50 rounded-md">
                        <p className="font-medium">Heure de départ</p>
                        <p>{bookData.departureTime}</p>
                      </div>
                      <div className="p-4 bg-pink-50 rounded-md">
                        <p className="font-medium">Instructions de sortie</p>
                        <p>{bookData.exitInstructions}</p>
                      </div>
                    </div>
                    {bookData.departureAdditionalInfo && (
                      <div className="p-4 bg-pink-50 rounded-md">
                        <p className="font-medium">Informations supplémentaires</p>
                        <p>{bookData.departureAdditionalInfo}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Hébergement */}
            <AccordionItem value="accommodation" className="border-none">
              <div className="bg-[#e9f5c9] rounded-xl shadow-md overflow-hidden text-black">
                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-lime-100 transition-all">
                  <span className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-lime-200 p-2 rounded-full">
                      <Home className="h-6 w-6 text-lime-600" />
                    </div>
                    Hébergement
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-white/10 p-6 space-y-4">
                    {/* WiFi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/20 rounded-md">
                        <p className="font-medium flex items-center gap-2">
                          <Wifi className="h-4 w-4" /> Nom du réseau
                        </p>
                        <p>{bookData.wifiName}</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-md">
                        <p className="font-medium flex items-center gap-2">
                          <Wifi className="h-4 w-4" /> Mot de passe
                        </p>
                        <p>{bookData.wifiPassword}</p>
                      </div>
                    </div>

                    {/* Règles de la maison */}
                    <div className="p-4 bg-white/20 rounded-md">
                      <p className="font-medium mb-2">Règles de la maison</p>
                      {bookData.houseRules.split('\n').map((rule, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <span className="mr-2">•</span>
                          <p>{rule}</p>
                        </div>
                      ))}
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/20 rounded-md">
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Contact
                        </p>
                        <p>{bookData.ownerContact}</p>
                      </div>
                      {bookData.generalInfo && (
                        <div className="p-4 bg-white/20 rounded-md">
                          <p className="font-medium flex items-center gap-2">
                            <Info className="h-4 w-4" /> Informations générales
                          </p>
                          <p>{bookData.generalInfo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Recommandations */}
            {bookData.recommendations && bookData.recommendations.length > 0 && (
              <AccordionItem value="recommendations" className="border-none">
                <div className="bg-[#d8f3f6] rounded-xl shadow-md overflow-hidden text-black">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-cyan-100 transition-all">
                    <span className="text-xl font-semibold flex items-center gap-3">
                      <div className="bg-cyan-200 p-2 rounded-full">
                        <MapPin className="h-6 w-6 text-cyan-600" />
                      </div>
                      Recommandations
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-white/10 p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookData.recommendations.map((rec) => (
                          <div key={rec.id} className="p-4 bg-white/20 rounded-md">
                            <p className="font-medium">{rec.name}</p>
                            <p className="text-sm">{rec.type}</p>
                            {rec.address && <p className="text-sm mt-1">{rec.address}</p>}
                            {rec.description && <p className="mt-2">{rec.description}</p>}
                          </div>
                        ))}
                      </div>
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