"use client";

import InputsContainer from "./InputsContainer";
import useCartStore from "@/hooks/useCartStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiGlobe,
  FiTag,
  FiCreditCard,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import Button from "../Button";
import { useForm } from "react-hook-form";
import CheckoutInput from "./CheckoutInput";
import { useTranslations } from "next-intl";
import { MdOutlineLocalShipping } from "react-icons/md";
import {
  getShippingOptions,
  validateCoupon,
  createOrder,
} from "@/lib/utils/api-client";

type CheckoutFields = {
  // Personal Information
  fullName: string;
  email: string;
  phoneNumber: string;

  // Shipping Address
  street: string;
  buildingNumber: string;
  additionalAddress?: string;
  postalCode: string;
  city: string;
  country: string;

  // Coupon
  couponCode?: string;
};

interface ShippingOption {
  id: number;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price: string;
  estimated_days?: number;
  is_active: boolean;
}

export default function CheckoutPageLayout() {
  const h = useTranslations("CheckoutPage");
  const Personalinformation = useTranslations("Personalinformation");
  const ShippingAddress = useTranslations("ShippingAddress");
  const CouponCode = useTranslations("CouponCode");
  const OrderSummary = useTranslations("OrderSummary");
  const ButtonTransaltions = useTranslations("Button");
  const PaymentMethod = useTranslations("PaymentMethod");
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  // Backend Data State
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cash" | "card">("cash");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFields>({
    mode: "onChange",
  });

  // Fetch shipping options
  useEffect(() => {
    const fetchData = async () => {
      const shippingData = await getShippingOptions();
      const activeOptions = shippingData.filter((opt: ShippingOption) => opt.is_active !== false);
      setShippingOptions(activeOptions);

      if (activeOptions.length > 0) {
        setSelectedShipping(activeOptions[0]);
      }
    };
    fetchData();
  }, []);

  // Scroll to top when order is successful
  useEffect(() => {
    if (orderSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderSuccess]);

  const handleApplyCoupon = async () => {
    const code = watch("couponCode");
    if (!code) return;

    setCouponError("");
    setCouponSuccess("");

    try {
      const result = await validateCoupon(code, getTotal());
      setAppliedCoupon(result);
      setCouponSuccess(
        `Coupon applied! Discount: ${result.discount_value}${result.discount_type === "percentage" ? "%" : " JOD"
        }`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Coupon error:", error);
      setAppliedCoupon(null);
      setCouponError(
        error.details?.coupon_code?.[0] ||
        error.details?.coupon_code ||
        "Invalid coupon"
      );
    }
  };

  // Calculate product discounts (difference between base and discount prices)
  const getProductDiscounts = () => {
    let totalDiscount = 0;
    cart.forEach((item) => {
      const basePrice = parseFloat(String(item.base_price)) || 0;
      const finalPrice = item.final_price || basePrice;
      if (basePrice > finalPrice) {
        totalDiscount += (basePrice - finalPrice) * item.quantity;
      }
    });
    return totalDiscount;
  };

  // Calculate coupon discount
  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getTotal();
    if (appliedCoupon.discounted_total) {
      return subtotal - parseFloat(appliedCoupon.discounted_total);
    }
    return 0;
  };

  const calculateFinalTotal = () => {
    let total = getTotal();

    // Apply coupon discount
    if (appliedCoupon && appliedCoupon.discounted_total) {
      total = parseFloat(appliedCoupon.discounted_total);
    }

    // Add shipping cost
    if (selectedShipping) {
      total += parseFloat(selectedShipping.price);
    }

    return total;
  };

  const onSubmit = async (data: CheckoutFields) => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!selectedShipping) {
      alert("Please select a shipping option");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        address: `${data.street}, ${data.buildingNumber}${data.additionalAddress ? `, ${data.additionalAddress}` : ""
          }`,
        city: data.city,
        country: data.country, // Send country value as text (backend handles both ID and name)
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          selected_options: item.selectedVariations
            ? item.selectedVariations.reduce((acc, curr) => {
              acc[curr.name] = curr.value;
              return acc;
            }, {} as Record<string, string>)
            : {},
        })),
        payment_method: selectedPaymentMethod.toUpperCase(), // Backend expects "CASH" or "CARD"
        total_amount: getTotal(),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        shipping_option_id: selectedShipping.id,
      };

      console.log("Submitting order:", orderPayload);

      const response = await createOrder(orderPayload);

      if (response.success) {
        // Handle card payment - redirect to payment link
        if (selectedPaymentMethod === "card" && response.payment_link) {
          // Redirect to MontyPay checkout
          window.location.href = response.payment_link;
        } else if (selectedPaymentMethod === "card" && !response.payment_link) {
          // Payment link generation failed but order was created
          clearCart();
          setOrderMessage(`Order created (ID: ${response.order?.id}). ${response.message || "Please contact support for payment."}`);
          setOrderSuccess(true);
        } else {
          // Cash on delivery - order complete
          clearCart();
          setOrderMessage("Your order has been placed successfully! We'll contact you soon.");
          setOrderSuccess(true);
        }
      } else {
        alert("Failed to place order. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.details?.error ||
        Object.values(error.details || {})
          .flat()
          .join(", ") ||
        "An error occurred while placing the order.";
      alert(`Failed to place order: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productDiscounts = getProductDiscounts();
  const couponDiscount = getCouponDiscount();

  return (
    <div>
      <div className="flex flex-col items-center justify-center relative overflow-hidden bg-[#1E1E1E] h-[140px] sm:h-[180px] lg:h-[220px] gap-1 sm:gap-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center text-white font-bold">
          {orderSuccess ? "Order Confirmed!" : h("title")}
        </h1>

        <p className="text-white/80 text-center text-sm sm:text-base lg:text-lg max-w-md">
          {orderSuccess ? "Thank you for your purchase" : h("subtitle")}
        </p>
      </div>

      {orderSuccess ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-220px)] px-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 sm:p-12 max-w-lg text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {h("orderSuccess") || "Order Placed Successfully!"}
            </h2>
            <p className="text-gray-600 mb-8">
              {orderMessage}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#1E1E1E] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#333] transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              {ButtonTransaltions("GoBackHome") || "Go Back Home"}
            </button>
          </div>
        </div>
      ) : (
        <>

          <div className="my-6 px-4 sm:px-6 lg:px-12 xl:px-40 flex flex-col lg:flex-row gap-8 lg:gap-12">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-8 lg:w-2/3"
            >
              {/* Personal information */}
              <InputsContainer
                title={Personalinformation("Personalinformation")}
                icon={FiUser}
              >
                <CheckoutInput
                  id="fullName"
                  placeholder={Personalinformation("fullName")}
                  icon={FiUser}
                  error={errors.fullName}
                  registration={register("fullName", {
                    required: `${Personalinformation("requiredfullName")}`,
                    minLength: {
                      value: 3,
                      message: `${Personalinformation("minLengthfullName")}`,
                    },
                  })}
                />

                <CheckoutInput
                  id="email"
                  placeholder={Personalinformation("email")}
                  icon={FiMail}
                  error={errors.email}
                  registration={register("email", {
                    required: `${Personalinformation("requiredEmail")}`,
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: `${Personalinformation("validEmail")}`,
                    },
                  })}
                />

                <CheckoutInput
                  id="phoneNumber"
                  placeholder={Personalinformation("phoneNumber")}
                  icon={FiPhone}
                  error={errors.phoneNumber}
                  registration={register("phoneNumber", {
                    required: `${Personalinformation("requiredPhoneNumber")}`,
                    minLength: {
                      value: 9,
                      message: `${Personalinformation("validPhoneNumber")}`,
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: `${Personalinformation("validPhoneNumber")}`,
                    },
                  })}
                />
              </InputsContainer>

              {/* Shipping Address */}
              <InputsContainer
                title={ShippingAddress("ShippingAddress")}
                icon={MdOutlineLocalShipping}
              >
                <CheckoutInput
                  id="street"
                  placeholder={ShippingAddress("street")}
                  icon={FiHome}
                  error={errors.street}
                  registration={register("street", {
                    required: `${ShippingAddress("requiredStreet")}`,
                  })}
                />

                <CheckoutInput
                  id="buildingNumber"
                  placeholder={ShippingAddress("buildingNumber")}
                  icon={FiHome}
                  error={errors.buildingNumber}
                  registration={register("buildingNumber", {
                    required: `${ShippingAddress("requiredBuildingNumber")}`,
                  })}
                />

                <CheckoutInput
                  id="additionalAddress"
                  placeholder={ShippingAddress("additionalAddress")}
                  icon={FiMapPin}
                  registration={register("additionalAddress")}
                />

                <div className="flex gap-4 justify-between">
                  <CheckoutInput
                    id="postalCode"
                    placeholder={ShippingAddress("postalCode")}
                    icon={FiMapPin}
                    error={errors.postalCode}
                    registration={register("postalCode", {
                      required: `${ShippingAddress("requiredPostalCode")}`,
                    })}
                  />

                  <CheckoutInput
                    id="city"
                    placeholder={ShippingAddress("city")}
                    icon={FiMapPin}
                    error={errors.city}
                    registration={register("city", {
                      required: `${ShippingAddress("requiredCity")}`,
                    })}
                  />
                </div>

                {/* Country Text Input */}
                <CheckoutInput
                  id="country"
                  placeholder={ShippingAddress("country")}
                  icon={FiGlobe}
                  error={errors.country}
                  registration={register("country", {
                    required: `${ShippingAddress("requiredCountry")}`,
                  })}
                />
              </InputsContainer>

              {/* Shipping Options */}
              <InputsContainer title="Shipping Method" icon={MdOutlineLocalShipping}>
                <div className="flex flex-col gap-3">
                  {shippingOptions.length === 0 ? (
                    <p className="text-gray-500 text-sm">Loading shipping options...</p>
                  ) : (
                    shippingOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedShipping(option)}
                        className={`flex flex-col p-4 border rounded-xl transition-all duration-200 text-left ${selectedShipping?.id === option.id
                          ? "border-[#1E1E1E] bg-[#FDF7EF] ring-2 ring-[#1E1E1E]"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping?.id === option.id
                                ? "border-[#1E1E1E]"
                                : "border-gray-300"
                                }`}
                            >
                              {selectedShipping?.id === option.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
                              )}
                            </div>
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <span className="font-semibold">{parseFloat(option.price).toFixed(2)} JOD</span>
                        </div>
                        {/* Description and estimated days */}
                        <div className="ml-8 mt-2 flex flex-col gap-1">
                          {option.description && (
                            <p className="text-sm text-gray-500">{option.description}</p>
                          )}
                          {option.estimated_days && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <FiClock size={14} />
                              <span>{option.estimated_days} days delivery</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </InputsContainer>

              {/* Coupon Code */}
              <InputsContainer title={CouponCode("CouponCode")} icon={FiTag}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder={CouponCode("EnterCoupon")}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                      {...register("couponCode")}
                    />
                    <Button
                      variant="secondary"
                      label={ButtonTransaltions("Apply")}
                      onClick={(e) => {
                        if (e) e.preventDefault();
                        handleApplyCoupon();
                      }}
                      type="button"
                      rounded={false}
                    />
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-green-600 text-sm">{couponSuccess}</p>
                  )}
                </div>
              </InputsContainer>

              {/* Payment Method */}
              <InputsContainer title={PaymentMethod("PaymentMethod")}>
                <div className="flex flex-col gap-3">
                  {/* Cash on Delivery - Only Option */}
                  <div
                    className="flex flex-col p-4 border border-[#1E1E1E] bg-[#FDF7EF] ring-2 ring-[#1E1E1E] rounded-xl text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
                      </div>
                      <FiDollarSign size={20} className="text-gray-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-8 mt-1">Pay when you receive your order</p>
                  </div>
                </div>
              </InputsContainer>
            </form>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <InputsContainer title={OrderSummary("OrderSummary")}>
                <div className="flex flex-col gap-4">
                  {cart.map((item) => {
                    const basePrice = parseFloat(String(item.base_price)) || item.final_price;
                    const hasDiscount = basePrice > item.final_price;

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {(basePrice * item.quantity).toFixed(2)} JOD
                            </span>
                          )}
                          <span className="text-sm font-medium">
                            {(item.final_price * item.quantity).toFixed(2)} JOD
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Subtotal</span>
                      <span>{getTotal().toFixed(2)} JOD</span>
                    </div>

                    {/* Product Discounts (if any items have discount prices) */}
                    {productDiscounts > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Product Discounts</span>
                        <span>-{productDiscounts.toFixed(2)} JOD</span>
                      </div>
                    )}

                    {/* Coupon/Promo Discount */}
                    {appliedCoupon && couponDiscount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Promo Code ({appliedCoupon.code})</span>
                        <span>-{couponDiscount.toFixed(2)} JOD</span>
                      </div>
                    )}

                    {selectedShipping && (
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Shipping ({selectedShipping.name})</span>
                        <span>{parseFloat(selectedShipping.price).toFixed(2)} JOD</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center font-bold text-lg mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>{calculateFinalTotal().toFixed(2)} JOD</span>
                    </div>
                  </div>
                </div>
              </InputsContainer>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-12 xl:px-40 pb-4">
            <Button
              fullWidth
              variant="secondary"
              label={
                isSubmitting
                  ? "Processing..."
                  : ButtonTransaltions("CompleteOrder")
              }
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              rounded={false}
            />
          </div>
        </>)}
    </div>
  );
}
