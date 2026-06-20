'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Camera, Shield, Cpu, CreditCard } from 'lucide-react';

const iconMap = {
    1: Camera,
    2: CreditCard,
    3: Cpu,
    4: Shield,
};

export default function StepHeader({ stepNumber, title, isOpen, selectedCount, onClick }) {
    const IconComponent = iconMap[stepNumber] || Camera;

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between px-4 py-4 cursor-pointer bg-white transition-colors hover:bg-gray-50/50"
        >
            <div className="flex items-center gap-3.5">
                <div className="text-[#4B5563] shrink-0">
                    <IconComponent size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-[17px] font-bold text-[#111827] font-['Gilroy-Bold'] tracking-tight">
                    {title}
                </h3>
            </div>

            <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                    <span className="text-[13px] text-[#4F46E5] font-semibold font-['Gilroy-SemiBold']">
                        {selectedCount} selected
                    </span>
                )}
                <div className="text-[#4F46E5] ml-1">
                    {isOpen ? (
                        <ChevronUp size={16} strokeWidth={2.5} />
                    ) : (
                        <ChevronDown size={16} strokeWidth={2.5} />
                    )}
                </div>
            </div>
        </div>
    );
}

