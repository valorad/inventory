export interface IAction {
  fields: string[],
  getAll?: () => any,
  getList: () => any,
  getSingle: () => any,
  add: (info: any) => any,
  update: (dbname: string, token: any) => any,
  delete: (token: any) => any
}