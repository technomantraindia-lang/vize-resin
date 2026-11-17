import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Terms & Conditions | VIZE Specialty Polymers';
  }, []);

  return (
    <div className="vize-policy-page" style={{ backgroundColor: '#F8F6F0', minHeight: '100vh', color: '#1A202C' }}>
      <Header />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: '#0D2C33', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <span style={{ color: '#8C4830', fontWeight: 600 }}>Terms &amp; Conditions</span>
        </div>

        {/* Hero Header Card */}
        <div style={{ background: '#0D2C33', color: '#FFFFFF', borderRadius: '16px', padding: '2.5rem 2rem', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(13, 44, 51, 0.15)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem', color: '#38BDF8' }}>
            <FileText size={16} /> Legal &amp; Commercial Agreement
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
            Standard commercial agreement between <strong>VIZE Specialty Polymers</strong> and purchasers/visitors of <strong>https://vizeresin.com</strong>. By accessing this store or placing an order, you accept these terms in full.
          </p>
          <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Applicable Law: <strong>Republic of India</strong></span>
            <span>Last Updated: <strong>November 2026</strong></span>
          </div>
        </div>

        {/* Terms Content */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', gap: '2.25rem', lineHeight: 1.7, fontSize: '0.95rem', color: '#334155' }}>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              1. Commercial Identity &amp; Platform Ownership
            </h2>
            <p>
              The digital storefront <strong>https://vizeresin.com</strong> is operated by <strong>VIZE Specialty Polymers</strong>, an Indian commercial enterprise with headquarters and central chemical dispatch operations located in Ahmedabad, Gujarat, India. Throughout this site, "we", "us", and "our" refer to VIZE Specialty Polymers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              2. Product Catalog, Specifications &amp; Mix Ratios
            </h2>
            <p>
              We formulate and sell two-part polymer systems (Epoxy Resins + Amine Hardeners), polyurethane topcoats, and colorant pigments. While we maintain rigorous laboratory batch quality control:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Epoxy polymer reactions depend on ambient workshop temperature, substrate moisture, pour thickness, and accurate stoichiometric mix ratios (e.g. 2:1 or 3:1 by weight/volume as specified).</li>
              <li>Customers and contractors must review the supplied Technical Data Sheet (TDS) and conduct small test samples before executing large-scale casting or flooring installations.</li>
              <li>Color pigment representations on digital screens may vary slightly from cured polymer swatches due to display calibrations and ambient lighting.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              3. Pricing, GST Invoicing &amp; Payment Gateway
            </h2>
            <p>
              All prices displayed on the website are in Indian Rupees (INR ₹). 
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Orders are billed with applicable Goods and Services Tax (GST 18%), and valid GST tax invoices containing your business GSTIN are generated upon order completion.</li>
              <li>Payments are processed securely via <strong>PhonePe Payment Gateway</strong>, supporting UPI (PhonePe, Google Pay, Paytm, BHIM), Indian RuPay/Visa/MasterCard Debit &amp; Credit Cards, and NetBanking.</li>
              <li>We reserve the right to decline or cancel orders in cases of pricing typographical errors or product stock unavailability, in which case full refunds are issued.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              4. Order Confirmation &amp; Fulfillment
            </h2>
            <p>
              Upon successful payment authorization via PhonePe, an automated Order ID (e.g., #VZ-28222) is generated. Orders are dispatched from our central chemical warehouse via <strong>Delhivery Surface Express</strong> or registered heavy cargo freight carriers with live AWB tracking.
            </p>
          </section>

          <section style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#92400E', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#D97706' }} /> 5. Chemical Safety &amp; Contractor Responsibility
            </h2>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#78350F' }}>
              Epoxy resins and hardeners are industrial chemicals. Users must wear appropriate personal protective equipment (PPE), including nitrile gloves, protective eyewear, and work in well-ventilated areas. VIZE Specialty Polymers is not liable for damages arising from exothermic runaway caused by exceeding maximum recommended pour depths or improper ratio blending.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              6. Intellectual Property
            </h2>
            <p>
              All brand names, product formulations, logos, packaging graphics, and website documentation displayed on https://vizeresin.com are the exclusive intellectual property of <strong>VIZE Specialty Polymers</strong>.
            </p>
          </section>

          <section style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              7. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms &amp; Conditions are governed by the laws of India. Any legal disputes or claims arising out of transactions on this site shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ahmedabad, Gujarat, India</strong>.
            </p>
            <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '1.25rem', marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>VIZE Specialty Polymers Customer Care Desk:</strong><br />
              Email: <a href="mailto:support@vizeresin.com" style={{ color: '#0D2C33', fontWeight: 600 }}>support@vizeresin.com</a> | Operating Hub: Ahmedabad, Gujarat, India
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
