'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function Stepper({ quantity, onIncrement, onDecrement, min = 0 }) {
    return (
        <div className="flex items-center border border-gray-300 rounded-full bg-white p-1 max-w-[120px] justify-between shadow-sm">

            <button
                onClick={(e) => {
                    e.stopPropagation(); 
                    if (quantity > min) onDecrement();
                }}
                disabled={quantity <= min}
                className={`p-1.5 rounded-full transition-colors ${quantity <= min
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                type="button"
            >
                <Minus size={14} strokeWidth={2.5} />
            </button>

            <span className="font-semibold text-sm text-gray-800 px-2 select-none">
                {quantity}
            </span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onIncrement();
                }}
                className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                type="button"
            >
                <Plus size={14} strokeWidth={2.5} />
            </button>
        </div>
    );
}

