import * as React from "react";
import useLocalStorageState from "use-local-storage-state";
import type { IItem } from 'shared/models/order'
import type { IProduct } from 'shared/models/product';
import type { IPet } from 'shared/models/pet';

export type Key = 'product' | 'pet'

const oneOrTheOther = (key: Key, val: IPet | IProduct) => ({
  product: key == 'product' ? (val as IProduct) : null,
  pet: key == 'pet' ? (val as IPet) : null,
})

const useCart = (): [IItem[], (key: Key, i: IPet | IProduct, amount: number) => void, (key: Key, i: IProduct | IPet) => void, () => void] => {
  const [cart, setCart] = useLocalStorageState<IItem[]>('cart', { defaultValue: [] })
  const add = React.useCallback((key: Key, i: IProduct | IPet, amount: number) => setCart(items => {
    let found = false
    return items.reduce<IItem[]>((prev, item) => {
      if (item[key]?._id != i._id)
        return [...prev, item]
      else {
        found = true
        return [...prev, { ...item, amount: item.amount + amount } as IItem]
      }
    }, []).concat(found ? [] : [{ ...oneOrTheOther(key, i), amount: 1 }])
  }), [setCart])
  const del = React.useCallback((key: Key, i: IProduct | IPet) => setCart(items => items.filter(item => item[key]?._id != i._id)), [setCart])
  const clear = React.useCallback(() => setCart([]), [setCart])
  return [cart, add, del, clear]
}

export default useCart;
