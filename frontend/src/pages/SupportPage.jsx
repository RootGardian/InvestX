import React from 'react';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-textMain mb-4">Comment pouvons-nous vous aider ?</h1>
        <p className="text-lg text-textMuted">Notre équipe de support est disponible 24/7 pour répondre à vos questions techniques ou liées à votre compte.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-textMain mb-2">Email</h3>
          <p className="text-sm text-textMuted">support@investx.com</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-textMain mb-2">Chat en direct</h3>
          <p className="text-sm text-textMuted">Temps de réponse: ~2 min</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <HelpCircle className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-textMain mb-2">FAQ</h3>
          <p className="text-sm text-textMuted">Consultez nos articles</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-textMain mb-6">Envoyer un message</h2>
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Nom complet</label>
              <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Adresse email</label>
              <input type="email" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Sujet</label>
            <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:border-primary focus:outline-none">
              <option>Problème technique (API/Plateforme)</option>
              <option>Question sur mon compte</option>
              <option>Facturation</option>
              <option>Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Message</label>
            <textarea rows="5" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:border-primary focus:outline-none"></textarea>
          </div>
          <button type="button" className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-lg transition-colors">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;
