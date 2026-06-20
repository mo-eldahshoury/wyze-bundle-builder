'use client';

import React from 'react';
import Accordion from '@/components/builder/Accordion';
import ReviewPanel from '@/components/review/ReviewPanel';

export default function DesktopFrame({ products, saveSystemForLater }) {
    return (
        <main className="w-[1440px] min-h-[900px] bg-[#f8fafc] px-12 py-10 border border-gray-200 bg-white">

            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Left Side: Accordion Steps (7 Columns) */}
                <section aria-label="Bundle steps" className="col-span-7">
                    <Accordion products={products} />
                </section>

                {/* Right Side: Sticky Review Panel Sidebar (5 Columns) */}
                <section aria-label="Review system summary" className="col-span-5 sticky top-6 flex flex-col items-center">
                    <ReviewPanel products={products} />

                    <button
                        onClick={saveSystemForLater}
                        type="button"
                        className="mt-4 text-xs text-gray-500 hover:text-gray-800 font-medium underline transition-colors font-['Gilroy-Regular']"
                    >
                        Save my system for later
                    </button>
                </section>
            </div>
        </main>
    );
}