import { CartItem, Product } from '@/db/schema'

export const getQuantityString = (item: CartItem) => {
  if (item.product.isSpecialProduct) return item.quantity.toString() + ' pcs'
  const quantityString = item.product.measurement?.amount
    ? (item.product.measurement.amount * item.quantity).toString()
    : item.quantity.toString()
  return quantityString + ' ' + item.product.measurement?.unit
}

export const getPriceString = (item: CartItem) => {
  return (item.product.price * item.quantity).toFixed(2) + '€'
}
