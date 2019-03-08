interface IEquiped {
  [index: string]: string;
}

export interface Actor {
  dbname: string,
  icon?: string,
  equiped: IEquiped
}