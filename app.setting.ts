import { environment } from '../environments/environment';
export class AppSettings {
    public static get HAS_ACCOUNTING() : boolean {return environment.SIDE_ACCOUNTING}
    public static get INQUERIES_SEARCH() : boolean {return environment.INQUERIES_SEARCH}
    public static get ITINERARY_SEGMENTS() : boolean {return environment.ITINERARY_SEGMENTS}
    public static get ITINERARY_MAP() : boolean {return environment.ITINERARY_MAP}
    public static get ITINERARY_HEART() : boolean {return environment.ITINERARY_HEART}
    public static get ITINERARY_TO() : boolean {return environment.ITINERARY_TO}
    public static get ITINERARY_SHOPPING() : boolean {return environment.ITINERARY_SHOPPING}
    public static get ITINERARY_MANUAL() : boolean {return environment.ITINERARY_MANUAL}
    public static get MARKETING_FLICKR() : boolean {return environment.MARKETING_FLICKR}
    public static get MARKETING_PINTEREST() : boolean {return environment.MARKETING_PINTEREST}
    public static get MARKETING_YOUTUBE() : boolean {return environment.MARKETING_YOUTUBE}
    public static get DASHBOARD_INCREASE() : boolean {return environment.DASHBOARD_INCREASE}
    public static get LOGIN() : boolean {return environment.LOGIN}
    public static get DOMAIN() : string {return environment.DOMAIN}
    public static get UPLOAD_URL() : string {return environment.UPLOAD_URL}
    public static get PUBLIC_URL() : string {return environment.PUBLIC_URL}
    public static get AMADEUS_COMPANY() : boolean {return environment.AMADEUS_COMPANY}

    

}
