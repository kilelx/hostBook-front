function ClientBook() {
  return (
    <section className="h-screen w-screen bg-background flex items-center justify-center">
      <div className="w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] mx-auto p-6 space-y-4 bg-card rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center">
          Bienvenue dans votre livret d'hébergement
        </h2>
        <p className="text-center">
          Vous pouvez consulter les informations de votre livret d'hébergement ici.
        </p>
      </div>

      
    </section>
  )
}

export default ClientBook