import Link from"next/link";import{LoginForm}from"@/components/admin/login-form";
export default function Login(){return <main className="login-page"><section><Link className="wordmark" href="/">PEANUTZIN<small>ADMIN STUDIO</small></Link><p className="eyebrow">Publishing access</p><h1>Welcome back.</h1><p>Sign in with your provisioned administrator account.</p><LoginForm/></section></main>}
