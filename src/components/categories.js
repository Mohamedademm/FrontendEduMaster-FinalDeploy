import React from 'react';
import '../Css/Categories.css';

const Categories = () => {
  const categoriesData = [
    {
      title: "Développement personnel",
      description: "Fixer des objectifs afin de réaliser et de maximiser votre potentiel.",
      link: "/development-personal"
    },
    {
      title: "Business",
      description: "Idées, initiatives et des activités qui contribuent à améliorer une entreprise.",
      link: "/business"
    },
    {
      title: "Marketing",
      description: "Promouvoir et vendre des produits ou des services, y compris des études de marché et de la publicité.",
      link: "/marketing"
    },
    {
      title: "Communication",
      description: "Une variété d'aspects sont importants tels que l'écoute, la parole, l'observation et l'empathie.",
      link: "/communication"
    },
    {
      title: "Mode de vie",
      description: "Les habitudes, les coutumes et les croyances d'une personne ou d'un groupe de personnes en particulier.",
      link: "/lifestyle"
    },
    {
      title: "Design",
      description: "Créer des concepts visuels, à l'aide d'un logiciel informatique ou à la main, pour communiquer des idées.",
      link: "/design"
    },
    {
      title: "Développement",
      description: "Processus de création d'un ensemble d'instructions indiquant à un ordinateur comment effectuer une tâche.",
      link: "/development"
    },
    {
      title: "Informatique et logiciels",
      description: "Ensemble d'instructions, de données ou de programmes permettant d'exécuter des tâches spécifiques.",
      link: "/computing-software"
    },
    {
      title: "Photographie",
      description: "La photographie est une façon de faire une image à l'aide d'un appareil photo.",
      link: "/photography"
    },
    {
      title: "Musique",
      description: "Un arrangement de sons ayant une mélodie, un rythme et généralement une harmonie de musique classique.",
      link: "/music"
    }
  ];

  return (
    <section className="categories-section">
      <div className="categories-container">
        <h3 className="category-title">Meilleures catégories</h3>
        <div className="category-grid">
          {categoriesData.map((category, index) => (
            <Category
              key={index}
              title={category.title}
              description={category.description}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Category = ({ title, description, link }) => {
  return (
    <div className="category-item">
      <h6 className="category-item-title">{title}</h6>
      <p className="category-item-description">{description}</p>
      <a href={link} className="category-item-link">Voir plus &gt;</a>
    </div>
  );
};

export default Categories;
