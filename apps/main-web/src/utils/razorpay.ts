type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: {
    ondismiss: () => void;
  };
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};

type OpenRazorpayParams = {
  order: RazorpayOrder;
  customerName: string;
  customerPhone: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
};

export function openRazorpay({
  order,
  customerName,
  customerPhone,
  onSuccess,
}: OpenRazorpayParams) {
  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Victory On Wheels",
    description: "Vehicle Service Booking",
    order_id: order.id,

    prefill: {
      name: customerName,
      contact: customerPhone,
    },

    theme: {
      color: "#ff0000",
    },

    handler: (response) => {
      onSuccess(response);
    },

    modal: {
      ondismiss() {
        alert("Payment cancelled.");
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
}
