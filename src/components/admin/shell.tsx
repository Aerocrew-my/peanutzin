import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

export async function AdminShell({section,children}:{section:string;children:React.ReactNode}) {
  const admin=await requireAdmin();
  const links=[["Dashboard","/admin"],["Articles","/admin/articles"],["Books","/admin/books"],["Settings","/admin/settings"],["Orders","/admin/orders"],["Social Studio","/admin/social-studio"]];
  return <div className="admin-layout"><aside><Link className="wordmark" href="/">PEANUTZIN<small>ADMIN STUDIO</small></Link><nav aria-label="Admin navigation">{links.map(([label,href])=><Link className={section===label?"active":""} href={href} key={href}>{label}</Link>)}</nav><div className="admin-identity"><span>{admin.email}</span><small>{admin.role}</small><form action={logout}><button className="text-button">Log out</button></form></div></aside><main className="admin-main"><p className="eyebrow">Admin / {section}</p>{children}</main></div>;
}
export function Notice({searchParams}:{searchParams?:Record<string,string|undefined>}) { if(!searchParams?.saved&&!searchParams?.deleted)return null; return <p className="form-success" role="status">{searchParams.deleted?"Deleted successfully.":"Saved successfully."}</p>; }
