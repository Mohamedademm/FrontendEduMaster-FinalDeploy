// Blog.js
import React from 'react';
import '../Css/Blog.css';

const Blog = () => {
  return (
    <>
      <header>
        <div className="blogPage-header-container">
          <div className="blogPage-logo">
            <h3>The EduMaster Blog: <br/> Learn, Teach, and Grow</h3>
          </div>
          
          <nav aria-label="Menu principal">
            <ul>
              <li><a href="#etudiants">Students</a></li>
              <li><a href="#enseignants">Teachers</a></li>
              <li><a href="#technique">Technical Help</a></li>
              <li><a href="#tendances">Trends</a></li>
            </ul>
          </nav>
          <div className="blogPage-search-bar">
            <input type="search" placeholder="Search for an article..." aria-label="Search" />
          </div>
        </div>
      </header>
      
      <section className="blogPage-hero">
        <div className="blogPage-overlay">
          <h2>Discover our exclusive tips</h2>
          <p>Success, pedagogy, and innovation at the heart of your learning.</p>
          <a href="#newsletter" className="blogPage-cta-btn">Subscribe to our Newsletter</a>
        </div>
      </section>
      
      <main className="blogPage-content">
        <div className="blogPage-main-left">
          <section className="blogPage-articles">
            <article className="blogPage-featured-article">
              <img src="article1.jpg" alt="Illustration de l'article" />
              <div className="blogPage-article-info">
                <h3>Article Title</h3>
                <p>Excerpt from the article with a brief and catchy summary...</p>
                <a href="article1.html" className="blogPage-btn-readmore">Read More</a>
              </div>
            </article>
            {/* Répétez pour d'autres articles */}
          </section>
          
          <section className="blogPage-aide-sections">
            <div id="etudiants" className="blogPage-aide-section">
              <h2>Help for Students</h2>
              <ul>
                <li><a href="#reviser">How to effectively revise for exams? 📚</a></li>
                <li><a href="#plateformes">The best platforms for online learning 🌐</a></li>
                <li><a href="#emploi">How to organize your schedule for effective studying? ⏳</a></li>
                <li><a href="#test">Tips for succeeding in an online test ✅</a></li>
                <li><a href="#erreurs">Mistakes to avoid as an online student 🚫</a></li>
              </ul>
            </div>
            <div id="enseignants" className="blogPage-aide-section">
              <h2>Help for Teachers</h2>
              <ul>
                <li><a href="#creer-cours">How to create an interactive course on EduMaster? 🎥</a></li>
                <li><a href="#engager">The best methods to engage your online students 💡</a></li>
                <li><a href="#ia">Using AI to personalize student learning 🤖</a></li>
                <li><a href="#monetiser">How to monetize your courses with EduMaster? 💰</a></li>
                <li><a href="#corriger">Optimizing online exam grading 📝</a></li>
              </ul>
            </div>
            <div id="technique" className="blogPage-aide-section">
              <h2>Technical Help and Using EduMaster</h2>
              <ul>
                <li><a href="#inscription">How to sign up and set up your account? 🆕</a></li>
                <li><a href="#connexion">Connection issues and solutions 🔄</a></li>
                <li><a href="#suivre">How to follow a course and progress effectively? 🚀</a></li>
                <li><a href="#certifications">Adding and managing your certifications 🎖</a></li>
                <li><a href="#support">Contacting support in case of issues 📞</a></li>
              </ul>
            </div>
          </section>
          
          <section id="tendances" className="blogPage-tendances">
            <h2>Trends</h2>
            <ul>
              <li><a href="#trend1">Trend 1</a></li>
              <li><a href="#trend2">Trend 2</a></li>
              <li><a href="#trend3">Trend 3</a></li>
            </ul>
          </section>
        </div>
        
        <aside className="blogPage-sidebar">
          <div className="blogPage-widget blogPage-popular-articles">
            <h3>Popular Articles</h3>
            <ul>
              <li><a href="#article-pop">Popular Article Title 1</a></li>
              <li><a href="#article-pop">Popular Article Title 2</a></li>
              <li><a href="#article-pop">Popular Article Title 3</a></li>
            </ul>
          </div>
          <div className="blogPage-widget blogPage-subscribe-newsletter" id="newsletter">
            <h3>Newsletter</h3>
            <form>
              <input type="email" placeholder="Your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </aside>
      </main>
      
      <footer>
        <div className="blogPage-footer-content">
          <nav className="blogPage-footer-nav1">
            <ul>
              <li><a href="#etudiants">Students</a></li>
              <li><a href="#enseignants">Teachers</a></li>
              <li><a href="#technique">Technical Help</a></li>
              <li><a href="#tendances">Trends</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </nav>
          <div className="blogPage-legal">
            <a href="mentions-legales.html">Legal Notice</a> | <a href="cgu.html">Terms of Use</a>
          </div>
          
        </div>
      </footer>
    </>
  );
};

export default Blog;
