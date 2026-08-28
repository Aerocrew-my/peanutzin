"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const router = useRouter();
  const [message,setMessage]=useState(""); const [pending,setPending]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setPending(true);setMessage("");const form=new FormData(event.currentTarget),email=String(form.get("email")??"").trim(),password=String(form.get("password")??""),name=String(form.get("name")??"").trim();
    const supabase=createClient();
    if(mode==="forgot"){const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/account`});setMessage(error?.message??"Check your inbox for a secure password reset link.");setPending(false);return;}
    if(mode==="signup"&&password!==String(form.get("confirmPassword")??"")){setMessage("Passwords do not match.");setPending(false);return;}
    const result=mode==="login"?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password,options:{data:{name}}});
    if(result.error){setMessage(result.error.message);setPending(false);return;}
    if(mode==="signup"&&!result.data.session){setMessage("Account created. Check your inbox to confirm your email, then sign in.");setPending(false);return;}
    router.replace("/account");router.refresh();
  }
  const signup=mode==="signup",forgot=mode==="forgot";
  return <form className="customer-auth-form" onSubmit={submit}>{signup&&<label>Name<input name="name" autoComplete="name" minLength={2} required/></label>}<label>Email<input name="email" type="email" autoComplete="email" required/></label>{!forgot&&<><label>Password<input name="password" type="password" autoComplete={signup?"new-password":"current-password"} minLength={8} required/></label>{signup&&<label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required/></label>}</>}<button className="button button-coral" disabled={pending}>{pending?"Please wait…":forgot?"Send reset link":signup?"Create account":"Log in"}</button>{message&&<p className="form-feedback" role="status">{message}</p>}<div className="auth-links">{mode==="login"&&<><Link href="/forgot-password">Forgot password?</Link><Link href="/signup">Create account</Link></>}{signup&&<Link href="/login">Already have an account? Log in</Link>}{forgot&&<Link href="/login">Back to login</Link>}</div></form>;
}

export function SignOutButton(){const router=useRouter();return <button className="button button-outline" onClick={async()=>{await createClient().auth.signOut();router.replace("/");router.refresh();}}>Sign out</button>}
