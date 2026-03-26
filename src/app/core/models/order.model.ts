export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItemResponse[];
  totalUsd: number;
  totalArs: number;
  exchangeRateUsed: number;
  status: OrderStatus;
  whatsappLink: string;
  createdAt: string;
}

export interface OrderItemResponse {
  productName: string;
  quantity: number;
  priceUsd: number;
  priceArs: number;
  subtotalUsd: number;
  subtotalArs: number;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  items: OrderItemResponse[];
  totalUsd: number;
  totalArs: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus =
  | 'sent'
  | 'deposited'
  | 'ordered_from_supplier'
  | 'in_transit'
  | 'ready_for_delivery'
  | 'delivered'
  | 'cancelled';
