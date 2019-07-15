import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'ng2-file-upload';

import { CardHolderGatewaySharedModule } from 'app/shared';
import {
    StudentMembershipComponent,
    StudentMembershipDetailComponent,
    StudentMembershipUpdateComponent,
    StudentMembershipDeletePopupComponent,
    StudentMembershipDeleteDialogComponent,
    studentMembershipRoute,
    studentMembershipPopupRoute
} from './';

import { StudentMembershipPreRegisterComponent } from './student-membership-pre-register/student-membership-pre-register.component';
import { StudentMembershipSelfRegisterSummaryComponent } from './student-membership-self-register-summary/student-membership-self-register-summary.component';
import { StudentMembershipSelfRegisterComponent } from './student-membership-self-register/student-membership-self-register.component';
import { StudentMembershipSelfRegisterDialogComponent } from './student-membership-self-register-dialog/student-membership-self-register-dialog.component';

import { ProfileViewComponent } from '../../EducationalManagement/person/profile-view/profile-view.component';

const ENTITY_STATES = [...studentMembershipRoute, ...studentMembershipPopupRoute];

@NgModule({
    imports: [
        CardHolderGatewaySharedModule,
        RouterModule.forChild(ENTITY_STATES),
        FileUploadModule,
        [NgbModule],
        ReactiveFormsModule,
        NgSelectModule
    ],
    declarations: [
        StudentMembershipComponent,
        StudentMembershipDetailComponent,
        StudentMembershipPreRegisterComponent,
        StudentMembershipSelfRegisterComponent,

        StudentMembershipSelfRegisterSummaryComponent,
        StudentMembershipSelfRegisterDialogComponent,
        StudentMembershipUpdateComponent,
        StudentMembershipDeleteDialogComponent,
        StudentMembershipDeletePopupComponent,

        ProfileViewComponent
    ],
    entryComponents: [
        StudentMembershipComponent,
        StudentMembershipUpdateComponent,
        StudentMembershipDeleteDialogComponent,
        StudentMembershipDeletePopupComponent,
        StudentMembershipSelfRegisterDialogComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardHolderGatewayStudentMembershipModule {}
