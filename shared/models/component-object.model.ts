

export class Addon {
    name: string;
    availability: boolean;
    icon: string;
  type:string;
}

export class DateFormat {
  date: Date=new Date();
  time: string="00:00";
}

export class From {
    city: string;
    airport: string;
    departure: DateFormat=new DateFormat();
    arrival: DateFormat=new DateFormat();
    class: string='ECONOMY';
}


export class Details {
    roundTrip: boolean=true;
    address:string;
    addons: Addon[]=[
        {
            name: "Business Class",
            availability: true,
            icon: "airline_seat_legroom_extra",
            type:'mat'
        },
        {
            name: "Insurance",
            availability: true,
            icon: "beenhere",
          type:'mat'
        },
        {
            name: "Seat Pick",
            availability: true,
            icon: "event_seat",
          type:'mat'
        },
        {
            name: "Food",
            availability: true,
            icon: "fastfood",
          type:'mat'
        }
    ];
    from: From=new From();
    to: From=new From();
}

export class ComponentObject {
    _id?: String;
    constructor(type,user,mode,icon){
        this.type=type;
        this.user=user;
        this.mode=mode;
        this.icon=icon;
    }
    type: string;
    componentName: string;
    company: string;
    user: string;
    soloPrice: number;
    soloPriceChild: number;
    bulkPrice: number;
    originalPriceAdult:number;
    originalPriceChild:number;
    originalPriceInfant:number;
    quantity: number;
    tax: number;
    bulkPriceChild: number;
    asSolo: boolean;
    asSharable: boolean;
    asPackage: boolean=true;
    mode: string;
    icon: string;
    deadline: DateFormat=new DateFormat();
    details: Details=new Details();
}
