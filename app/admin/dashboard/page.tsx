'use client';

import React from 'react';

export default function AdminDashboard(): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          "Total Lenders",
          "Total Borrowers",
          "Total referred",
          "Deals in Progress",
          "Deals Completed",
        ].map((title, index) => (
          <div
            key={index}
            className="admin-card flex flex-col items-start p-6"
          >
            <h6 className="admin-text-primary text-lg font-light">
              {title}
            </h6>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-2xl font-semibold admin-text-primary">
                4,234
              </span>
              <div className="flex items-center gap-1 text-[var(--admin-color-success)]">
                <img src="/images/trend-up.svg" alt="Trend" className="w-5 h-5" />
                <span className="text-sm">22.3%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Joined Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {["Recently joined Lenders", "Recently joined Borrowers"].map(
          (title, index) => (
            <div
              key={index}
              className="admin-card flex flex-col"
            >
              <div className="flex items-center justify-between p-6">
                <h6 className="admin-text-primary text-lg font-light">
                  {title}
                </h6>
                <img src="/images/more.svg" alt="Options" className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-4 p-6">
                {[1, 2, 3, 4, 5].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <h6 className="admin-text-primary font-medium">
                          Name Placeholder
                        </h6>
                        <p className="admin-text-disabled text-sm">
                          Role Placeholder
                        </p>
                      </div>
                    </div>
                    <span className="admin-text-secondary text-sm">
                      Sun 24 Nov 2024
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Pending Accounts */}
      <div className="admin-card">
        <div className="flex items-center justify-between p-6">
          <h6 className="admin-text-primary text-lg font-light">
            Pending accounts
          </h6>
          <img src="/images/more.svg" alt="Options" className="w-6 h-6" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 admin-text-primary font-light">
            <span>NAME</span>
            <span>ACCOUNT TYPE</span>
            <span>SIGN UP PROGRESS</span>
            <span>DATE JOINED</span>
          </div>
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-4 items-center mt-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <h6 className="admin-text-primary font-medium">
                    Name Placeholder
                  </h6>
                  <p className="admin-text-disabled text-sm">
                    Role Placeholder
                  </p>
                </div>
              </div>
              <span className="admin-badge admin-badge-primary">
                LENDERS
              </span>
              <div className="flex items-center gap-2">
                <div className="admin-progress-bar">
                  <div
                    className="admin-progress-bar-fill"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <span className="admin-text-primary text-sm">50%</span>
              </div>
              <span className="admin-text-secondary text-sm">
                Sun 24 Nov 2024
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Document Status */}
      <div className="admin-card">
        <div className="flex items-center justify-between p-6">
          <h6 className="admin-text-primary text-lg font-light">
            Document status
          </h6>
          <img src="/images/more.svg" alt="Options" className="w-6 h-6" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 admin-text-primary font-light">
            <span>BORROWERS</span>
            <span>DOCUMENT REQUESTED</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center mt-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <h6 className="admin-text-primary font-medium">
                  Rize Education
                </h6>
                <p className="admin-text-disabled text-sm">Edtech</p>
              </div>
            </div>
            <span className="admin-text-secondary text-sm">NOC</span>
            <span className="admin-badge admin-badge-primary">
              PENDING
            </span>
            <button className="admin-action-button">
              <img src="/images/download.svg" alt="Download" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      <div className="admin-card">
        <div className="flex items-center justify-between p-6">
          <h6 className="admin-text-primary text-lg font-light">
            Transaction status
          </h6>
          <img src="/images/more.svg" alt="Options" className="w-6 h-6" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 admin-text-primary font-light">
            <span>LENDERS</span>
            <span>BORROWERS</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 gap-4 items-center mt-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <h6 className="admin-text-primary font-medium">
                    Aspen Capital
                  </h6>
                  <p className="admin-text-disabled text-sm">
                    Family office
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <h6 className="admin-text-primary font-medium">
                    Aspen Capital
                  </h6>
                  <p className="admin-text-disabled text-sm">
                    Family office
                  </p>
                </div>
              </div>
              <span className="admin-text-secondary text-sm">$500</span>
              <span className="admin-badge admin-badge-info">
                INITIATED
              </span>
              <button className="admin-action-button">
                <img src="/images/download.svg" alt="Download" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
