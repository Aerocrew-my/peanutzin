import Link from "next/link";
import { AdminShell, DataError } from "@/components/admin/shell";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";
import type { OrderStatus, PaymentStatus } from "@/types/commerce";

const orderStatuses: OrderStatus[] = ["pending","processing","shipped","completed","cancelled"];
const paymentStatuses: PaymentStatus[] = ["unpaid","pending","paid","failed","refunded"];
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}) {
  const q = await searchParams;
  const status = orderStatuses.find(value => value === q.status), payment = paymentStatuses.find(value => value === q.payment);
  let query = (await createClient()).from("orders").select("id,order_number,created_at,customer_name,total_cents,currency,order_status,payment_status").order("created_at",{ascending:false});
  if(status) query = query.eq("order_status",status); if(payment) query = query.eq("payment_status",payment);
  const {data,error} = await query;
  return <AdminShell section="Orders"><h1>Orders</h1><form className="filters"><select name="status" defaultValue={status??""}><option value="">All order statuses</option>{orderStatuses.map(value=><option key={value}>{value}</option>)}</select><select name="payment" defaultValue={payment??""}><option value="">All payment statuses</option>{paymentStatuses.map(value=><option key={value}>{value}</option>)}</select><button className="button button-outline">Filter</button></form>{error ? <DataError message={`Orders could not be loaded (${error.message}).`} /> : data?.length ? <div className="cms-list">{data.map(order=><Link href={`/admin/orders/${order.id}`} key={order.id}><strong>{order.order_number}</strong><span>{order.customer_name} · {formatMoney(order.total_cents,order.currency)} · {new Intl.DateTimeFormat("en-MY",{dateStyle:"medium"}).format(new Date(order.created_at))}</span><small>{order.payment_status} · {order.order_status}</small></Link>)}</div> : <div className="empty-state"><h2>No matching orders.</h2></div>}</AdminShell>;
}
