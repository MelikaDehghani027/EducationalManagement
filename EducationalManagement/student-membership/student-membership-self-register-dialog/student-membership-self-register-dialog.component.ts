import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentMembershipService } from '../student-membership.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IPersonUserPass } from 'app/shared/model/EducationalManagement/person-custom.model';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-student-membership-self-register-dialog',
    templateUrl: './student-membership-self-register-dialog.component.html',
    styleUrls: ['./student-membership-self-register-dialog.scss']
})
export class StudentMembershipSelfRegisterDialogComponent implements OnInit {
    personUserPass: IPersonUserPass;
    beforeSelfRegister = true;

    submitButtonDisabled: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private studentMembershipService: StudentMembershipService,
        private router: Router
    ) {}

    ngOnInit() {}

    submit() {
        this.submitButtonDisabled = true;
        this.studentMembershipService.selfRegister(this.studentMembershipService.getSelfRegisterCache()).subscribe(
            (res: HttpResponse<IPersonUserPass>) => {
                this.submitButtonDisabled = false;
                this.personUserPass = res.body;
                this.beforeSelfRegister = false;
            },
            (res: HttpErrorResponse) => {
                console.log(res);
            }
        );
    }

    proceed() {
        this.activeModal.close();
        this.router.navigate(['person/profile-view']);
    }
}
