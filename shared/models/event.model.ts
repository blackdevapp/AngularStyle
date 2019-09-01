export class EventModel {
	_id: String;
	type: String;
	user: String;
	deleted: Boolean;
	publishedDate: Date;
	updatedDate: Date;
	details: {
		resourceId: String,
		start: Date,
		end: Date,
		title: String

	}
}
