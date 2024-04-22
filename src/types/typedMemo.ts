import { ComponentPropsWithRef, ComponentType, memo, NamedExoticComponent } from 'react'
import isEqual from 'react-fast-compare'

export const typedMemo = <T extends ComponentType<any>>(component: T): NamedExoticComponent<ComponentPropsWithRef<T>> =>
  memo(component, isEqual) as NamedExoticComponent<ComponentPropsWithRef<T>>
