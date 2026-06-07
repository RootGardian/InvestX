import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-textMain">InvestX</span>
            </Link>
            <p className="text-textMuted text-sm leading-relaxed">
              La plateforme nouvelle génération pour apprendre, simuler et maîtriser le trading sur les marchés financiers internationaux.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li><Link to="/markets" className="hover:text-primary transition-colors">Marchés</Link></li>
              <li><Link to="/nlp" className="hover:text-primary transition-colors">Analyse NLP</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li><Link to="/academy" className="hover:text-primary transition-colors">Académie</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">Support client</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Conditions Générales</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Politique de Confidentialité</Link></li>
              <li><Link to="/legal" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-textMuted text-sm">
            &copy; {new Date().getFullYear()} InvestX Trading Simulator. Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
