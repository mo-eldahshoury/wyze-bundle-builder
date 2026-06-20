'use client';

import React, { useRef, useEffect } from 'react';
import { useBundle } from '@/context/BundleContext';
import { Shield } from 'lucide-react';

function ShippingIcon({ className = "w-6 h-6" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8" />
            <path d="M14 9h4l3 3v4a1 1 0 0 1-1 1h-6V9z" />
            <path d="M18 9v3h3" />
            <circle cx="7.5" cy="18.5" r="2.5" fill="none" />
            <circle cx="7.5" cy="18.5" r="0.75" fill="currentColor" />
            <circle cx="17.5" cy="18.5" r="2.5" fill="none" />
            <circle cx="17.5" cy="18.5" r="0.75" fill="currentColor" />
            <path d="M1 9h2M0 12h2" strokeWidth="1.5" opacity="0.7" />
        </svg>
    );
}

function SatisfactionSeal() {
    const points = 30;
    const outerRadius = 47;
    const innerRadius = 42;
    const centerX = 50;
    const centerY = 50;

    let pathDescription = "";

    for (let i = 0; i < points * 2; i++) {
        const currentRadius = i % 2 === 0 ? outerRadius : innerRadius;
        const currentAngle = (Math.PI * i) / points;
        const xCoordinate = centerX + currentRadius * Math.sin(currentAngle);
        const yCoordinate = centerY - currentRadius * Math.cos(currentAngle);

        pathDescription += `${i === 0 ? "M" : "L"}${xCoordinate.toFixed(1)},${yCoordinate.toFixed(1)} `;
    }
    pathDescription += "Z";

    return (
        <svg
            viewBox="0 0 100 100"
            className="w-[76px] h-[76px] shrink-0 transform hover:scale-105 transition-transform duration-200"
            aria-label="100% Wyze satisfaction guarantee seal badge"
        >
            <path d={pathDescription} fill="#4F46E5" />
            <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeDasharray="2, 2"
                opacity="0.85"
            />
            <text
                x="50"
                y="41"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="14.5"
                fontWeight="800"
                style={{ fontFamily: "Gilroy-SemiBold, sans-serif", letterSpacing: "-0.5px" }}
            >
                100%
            </text>
            <text
                x="50"
                y="53"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="7.5"
                fontWeight="700"
                style={{ fontFamily: "Gilroy-SemiBold, sans-serif", letterSpacing: "0.2px" }}
            >
                WYZE
            </text>
            <text
                x="50"
                y="62"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="6.8"
                fontWeight="400"
                style={{ fontFamily: "Gilroy-Regular, sans-serif", opacity: "0.9" }}
            >
                satisfaction
            </text>
            <text
                x="50"
                y="70"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="6.8"
                fontWeight="400"
                style={{ fontFamily: "Gilroy-Regular, sans-serif", opacity: "0.9" }}
            >
                guarantee
            </text>
        </svg>
    );
}

// Maps a product's numeric `step` to the category bucket it belongs to in the review list.
const SECTION_BY_STEP = {
    1: 'CAMERAS',
    2: 'HOME MONITORING PLAN',
    3: 'SENSORS',
};

function sectionNameForStep(step) {
    return SECTION_BY_STEP[step] || 'ACCESSORIES';
}

