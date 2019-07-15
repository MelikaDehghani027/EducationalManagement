import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StudentMembershipService } from '../student-membership.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IStudentMembershipPreRegister } from 'app/shared/model/EducationalManagement/student-membership-custom.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { DISABLED, FormGroup, FormControl } from '@angular/forms/src/model';
// import { Validators } from '@angular/forms';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'jhi-student-membership-pre-register',
    templateUrl: './student-membership-pre-register.component.html',
    styleUrls: ['student-membership-pre-register.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StudentMembershipPreRegisterComponent implements OnInit {
    nationalCode: string;
    showPreRegister = true;
    checkbox;
    acceptError = false;

    personForm: FormGroup;

    imageTag = true;
    messageConfig = {
        timeOut: 10000,
        progressBar: true,
        positionClass: 'toast-bottom-left'
    };

    constructor(
        private studentMembershipService: StudentMembershipService,
        private router: Router,
        private fb: FormBuilder,
        private toastrService: ToastrService
    ) {}

    ngOnInit() {
        this.personForm = this.fb.group({
            //  this.personForm = new FormGroup({
            nationalCode: ['', [Validators.required, Validators.minLength(10), this.nationalIdValidate.bind(this)]]
            //  nationalCode : new FormControl (null, [Validators.required, Validators.minLength(10)], this.nationalIdValidate.bind(this)),
        });
    } // end preRegister

    saveAndCreate() {
        if (this.personForm.valid) {
            this.preRegister();
            //   this.router.navigate(['student-membership/self-register']);
        } else {
            if (!this.personForm.valid) {
                this.toastrService.error('لطفا موارد ستاره دار را پر کنید', null, this.messageConfig);
            }
        }
    }

    preRegister() {
        this.checkbox = document.getElementById('fluency');
        if (this.checkbox.checked === true) {
            // this.showPreRegister = false;

            this.studentMembershipService.preRegister(this.nationalCode).subscribe(
                (res: HttpResponse<IStudentMembershipPreRegister>) => {
                    this.studentMembershipService.setPreRegisterCache(res.body);
                    this.router.navigate(['student-membership/self-register']);
                },
                (res: HttpErrorResponse) => {
                    // this.onError(res.message)
                }
            );
        } else {
            this.acceptError = true;
        }
    }

    getFormControl(name: string) {
        return this.personForm.get(name);
    }

    showValidationErrors(name: string) {
        return this.getFormControl(name).invalid && (this.getFormControl(name).dirty || this.getFormControl(name).touched);
    }

    private nationalIdValidate(control: AbstractControl) {
        if (!control.value) {
            return null;
        }
        if (control.value.length < 10) {
            return null;
        }
        if (!this.checkCodeMeli(control.value)) {
            return { validNationalId: true };
        }
        return null;
    }

    private checkCodeMeli(code) {
        const L = code.length;

        if (L < 8 || parseInt(code, 10) === 0) {
            return false;
        }

        code = ('0000' + code).substr(L + 4 - 10);
        if (parseInt(code.substr(3, 6), 10) === 0) {
            return false;
        }
        const c = parseInt(code.substr(9, 1), 10);
        let s = 0;
        for (let i = 0; i < 9; i++) {
            s += parseInt(code.substr(i, 1), 10) * (10 - i);
        }
        s = s % 11;
        return (s < 2 && c === s) || (s >= 2 && c === 11 - s);
    }

    acceptLow() {
        this.checkbox = document.getElementById('fluency');
        if (this.checkbox.checked === true) {
            this.showPreRegister = false;
        } else {
            this.acceptError = true;
        }
    }

    backPreRegister() {
        this.showPreRegister = true;
    }
} // end class
