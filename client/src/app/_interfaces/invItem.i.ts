interface IEquipSlot {
	name: string,
	equip: string
}

interface IEquipState {
	equiped?: boolean,
	lefthand?: boolean,
	righthand?: boolean
}

export interface _1HWeaponEquipState {
	left: boolean,
	right: boolean
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
	id: string,
	icon?: string, // to be assigned in the cdk table
	category?: string, // to be assigned in the cdk table
	equipState: IEquipState;
	name: string,
	description?: string,
	type: string,
	typeName?: string,
  value?: number,
	weight?: number,
	rating?: number,
	equipSlots: IEquipSlot[]
	effects: IEffect[],
	quantity: number,
	bookContent?: string;

}

export interface InvItemVerbose {
	id: string,
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