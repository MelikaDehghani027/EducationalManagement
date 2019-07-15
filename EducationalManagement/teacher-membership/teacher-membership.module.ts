import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardHolderGatewaySharedModule } from 'app/shared';
import {
    TeacherMembershipComponent,
    TeacherMembershipDetailComponent,
    TeacherMembershipUpdateComponent,
    TeacherMembershipDeletePopupComponent,
    TeacherMembershipDeleteDialogComponent,
    teacherMembershipRoute,
    teacherMembershipPopupRoute
} from './';

const ENTITY_STATES = [...teacherMembershipRoute, ...teacherMembershipPopupRoute];

@NgModule({
    imports: [CardHolderGatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TeacherMembershipComponent,
        TeacherMembershipDetailComponent,
        TeacherMembershipUpdateComponent,
        TeacherMembershipDeleteDialogComponent,
        TeacherMembershipDeletePopupComponent
    ],
    entryComponents: [
        TeacherMembershipComponent,
        TeacherMembershipUpdateComponent,
        TeacherMembershipDeleteDialogComponent,
        TeacherMembershipDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardHolderGatewayTeacherMembershipModule {}
