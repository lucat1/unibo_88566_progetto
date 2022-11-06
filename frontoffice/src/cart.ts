import * as React from 'react'
import useLocalStorageState from "use-local-storage-state";
import type { IItem } from 'shared/models/order'
import type { IProduct } from 'shared/models/product';

const useCart = (): [IItem[], (prod: IProduct, amount: number) => void, (prod: IProduct) => void] => {
  const [cart, setCart] = useLocalStorageState<IItem[]>('cart', { defaultValue: [] })
  const add = React.useCallback((prod: IProduct, amount: number) => setCart(items => {
    let found = false
    return items.reduce<IItem[]>((prev, item) => {
      if (item.product._id != prod._id)
        return [...prev, item]
      else {
        found = true
        return [...prev, { product: item.product, amount: item.amount + amount }]
      }
    }, []).concat(found ? [] : [{ product: prod as any, amount: 1 }])
  }), [setCart])
  const del = React.useCallback((prod: IProduct) => setCart(items => items.filter(item => item.product._id != prod._id)), [setCart])
  return [cart, add, del]
}

export default useCart
