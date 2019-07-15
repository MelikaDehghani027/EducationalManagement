import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardHolderGatewaySharedModule } from 'app/shared';
import {
    EmployeeMembershipComponent,
    EmployeeMembershipDetailComponent,
    EmployeeMembershipUpdateComponent,
    EmployeeMembershipDeletePopupComponent,
    EmployeeMembershipDeleteDialogComponent,
    employeeMembershipRoute,
    employeeMembershipPopupRoute
} from './';

const ENTITY_STATES = [...employeeMembershipRoute, ...employeeMembershipPopupRoute];

@NgModule({
    imports: [CardHolderGatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EmployeeMembershipComponent,
        EmployeeMembershipDetailComponent,
        EmployeeMembershipUpdateComponent,
        EmployeeMembershipDeleteDialogComponent,
        EmployeeMembershipDeletePopupComponent
    ],
    entryComponents: [
        EmployeeMembershipComponent,
        EmployeeMembershipUpdateComponent,
        EmployeeMembershipDeleteDialogComponent,
        EmployeeMembershipDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardHolderGatewayEmployeeMembershipModule {}
