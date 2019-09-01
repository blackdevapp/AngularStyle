export class RoomModel {
	_id: String;
	type: String;
	user: String;
	asSolo: Boolean;
	asPackage: Boolean;
	deleted: {
		type: Boolean,
		default: false
	};
	publishedDate: Date;
	updatedDate: Date;
	company: String;
	soloPrice: Number;
	bulkPrice: Number;
	deadline: Object
	details: {
		title: String,
		children: Array<any>,

	}
}
