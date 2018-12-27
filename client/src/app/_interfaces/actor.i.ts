interface IEquiped {
  [index: string]: string;
}

export interface IActor {
  dbname: string,
  icon?: string,
  equiped: IEquiped
}