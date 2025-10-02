import React from 'react';
import { useTranslation } from 'react-i18next';
import '../Css/PopularCourses.css';
import PopularCourseCard from './PopularCourseCard';

const popularCoursesData = [
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2bc51c85ef0d7cf7e73f790c2651741b06b3265f7a4b958b95380077e546104?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    title: "Full-Stack Web Development",
    instructor: {
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/296668268648e61aa740020c2b0d89aec1a2552f08577199baf162037640c73e?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
      name: "John Smith"
    },
    rating: "4.8",
    students: "2,500"
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/0e43972348d7b3bacc157a190c304741ea225c11f9d4487148421d694598e20c?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    title: "Digital Marketing Mastery",
    instructor: {
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/503b4c4fca44b7b35d0969fd34b6a4ab452f02ee51890b21ddd6ea5ad0888c58?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
      name: "Sarah Johnson"
    },
    rating: "4.9",
    students: "1,800"
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/59b6be2291705ed87ef1202b1a53e604dce329b6ea2df1dff9887b90d29277dd?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    title: "Data Science with Python",
    instructor: {
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/ff56a150750440403cc30f7318dad282deb84153d4a74e599fba66289513cb0e?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
      name: "Mike Chen"
    },
    rating: "4.7",
    students: "3,200"
  }
];

function PopularCourses() {
  const { t } = useTranslation();
  
  return (
    <section className="popularCoursesSection">
      <div className="popularCoursesContainer">
        <h2 className="popularCoursesTitle">{t('popular_courses', 'Popular Courses')}</h2>
        <div className="courseCardContainer">
          {popularCoursesData.map((course, index) => (
            <PopularCourseCard
              key={index}
              image={course.image}
              title={course.title}
              instructor={course.instructor}
              rating={course.rating}
              students={course.students}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCourses;
