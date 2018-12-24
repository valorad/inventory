interface IEquip {
	name: string,
	equip: string
}

interface IEffect {
	name: string,
	effect: string
}

interface IRefDetail {
	refID: string,
	owner: string,
	num: number,
	item: string
}

export interface InvItem {
	icon?: string, // to be assigned in the cdk table
	category?: string, // to be assigned in the cdk table
	name: string,
	description?: string,
	type: string,
	typeName?: string,
  value?: number,
	weight?: number,
	rating?: number,
	equips: IEquip[]
	effects: IEffect[],
	quantity: number,
	bookContent?: string;

}

export interface InvItemVerbose {
  holder: string,
  item: string,
  refDetails: IRefDetail[],
  // item base info
  base: {
		dbname: string,
		name?: string,
		description?: string,
    value: number,
    weight: number,
    category: string,
    detail?: {
      rating?: number,
			type?: string,
			typeName?: string,
      equipI18n?: any,
      effectsI18n?: any,
			content?: string,
			contentDetail?: string
    }
  }
}