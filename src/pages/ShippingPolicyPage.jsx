import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2, ArrowLeft, PackageCheck } from 'lucide-react';

export default function ShippingPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Shipping & Delivery Policy | VIZE Specialty Polymers';
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
          <span style={{ color: '#8C4830', fontWeight: 600 }}>Shipping &amp; Delivery Policy</span>
        </div>

        {/* Hero Header Card */}
        <div style={{ background: '#0D2C33', color: '#FFFFFF', borderRadius: '16px', padding: '2.5rem 2rem', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(13, 44, 51, 0.15)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem', color: '#38BDF8' }}>
            <Truck size={16} /> Pan-India Cargo Logistics
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Shipping &amp; Delivery Policy
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
            Official shipping standards of <strong>VIZE Specialty Polymers</strong>. We partner with India’s leading logistics network, <strong>Delhivery Surface Express</strong>, to ensure prompt, leak-proof delivery of industrial polymers to workshops and job-sites across all 28 states.
          </p>
          <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Primary Carrier: <strong>Delhivery Surface Express</strong></span>
            <span>Dispatch Origin: <strong>Ahmedabad, Gujarat</strong></span>
          </div>
        </div>

        {/* Policy Content */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', gap: '2.25rem', lineHeight: 1.7, fontSize: '0.95rem', color: '#334155' }}>

          {/* Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D2C33', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <Clock size={18} style={{ color: '#0284C7' }} /> Same-Day / 24h Dispatch
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                Orders confirmed before 2:00 PM are palletized and dispatched on the same business day from our central hub.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D2C33', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <MapPin size={18} style={{ color: '#E11D48' }} /> 19,000+ PIN Codes
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                Extensive coverage across Gujarat, Maharashtra, Delhi NCR, Karnataka, Tamil Nadu, UP, Rajasthan, and all Indian states.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D2C33', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <ShieldCheck size={18} style={{ color: '#16A34A' }} /> UN-Certified Pails
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                Reinforced chemical pails with anti-leak induction seals specifically rated for road transit safety.
              </p>
            </div>
          </div>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              1. Delivery Transit Times by Region
            </h2>
            <p>
              Estimated transit timelines from our Central Chemical Hub (Ahmedabad, Gujarat) after dispatch:
            </p>
            <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px 14px', color: '#0D2C33' }}>Destination Region</th>
                    <th style={{ padding: '10px 14px', color: '#0D2C33' }}>Major Coverage Hubs</th>
                    <th style={{ padding: '10px 14px', color: '#0D2C33' }}>Estimated Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Gujarat State</td>
                    <td style={{ padding: '10px 14px', color: '#64748B' }}>Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar</td>
                    <td style={{ padding: '10px 14px', color: '#166534', fontWeight: 700 }}>1 – 2 Business Days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Western &amp; Northern Metros</td>
                    <td style={{ padding: '10px 14px', color: '#64748B' }}>Mumbai, Pune, Delhi NCR, Gurugram, Jaipur, Indore</td>
                    <td style={{ padding: '10px 14px', color: '#166534', fontWeight: 700 }}>2 – 3 Business Days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Southern &amp; Eastern Hubs</td>
                    <td style={{ padding: '10px 14px', color: '#64748B' }}>Bengaluru, Hyderabad, Chennai, Kolkata, Lucknow</td>
                    <td style={{ padding: '10px 14px', color: '#166534', fontWeight: 700 }}>3 – 4 Business Days</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Rest of India &amp; Remote Sites</td>
                    <td style={{ padding: '10px 14px', color: '#64748B' }}>Tier-2/3 Industrial Towns &amp; North East regions</td>
                    <td style={{ padding: '10px 14px', color: '#166534', fontWeight: 700 }}>4 – 6 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              2. Real-Time Tracking with Delhivery AWB
            </h2>
            <p>
              Once your shipment is manifested:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>An automated <strong>Delhivery AWB Number (e.g. DLHV6957321604)</strong> is generated.</li>
              <li>You will receive SMS and WhatsApp notifications with live tracking links.</li>
              <li>You can also track your shipment anytime directly on <strong>https://vizeresin.com</strong> by clicking the <strong>Truck Icon</strong> in our header navigation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              3. Heavy Freight &amp; Job-Site Unloading
            </h2>
            <p>
              Because standard epoxy resin orders weigh between 15 KG to 100+ KG (pails and barrels), orders are transported via <strong>Heavy Surface Freight</strong>. Ensure a designated receiver or site supervisor is present with the delivery OTP sent by Delhivery on the morning of delivery.
            </p>
          </section>

          <section style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              4. Dispatch Inquiries &amp; Support
            </h2>
            <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '1.25rem', fontSize: '0.9rem' }}>
              <strong>VIZE Specialty Polymers Logistics Desk:</strong><br />
              Email: <a href="mailto:support@vizeresin.com" style={{ color: '#0D2C33', fontWeight: 600 }}>support@vizeresin.com</a> | Helpline: +91 96541 25784<br />
              Dispatch Facility: Central Chemical Hub, Ahmedabad, Gujarat, India - 382445
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
