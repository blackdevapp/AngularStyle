export class ComponentModel {
  _id?: String;
	type: String;
	user: String;
	company: String;
	soloPrice: Number;
	bulkPrice: Number;
	onlineData: Boolean;
	asSolo: Boolean;
	asPackage: Boolean;
	mode: String;
	icon: String;
	deadline: {
		date: Date,
		time: Object
	};
	details: {
		roundTrip: Boolean;
		addons: Array<any>,	
		from: {
			city: String,
			airport: String,
			departure: {
				date: Date,
				time: Object
			},
			arrival: {
				date: Date,
				time: Object
			},
			class: String
		};
		to: {
			city: String,
			airport: String,
			departure: {
				date: Date,
				time: Object
			},
			arrival: {
				date: Date,
				time: Object
			},
			class: String
		}
	}
}
