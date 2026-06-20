'use client';

import React, { useState } from 'react';
import MobileFrame from './MobileFrame';
import ReviewPanel from '../review/ReviewPanel';
import Accordion from './Accordion';

export default function BundleBuilder({ products }) {
    const [viewMode, setViewMode] = useState('desktop-1736');
    return (
        <div className="w-full min-h-screen bg-[#EAEFF8] py-4 font-sans antialiased">

            <div className="w-full transition-all duration-300">
                {viewMode === 'mobile' && (
                    <div className="flex justify-center">
                        <MobileFrame products={products} />
                    </div>
                )}
                {viewMode === 'desktop-1736' && (
                    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 pb-16 pt-4 flex flex-col gap-8">
                        <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                            <Accordion products={products} />
                        </div>
                        <div className="w-full">
                            <ReviewPanel products={products} />
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
}