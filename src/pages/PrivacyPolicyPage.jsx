import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Privacy Policy | VIZE Specialty Polymers';
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
          <span style={{ color: '#8C4830', fontWeight: 600 }}>Privacy Policy</span>
        </div>

        {/* Hero Header Card */}
        <div style={{ background: '#0D2C33', color: '#FFFFFF', borderRadius: '16px', padding: '2.5rem 2rem', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(13, 44, 51, 0.15)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem', color: '#38BDF8' }}>
            <ShieldCheck size={16} /> Compliance &amp; Data Protection
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
            Official privacy commitment of <strong>VIZE Specialty Polymers</strong>. This document explains how we collect, safeguard, and process your personal and transaction data in accordance with the Information Technology Act, 2000 and RBI digital payment standards.
          </p>
          <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Effective Date: <strong>1 January 2026</strong></span>
            <span>Last Updated: <strong>November 2026</strong></span>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', gap: '2.25rem', lineHeight: 1.7, fontSize: '0.95rem', color: '#334155' }}>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              1. Corporate Entity &amp; Scope
            </h2>
            <p>
              This Privacy Policy applies to the website <strong>https://vizeresin.com</strong> (the "Site"), owned and operated by <strong>VIZE Specialty Polymers</strong> ("we", "our", or "us"). We specialize in manufacturing, formulating, and distributing professional-grade epoxy resins, casting polymers, protective polyurethanes, and color pigments across India.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              2. Information We Collect
            </h2>
            <p>To fulfill your orders, provide technical formulation advice, and deliver heavy pallet orders, we collect the following types of information:</p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Contact Information:</strong> Full name, telephone/mobile number, email address, job title, and company name.</li>
              <li><strong>Delivery &amp; Billing Address:</strong> Job site address, workshop location, city, state, postal PIN code, and receiving supervisor phone number.</li>
              <li><strong>B2B Tax Invoicing Information:</strong> Business legal name and Goods and Services Tax Identification Number (GSTIN) for claiming input tax credit.</li>
              <li><strong>Technical Consultation Details:</strong> Project square footage, casting depths, substrate photos, and resin volume estimates provided via our consultation forms.</li>
              <li><strong>Technical Device &amp; Session Logs:</strong> IP address, browser type, operating system, and checkout session tokens for security fraud prevention.</li>
            </ul>
          </section>

          <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: '#0284C7' }} /> 3. Payment Processing via PhonePe Gateway
            </h2>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>
              All online payments on <strong>vizeresin.com</strong> are securely processed via <strong>PhonePe Payment Gateway</strong> (an RBI-authorized digital payment aggregator). 
              <strong> VIZE Specialty Polymers does NOT store, process, or have access to your sensitive banking credentials, Credit/Debit card CVVs, or UPI PINs.</strong> 
              All payment transactions are encrypted using 256-bit bank-grade SSL / TLS security protocols complying with PCI-DSS Level 1 specifications.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              4. How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate business and fulfillment functions:</p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Processing customer checkout, validating order totals, and generating 18% GST tax invoices.</li>
              <li>Generating delivery manifests and automated AWB tracking numbers with our logistics partner (Delhivery Surface Express).</li>
              <li>Sending automated order confirmations, dispatch tracking updates, and delivery OTP alerts via SMS and WhatsApp.</li>
              <li>Providing laboratory formulation guidance, technical data sheets (TDS), and mixing instructions tailored to your climate.</li>
              <li>Complying with statutory audits, chemical transport manifest laws, and Indian taxation guidelines.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              5. Third-Party Data Sharing &amp; Disclosures
            </h2>
            <p>We do not sell, rent, or trade your personal data. We disclose information only to certified partners necessary for order execution:</p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Logistics Partners:</strong> Delhivery Surface Express and registered chemical freight carriers for physical shipment delivery and proof of delivery (POD).</li>
              <li><strong>Payment Gateway:</strong> PhonePe India for transaction authorization, fraud validation, and refund processing.</li>
              <li><strong>Statutory Authorities:</strong> When required by Indian law, court order, or central tax authorities.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              6. Data Security &amp; Retention
            </h2>
            <p>
              We maintain technical, physical, and administrative safeguards to protect your personal data against unauthorized access, loss, or misuse. Order records and GST tax invoices are retained for the period mandated under Indian Goods and Services Tax laws (typically 6 years).
            </p>
          </section>

          <section style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              7. Grievance Officer &amp; Contact Information
            </h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details of the Grievance Officer for <strong>VIZE Specialty Polymers</strong> are:
            </p>
            <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '1.25rem', marginTop: '0.75rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Entity:</strong> VIZE Specialty Polymers</div>
              <div><strong>Designation:</strong> Data Grievance &amp; Compliance Officer</div>
              <div><strong>Operational Hub:</strong> Central Chemical Hub, Ahmedabad, Gujarat, India - 382445</div>
              <div><strong>Official Email:</strong> <a href="mailto:support@vizeresin.com" style={{ color: '#0D2C33', fontWeight: 600 }}>support@vizeresin.com</a> / <a href="mailto:contact@vizeresin.com" style={{ color: '#0D2C33', fontWeight: 600 }}>contact@vizeresin.com</a></div>
              <div><strong>Working Hours:</strong> Monday – Saturday, 9:30 AM to 6:30 PM IST</div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
