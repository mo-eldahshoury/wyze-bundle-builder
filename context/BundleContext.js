'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BundleContext = createContext();

export function BundleProvider({ children }) {
    const [cart, setCart] = useState({});

    const [activeStep, setActiveStep] = useState(1);

    const [activeVariants, setActiveVariants] = useState({});

    useEffect(() => {
        const savedSystem = localStorage.getItem('ecom_security_system');
        if (savedSystem) {
            try {
                const parsed = JSON.parse(savedSystem);
                setCart(parsed.cart || {});
                setActiveVariants(parsed.activeVariants || {});
                if (parsed.activeStep) setActiveStep(parsed.activeStep);
                return;
            } catch (e) {
                console.error("Error parsing saved system", e);
            }
        }

        const initialCart = {
            'wyze-cam-v4-white': 1,
            'wyze-cam-pan-v3-white': 2,
            'wyze-motion-sensor-default': 2,
            'wyze-sense-hub-default': 1,
            'wyze-microsd-card-default': 2,
            'cam-unlimited-plan-default': 1
        };

        const initialVariants = {
            'wyze-cam-v4': 'white',
            'wyze-cam-pan-v3': 'white',
            'wyze-floodlight-v2': 'white',
            'wyze-battery-cam-pro': 'white'
        };

        setCart(initialCart);
        setActiveVariants(initialVariants);
    }, []);

    const updateQuantity = (productId, variantId, change) => {
        const key = `${productId}-${variantId}`;
        setCart((prevCart) => {
            const currentQty = prevCart[key] || 0;
            const newQty = Math.max(0, currentQty + change);

            const updated = { ...prevCart };
            if (newQty === 0) {
                delete updated[key]; 
            } else {
                updated[key] = newQty;
            }
            return updated;
        });
    };

    const changeActiveVariant = (productId, variantId) => {
        setActiveVariants((prev) => ({
            ...prev,
            [productId]: variantId,
        }));
    };

    // 4.Save my system for later
    const saveSystemForLater = () => {
        const dataToSave = { cart, activeVariants, activeStep };
        localStorage.setItem('ecom_security_system', JSON.stringify(dataToSave));
        alert('Your security system configuration has been saved successfully!');
    };

    const getSelectedCountByStep = (productsInStep) => {
        let distinctCount = 0;
        productsInStep.forEach(product => {
            if (!product.variants || product.variants.length === 0) {
                if (cart[`${product.id}-default`] > 0) distinctCount++;
            } else {
                const hasSelectedVariant = product.variants.some(v => cart[`${product.id}-${v.id}`] > 0);
                if (hasSelectedVariant) distinctCount++;
            }
        });
        return distinctCount;
    };

    return (
        <BundleContext.Provider value={{
            cart,
            activeStep,
            activeVariants,
            setActiveStep,
            updateQuantity,
            changeActiveVariant,
            saveSystemForLater,
            getSelectedCountByStep
        }}>
            {children}
        </BundleContext.Provider>
    );
}

export const useBundle = () => useContext(BundleContext);