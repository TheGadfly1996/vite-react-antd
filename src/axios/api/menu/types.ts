export interface RouteData {
  id: number
  parent_id?: number
  name: string
  path: string
  meta: {
    title: string
    icon: string
    menu_order: number
    hidden: boolean
  }
  children?: RouteData[]
}
export interface MenuParams {}
