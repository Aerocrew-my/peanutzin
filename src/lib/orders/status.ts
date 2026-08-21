import type{OrderStatus}from"@/types/commerce";
export const ORDER_TRANSITIONS:Record<OrderStatus,OrderStatus[]>={pending:["processing","cancelled"],processing:["shipped","cancelled"],shipped:["completed"],completed:[],cancelled:[]};
export function canTransition(from:OrderStatus,to:OrderStatus){return ORDER_TRANSITIONS[from].includes(to)}
