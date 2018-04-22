interface IAddCallback {
  message: string
  status: string
  id: string | null
}

interface IDeleteCallback {
  message: string
  status: string
  rmCount: number
}

export interface IActor {
  dbname: string,
  icon?: string,
  equiped?: any,
  name: string,
  biography: string
}

export interface INewActor {
  dbname: string,
  icon?: string,
  equiped?: any,
  translations?: {
    name?: {
      en?: string,
      zh?: string
    },
    biography?: {
      en?: string,
      zh?: string
    }
  }
}