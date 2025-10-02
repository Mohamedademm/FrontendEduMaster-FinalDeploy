import React from 'react';
import CourseItem from './CourseItem';
import '../Css/RecommendedCourses.css'; // Assure-toi d'avoir ce fichier CSS

const recommendedCourses = [
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/9a0c4db47616b81380e3684cb1e9d9c17bfba7e55ac01d43bb8d6f70888149aa?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    category: "Design",
    duration: "3 Months",
    title: "AWS Certified Solutions Architect",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    instructor: {
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/03f5e1f0ae3a37517cf954ca2692b511d276c1b88a871a0d60e8d747610166f6?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
      name: "Lina"
    },
    price: {
      original: "$100",
      discounted: "$80"
    }
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ebcbf7c140e9c864c9de89c8e80d7856718be11f4bcdab8e8b9011fb3744b84b?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    category: "Design",
    duration: "3 Months",
    title: "AWS Certified Solutions Architect",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    instructor: {
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/03f5e1f0ae3a37517cf954ca2692b511d276c1b88a871a0d60e8d747610166f6?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
      name: "Lina"
    },
    price: {
      original: "$100",
      discounted: "$80"
    }
  }
];

function RecommendedCourses() {
  return (
    <section className="recommendedCourses">
      <div className="header">
        <h2 className="title">Recommended for you</h2>
        <button className="seeAll">See all</button>
      </div>
      <div className="courseGrid">
        {recommendedCourses.map((course, index) => (
          <CourseItem key={index} {...course} />
        ))}
      </div>
      <div className="navigation">
        <button className="navButton" aria-label="Previous courses"></button>
        <button className="navButton" aria-label="Next courses"></button>
      </div>
    </section>
  );
}

export default RecommendedCourses;
