"use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/context/CartContext";
// import { useCurrency } from "@/context/CurrencyContext";
// import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiGlobe,
  FiTag,
} from "react-icons/fi";
import { HiOutlineCash, HiOutlineCreditCard } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";
// import { useTranslations, useLocale } from "next-intl";
// import Script from "next/script";

export default function OldCheckoutPageLayout() {
  // Mock translation function
  const t = (key) => key;

  // Static values instead of hooks
  const isArabic = false;
  const loading = false;
  const error = null;
  const showConfirmation = false;
  const confirmedOrderId = null;
  const couponCode = "";
  const couponLoading = false;
  const shippingOptions = [];
  const filteredShippingOptions = [];
  const shippingSearch = "";
  const selectedShippingOption = null;
  const loadingShippingOptions = false;
  const shippingError = null;
  const paymentMethod = "CASH";
  const cartItems = [];
  const subtotalAmount = 0;
  const totalCartQuantity = 0;
  const shippingCost = 0;
  const totalAmount = 0;

  const discountInfo = {
    discount_amount: 0,
    discount_type: null,
    discount_value: 0,
    code: "",
    discounted_total: 0,
    is_applied: false,
  };

  const formData = {
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  };

  const detailedAddress = {
    street: "",
    building: "",
    postal: "",
    additional: "",
  };

  // Mock functions
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const handleInputChange = () => {};
  const handleCouponApply = () => {};
  const handleRemoveCoupon = () => {};
  const handleShippingOptionChange = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const getActualDiscountAmount = () => 0;
  const getDiscountedSubtotal = () => subtotalAmount;

  // // COMMENTED OUT: All hooks and state management
  // const t = useTranslations();
  // const locale = useLocale();
  // const isArabic = locale === "ar";
  // const router = useRouter();
  // const { cartItems, clearCart } = useCart();
  // const { formatPrice, currentCurrency, changeCurrency, currencies } = useCurrency();
  // const { user, isAuthenticated, getProfile } = useAuth();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [showConfirmation, setShowConfirmation] = useState(false);
  // const [confirmedOrderId, setConfirmedOrderId] = useState(null);
  // const [couponCode, setCouponCode] = useState("");
  // const [discountInfo, setDiscountInfo] = useState({...});
  // const [couponLoading, setCouponLoading] = useState(false);
  // const [shippingOptions, setShippingOptions] = useState([]);
  // const [filteredShippingOptions, setFilteredShippingOptions] = useState([]);
  // const [shippingSearch, setShippingSearch] = useState("");
  // const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  // const [loadingShippingOptions, setLoadingShippingOptions] = useState(false);
  // const [shippingError, setShippingError] = useState(null);
  // const [formData, setFormData] = useState({...});
  // const [detailedAddress, setDetailedAddress] = useState({...});
  // const [paymentMethod, setPaymentMethod] = useState("CASH");

  // // COMMENTED OUT: Load saved coupon from localStorage
  // useEffect(() => {
  //   const savedCoupon = localStorage.getItem("coupon");
  //   if (savedCoupon) {
  //     try {
  //       const parsedCoupon = JSON.parse(savedCoupon);
  //       setDiscountInfo(parsedCoupon);
  //       if (parsedCoupon.is_applied && parsedCoupon.code) {
  //         setCouponCode(parsedCoupon.code);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing saved coupon:", error);
  //       localStorage.removeItem("coupon");
  //     }
  //   }
  // }, []);

  // // Save coupon to localStorage when it changes
  // useEffect(() => {
  //   localStorage.setItem("coupon", JSON.stringify(discountInfo));
  // }, [discountInfo]);

  // // Calculate subtotal (products only)
  // const subtotalAmount = cartItems.reduce((total, item) => {
  //   const itemPrice =
  //     parseFloat(item.price) +
  //     Object.values(item.selectedOptions || {}).reduce(
  //       (sum, option) => sum + parseFloat(option.additional_price || 0),
  //       0
  //     );
  //   return total + itemPrice * item.quantity;
  // }, 0);

  // // Calculate discount amount
  // const getActualDiscountAmount = () => {
  //   if (!discountInfo.is_applied) {
  //     return 0;
  //   }

  //   if (
  //     discountInfo.discount_amount &&
  //     typeof discountInfo.discount_amount === "number"
  //   ) {
  //     return discountInfo.discount_amount;
  //   }

  //   if (discountInfo.discount_type === "PERCENTAGE") {
  //     return Math.min(
  //       (subtotalAmount * discountInfo.discount_value) / 100,
  //       subtotalAmount
  //     );
  //   } else if (discountInfo.discount_type === "FIXED") {
  //     return Math.min(discountInfo.discount_value, subtotalAmount);
  //   }
  //   return 0;
  // };

  // // Calculate discounted subtotal
  // const getDiscountedSubtotal = () => {
  //   if (!discountInfo.is_applied) {
  //     return subtotalAmount;
  //   }
  //   return Math.max(0, subtotalAmount - getActualDiscountAmount());
  // };

  // // Calculate total cart quantity
  // const totalCartQuantity = cartItems.reduce(
  //   (total, item) => total + item.quantity,
  //   0
  // );

  // // Calculate shipping cost (multiply by total quantity)
  // const shippingCost = selectedShippingOption
  //   ? parseFloat(selectedShippingOption.price) * totalCartQuantity
  //   : 0;

  // // Calculate total amount with shipping and discount
  // const totalAmount = getDiscountedSubtotal() + shippingCost;

  // // Search shipping options
  // useEffect(() => {
  //   if (shippingOptions.length) {
  //     if (!shippingSearch.trim()) {
  //       setFilteredShippingOptions(shippingOptions);
  //     } else {
  //       const query = shippingSearch.toLowerCase().trim();
  //       const filtered = shippingOptions.filter((option) => {
  //         const name =
  //           isArabic && option.name_ar ? option.name_ar : option.name;
  //         const description =
  //           isArabic && option.description_ar
  //             ? option.description_ar
  //             : option.description;
  //         return (
  //           name.toLowerCase().includes(query) ||
  //           description.toLowerCase().includes(query)
  //         );
  //       });
  //       setFilteredShippingOptions(filtered);
  //     }
  //   }
  // }, [shippingSearch, shippingOptions, isArabic]);

  // // COMMENTED OUT: Fetch shipping options
  // const fetchShippingOptions = async () => {
  //   setLoadingShippingOptions(true);
  //   setShippingError(null);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/shipping-options/`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch shipping options");
  //     }
  //     const data = await response.json();
  //     // Filter only active shipping options and ensure IDs are numeric
  //     const activeOptions = data
  //       .filter((option) => option.is_active)
  //       .map((option) => ({
  //         ...option,
  //         id: parseInt(option.id), // Ensure ID is numeric
  //       }));

  //     console.log("Fetched shipping options:", activeOptions);
  //     setShippingOptions(activeOptions);
  //     setFilteredShippingOptions(activeOptions);

  //     // Select the first option by default if available
  //     if (activeOptions.length > 0) {
  //       setSelectedShippingOption(activeOptions[0]);
  //       console.log("Default selected shipping option:", activeOptions[0]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching shipping options:", error);
  //     setShippingError(error.message || "Error loading shipping options");
  //   } finally {
  //     setLoadingShippingOptions(false);
  //   }
  // };

  // // Handle shipping option change
  // const handleShippingOptionChange = (option) => {
  //   console.log("Selected shipping option:", option);
  //   // Ensure we have a valid option with ID before setting
  //   if (option && option.id) {
  //     // Make sure the ID is a number
  //     const optionWithNumericId = {
  //       ...option,
  //       id: parseInt(option.id),
  //     };
  //     setSelectedShippingOption(optionWithNumericId);
  //   } else {
  //     console.error("Invalid shipping option selected:", option);
  //   }
  // };

  // useEffect(() => {
  //   // Fetch shipping options when component mounts
  //   fetchShippingOptions();
  // }, []);

  // // COMMENTED OUT: Auto-fill form when user is logged in
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     // Prepare address information if profile exists
  //     let addressData = {};
  //     let detailedAddressData = {
  //       street: "",
  //       building: "",
  //       postal: "",
  //       additional: "",
  //     };

  //     if (user.profile) {
  //       const street = user.profile.street || "";
  //       const building = user.profile.building || "";
  //       const postal = user.profile.postal_code || "";
  //       const additional = user.profile.landmark || "";

  //       // Combine address fields
  //       const combinedAddress = [street, building, postal, additional]
  //         .filter(Boolean)
  //         .join(", ");

  //       detailedAddressData = {
  //         street,
  //         building,
  //         postal,
  //         additional,
  //       };

  //       addressData = {
  //         address: combinedAddress,
  //         city: user.profile.city || "",
  //         country: user.profile.country || "",
  //       };
  //     }

  //     // Set detailed address first
  //     setDetailedAddress(detailedAddressData);

  //     // Fill all form data in a single update
  //     setFormData((prev) => ({
  //       ...prev,
  //       full_name: user.full_name || "",
  //       email: user.email || "",
  //       phone: user.phone_number || "",
  //       ...addressData,
  //     }));
  //   }
  // }, [isAuthenticated, user]);

  // // COMMENTED OUT: handleInputChange
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name.startsWith("address_")) {
  //     // Handle detailed address fields
  //     const field = name.replace("address_", "");
  //     setDetailedAddress((prev) => {
  //       const updated = { ...prev, [field]: value };
  //       // Combine address fields and update formData
  //       const combinedAddress = [
  //         updated.street,
  //         updated.building,
  //         updated.postal,
  //         updated.additional,
  //       ]
  //         .filter(Boolean)
  //         .join(", ");

  //       setFormData((prevForm) => ({
  //         ...prevForm,
  //         address: combinedAddress,
  //       }));

  //       return updated;
  //     });
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  // // COMMENTED OUT: Coupon handlers
  // const handleCouponApply = async () => {
  //   if (couponCode.trim() === "") {
  //     setError(t("couponRequired") || "Coupon code is required");
  //     return;
  //   }
  //   setCouponLoading(true);
  //   try {
  //     const response = await fetch("/api/validate-coupon", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         coupon: couponCode,
  //         total_amount: subtotalAmount,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Invalid coupon");
  //     }

  //     const {
  //       discount_amount,
  //       discount_type,
  //       discount_value,
  //       code,
  //       discounted_total,
  //     } = data;

  //     const newDiscountInfo = {
  //       discount_amount,
  //       discount_type: discount_type.toUpperCase(),
  //       discount_value,
  //       code,
  //       discounted_total,
  //       is_applied: true,
  //     };

  //     setDiscountInfo(newDiscountInfo);
  //     setError(null);
  //   } catch (error) {
  //     console.error("Coupon validation error:", error);
  //     setError(error.message || t("invalidCoupon") || "Invalid coupon code");
  //   } finally {
  //     setCouponLoading(false);
  //   }
  // };

  // // COMMENTED OUT: handleRemoveCoupon
  // const handleRemoveCoupon = () => {
  //   setDiscountInfo({
  //     discount_amount: 0,
  //     discount_type: null,
  //     discount_value: 0,
  //     code: "",
  //     discounted_total: 0,
  //     is_applied: false,
  //   });
  //   setCouponCode("");
  //   localStorage.removeItem("coupon");
  // };

  // // COMMENTED OUT: validateForm
  // const validateForm = () => {
  //   const errors = [];
  //   if (!formData.full_name?.trim()) errors.push("Full name is required");
  //   if (!formData.phone?.trim()) errors.push("Phone number is required");
  //   if (!formData.address?.trim()) errors.push("Address is required");
  //   if (!formData.city?.trim()) errors.push("City is required");
  //   if (!formData.country?.trim()) errors.push("Country is required");
  //   if (formData.email?.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
  //     errors.push("Invalid email format");
  //   }
  //   if (!cartItems.length) {
  //     errors.push("Cart is empty");
  //   }
  //   if (!currentCurrency?.id) {
  //     errors.push("Please select a currency");
  //   }
  //   if (!selectedShippingOption) {
  //     errors.push("Please select a shipping option");
  //   }
  //
  //   // Note: Credit card payments will automatically use JOD currency during submission
  //   // so we don't need to validate or block the user here
  //
  //   return errors;
  // };

  // // COMMENTED OUT: MPGS state
  // const [isMpgsLoaded, setIsMpgsLoaded] = useState(false);
  // const [scriptAttempted, setScriptAttempted] = useState(false);

  // // COMMENTED OUT: Add useEffect to track MPGS script loading
  // useEffect(() => {
  //   const loadMpgsScript = () => {
  //     // Check if script is already loaded
  //     if (window.Checkout) {
  //       console.log("MPGS script is already loaded");
  //       setIsMpgsLoaded(true);
  //       return;
  //     }

  //     // Check if script element already exists
  //     const existingScript = document.querySelector(
  //       'script[src*="mastercard.com/static/checkout/checkout.min.js"]'
  //     );
  //     if (existingScript) {
  //       console.log("MPGS script is already in the DOM");
  //       return;
  //     }

  //     // Create and append script element
  //     const script = document.createElement("script");
  //     script.src =
  //       "https://ap-gateway.mastercard.com/static/checkout/checkout.min.js";
  //     script.async = true;

  //     script.onload = () => {
  //       console.log("✅ MPGS Checkout script loaded successfully");
  //       setIsMpgsLoaded(true);
  //     };

  //     script.onerror = (e) => {
  //       console.error("❌ MPGS script failed to load", e);
  //       setError("Payment system failed to load. Please try again later.");
  //     };

  //     document.body.appendChild(script);
  //     setScriptAttempted(true);
  //   };

  //   // Load script if not already loaded
  //   if (!isMpgsLoaded && !scriptAttempted) {
  //     console.log("Attempting to load MPGS script...");
  //     loadMpgsScript();
  //   }

  //   // Check for script loaded status
  //   const checkScriptLoaded = setInterval(() => {
  //     if (window.Checkout && !isMpgsLoaded) {
  //       console.log("MPGS script detected as loaded");
  //       setIsMpgsLoaded(true);
  //       clearInterval(checkScriptLoaded);
  //     }
  //   }, 100);

  //   return () => {
  //     clearInterval(checkScriptLoaded);
  //   };
  // }, [isMpgsLoaded, scriptAttempted]);

  // // COMMENTED OUT: initializePayment function
  // const initializePayment = async (sessionData) => {
  //   return new Promise((resolve, reject) => {
  //     const initializeAttempt = () => {
  //       if (typeof window !== "undefined" && window.Checkout) {
  //         try {
  //           // Validate session data
  //           if (
  //             !sessionData ||
  //             !sessionData.session ||
  //             !sessionData.session.id
  //           ) {
  //             console.error("Invalid session data:", sessionData);
  //             reject(
  //               new Error("Invalid session data provided to initializePayment")
  //             );
  //             return;
  //           }

  //           console.log("Resetting MPGS configuration...");
  //           // Reset any previous configuration
  //           try {
  //             window.Checkout.configure(null);
  //             console.log("Successfully reset MPGS configuration");
  //           } catch (resetError) {
  //             console.warn(
  //               "Warning: Failed to reset MPGS configuration:",
  //               resetError
  //             );
  //             // Continue anyway as this might not be critical
  //           }

  //           // Configure with new session
  //           const config = {
  //             session: {
  //               id: sessionData.session.id,
  //             },
  //           };

  //           console.log("Configuring MPGS checkout with:", config);

  //           window.Checkout.configure(config);
  //           console.log("Successfully configured MPGS checkout");

  //           // Set up callbacks before showing payment page
  //           window.Checkout.onComplete = function (response) {
  //             console.log("Payment completed:", response);
  //             const orderId = localStorage.getItem("orderID");
  //             if (orderId) {
  //               setConfirmedOrderId(orderId);
  //               setShowConfirmation(true);
  //             }
  //           };

  //           window.Checkout.onError = function (error) {
  //             console.error("MPGS Payment Error:", error);
  //             const errorMessage =
  //               error?.explanation ||
  //               error?.message ||
  //               "Payment failed. Please try again.";
  //             setError(errorMessage);
  //             setLoading(false);
  //           };

  //           window.Checkout.onCancel = function () {
  //             console.log("Payment cancelled by user");
  //             setError("Payment was cancelled. Please try again.");
  //             setLoading(false);
  //           };

  //           console.log("MPGS callbacks set up successfully");
  //           resolve();
  //         } catch (e) {
  //           console.error("Error in initializePayment:", e);
  //           reject(
  //             new Error(
  //               "MPGS initialization failed: " + (e.message || String(e))
  //             )
  //           );
  //         }
  //       } else {
  //         reject(new Error("Payment gateway is not available"));
  //       }
  //     };

  //     // Try to initialize immediately
  //     initializeAttempt();
  //   });
  // };

  // // COMMENTED OUT: handleSubmit function (entire order submission logic)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   ... (250+ lines of order submission logic commented out)
  // };

  // // COMMENTED OUT: Final useEffect for payment method switching
  // useEffect(() => {
  //   // If payment method is CASH and shipping is not to Amman, switch to credit card
  //   if (paymentMethod === "CASH" && selectedShippingOption?.name !== "Amman") {
  //     setPaymentMethod("CREDIT_CARD");
  //   }
  // }, [selectedShippingOption, paymentMethod]);

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header Section */}
      <div className="h-[180px] flex items-center justify-center relative overflow-hidden bg-[#1E1E1E]">
        <div className="text-center z-10">
          <h1 className="text-4xl text-white font-bold mb-2">
            {t("checkout")}
          </h1>
          <p className="text-white/80">{t("checkoutMessage")}</p>
        </div>
      </div>
      <div id="embed-target" className="mt-6"></div>

      {/* Main Content */}
      <div className="bg-[#F7F7F7] rounded-t-[40px] -mt-10 px-4 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6 flex items-center gap-2">
                  <FiUser className="text-[#1E1E1E]" />
                  {t("personalInformation")}
                </h2>

                <div className="space-y-4">
                  {/* Form Fields with Icons */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("fullNamePlaceholder")}
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder={t("phonePlaceholder")}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6 flex items-center gap-2">
                  <MdOutlineLocalShipping className="text-[#1E1E1E]" />
                  {t("shippingAddress")}
                </h2>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("streetAddressPlaceholder")}
                      name="address_street"
                      value={detailedAddress.street}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>

                  {/* Building/Apartment */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("buildingPlaceholder")}
                      name="address_building"
                      value={detailedAddress.building}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>

                  {/* Additional Address Details */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("additionalAddressPlaceholder")}
                      name="address_additional"
                      value={detailedAddress.additional}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Postal Code */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={t("postalCodePlaceholder")}
                        name="address_postal"
                        value={detailedAddress.postal}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                      />
                    </div>
                    {/* City */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={t("cityPlaceholder")}
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("countryPlaceholder")}
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6 flex items-center gap-2">
                  <MdOutlineLocalShipping className="text-[#1E1E1E]" />
                  {t("shippingOptions")}
                </h2>

                <p className="text-gray-500 mb-2">
                  {t("shippingOptionsMessage")}
                </p>

                {/* Shipping calculation info */}
                {totalCartQuantity > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-blue-800">
                        {isArabic
                          ? `سيتم احتساب تكلفة الشحن بناءً على عدد القطع في سلتك (${totalCartQuantity} قطعة)`
                          : `Shipping cost will be calculated based on your cart quantity (${totalCartQuantity} items)`}
                      </p>
                    </div>
                  </div>
                )}

                {loadingShippingOptions ? (
                  <div className="flex items-center justify-center py-6">
                    <svg
                      className="animate-spin h-5 w-5 text-[#1E1E1E] mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-gray-500">
                      {t("loadingShippingOptions")}
                    </span>
                  </div>
                ) : shippingError ? (
                  <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
                    {t("shippingError")}: {shippingError}
                  </div>
                ) : shippingOptions.length === 0 ? (
                  <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 mb-4">
                    {t("noShippingOptions")}
                  </div>
                ) : (
                  <>
                    {/* Search input for shipping options */}
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder={
                          t("searchShippingOptions") ||
                          "Search shipping options..."
                        }
                        value={shippingSearch}
                        onChange={(e) => setShippingSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200"
                      />
                      {shippingSearch && (
                        <button
                          onClick={() => setShippingSearch("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {filteredShippingOptions.length === 0 ? (
                      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 mb-4">
                        {t("noShippingOptionsFound") ||
                          "No shipping options match your search."}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            {filteredShippingOptions.length}{" "}
                            {filteredShippingOptions.length === 1
                              ? t("optionAvailable") || "option available"
                              : t("optionsAvailable") || "options available"}
                          </span>
                          {filteredShippingOptions.length > 3 && (
                            <div className="flex items-center text-xs text-[#1E1E1E] font-medium">
                              <span className="mr-1">
                                {t("scrollForMoreOptions") ||
                                  "Scroll for more options"}
                              </span>
                              <svg
                                className="h-4 w-4 animate-bounce"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1E1E1E]/20 scrollbar-track-transparent relative">
                            <div className="space-y-3 py-3 px-3">
                              {filteredShippingOptions.map((option) => (
                                <div
                                  key={option.id}
                                  onClick={() =>
                                    handleShippingOptionChange(option)
                                  }
                                  className={`group cursor-pointer rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                                    selectedShippingOption?.id === option.id
                                      ? "bg-[#C9E2FF]/30 border-2 border-[#1E1E1E]"
                                      : "border-2 border-gray-100 hover:border-[#1E1E1E]/30 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`p-3 rounded-full ${
                                        selectedShippingOption?.id === option.id
                                          ? "bg-[#1E1E1E] text-white"
                                          : "bg-[#C9E2FF] text-[#1E1E1E]"
                                      } transition-colors duration-200`}
                                    >
                                      <MdOutlineLocalShipping size={22} />
                                    </div>
                                    <div className="flex-1">
                                      <p
                                        className={`font-semibold ${
                                          selectedShippingOption?.id ===
                                          option.id
                                            ? "text-[#1E1E1E]"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {isArabic && option.name_ar
                                          ? option.name_ar
                                          : option.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {isArabic && option.description_ar
                                          ? option.description_ar
                                          : option.description}
                                        {option.estimated_days && (
                                          <span className="ml-2">
                                            {t("estimatedDelivery")}:{" "}
                                            {option.estimated_days} {t("days")}
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    <div
                                      className={`text-right font-medium whitespace-nowrap ${
                                        selectedShippingOption?.id === option.id
                                          ? "text-[#1E1E1E]"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {formatPrice(option.price)}
                                    </div>
                                    <div
                                      className={`ml-auto w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                                        selectedShippingOption?.id === option.id
                                          ? "border-[#1E1E1E]"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {selectedShippingOption?.id ===
                                        option.id && (
                                        <div className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6 flex items-center gap-2">
                  <FiTag className="text-[#1E1E1E]" />
                  {t("couponCode") || "Coupon Code"}
                </h2>

                {!discountInfo.is_applied ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder={t("enterCouponCode") || "Enter coupon code"}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9E2FF] focus:border-[#1E1E1E] transition-all duration-200 font-mono"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={handleCouponApply}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-6 py-3 bg-[#C9E2FF] text-[#1E1E1E] rounded-xl font-semibold hover:bg-[#C9E2FF]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {couponLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          {t("applying") || "Applying..."}
                        </span>
                      ) : (
                        t("apply") || "Apply"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiTag className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          {discountInfo.code}
                        </p>
                        <p className="text-sm text-green-600">
                          {discountInfo.discount_type === "PERCENTAGE"
                            ? `${discountInfo.discount_value}% off`
                            : `${formatPrice(discountInfo.discount_value)} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      {t("remove") || "Remove"}
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">
                  {t("paymentMethod")}
                </h2>
                <div className="space-y-4">
                  <div
                    onClick={() => {
                      // Only allow selection if shipping is to Amman
                      if (selectedShippingOption?.name === "Amman") {
                        setPaymentMethod("CASH");
                      }
                    }}
                    className={`group cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                      selectedShippingOption?.name !== "Amman"
                        ? "opacity-50 cursor-not-allowed"
                        : paymentMethod === "CASH"
                        ? "bg-[#C9E2FF]/30 border-2 border-[#1E1E1E]"
                        : "border-2 border-gray-100 hover:border-[#1E1E1E]/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-[#C9E2FF] text-[#1E1E1E]">
                        <HiOutlineCash size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {t("cashOnDelivery")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedShippingOption?.name === "Amman"
                            ? t("cashOnDeliveryMessage")
                            : isArabic
                            ? "الدفع عند الاستلام متاح فقط في عمان"
                            : "Cash on delivery is only available for Amman"}
                        </p>
                      </div>
                      <div
                        className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "CASH" &&
                          selectedShippingOption?.name === "Amman"
                            ? "border-[#1E1E1E]"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "CASH" &&
                          selectedShippingOption?.name === "Amman" && (
                            <div className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                          )}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("CREDIT_CARD")}
                    className={`group cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                      paymentMethod === "CREDIT_CARD"
                        ? "bg-[#C9E2FF]/30 border-2 border-[#1E1E1E]"
                        : "border-2 border-gray-100 hover:border-[#1E1E1E]/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-[#C9E2FF] text-[#1E1E1E]">
                        <HiOutlineCreditCard size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {t("creditCard")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isArabic
                            ? "ادفع بأمان باستخدام بطاقتك الائتمانية"
                            : "Pay securely with your credit card"}
                        </p>
                      </div>
                      <div
                        className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "CREDIT_CARD"
                            ? "border-[#1E1E1E]"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "CREDIT_CARD" && (
                          <div className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#C9E2FF] text-[#1E1E1E] py-4 rounded-xl font-semibold text-lg hover:bg-[#C9E2FF]/80 transition-all duration-300 disabled:opacity-50 group relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="inline-flex items-center">
                      {t("processOrder")}
                      <span className="dots-animation">...</span>
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="relative">
                      {t("completeOrder")}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1E1E1E] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                )}

                {/* Button background animation */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1E1E1E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:relative">
              <div className="lg:top-8 w-full">
                <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">
                    {t("orderSummary")}
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64} // Adjust width as needed
                            height={64} // Adjust height as needed
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-[#1E1E1E] font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Calculations */}
                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>{t("subtotal")}</span>
                      <span>{formatPrice(subtotalAmount)}</span>
                    </div>

                    {/* Coupon Discount Row */}
                    {discountInfo.is_applied && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <FiTag className="w-4 h-4" />
                          {t("discount") || "Discount"} ({discountInfo.code})
                        </span>
                        <span>-{formatPrice(getActualDiscountAmount())}</span>
                      </div>
                    )}

                    {/* Subtotal after discount */}
                    {discountInfo.is_applied && (
                      <div className="flex justify-between text-gray-700 font-medium">
                        <span>
                          {t("subtotalAfterDiscount") ||
                            "Subtotal after discount"}
                        </span>
                        <span>{formatPrice(getDiscountedSubtotal())}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <div className="flex flex-col">
                        <span
                          style={
                            isArabic
                              ? {
                                  fontFamily: "var(--font-arabic)",
                                  fontWeight: "500",
                                  letterSpacing: "0",
                                  wordSpacing: "0",
                                }
                              : {
                                  fontFamily: "'Myriad Pro', sans-serif",
                                  fontWeight: 400,
                                }
                          }
                        >
                          {t("shipping")}
                        </span>
                        {selectedShippingOption && totalCartQuantity > 0 && (
                          <span className="text-xs text-gray-500 mt-1">
                            {formatPrice(selectedShippingOption.price)} ×{" "}
                            {totalCartQuantity} {isArabic ? "قطعة" : "items"}
                          </span>
                        )}
                      </div>
                      <span
                        style={
                          isArabic
                            ? {
                                fontFamily: "var(--font-arabic)",
                                fontWeight: "500",
                                letterSpacing: "0",
                                wordSpacing: "0",
                              }
                            : {
                                fontFamily: "'Myriad Pro', sans-serif",
                                fontWeight: 400,
                              }
                        }
                      >
                        {selectedShippingOption
                          ? formatPrice(shippingCost)
                          : t("selectShippingOption")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold pt-3 border-t border-gray-200">
                      <span
                        style={
                          isArabic
                            ? {
                                fontFamily: "var(--font-arabic)",
                                fontWeight: "600",
                                letterSpacing: "0",
                                wordSpacing: "0",
                              }
                            : {
                                fontFamily: "'Myriad Pro', sans-serif",
                                fontWeight: 500,
                              }
                        }
                      >
                        {t("total")}
                      </span>
                      <span
                        style={
                          isArabic
                            ? {
                                fontFamily: "var(--font-arabic)",
                                fontWeight: "700",
                                letterSpacing: "0",
                                wordSpacing: "0",
                              }
                            : {
                                fontFamily: "'Myriad Pro', sans-serif",
                                fontWeight: 700,
                              }
                        }
                        className="text-[#1E1E1E] text-xl"
                      >
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 max-w-md">
          <div className="flex items-start justify-between">
            <p className="pr-2">{error}</p>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-700 hover:text-red-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isArabic
                  ? "تم تقديم طلبك بنجاح!"
                  : "Order Placed Successfully!"}
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                {isArabic
                  ? "شكراً لك على طلبك. سنقوم بمعالجته قريباً."
                  : "Thank you for your order. We'll process it shortly."}
              </p>

              {/* Order ID */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  {isArabic ? "رقم الطلب" : "Order ID"}
                </p>
                <p className="text-lg font-semibold text-[#1E1E1E]">
                  #{confirmedOrderId}
                </p>
              </div>

              {/* Contact Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    {isArabic
                      ? "سيتواصل معك فريقنا عبر البريد الإلكتروني لأي تفاصيل إضافية مطلوبة"
                      : "Our team will contact you via email for any further details needed"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  clearCart();
                  localStorage.removeItem("coupon");
                  router.push(`/${locale}`);
                }}
                className="w-full bg-[#C9E2FF] text-[#1E1E1E] py-3 rounded-xl font-semibold hover:bg-[#C9E2FF]/80 transition-all duration-200"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add this CSS to your global styles or as a style tag */}
      <style jsx>{`
        .dots-animation {
          animation: dots 1.5s infinite;
        }

        @keyframes dots {
          0%,
          20% {
            content: "";
          }
          40% {
            content: ".";
          }
          60% {
            content: "..";
          }
          80%,
          100% {
            content: "...";
          }
        }
      `}</style>
    </div>
  );
}
