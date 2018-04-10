export interface IAction {
  getAll?: () => any,
  getSingle: () => any,
  add: (info: any) => any,
  updateSingle: (dbname: string, token: any) => any,
  delete: (token: any) => any
}