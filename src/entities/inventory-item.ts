import { getModelForClass, prop } from '@typegoose/typegoose';

export class IInventoryItem {
	@prop({
		type: String
	})
	public name!: string;

	@prop({
		type: String
	})
	public slug!: string;

	@prop({
		type: Number
	})
	public quantity!: number;

	@prop({
		type: String
	})
	public creator!: string;

	@prop({
		type: Date,
		default: Date.now
	})
	public createdAt!: Date;

	@prop({
		type: Date,
		default: Date.now
	})
	public updatedAt!: Date;

	@prop({
		type: Date
	})
	public deletedAt?: Date;

	@prop({
		type: Boolean,
		default: false
	})
	public deleted!: boolean;
}

export const InventoryItemModel = getModelForClass(IInventoryItem);