// Builds the categorized, quantity-filtered cart for a given step of the flow.
// `currentStep` is the highest step reached so far (the caller passes `maxStep`) —
// products belonging to a later step are excluded entirely, so the panel
// accumulates as the user moves forward instead of showing future steps early.
function buildReviewData(products, cart, currentStep) {
    const categories = {
        CAMERAS: [],
        SENSORS: [],
        ACCESSORIES: [],
        'HOME MONITORING PLAN': [],
    };

    let subtotal = 0;
    let totalCompareAtPrice = 0;

    products.forEach((product) => {
        if (currentStep != null && product.step > currentStep) return;

        const sectionName = sectionNameForStep(product.step);

        if (!product.variants || product.variants.length === 0) {
            const qty = cart[`${product.id}-default`] || 0;
            if (qty > 0) {
                categories[sectionName].push({ ...product, variantId: 'default', quantity: qty });
                subtotal += product.price * qty;
                totalCompareAtPrice += (product.compareAtPrice || product.price) * qty;
            }
        } else {
            product.variants.forEach((variant) => {
                const qty = cart[`${product.id}-${variant.id}`] || 0;
                if (qty > 0) {
                    categories[sectionName].push({
                        ...product,
                        variantId: variant.id,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        quantity: qty,
                    });
                    subtotal += product.price * qty;
                    totalCompareAtPrice += (product.compareAtPrice || product.price) * qty;
                }
            });
        }
    });

    const totalSavings = totalCompareAtPrice - subtotal;
    const hasItems = Object.values(categories).some((arr) => arr.length > 0);

    return { categories, subtotal, totalCompareAtPrice, totalSavings, hasItems };
}

