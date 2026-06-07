import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage = () => {
  const posts = [
    { title: "Comment le NLP transforme l'analyse financière", date: "12 Juin 2026", author: "Equipe Data", tag: "Tech" },
    { title: "Mise à jour V2 : Nouveau moteur de matching FIFO", date: "05 Juin 2026", author: "Dev Team", tag: "Produit" },
    { title: "5 erreurs à éviter quand on débute le trading", date: "28 Mai 2026", author: "Trader Pro", tag: "Conseils" },
    { title: "Analyse Macro : Les taux de la FED en 2026", date: "15 Mai 2026", author: "Analyste Macro", tag: "Marchés" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-textMain mb-4">Blog InvestX</h1>
        <p className="text-lg text-textMuted max-w-2xl">Restez informé des dernières mises à jour de la plateforme, des analyses de marché et des nouveautés techniques.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post, i) => (
          <article key={i} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="h-48 bg-background relative">
              {/* Fake image placeholder using gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${i%2===0 ? 'from-primary/20 to-background' : 'from-bullish/20 to-background'}`}></div>
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 text-xs font-bold text-textMain rounded-full uppercase tracking-wider">
                {post.tag}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-textMuted mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3"/> {post.author}</span>
              </div>
              <h2 className="text-2xl font-bold text-textMain mb-4 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-textMuted mb-6">Découvrez comment cette nouvelle approche change la donne pour les utilisateurs de la plateforme et optimise les stratégies d'investissement.</p>
              <button className="text-primary font-medium flex items-center hover:text-primaryHover transition-colors">
                Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
