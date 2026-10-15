import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';

export function Screen13_PoolDetails() {
  const { navigate } = useRouter();
  const [showMembersModal, setShowMembersModal] = useState(false);

  // 5 months trend data matching reference
  const trendData = [
    { month: 'Jan', val: 4500000, x: 20, y: 130 },
    { month: 'Feb', val: 5400000, x: 85, y: 110 },
    { month: 'Mar', val: 6200000, x: 150, y: 85 },
    { month: 'Apr', val: 7100000, x: 215, y: 55 },
    { month: 'May', val: 8450000, x: 280, y: 25 },
  ];

  const members = [
    { id: 1, name: 'Chinedu Okafor', role: 'Contributor', department: 'Computer Science', amount: '₦25,000' },
    { id: 2, name: 'Amina Bello', role: 'Contributor', department: 'Economics', amount: '₦15,000' },
    { id: 3, name: 'Tunde Williams', role: 'Contributor', department: 'Mechanical Eng.', amount: '₦12,000' },
    { id: 4, name: 'Fatima Zubairu', role: 'Active Borrower', department: 'Pharmacy', amount: '₦30,000' },
    { id: 5, name: 'Emeka Eze', role: 'Contributor', department: 'Accounting', amount: '₦20,000' },
  ];

  return (
    <div className="screen screen--pool-details">
      <Header title="Pool Statistics" showBack onBack={() => navigate('/pool')} />

      <div className="pool-details-card">
        {/* Total Statistics Hero */}
        <div className="pool-stat-hero">
          <div className="pool-stat-hero__label">Total Pool Statistics</div>
          <div className="pool-stat-hero__row">
            <span className="pool-stat-hero__amount">₦ 8,450,000</span>
            <span className="pool-badge-growth">+12% this month</span>
          </div>
          <small className="demo-disclaimer-text">Simulated historical lending activity</small>
        </div>

        {/* Lightweight SVG Trend Line Chart matching screen 13 */}
        <div className="pool-chart-container">
          <h2 className="pool-chart-title">Growth Trajectory</h2>
          <div className="pool-chart-wrapper">
            <svg viewBox="0 0 300 160" className="pool-chart-svg">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#28785c" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#28785c" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="10" y1="30" x2="290" y2="30" stroke="#edf0f4" strokeDasharray="3 3" />
              <line x1="10" y1="70" x2="290" y2="70" stroke="#edf0f4" strokeDasharray="3 3" />
              <line x1="10" y1="110" x2="290" y2="110" stroke="#edf0f4" strokeDasharray="3 3" />

              {/* Shaded Area */}
              <path
                d="M20 130 L85 110 L150 85 L215 55 L280 25 L280 145 L20 145 Z"
                fill="url(#chartGradient)"
              />

              {/* Trend Line */}
              <path
                d="M20 130 C50 120, 60 115, 85 110 S120 95, 150 85 S190 65, 215 55 S250 35, 280 25"
                fill="none"
                stroke="#28785c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {trendData.map((pt, i) => (
                <g key={pt.month}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === trendData.length - 1 ? 6 : 4}
                    fill="#ffffff"
                    stroke="#28785c"
                    strokeWidth="3"
                  />
                  <text
                    x={pt.x}
                    y="155"
                    textAnchor="middle"
                    fill="#8c9ba8"
                    fontSize="11"
                    fontFamily="inherit"
                  >
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Pool Performance Metrics */}
        <div className="pool-performance-section">
          <h2 className="pool-section-title">Pool Performance</h2>

          <div className="pool-performance-list">
            <div className="pool-perf-item">
              <div className="pool-perf-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28785c" strokeWidth="2.2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="pool-perf-item__label">On-time Repayment</div>
              <div className="pool-perf-item__val text-success">90%</div>
            </div>

            <div className="pool-perf-item">
              <div className="pool-perf-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e69d28" strokeWidth="2.2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="pool-perf-item__label">Default Rate</div>
              <div className="pool-perf-item__val">2.4%</div>
            </div>

            <div className="pool-perf-item">
              <div className="pool-perf-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20334a" strokeWidth="2.2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="pool-perf-item__label">Default Rates</div>
              <div className="pool-perf-item__val">14% p.a.</div>
            </div>
          </div>
        </div>

        {/* View Members Action */}
        <div className="pool-actions mt-4">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={() => setShowMembersModal(true)}
          >
            View Members
          </Button>
        </div>
      </div>

      {/* Members Modal */}
      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title="Active Pool Members (Demo)"
      >
        <p className="text-secondary text-sm mb-3">
          Verified student participants in your campus lending pool.
        </p>
        <div className="members-list">
          {members.map((m) => (
            <div key={m.id} className="member-row">
              <div className="member-avatar">{m.name.charAt(0)}</div>
              <div className="member-info">
                <div className="member-name">{m.name}</div>
                <div className="member-dept">{m.department} • <span className="member-role">{m.role}</span></div>
              </div>
              <div className="member-amount">{m.amount}</div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
