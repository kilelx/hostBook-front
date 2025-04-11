'use client';

import { useState } from 'react';

import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface PasswordDisplayProps {
  password: string;
  bookId: string;
}

export function PasswordDisplay({ password, bookId }: PasswordDisplayProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const bookUrl = `${window.location.origin}/welcome-book/${bookId}`;

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie du mot de passe:', err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie du lien:', err);
    }
  };

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-amber-800">Informations d'accès</h3>
        <p className="text-sm text-amber-700">
          Ces informations sont nécessaires pour accéder au livret. Partagez-les avec vos invités.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-amber-800">Lien du livret</label>
          <div className="flex gap-2">
            <Input
              value={bookUrl}
              readOnly
              className="bg-white border-amber-200"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyLink}
              className="border-amber-200 hover:bg-amber-100"
              title="Copier le lien"
            >
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-amber-800">Mot de passe</label>
          <div className="flex gap-2">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              className="bg-white border-amber-200"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="border-amber-200 hover:bg-amber-100"
              title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyPassword}
              className="border-amber-200 hover:bg-amber-100"
              title="Copier le mot de passe"
            >
              {copiedPassword ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>


      </div>
    </div>
  );
}
