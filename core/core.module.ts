import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScrollableDirective} from './directives/scrollable.directive';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {
  MatAutocompleteModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatSnackBarModule,
  MatCheckboxModule, MatCardModule
} from "@angular/material";

import {MatRadioModule} from '@angular/material/radio';

import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {SortablejsModule} from "angular-sortablejs";
import {ImageUploadModule} from "angular2-image-upload";
import {FooterComponent} from "./footer/footer.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {DropdownComponent} from "./dropdown/dropdown.component";
import {TableComponent} from "./table/table.component";
import {DetailCardComponent} from "./detail-card/detail-card.component";
import {AddonsComponent} from "./addons/addons.component";
import {PackageListComponent} from "./package-list/package-list.component";
import {ModalComponent} from "./modal/modal.component";
import {ElementListComponent} from "./element-list/element-list.component";
import {TripViewerComponent} from "./trip-viewer/trip-viewer.component";
import {TripBuilderComponent} from "./trip-builder/trip-builder.component";
import {LoadingComponent} from "./loading/loading.component";
import {ComponentDataService} from "../services/dataService/component-data.service";
import {ComponentResolverService} from "../services/dataService/component-resolver.service";
import {DateManagerService} from "../services/date-manager.service";
import {InqueriesService} from "../services/inqueries.service";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {MapsComponent} from "./maps/maps.component";
import { HeaderComponent } from './header/header.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { TileTableComponent } from './tile-table/tile-table.component';
import { SharedModule } from '../public/shared/shared.module';
import { TimelineComponent } from './timeline/timeline.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TosComponent } from './tos/tos.component';
import { FilterComponent } from './filter/filter.component';
import { CircularDropComponent } from './circular-drop/circular-drop.component';
import { ItineraryDetailsComponent } from './itinerary-details/itinerary-details.component';
import {CityService} from "../services/city.service";
import {DragDropModule} from "@angular/cdk/drag-drop"
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {ItinerarySocialComponent} from "./itinerary-social/itinerary-social.component";
import {SocialService} from "../services/social.service";
import { ItineraryComponent } from './itinerary/itinerary.component';
import { MatChipsModule } from '@angular/material/chips';
import {NotFoundComponent} from "./not-found/not-found.component";
import { NoAccessComponent } from './no-access/no-access.component';
import { ElementDragComponent } from './element-drag/element-drag.component';
import { EventDragComponent } from './event-drag/event-drag.component';
import {VisaService} from "../services/visa.service";
import { SliderComponent } from './slider/slider.component';
import {NotificationService} from "../services/notification.service";
import { NotificationComponent } from './notification/notification.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    AmazingTimePickerModule,
    LeafletModule,
    CKEditorModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatIconModule,
    MatAutocompleteModule,
    SlickCarouselModule,
    SortablejsModule.forRoot({ animation: 150 }),
    ImageUploadModule.forRoot(),
    DragDropModule,
    MatStepperModule,
    MatExpansionModule,
    MatRadioModule
  ],
  declarations: [
    ScrollableDirective,
    FooterComponent,
    NavbarComponent,
    MapsComponent,
    SidebarComponent,
    DropdownComponent,
    TableComponent,
    DetailCardComponent,
    AddonsComponent,
    PackageListComponent,
    ModalComponent,
    ElementListComponent,
    TripViewerComponent,
    TripBuilderComponent,
    LoadingComponent,
    HeaderComponent,
    TimelineComponent,
    TileTableComponent,
    PrivacyPolicyComponent,
    TosComponent,
    FilterComponent,
    CircularDropComponent,
    ItineraryDetailsComponent,
    ItinerarySocialComponent,
    ItineraryComponent,
    NotFoundComponent,
    NoAccessComponent,
    ElementDragComponent,
    EventDragComponent,
    SliderComponent,
    NotificationComponent
  ],
  exports:[
    ScrollableDirective,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DropdownComponent,
    TableComponent,
    DetailCardComponent,
    AddonsComponent,
    PackageListComponent,
    ElementListComponent,
    MapsComponent,
    TripViewerComponent,
    TripBuilderComponent,
    LoadingComponent,
    TileTableComponent,
    TimelineComponent,
    PrivacyPolicyComponent,
    TosComponent,
    FilterComponent,
      SliderComponent,
    CircularDropComponent,
    ItineraryDetailsComponent,
    ItineraryComponent,
    NotificationComponent
  ],
  providers:[ComponentDataService,SocialService,VisaService,NotificationService,
    CityService,ComponentResolverService,DateManagerService,InqueriesService]
})
export class CoreModule { }