function CategorySection({ categoryName, items, updateQuantity }) {
    const isMonitoringPlan = categoryName === 'HOME MONITORING PLAN';

    return (
        <div className="mb-6">
            <h4 className="text-[15px] font-normal text-[#CED6DE] tracking-wider uppercase mb-4 font-['Gilroy-Regular']">
                {categoryName}
            </h4>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={`${item.id}-${item.variantId}`} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            {isMonitoringPlan ? (
                                <div className="w-12 h-12 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shadow-sm shrink-0">
                                    <Shield size={20} strokeWidth={2.5} />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center overflow-hidden shadow-sm shrink-0 p-1">
                                    <img
                                        src={item.image || '/api/placeholder/48/48'}
                                        alt={item.title}
                                        className="object-contain max-h-full max-w-full mix-blend-multiply"
                                    />
                                </div>
                            )}

                            <div>
                                {isMonitoringPlan ? (
                                    <h5 className="text-[14px] text-[#1F2937] leading-none font-['Gilroy-Bold']">
                                        <span className="font-bold text-gray-900">Cam </span>
                                        <span className="font-extrabold text-[#4F46E5]">Unlimited</span>
                                    </h5>
                                ) : (
                                    <h5 className={`text-[14px] font-semibold text-[#1F2937] leading-tight ${categoryName === 'CAMERAS' ? "font-['Gilroy-SemiBold']" : "font-['Gilroy-Regular']"}`}>
                                        {item.title}
                                    </h5>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            {!isMonitoringPlan && (
                                <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-white px-1.5 py-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.variantId, -1)}
                                        className="w-5 h-5 flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] text-xs font-bold"
                                        type="button"
                                    >
                                        —
                                    </button>
                                    <span className="text-xs font-bold text-[#111827] px-2 min-w-[20px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.variantId, 1)}
                                        className="w-5 h-5 flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] text-xs font-bold"
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            <div className="text-right min-w-[70px]">
                                {item.compareAtPrice && (
                                    <span className="block text-[11px] text-[#9CA3AF] line-through font-normal">
                                        ${(item.compareAtPrice * item.quantity).toFixed(2)}{isMonitoringPlan && '/mo'}
                                    </span>
                                )}
                                <span className="block text-[13px] font-bold text-[#4F46E5] mt-0.5">
                                    {item.price === 0 ? 'FREE' : `$${(item.price * item.quantity).toFixed(2)}${isMonitoringPlan ? '/mo' : ''}`}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full h-[1px] bg-[#E2E8F0] mt-5" />
        </div>
    );
}

// Step-aware copy for the panel header, keyed by maxStep. Falls back to the
// completed-state copy once maxStep moves past the mapped steps.
const STEP_HEADER_COPY = {
    1: {
        title: 'Building your system',
        subtitle: 'Start by choosing the cameras that fit your home.',
    },
    2: {
        title: 'Add your monitoring plan',
        subtitle: "Pick the plan that keeps your cameras watching, even when you're not.",
    },
    3: {
        title: 'Almost there',
        subtitle: 'Add sensors to cover doors, windows, and motion.',
    },
};

const DEFAULT_HEADER_COPY = {
    title: 'Your security system',
    subtitle: 'Review your personalized protection system designed to keep what matters most safe.',
};

export default function ReviewPanel({ products }) {
    const { cart, updateQuantity, activeStep } = useBundle();

    // `activeStep` reflects whichever accordion tab is currently expanded, and
    // flips to `null` whenever the user collapses a tab — it is NOT a record of
    // progress. `maxStepRef` tracks the highest step ever reached so the review
    // panel keeps showing accumulated items even when every tab is closed.
    const maxStepRef = useRef(typeof activeStep === 'number' ? activeStep : 1);

    useEffect(() => {
        if (typeof activeStep === 'number' && activeStep > maxStepRef.current) {
            maxStepRef.current = activeStep;
        }
    }, [activeStep]);

    const maxStep = typeof activeStep === 'number'
        ? Math.max(activeStep, maxStepRef.current)
        : maxStepRef.current;

    const { categories, subtotal, totalCompareAtPrice, totalSavings, hasItems } = buildReviewData(
        products,
        cart,
        maxStep
    );

    const headerCopy = STEP_HEADER_COPY[maxStep] || DEFAULT_HEADER_COPY;

    return (
        <div className="w-full bg-[#F4F7FC] p-6 font-sans antialiased rounded-2xl border border-[#E2E8F0] sticky top-6 self-start min-h-[420px]">
            <div className="mb-1">
                <span className="text-[11px] font-normal text-[#CED6DE] tracking-widest uppercase font-['Gilroy-Regular']">
                    REVIEW
                </span>
            </div>

            <div className="mb-6">
                <h2 className="text-[22px] font-semibold text-[#111827] tracking-tight font-['Gilroy-Medium']">
                    {headerCopy.title}
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-1.5 leading-relaxed font-['Gilroy-Regular']">
                    {headerCopy.subtitle}
                </p>
            </div>

            <div className="w-full h-[2px] bg-[#E2E8F0] mb-5" />

            {Object.keys(categories).map((categoryName) => {
                const items = categories[categoryName];
                if (items.length === 0) return null;

                return (
                    <CategorySection
                        key={categoryName}
                        categoryName={categoryName}
                        items={items}
                        updateQuantity={updateQuantity}
                    />
                );
            })}

            {hasItems && (
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#10B981] shadow-sm transform hover:rotate-3 transition-transform duration-200">
                                <ShippingIcon className="w-6 h-6" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1F2937] font-['Gilroy-SemiBold']">Fast Shipping</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[11px] text-[#9CA3AF] line-through font-normal">$5.99</span>
                            <span className="block text-[13px] font-bold text-[#4F46E5] uppercase mt-0.5">FREE</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#E2E8F0] mt-5" />
                </div>
            )}

            {hasItems && (
                <div className="space-y-4">
                    <div className="flex items-end justify-between pt-2">
                        <SatisfactionSeal />

                        <div className="text-right space-y-1">
                            <span className="inline-block bg-[#4F46E5] text-white text-[10px] font-bold px-2.5 py-1 rounded font-['Gilroy-SemiBold'] tracking-wide">
                                as low as $19.19/mo
                            </span>
                            <div className="flex items-baseline justify-end gap-1.5 mt-1.5">
                                <span className="text-[15px] text-[#9CA3AF] line-through font-normal">
                                    ${totalCompareAtPrice.toFixed(2)}
                                </span>
                                <span className="text-[32px] font-black text-[#4F46E5] tracking-tight leading-none font-['Gilroy-SemiBold']">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {totalSavings > 0 && (
                        <p className="text-center text-[13px] font-bold text-[#0EA5E9] tracking-wide pt-1 font-['Gilroy-SemiBold']">
                            Congrats! You're saving ${totalSavings.toFixed(2)} on your security bundle!
                        </p>
                    )}

                    <button
                        type="button"
                        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-4 text-[18px] tracking-wide shadow-md active:scale-[0.99] transition-all font-['TT Norms Pro'] rounded-xl"
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}