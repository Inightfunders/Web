'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  title: string;
  key: string;
  icon: string;
  children?: {
    title: string;
    key: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboards',
    key: 'dashboard',
    icon: '/images/dashboard-icon.svg'
  },
  {
    title: 'Admins',
    key: 'admins',
    icon: '/images/manage-accounts.svg',
    children: [
      {
        title: 'Admin Management',
        key: 'admin-management',
      },
      {
        title: 'Role Management',
        key: 'role-management',
      },
    ],
  },
  {
    title: 'Users',
    key: 'users',
    icon: '/images/users-icon.svg',
    children: [
      {
        title: 'Lenders',
        key: 'lenders',
      },
      {
        title: 'Borrowers',
        key: 'borrowers',
      },
    ],
  },
];

export default function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

  const isMenuActive = (key: string) => activeItem === key;
  const isSubItemActive = (key: string) => activeSubItem === key;

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedMenu(expandedMenu === item.key ? null : item.key);
    } else {
      setActiveItem(item.key);
      setActiveSubItem(null);
      setExpandedMenu(null);
      // Handle dashboard content change here
    }
  };

  const handleSubItemClick = (parentKey: string, childKey: string) => {
    setActiveItem(parentKey);
    setActiveSubItem(childKey);
    // Handle dashboard content change here
  };

  return (
    <div className="w-[260px] h-full flex flex-col shadow-[0px_1px_4px_2px_rgba(50,71,92,0.02)] border-r border-[rgba(50,71,92,0.12)]">
      {/* Logo Section */}
      <div className="h-[72px] pt-3 bg-white">
        <div className="w-full py-[17px] pl-6 flex items-center gap-[19px]">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] relative -rotate-90">
              <Image
                src="/images/insight-logo.svg"
                alt="Insight Funders Logo"
                width={26}
                height={26}
              />
            </div>
            <div className="text-[rgba(50,71,92,0.87)] text-[18px] font-inter font-semibold leading-[19.71px]">
              Insight Funders
            </div>
          </div>
          <div className="p-0.5 bg-[#696CFF] rounded-[30px] border-[7px] border-[#F5F5F9]">
            <div className="w-[18px] h-[18px] relative">
              <Image
                src="/images/chevron-left.svg"
                alt="Notification"
                width={18}
                height={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 pt-10 pb-2 bg-white flex flex-col gap-[20px]">
        {menuItems.map((item) => (
          <div key={item.key} className="flex">
            <div className="flex-1">
              <div className="pl-4 pr-1">
                <button
                  onClick={() => handleMenuClick(item)}
                  className="w-full flex items-center h-11 pl-4 pr-2.5 py-1.5 rounded-[6px] bg-[rgba(102,108,255,0.12)] hover:bg-[rgba(102,108,255,0.16)] transition-colors"
                >
                  {/* Icon Container */}
                  <div className="w-8 flex-col justify-start items-start inline-flex">
                    <div className="w-6 h-6 relative">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={24}
                        height={24}
                        className="[&>path]:fill-[#696CFF]"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 h-8 py-1">
                    <span className="text-base text-[#696CFF] font-['Public_Sans'] font-normal leading-6 tracking-[0.15px] text-left">
                      {item.title}
                    </span>
                  </div>

                  {/* Chevron */}
                  {item.children && (
                    <div className="w-6 transform origin-center text-[#696CFF]">
                      <Image
                        src="/images/chevron-down.svg"
                        alt="Expand"
                        width={24}
                        height={24}
                        className={`transition-transform ${expandedMenu === item.key ? 'rotate-0' : '-rotate-90'}`}
                      />
                    </div>
                  )}
                </button>
              </div>

              {/* Submenu */}
              {item.children && expandedMenu === item.key && (
                <div className="pt-[4px] pb-[8px]">
                  {item.children.map((child) => (
                    <button
                      key={child.key}
                      onClick={() => handleSubItemClick(item.key, child.key)}
                      className={`w-full flex items-center h-11 pl-8 pr-2.5 hover:text-[rgba(50,71,92,0.87)] transition-colors ${
                        isSubItemActive(child.key)
                          ? 'text-[rgba(50,71,92,0.87)]'
                          : 'text-[rgba(50,71,92,0.68)]'
                      }`}
                    >
                      <div className="w-[34px] pl-[6px] pr-[37px] flex items-center justify-start">
                        <Image
                          src={isSubItemActive(child.key) ? '/images/active-dot.svg' : '/images/inactive-dot.svg'}
                          alt="Menu indicator"
                          width={10}
                          height={10}
                          className="min-w-[10px]"
                        />
                      </div>
                      <div className="flex-1 h-8 py-1">
                        <span className="text-base font-inter font-semibold leading-6 tracking-[0.15px] text-left">
                          {child.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Active Indicator */}
            <div className={`w-1 ${isMenuActive(item.key) ? 'w-[4px] bg-[#696CFF]' : ''}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
