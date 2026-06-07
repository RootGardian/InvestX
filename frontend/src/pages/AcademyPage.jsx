import React from 'react';
import { BookOpen, Video, FileText, PlayCircle } from 'lucide-react';

const AcademyPage = () => {
  const courses = [
    { title: "Introduction à la Bourse", category: "Débutant", type: "Vidéo", duration: "45 min", icon: <Video className="w-6 h-6" /> },
    { title: "Comprendre les Chandeliers Japonais", category: "Intermédiaire", type: "Article", duration: "15 min", icon: <FileText className="w-6 h-6" /> },
    { title: "Psychologie du Trader", category: "Tous niveaux", type: "Cours", duration: "1h 30", icon: <BookOpen className="w-6 h-6" /> },
    { title: "Le Carnet d'Ordres L2 expliqué", category: "Avancé", type: "Vidéo", duration: "30 min", icon: <Video className="w-6 h-6" /> },
    { title: "Analyse Fondamentale vs Technique", category: "Intermédiaire", type: "Article", duration: "20 min", icon: <FileText className="w-6 h-6" /> },
    { title: "Gérer son risque (Money Management)", category: "Débutant", type: "Cours", duration: "1h", icon: <BookOpen className="w-6 h-6" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-textMain mb-4">Académie InvestX</h1>
        <p className="text-textMuted text-lg max-w-2xl">Formez-vous aux marchés financiers avec nos contenus gratuits. De novice à expert, maîtrisez les concepts clés avant de trader sur le simulateur.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-background rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {course.icon}
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-border rounded text-textMuted uppercase tracking-wider">{course.category}</span>
            </div>
            <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
            <div className="flex items-center text-sm text-textMuted gap-4">
              <span>{course.type}</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>{course.duration}</span>
            </div>
            <div className="mt-6 pt-4 border-t border-border flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-5 h-5 mr-2" /> Commencer
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademyPage;
