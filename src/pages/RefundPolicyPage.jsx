import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RefreshCw, CheckCircle2, AlertCircle, Clock, Truck, ArrowLeft, Mail, Phone } from 'lucide-react';

export default function RefundPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Cancellation & Refund Policy | VIZE Specialty Polymers';
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
          <span style={{ color: '#8C4830', fontWeight: 600 }}>Cancellation &amp; Refund Policy</span>
        </div>

        {/* Hero Header Card */}
        <div style={{ background: '#0D2C33', color: '#FFFFFF', borderRadius: '16px', padding: '2.5rem 2rem', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(13, 44, 51, 0.15)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem', color: '#38BDF8' }}>
            <RefreshCw size={16} /> Returns, Cancellations &amp; Refunds
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Cancellation &amp; Refund Policy
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
            Transparent return and refund standards for <strong>VIZE Specialty Polymers</strong>. Because we formulate industrial-grade polymer resins, this policy balances customer satisfaction with hazardous material handling protocols.
          </p>
          <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Refund Settlement: <strong>5–7 Business Days</strong></span>
            <span>Gateway: <strong>PhonePe Automated Reversal</strong></span>
          </div>
        </div>

        {/* Policy Content */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', gap: '2.25rem', lineHeight: 1.7, fontSize: '0.95rem', color: '#334155' }}>

          {/* Quick Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <CheckCircle2 size={18} /> Cancellation Window
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#14532D' }}>
                Cancel anytime <strong>before warehouse pallet dispatch</strong> for an immediate 100% full refund with zero cancellation penalty.
              </p>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <AlertCircle size={18} /> Damaged / Leaked Goods
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F' }}>
                Report transit leaks or pail damage within <strong>48 hours of delivery</strong> for an immediate free batch replacement or full refund.
              </p>
            </div>

            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <Clock size={18} /> Refund Speed
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#1E3A8A' }}>
                Approved refunds are processed back to your original source (Bank / UPI / Card via PhonePe) within <strong>5–7 business days</strong>.
              </p>
            </div>
          </div>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              1. Order Cancellation Policy
            </h2>
            <p>
              You can cancel your order for a 100% full refund if your cancellation request is received prior to order dispatch:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Before Dispatch:</strong> To cancel, email <a href="mailto:support@vizeresin.com" style={{ color: '#0D2C33', fontWeight: 600 }}>support@vizeresin.com</a> or WhatsApp our dispatch helpline with your <strong>Order ID (#VZ-...)</strong>. We will cancel the order immediately and trigger an automated refund via PhonePe.</li>
              <li><strong>After Dispatch:</strong> Once an order is assigned a Delhivery Surface Express AWB number and handed over to the cargo fleet, the shipment cannot be intercepted in transit.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              2. Transit Damage &amp; Leakage Replacement Guarantee
            </h2>
            <p>
              We package all resin and hardener components in UN-certified tamper-proof pails with induction-sealed inner liners. However, in the rare event of transit damage:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Inspect the package exterior upon arrival with the Delhivery delivery person. If substantial leakage or crushing is apparent, note it on the Proof of Delivery (POD).</li>
              <li>Photograph/record a short video of the damaged seal and outer shipping label, and contact us within <strong>48 hours of delivery</strong>.</li>
              <li>Upon verification, VIZE Specialty Polymers will dispatch a <strong>free replacement pail/order immediately via priority courier</strong>, or issue a 100% full refund at your preference.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              3. Non-Returnable Items (Chemical Safety Compliance)
            </h2>
            <p>
              Due to hazardous material transportation laws, chemical contamination risks, and shelf-life constraints:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Containers that have been opened, unsealed, or partially dispensed cannot be returned or refunded.</li>
              <li>Custom tint / personalized RAL-matched pigment dispersions cannot be returned once blended.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              4. Refund Processing Method &amp; Timelines
            </h2>
            <p>
              All refunds are handled through <strong>PhonePe Payment Gateway's automated banking API</strong>:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>UPI Payments (PhonePe, GPay, Paytm):</strong> Credited directly back to your linked bank account within 24–48 banking hours.</li>
              <li><strong>Debit / Credit Cards:</strong> Credited back to the issuing bank card within 5–7 business days depending on your bank's billing cycle.</li>
              <li><strong>NetBanking / NEFT:</strong> Credited to the originating bank account within 3–5 working days.</li>
            </ul>
          </section>

          <section style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D2C33', margin: '0 0 0.75rem' }}>
              5. How to Initiate a Return or Refund Request
            </h2>
            <p>To request a cancellation, return, or damage claim, contact our dedicated support team:</p>
            <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '1.25rem', marginTop: '0.75rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Entity:</strong> VIZE Specialty Polymers</div>
              <div><strong>Returns Email:</strong> <a href="mailto:support@vizeresin.com" style={{ color: '#0D2C33', fontWeight: 600 }}>support@vizeresin.com</a></div>
              <div><strong>WhatsApp Desk:</strong> +91 96541 25784 / +91 98765 43210</div>
              <div><strong>Operating Hours:</strong> Monday – Saturday, 9:30 AM to 6:30 PM IST</div>
              <div><strong>Hub Address:</strong> Central Chemical Hub, Ahmedabad, Gujarat, India - 382445</div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
