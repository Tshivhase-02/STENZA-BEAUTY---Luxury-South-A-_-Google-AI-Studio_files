import React, { useState } from 'react';
import { BeautyProduct } from '../data/beautyData';

export interface CartItem {
  product: BeautyProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 500;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 95;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#fcf9f4] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#e5e0d8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e5e0d8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#695684]">shopping_bag</span>
            <h3 className="font-serif text-xl font-bold text-[#26152d]">
              Beauty Apothecary Bag
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebe8e3] text-gray-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {checkoutSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[36px]">local_shipping</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-[#26152d]">
                Order Confirmed!
              </h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                Thank you! Your botanical beauty items are being carefully packed for door-to-door courier dispatch across South Africa.
              </p>
              <div className="text-xs font-mono font-bold text-[#695684] bg-[#f6f3ee] py-2 px-4 rounded-lg inline-block">
                WAYBILL: STZ-RAM-{Math.floor(100000 + Math.random() * 900000)}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <span className="material-symbols-outlined text-gray-300 text-[48px]">
                local_mall
              </span>
              <p className="font-serif text-lg text-gray-600">Your bag is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our curated South African botanical serums, Kalahari melon butters, and salon-grade restorative oils.
              </p>
            </div>
          ) : (
            <>
              {/* Shipping progress indicator */}
              <div className="p-3 bg-white rounded-xl border border-[#e5e0d8] text-xs">
                {subtotal >= freeShippingThreshold ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>You've unlocked FREE courier delivery anywhere in SA!</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-700">
                      Add <strong className="text-[#695684]">R{freeShippingThreshold - subtotal}</strong> more for complimentary door-to-door courier.
                    </span>
                    <div className="w-full bg-[#f0ede6] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-[#695684] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 bg-white rounded-xl border border-[#e5e0d8] relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-[#7c535c]">{product.brand}</div>
                      <h4 className="text-xs font-semibold text-[#26152d] truncate">{product.name}</h4>
                      <div className="text-xs font-bold text-[#695684] mt-1">R{product.price}</div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-6 h-6 rounded bg-[#f6f3ee] hover:bg-[#ebe8e3] text-xs flex items-center justify-center font-bold text-gray-700"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-[#26152d] px-1">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-6 h-6 rounded bg-[#f6f3ee] hover:bg-[#ebe8e3] text-xs flex items-center justify-center font-bold text-gray-700"
                        >
                          +
                        </button>

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="ml-auto text-[11px] text-gray-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer with totals & checkout */}
        {items.length > 0 && !checkoutSuccess && (
          <div className="p-6 bg-white border-t border-[#e5e0d8] space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#26152d]">R{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Door-to-door Courier (RAM / The Courier Guy)</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">Free</strong> : `R${shipping}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#f0ede6] text-sm font-bold text-[#26152d]">
                <span>Total Amount</span>
                <span className="text-[#695684]">R{total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-[#695684] hover:bg-[#584572] text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Proceed to Secure ZAR Checkout • R{total}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
