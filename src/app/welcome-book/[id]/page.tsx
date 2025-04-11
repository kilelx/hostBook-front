'use client';

import { useState } from 'react';
import { BookData } from '@/types/BookData';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Plane, Home, MapPin, Phone, Info, Wifi } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function ClientBook() {
  const params = useParams();
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Initialiser à false car aucun chargement n'est en cours au départ
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fetchBookData = async (pwd: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setPasswordError(null);

      const response = await fetch(`http://localhost:3001/api/stay/${params.id}?password=${pwd}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        setPasswordError('Mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setBookData(data);
      setIsPasswordRequired(false);
    } catch (err) {
      setError('Impossible de récupérer les données du livret. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '') {
      setPasswordError('Veuillez entrer un mot de passe');
      return;
    }
    fetchBookData(password);
  };


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

  if (!bookData && !isLoading) {
    if (isPasswordRequired) {
      return (
        <section className="h-screen w-screen bg-background flex items-center justify-center px-4">
          <div className="w-full max-w-md mx-auto p-8 space-y-6 bg-card rounded-xl shadow-lg border border-muted">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Accès protégé</h2>
              <p className="text-muted-foreground">Veuillez entrer le mot de passe pour accéder au livret d'hébergement</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? 'border-destructive' : ''}
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Accéder au livret
              </Button>
            </form>
          </div>
        </section>
      );
    }

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
        <div className="w-full max-w-4xl mx-auto lg:p-6 space-y-8">
          <h2 className="text-3xl font-bold text-center bg-white/80 p-4">
            Bienvenue chez {bookData?.ownerName || 'notre hébergement'}
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
                      {bookData?.arrivalTime && (
                        <div className="p-4 bg-orange-50 rounded-md">
                          <p className="font-medium">Heure d'arrivée</p>
                          <p>{bookData.arrivalTime}</p>
                        </div>
                      )}
                      {bookData?.accessInstructions && (
                        <div className="p-4 bg-orange-50 rounded-md">
                          <p className="font-medium">Instructions d'accès</p>
                          <p>{bookData.accessInstructions}</p>
                        </div>
                      )}
                    </div>
                    {bookData?.arrivalAdditionalInfo && (
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
                      {bookData?.departureTime && (
                        <div className="p-4 bg-pink-50 rounded-md">
                          <p className="font-medium">Heure de départ</p>
                          <p>{bookData.departureTime}</p>
                        </div>
                      )}
                      {bookData?.exitInstructions && (
                        <div className="p-4 bg-pink-50 rounded-md">
                          <p className="font-medium">Instructions de sortie</p>
                          <p>{bookData.exitInstructions}</p>
                        </div>
                      )}
                    </div>
                    {bookData?.departureAdditionalInfo && (
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
                    {(bookData?.wifiName || bookData?.wifiPassword) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookData?.wifiName && (
                          <div className="p-4 bg-white/50 rounded-md">
                            <p className="font-medium flex items-center gap-2">
                              <Wifi className="h-4 w-4" /> Nom du réseau
                            </p>
                            <p>{bookData.wifiName}</p>
                          </div>
                        )}
                        {bookData?.wifiPassword && (
                          <div className="p-4 bg-white/50 rounded-md">
                            <p className="font-medium flex items-center gap-2">
                              <Wifi className="h-4 w-4" /> Mot de passe
                            </p>
                            <p>{bookData.wifiPassword}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Règles de la maison */}
                    {bookData?.houseRules && (
                      <div className="p-4 bg-white/50 rounded-md">
                        <p className="font-medium mb-2">Règles de la maison</p>
                        {bookData.houseRules.split('\n').map((rule, index) => (
                          <div key={index} className="flex items-start mb-2">
                            <span className="mr-2">•</span>
                            <p>{rule}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookData?.ownerContact && (
                        <div className="p-4 bg-white/50 rounded-md">
                          <p className="font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Contact
                          </p>
                          <p>{bookData.ownerContact}</p>
                        </div>
                      )}
                      {bookData?.generalInfo && (
                        <div className="p-4 bg-white/50 rounded-md">
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
            {bookData?.recommendations && bookData.recommendations.length > 0 && (
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
                          <div key={rec.id} className="p-4 bg-white/50 rounded-md">
                            <div className="flex">
                            <p className="font-medium">{rec.name} -</p>
                            <p className="opacity-50 ml-1 font-semibold">{rec.type === "RESTAURANT" ? "Restaurant" : rec.type === "ACTIVITY" ? "Activité" : rec.type === "BAR" ? "Bar" : rec.type === "TOURISM" ? "Tourisme" : rec.type === "GROCERY" ? "Épicerie" : "Autre"}</p>
                            </div>
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