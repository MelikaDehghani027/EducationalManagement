import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardHolderGatewaySharedModule } from 'app/shared';
import {
    EducationalInstituteComponent,
    EducationalInstituteDetailComponent,
    EducationalInstituteUpdateComponent,
    EducationalInstituteDeletePopupComponent,
    EducationalInstituteDeleteDialogComponent,
    educationalInstituteRoute,
    educationalInstitutePopupRoute
} from './';

const ENTITY_STATES = [...educationalInstituteRoute, ...educationalInstitutePopupRoute];

@NgModule({
    imports: [CardHolderGatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EducationalInstituteComponent,
        EducationalInstituteDetailComponent,
        EducationalInstituteUpdateComponent,
        EducationalInstituteDeleteDialogComponent,
        EducationalInstituteDeletePopupComponent
    ],
    entryComponents: [
        EducationalInstituteComponent,
        EducationalInstituteUpdateComponent,
        EducationalInstituteDeleteDialogComponent,
        EducationalInstituteDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardHolderGatewayEducationalInstituteModule {}
