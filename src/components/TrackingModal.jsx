import React, { useState, useEffect } from 'react';
import { Truck, Search, X, CheckCircle2, Clock, MapPin, Package, ShieldCheck, ExternalLink, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchFromApi } from '../utils/api';

export default function TrackingModal({ isOpen, onClose, initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'VZ-28222');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-search if initialQuery provided
  useEffect(() => {
    if (isOpen) {
      const q = initialQuery || searchQuery || 'VZ-28222';
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [isOpen, initialQuery]);

  const handleSearch = async (queryToSearch) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!q) {
      setErrorMsg('Please enter a valid Order ID (e.g. VZ-28222) or Delhivery AWB number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetchFromApi(`/api/vize/shipping/delhivery/track/${encodeURIComponent(q)}`);
      if (res && res.success) {
        setTrackingData(res);
      } else {
        setErrorMsg(res?.message || 'Could not locate tracking information for this ID.');
        setTrackingData(null);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setErrorMsg('Network error while querying Delhivery tracking network. Please try again.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0D2C33 0%, #153E47 100%)',
            color: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#E11D48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(225, 29, 72, 0.4)',
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.08rem', fontWeight: 700, letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Delhivery Surface Express</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>
                  LIVE TRACKER
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                Heavy Freight Industrial Resins &amp; Polymer Logistics
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {/* SEARCH FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{ marginBottom: '1rem' }}
          >
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Enter Order ID or Delhivery AWB Number
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. VZ-28222 or DLHV6957321604"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0D2C33')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '10px 18px',
                  background: '#0D2C33',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <span>Track</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Test Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Quick Test Samples:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('VZ-28222');
                handleSearch('VZ-28222');
              }}
              style={{
                fontSize: '0.74rem',
                padding: '3px 9px',
                background: '#F1F5F9',
                color: '#334155',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              #VZ-28222
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('DLHV6957321604');
                handleSearch('DLHV6957321604');
              }}
              style={{
                fontSize: '0.74rem',
                padding: '3px 9px',
                background: '#F1F5F9',
                color: '#334155',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              DLHV6957321604
            </button>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                color: '#B91C1C',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* TRACKING CONTENT */}
          {trackingData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* STATUS SUMMARY CARD */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Air Waybill (AWB)
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                      {trackingData.awb}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#DCFCE7', color: '#15803D', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }}></span>
                    <span>{trackingData.status || 'In Transit'}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Origin Hub</span>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} style={{ color: '#0D2C33' }} /> Ahmedabad Central Hub
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Estimated Delivery</span>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0D2C33', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={12} style={{ color: '#E11D48' }} /> {trackingData.expected_delivery || '3-4 Business Days'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Cargo Classification</span>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <ShieldCheck size={12} style={{ color: '#16A34A' }} /> Hazmat Surface Heavy
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMELINE / CHECKPOINTS */}
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                  Shipment Checkpoints &amp; Transit Log
                </h5>
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  {/* Vertical Track Line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '8px',
                      bottom: '8px',
                      width: '2px',
                      background: '#CBD5E1',
                    }}
                  />

                  {trackingData.timeline && trackingData.timeline.map((step, idx) => {
                    const isCompleted = step.status === 'COMPLETED';
                    const isInProgress = step.status === 'IN_PROGRESS';

                    return (
                      <div key={idx} style={{ position: 'relative', marginBottom: idx === trackingData.timeline.length - 1 ? 0 : '18px' }}>
                        {/* Dot indicator */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-24px',
                            top: '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: isCompleted ? '#16A34A' : isInProgress ? '#E11D48' : '#E2E8F0',
                            border: '3px solid #FFFFFF',
                            boxShadow: '0 0 0 1px #CBD5E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          {isCompleted && <CheckCircle2 size={10} />}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: isInProgress ? 700 : 600, color: isInProgress ? '#E11D48' : '#1E293B' }}>
                              {step.milestone}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                              {step.timestamp}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={11} /> {step.location}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTION */}
              <div
                style={{
                  padding: '10px 14px',
                  background: '#F1F5F9',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  fontSize: '0.8rem',
                  color: '#475569',
                }}
              >
                <span>Automated Delhivery API Sync</span>
                <a
                  href={`https://www.delhivery.com/track/package/${trackingData.awb}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#E11D48',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Open on Delhivery.com</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
