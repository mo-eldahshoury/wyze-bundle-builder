'use client';

import React from 'react';
import { useBundle } from '@/context/BundleContext';
import { ChevronDown, ChevronUp, Camera, ShieldCheck, Cpu, Lock } from 'lucide-react';

export default function Accordion({ products }) {
    const { activeStep, setActiveStep, cart, updateQuantity } = useBundle();

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
        <div className="w-full space-y-0 divide-y divide-[#E2E8F0]">
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
                    <div key={step.id} className="py-5 first:pt-0 last:pb-0">
                        <span className="text-[10px] font-bold text-[#94A3B8] tracking-widest block mb-2 uppercase">
                            {step.label}
                        </span>

                        <button
                            onClick={() => setActiveStep(isOpen ? null : step.id)}
                            className="w-full flex items-center justify-between py-1 text-left group"
                            type="button"
                        >
                            <div className="flex items-center gap-3">
                                <StepIcon
                                    size={22}
                                    className={`shrink-0 ${isOpen ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`}
                                />
                                <h2 className="text-[18px] font-bold text-[#111827] tracking-tight">
                                    {step.title}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {selectedCount > 0 && (
                                    <span className="text-lg font-bold text-[#4F46E5] px-1">
                                        {selectedCount} selected
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
                        </button>

                        {isOpen && (
                            <div className="mt-5 bg-[#F4F7FC] p-5 rounded-2xl transition-all duration-200">
                                <div className="grid grid-cols-2 gap-4">
                                    {stepProducts.map((product) => {
                                        const hasVariants = product.variants && product.variants.length > 0;
                                        const defaultVariantId = hasVariants ? product.variants[0].id : 'default';
                                        const cartKey = `${product.id}-${defaultVariantId}`;
                                        const currentQuantity = cart[cartKey] || 0;
                                        const isSelected = currentQuantity > 0;
                                        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
                                        const discountPercentage = hasDiscount ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

                                        return (
                                            <div key={product.id} className={`bg-white rounded-xl p-4 border-2 flex gap-4 relative transition-all min-h-[180px] ${isSelected ? 'border-[#4F46E5] shadow-sm' : 'border-transparent shadow-sm'}`}>
                                                {hasDiscount && (
                                                    <div className="absolute top-3 left-3 bg-[#4F46E5] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md z-10">
                                                        Save {discountPercentage}%
                                                    </div>
                                                )}
                                                <div className="w-24 h-24 flex items-center justify-center bg-[#F8FAFC] rounded-lg overflow-hidden shrink-0 my-auto">
                                                    <img src={product.image} alt={product.title} className="object-contain max-h-full max-w-full mix-blend-multiply" />
                                                </div>
                                                <div className="flex flex-col justify-between flex-1 py-1">
                                                    <div>
                                                        <h3 className="text-[15px] font-bold text-[#111827] leading-snug">{product.title}</h3>
                                                        <p className="text-[11px] text-[#6B7280] mt-0.5 leading-tight">{product.description}</p>
                                                        <button type="button" className="text-[11px] text-[#4F46E5] font-bold underline mt-1 block text-left">Learn More</button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F1F5F9]">
                                                        <div className="flex items-center border border-[#E2E8F0] rounded-lg bg-white p-0.5 shadow-sm">
                                                            <button onClick={() => updateQuantity(product.id, defaultVariantId, -1)} className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#111827] text-xs font-bold" type="button">—</button>
                                                            <span className="text-xs font-bold text-[#111827] px-2 min-w-[16px] text-center">{currentQuantity}</span>
                                                            <button onClick={() => updateQuantity(product.id, defaultVariantId, 1)} className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#111827] text-xs font-bold" type="button">+</button>
                                                        </div>
                                                        <div className="text-right">
                                                            {product.compareAtPrice && <span className="block text-[11px] text-[#94A3B8] line-through font-medium leading-none mb-0.5">${product.compareAtPrice.toFixed(2)}</span>}
                                                            <span className="block text-[14px] font-black text-[#4F46E5] leading-none">${product.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {step.id < 4 && (
                                    <div className="flex justify-center pt-5 mt-5 border-t border-[#E2E8F0]/60 w-full">
                                        <button
                                            onClick={handleNextStep}
                                            type="button"
                                            className="bg-white border-2 border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white font-bold py-3 px-8 rounded-lg transition-all text-[16px]"
                                        >
                                            Next: {step.id === 1 ? 'Choose your plan' : step.id === 2 ? 'Choose your sensors' : 'Add extra protection'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}