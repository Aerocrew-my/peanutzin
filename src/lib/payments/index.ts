import "server-only";
export type PaymentHandoff={mode:"test"|"unconfigured";reference?:string};
export function paymentMode():"test"|"unconfigured" { return process.env.NODE_ENV!=="production"&&process.env.PAYMENT_MODE==="test"?"test":"unconfigured"; }
export function createPaymentHandoff(orderId:string):PaymentHandoff { const mode=paymentMode(); return mode==="test"?{mode,reference:`test_${orderId}_${crypto.randomUUID()}`}:{mode}; }
