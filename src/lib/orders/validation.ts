import { MALAYSIAN_STATES, type CheckoutInput } from "@/types/commerce";
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/, phone=/^(?:\+?60|0)[1-9][0-9]{7,10}$/;
export function validateCheckout(value: unknown): {data?:CheckoutInput; error?:string} {
 if(!value||typeof value!=="object") return {error:"Invalid checkout request."};
 const x=value as CheckoutInput, s=x.shipping;
 if(typeof x.customerName!=="string"||x.customerName.trim().length<2) return {error:"Enter your name."};
 if(typeof x.customerEmail!=="string"||!email.test(x.customerEmail)) return {error:"Enter a valid email address."};
 if(typeof x.customerPhone!=="string"||!phone.test(x.customerPhone.replace(/[\s-]/g,""))) return {error:"Enter a valid Malaysian phone number."};
 if(!s||!s.line1?.trim()||!s.postcode?.match(/^\d{5}$/)||!s.city?.trim()||!MALAYSIAN_STATES.includes(s.state)||s.country!=="MY") return {error:"Complete a valid Malaysian shipping address."};
 if(!Array.isArray(x.items)||!x.items.length||x.items.length>50||x.items.some(i=>!i.bookId||!i.slug||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>20)) return {error:"Your cart contains an invalid item."};
 return {data:{...x,customerName:x.customerName.trim(),customerEmail:x.customerEmail.trim().toLowerCase(),customerPhone:x.customerPhone.trim(),shipping:{...s,line1:s.line1.trim(),line2:s.line2?.trim(),postcode:s.postcode,city:s.city.trim()},customerNotes:x.customerNotes?.trim().slice(0,1000)}};
}
