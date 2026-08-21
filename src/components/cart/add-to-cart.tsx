"use client";
import {useState}from"react";import{useCart}from"./cart-provider";
export function AddToCart({bookId,slug,disabled=false}:{bookId:string;slug:string;disabled?:boolean}){const{add}=useCart(),[notice,setNotice]=useState("");return <div><button className="button button-coral" type="button" disabled={disabled} onClick={()=>{add(bookId,slug);setNotice("Added to cart");setTimeout(()=>setNotice(""),1800)}}>{disabled?"Out of stock":"Add to cart"}</button><span className="cart-notice" role="status" aria-live="polite">{notice}</span></div>}
