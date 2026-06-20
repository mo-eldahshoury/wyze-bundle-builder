'use client';

import React, { useEffect, useState } from 'react';
import { useBundle } from '@/context/BundleContext';
import MobileFrame from '@/components/builder/MobileFrame';
import DesktopFrame from '@/components/builder/DesktopFrame';
import BundleBuilder from '@/components/builder/BundleBuilder';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { saveSystemForLater } = useBundle();
    const [currentFrame, setCurrentFrame] = useState('mobile');

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Failed to fetch dataset');
                const data = await res.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
                <p className="text-sm font-semibold text-gray-500 animate-pulse">
                    Loading Security System...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#e2e8f0] py-6 flex flex-col items-center">

            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-1.5 flex gap-2 shadow-sm z-50">
                <button
                    onClick={() => setCurrentFrame('mobile')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentFrame === 'mobile' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    iPhone 13 & 14
                </button>
                <button
                    onClick={() => setCurrentFrame('desktop-1735')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentFrame === 'desktop-1735' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Desktop (1735)
                </button>
                <button
                    onClick={() => setCurrentFrame('desktop-1736')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentFrame === 'desktop-1736' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Desktop (1736)
                </button>
            </div>

            {currentFrame === 'mobile' && (
                <MobileFrame products={products} saveSystemForLater={saveSystemForLater} />
            )}
            {currentFrame === 'desktop-1735' && (
                <DesktopFrame products={products} saveSystemForLater={saveSystemForLater} />
            )}
            {currentFrame === 'desktop-1736' && (
                <BundleBuilder products={products} saveSystemForLater={saveSystemForLater} />
            )}
        </div>
    );
}