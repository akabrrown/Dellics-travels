import Link from "next/link";
import Image from "next/image";

export default function DestinationsPage() {
  return (
    <main>
      
  {/*  PAGE HEADER  */}
  <section className="page-header">
    <div className="container">
      <h1 className="page-title">Study <span className="highlight">Destinations</span></h1>
      <p className="page-subtitle">We place students in top universities across the globe</p>
    </div>
  </section>

  {/*  DESTINATIONS  */}
  <section id="destinations" className="destinations-section">
    <div className="container">
      <div className="destinations-grid">
        <article className="dest-card" id="uk"><div className="dest-flag">UK</div><div className="dest-content"><h3>United Kingdom</h3><p>Home to Oxford, Cambridge, Imperial College, and 100+ world-class universities. Post-study work visa available.</p><div className="dest-tags"><span className="dest-tag">Top Rankings</span><span className="dest-tag">Scholarships</span><span className="dest-tag">Work Rights</span></div><a href="/contact" className="dest-link">Explore UK &#8594;</a></div></article>
        <article className="dest-card" id="canada"><div className="dest-flag">CA</div><div className="dest-content"><h3>Canada</h3><p>Affordable tuition, multicultural environment, and a clear pathway to permanent residency. Work while you study!</p><div className="dest-tags"><span className="dest-tag">PR Pathway</span><span className="dest-tag">Affordable</span><span className="dest-tag">Safe</span></div><a href="/contact" className="dest-link">Explore Canada &#8594;</a></div></article>
        <article className="dest-card" id="usa"><div className="dest-flag">US</div><div className="dest-content"><h3>United States</h3><p>The world&#39;s leading academic destination. Access to Ivy League schools, Silicon Valley connections, and OPT opportunities.</p><div className="dest-tags"><span className="dest-tag">Ivy League</span><span className="dest-tag">Research</span><span className="dest-tag">OPT</span></div><a href="/contact" className="dest-link">Explore USA &#8594;</a></div></article>
        <article className="dest-card" id="australia"><div className="dest-flag">AU</div><div className="dest-content"><h3>Australia</h3><p>World-class education in a stunning environment. Post-study work rights, vibrant student community, and sunny lifestyle.</p><div className="dest-tags"><span className="dest-tag">Work Rights</span><span className="dest-tag">PR Pathway</span><span className="dest-tag">Quality Life</span></div><a href="/contact" className="dest-link">Explore Australia &#8594;</a></div></article>
        <article className="dest-card" id="europe"><div className="dest-flag">EU</div><div className="dest-content"><h3>Europe</h3><p>Germany, Netherlands, France and more — many offering free or low-cost tuition. Rich culture and global career opportunities.</p><div className="dest-tags"><span className="dest-tag">Low Tuition</span><span className="dest-tag">Culture</span><span className="dest-tag">Erasmus+</span></div><div className="europe-schools"><h4>Popular European Schools:</h4><ul><li>University of Oxford (UK)</li><li>University of Cambridge (UK)</li><li>Technical University of Munich (Germany)</li><li>University of Amsterdam (Netherlands)</li><li>Sorbonne University (France)</li><li>ETH Zurich (Switzerland)</li></ul></div><a href="/contact" className="dest-link">Explore Europe &#8594;</a></div></article>
        <article className="dest-card" id="ghana"><div className="dest-flag">GH</div><div className="dest-content"><h3>Study in Ghana</h3><p>International students seeking quality education in Ghana. We guide you through admissions to top Ghanaian universities and colleges.</p><div className="dest-tags"><span className="dest-tag">Quality Education</span><span className="dest-tag">Affordable</span><span className="dest-tag">Welcoming</span></div><a href="/contact" className="dest-link">Study in Ghana &#8594;</a></div></article>
        <article className="dest-card" id="newzealand"><div className="dest-flag">Global</div><div className="dest-content"><h3>And More...</h3><p>New Zealand, Ireland, Dubai, Singapore, and beyond. Wherever your dream destination is, we will get you there.</p><div className="dest-tags"><span className="dest-tag">New Zealand</span><span className="dest-tag">Ireland</span><span className="dest-tag">UAE</span></div><a href="/contact" className="dest-link">Ask Us &#8594;</a></div></article>
      </div>
    </div>
  </section>

  {/*  CTA BANNER  */}
  <section className="cta-banner">
    <div className="container cta-banner-inner">
      <div className="cta-banner-text"><h2>Where Do You Want to Study?</h2><p>Book your free consultation today and let us help you find the perfect destination for your goals.</p></div>
      <div className="cta-banner-actions">
        <a href="/contact" className="btn btn-white btn-lg">Book Free Consultation</a>
        <a href="/index" className="btn btn-outline-white btn-lg">Back to Home</a>
      </div>
    </div>
  </section>

    </main>
  );
}
