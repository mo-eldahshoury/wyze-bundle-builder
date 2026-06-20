'use client';

import React from 'react';
import { useBundle } from '@/context/BundleContext';
import {
    ChevronDown,
    ChevronUp,
    Camera,
    ShieldCheck,
    Cpu,
    Lock
} from 'lucide-react';
import ReviewPanel from '../review/ReviewPanel';

export default function MobileFrame({ products }) {
    const { activeStep, setActiveStep, cart, updateQuantity } = useBundle();

    // Map icons to step IDs exactly like Accordion
    const steps = [
        { id: 1, title: 'Choose your cameras', label: 'STEP 1 OF 4', icon: Camera },
        { id: 2, title: 'Choose your plan', label: 'STEP 2 OF 4', icon: ShieldCheck },
        { id: 3, title: 'Choose your sensors', label: 'STEP 3 OF 4', icon: Cpu },
        { id: 4, title: 'Add extra protection', label: 'STEP 4 OF 4', icon: Lock },
    ];

    const handleNextStep = () => {
        if (activeStep < 4) {
            setActiveStep(activeStep + 1);
        }
    };

    return (
        <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white px-4 py-6 font-sans antialiased">
            <header className="mb-6">
                <h1 className="text-[24px] text-center font-black text-[#111827] font-['Gilroy-Bold']">
                    Let's get started!
                </h1>
            </header>

            <div className="space-y-4 mb-6">
                {steps.map((step) => {
                    const isOpen = activeStep === step.id;
                    const stepProducts = products.filter(p => p.step === step.id);
                    const StepIcon = step.icon;

                    const selectedCount = stepProducts.reduce((acc, p) => {
                        if (!p.variants || p.variants.length === 0) {
                            return acc + (cart[`${p.id}-default`] || 0);
                        }
                        return acc + p.variants.reduce((vAcc, v) => vAcc + (cart[`${p.id}-${v.id}`] || 0), 0);
                    }, 0);

                    return (
                        <div key={step.id} className="border-b border-[#E2E8F0] pb-4">
                            <span className="text-[10px] font-bold text-[#94A3B8] tracking-widest block mb-1 font-['Gilroy-Bold']">
                                {step.label}
                            </span>

                            <button
                                onClick={() => setActiveStep(isOpen ? null : step.id)}
                                className="w-full flex flex-col justify-center py-1 text-left"
                                type="button"
                            >
                                <div className="w-full flex items-center justify-between">
                                    {/* Left Side: Step Icon + Step Title */}
                                    <div className="flex items-center gap-2.5">
                                        <StepIcon
                                            size={20}
                                            className={`shrink-0 ${isOpen ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`}
                                        />
                                        <h2 className="text-[18px] font-bold text-[#111827] font-['Gilroy-Bold']">
                                            {step.title}
                                        </h2>
                                    </div>

                                    {/* Right Side: Selection Badge and Arrow aligned together */}
                                    <div className="flex items-center gap-2">
                                        {selectedCount > 0 && (
                                            <span className="text-xs font-semibold text-[#4F46E5] font-['Gilroy-Bold']">
                                                {selectedCount} Selected
                                            </span>
                                        )}
                                        <div>
                                            {isOpen ? (
                                                <ChevronUp size={18} className="text-[#4F46E5]" />
                                            ) : (
                                                <ChevronDown size={18} className="text-[#94A3B8]" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="flex flex-col gap-3 mt-4 bg-[#F4F7FC] p-3 rounded-xl transition-all duration-200">
                                    {stepProducts.map((product) => {
                                        const hasVariants = product.variants && product.variants.length > 0;
                                        const defaultVariantId = hasVariants ? product.variants[0].id : 'default';
                                        const cartKey = `${product.id}-${defaultVariantId}`;
                                        const currentQuantity = cart[cartKey] || 0;
                                        const isSelected = currentQuantity > 0;

                                        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
                                        const discountPercentage = hasDiscount
                                            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                                            : 0;

                                        return (
                                            <div key={product.id} className={`bg-white rounded-xl p-3.5 border-2 flex gap-3 relative transition-all ${isSelected ? 'border-[#4F46E5]' : 'border-transparent'}`}>
                                                {hasDiscount && (
                                                    <div className="absolute top-2 left-2 bg-[#4F46E5] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded font-['Gilroy-Bold'] z-10">
                                                        Save {discountPercentage}%
                                                    </div>
                                                )}

                                                <div className="w-20 h-20 flex items-center justify-center bg-[#F8FAFC] rounded-lg overflow-hidden shrink-0 my-auto">
                                                    <img src={product.image || '/api/placeholder/80/80'} alt={product.title} className="object-contain max-h-full max-w-full mix-blend-multiply" />
                                                </div>

                                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                                    <div>
                                                        <h3 className="text-[14px] font-bold text-[#111827] font-['Gilroy-Bold'] leading-tight truncate">
                                                            {product.title}
                                                        </h3>
                                                        <p className="text-[11px] text-[#6B7280] mt-0.5 leading-tight font-['Gilroy-Regular'] line-clamp-2">
                                                            {product.description || 'The clearest Wyze Cam ever made.'}
                                                        </p>
                                                    </div>

                                                    {hasVariants && (
                                                        <div className="flex gap-1 my-1.5 overflow-x-auto no-scrollbar">
                                                            {product.variants.map((v) => (
                                                                <span key={v.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#E2E8F0] bg-white text-[9px] font-bold text-gray-500 whitespace-nowrap">
                                                                    <span className="w-1.5 h-1.5 rounded-full border border-gray-300" style={{ backgroundColor: v.colorCode || '#fff' }} />
                                                                    {v.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[#F1F5F9]">
                                                        <div className="flex items-center border border-[#E2E8F0] rounded-md bg-white p-0.5 shadow-sm">
                                                            <button onClick={() => updateQuantity(product.id, defaultVariantId, -1)} className="w-5 h-5 flex items-center justify-center text-[#94A3B8] text-xs font-bold" type="button">—</button>
                                                            <span className="text-xs font-bold text-[#111827] px-1.5 min-w-[14px] text-center font-['Gilroy-Bold']">{currentQuantity}</span>
                                                            <button onClick={() => updateQuantity(product.id, defaultVariantId, 1)} className="w-5 h-5 flex items-center justify-center text-[#94A3B8] text-xs font-bold" type="button">+</button>
                                                        </div>

                                                        <div className="text-right">
                                                            {product.compareAtPrice && (
                                                                <span className="block text-[10px] text-[#94A3B8] line-through font-medium leading-none">
                                                                    ${product.compareAtPrice.toFixed(2)}
                                                                </span>
                                                            )}
                                                            <span className="block text-[13px] font-black text-[#4F46E5] leading-none font-['Gilroy-Bold'] mt-0.5">
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="w-full pt-2">
                <ReviewPanel products={products} showSaveSystem={true} />
            </div>
        </div>
    );
}