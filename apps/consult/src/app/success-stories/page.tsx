import Link from "next/link";
import Image from "next/image";

export default function SuccessStoriesPage() {
  return (
    <main>
      
  {/*  PAGE HEADER  */}
  <section className="page-header">
    <div className="container">
      <h1 className="page-title">Success <span className="highlight">Stories</span></h1>
      <p className="page-subtitle">Real stories from students we have helped achieve their international education dreams</p>
    </div>
  </section>

  {/*  TESTIMONIALS  */}
  <section id="testimonials" className="testimonials-section">
    <div className="container">
      <div className="testimonials-slider" id="testimonials-slider">
        <div className="testimonials-track" id="testimonials-track">
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“Dellics made my dream of studying in the UK a reality. They guided me through every step &#8212; from IELTS prep to my Tier 4 visa. I&#39;m now at the University of Manchester!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">AK</div><div><strong itemProp="author">Ama Kyei</strong><span>University of Manchester, UK</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“I had tried twice before with other agents and failed. Dellics Education Consult got my Canadian study permit approved in just 6 weeks! Professional and thorough.”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">KB</div><div><strong itemProp="author">Kwame Boateng</strong><span>University of Calgary, Canada</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“The scholarship guidance from Dellics was phenomenal. They helped me secure a Chevening Scholarship worth &#163;25,000. I couldn&#39;t have done it without their expert help!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">AF</div><div><strong itemProp="author">Abena Frimpong</strong><span>Chevening Scholar, LSE London</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“Dellics handled everything &#8212; from my application to booking my flight and finding accommodation in Sydney. Truly an all-in-one service. I&#39;m forever grateful!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">KA</div><div><strong itemProp="author">Kofi Asante</strong><span>University of Sydney, Australia</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“Very professional team! Their online counselling sessions via Zoom were so convenient. My USA F-1 visa was approved on the first try. Highly recommend Dellics!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">EA</div><div><strong itemProp="author">Efua Acheampong</strong><span>Boston University, USA</span></div></div>
          </article>
        </div>
      </div>
      <div className="slider-controls">
        <button className="slider-btn" id="slider-prev" aria-label="Previous">&#8592;</button>
        <div className="slider-dots" id="slider-dots"></div>
        <button className="slider-btn" id="slider-next" aria-label="Next">&#8594;</button>
      </div>
    </div>
  </section>

  {/*  CTA BANNER  */}
  <section className="cta-banner">
    <div className="container cta-banner-inner">
      <div className="cta-banner-text"><h2>Want to Be Our Next Success Story?</h2><p>Book your free consultation today and start your journey to studying abroad.</p></div>
      <div className="cta-banner-actions">
        <Link href="/contact" className="btn btn-white btn-lg">Book Free Consultation</Link>
        <Link href="/index" className="btn btn-outline-white btn-lg">Back to Home</Link>
      </div>
    </div>
  </section>

    </main>
  );
}
