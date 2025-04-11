'use client';

import { BookEditForm } from '@/components/BookEditForm';
import { useEffect, useState } from 'react';
import { BookData } from '@/types/BookData';
import { motion } from 'framer-motion';
import { Palmtree, Book, Sun } from 'lucide-react';

function EditFormBook() {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-amber-100 py-12"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl mx-auto p-8 space-y-8 bg-gradient-to-b from-white to-amber-50 rounded-xl shadow-lg border border-amber-100"
        >
          <motion.div
            variants={itemVariants}
            className="text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Palmtree className="h-8 w-8 text-[#f04c23]" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#f04c23] to-pink-500 bg-clip-text text-transparent">
                Votre Livret d'Accueil
              </h2>
              <Sun className="h-8 w-8 text-amber-400" />
            </div>
            <motion.p
              variants={itemVariants}
              className="text-center text-lg text-gray-700"
            >
              Voici ce que nous avons pu générer pour votre livret.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-600"
            >
              N'hésitez pas à relire les informations, et à les modifier si nécessaire.
            </motion.p>
          </motion.div>

          {isLoading ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 flex flex-col items-center justify-center space-y-4"
            >
              <Book className="h-12 w-12 text-amber-400 animate-pulse" />
              <p className="text-lg text-gray-600">Chargement de votre livret...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#f04c23] to-pink-500 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '70%' }}></div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <BookEditForm
                initialData={bookData || undefined}
                onSubmit={(data) => {
                  console.log('Données du formulaire soumises:', data);
                  alert('Modifications enregistrées avec succès!');
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(30%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.section>
  );
}

export default EditFormBook;