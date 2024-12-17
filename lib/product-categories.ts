import { ProductCategory } from '@/db/schema'

export const categoryDisplayNames: Record<ProductCategory, string> = {
  BEER: 'Beer',
  LONG_DRINK: 'Long Drink',
  CIDER: 'Cider',
  LIQUOR: 'Liquor',
  GIN: 'Gin',
  VODKA: 'Vodka',
  WHISKEY: 'Whiskey',
  RUM: 'Rum',
  TEQUILA: 'Tequila',
  WINE: 'Wine',
  SODA: 'Soda',
  ENERGY_DRINK: 'Energy Drink',
  NON_ALCOHOLIC: 'Non-Alcoholic',
  COCKTAIL: 'Cocktail',
  OTHER: 'Other'
}
