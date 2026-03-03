import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, ShoppingCart, Plus, Minus, Trash2, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const availableMedicines = [
  { id: 1, name: "Amoxicillin 500mg", price: 12.5, prescribed: true, stock: true },
  { id: 2, name: "Paracetamol 500mg", price: 3.0, prescribed: true, stock: true },
  { id: 3, name: "Losartan 50mg", price: 18.0, prescribed: true, stock: true },
  { id: 4, name: "Aspirin 80mg", price: 5.5, prescribed: true, stock: false },
];

type CartItem = { id: number; name: string; price: number; qty: number };

export default function Pharmacy() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");

  const addToCart = (med: typeof availableMedicines[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === med.id);
      if (existing) return prev.map((c) => (c.id === med.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id: med.id, name: med.name, price: med.price, qty: 1 }];
    });
    toast.success(`${med.name} added to cart`);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    toast.success(`Order placed! ${deliveryMethod === "pickup" ? "Ready for pickup." : "Delivery on its way."}`);
    setCart([]);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">E-Pharmacy</h1>
          <p className="text-sm text-muted-foreground mt-1">Order your prescribed medicines for pickup or delivery.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Medicines */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-display text-base font-semibold text-foreground">Prescribed Medicines</h2>
            {availableMedicines.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{med.name}</p>
                    <p className="text-xs text-muted-foreground">₱{med.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {med.prescribed && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">Prescribed</Badge>
                  )}
                  {med.stock ? (
                    <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => addToCart(med)}>
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">Out of Stock</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cart */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card h-fit">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" /> Cart
            </h2>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₱{item.price.toFixed(2)} × {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="rounded p-1 hover:bg-muted text-muted-foreground">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center text-foreground">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="rounded p-1 hover:bg-muted text-muted-foreground">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setCart((p) => p.filter((c) => c.id !== item.id))} className="rounded p-1 hover:bg-destructive/10 text-destructive ml-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-sm font-semibold text-foreground">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Delivery Method</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        deliveryMethod === "pickup"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" /> Pickup
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        deliveryMethod === "delivery"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Truck className="h-3.5 w-3.5" /> Delivery
                    </button>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full gradient-primary border-0 text-primary-foreground">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
