"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <main>
      
  {/*  PAGE HEADER  */}
  <section className="page-header">
    <div className="container">
      <h1 className="page-title">Book Your <span className="highlight">Free</span> Consultation</h1>
      <p className="page-subtitle">Fill out the form below and our expert counsellors will contact you within 24 hours</p>
    </div>
  </section>

  {/*  CONTACT  */}
  <section id="contact" className="contact-section">
    <div className="container">
      <div className="contact-inner">
        <div className="contact-form-wrap">
          <form className="contact-form" id="contact-form" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label htmlFor="firstName">First Name *</label><input type="text" id="firstName" name="firstName" placeholder="Your first name" required /><span className="form-error"></span></div>
              <div className="form-group"><label htmlFor="lastName">Last Name *</label><input type="text" id="lastName" name="lastName" placeholder="Your last name" required /><span className="form-error"></span></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="email">Email Address *</label><input type="email" id="email" name="email" placeholder="your@email.com" required /><span className="form-error"></span></div>
              <div className="form-group"><label htmlFor="phone">Phone Number *</label><input type="tel" id="phone" name="phone" placeholder="+233 XX XXX XXXX" required /><span className="form-error"></span></div>
            </div>
            <div className="form-group">
              <label htmlFor="destination">Preferred Study Destination</label>
              <select id="destination" name="destination"><option value="">Select a destination…</option><option value="uk">United Kingdom</option><option value="canada">Canada</option><option value="usa">United States</option><option value="australia">Australia</option><option value="europe">Europe</option><option value="ghana">Ghana</option><option value="newzealand">New Zealand</option><option value="other">Other</option></select>
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Required</label>
              <select id="service" name="service"><option value="">Select a service…</option><option value="admissions">University Admissions</option><option value="visa">Visa Assistance</option><option value="scholarship">Scholarship Guidance</option><option value="travel">Travel &amp; Tour</option><option value="online">Online Counselling</option><option value="test">Test Prep (IELTS/TOEFL)</option><option value="all">All Services</option></select>
            </div>
            <div className="form-group"><label htmlFor="message">Tell Us About Your Goals</label><textarea id="message" name="message" rows={4} placeholder="Share your study abroad goals, current qualification level, and any specific questions…"></textarea></div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary btn-full" id="form-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="btn-loading">Processing…</span>
                ) : (
                  
                <span className="btn-text">Submit via WhatsApp</span>
                
              
                )}
              </button>
              <button type="button" className="btn btn-secondary btn-full" id="email-submit-btn">
                <span className="btn-text">Send via Email</span>
                <span className="btn-loading" style={{ display: "none" }}>Sending…</span>
              </button>
            </div>
            {isSuccess && <div className="form-success" id="form-success">&#10003; Thank you! Your consultation request has been received. We will contact you within 24 hours.</div>}
          </form>
        </div>
        <div className="contact-info">
          <div className="contact-info-card">
            <Image src="/logo.jpg" width={100} height={100}  alt="Dellics Education Consult" className="contact-logo" />
            <p className="contact-tagline">“Guiding Futures. Building Success.”</p>
          </div>
          <div className="contact-details">
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div><div><strong>Visit Our Office</strong><p>Tema Community 25, Devtraco Estate<br />Greater Accra, Ghana<br /><a href="https://maps.google.com/?q=Tema+Community+25+Devtraco+Estate+Ghana" target="_blank" rel="noopener noreferrer">View on Google Maps</a></p></div></div>
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><div><strong>Call / WhatsApp</strong><p><a href="tel:+233552054174">+233 55 205 4174</a></p></div></div>
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div><div><strong>Email Us</strong><p><a href="mailto:info@dellicstravels.com">info@dellicstravels.com</a></p></div></div>
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><div><strong>Office Hours</strong><p>Mon - Fri: 8:00 AM - 6:00 PM<br />Sat: 9:00 AM - 4:00 PM</p></div></div>
          </div>
          <a href="https://wa.me/233552054174?text=Hello%20Dellics!" className="whatsapp-cta" target="_blank" rel="noopener noreferrer">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488 11.815 11.815 0 0012.05 0z"/></svg>
            Chat with Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>

    </main>
  );
}
