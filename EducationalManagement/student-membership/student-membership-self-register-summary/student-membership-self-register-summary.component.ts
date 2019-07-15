import { Component, OnInit } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { StudentMembershipSelfRegisterDialogComponent } from '../student-membership-self-register-dialog/student-membership-self-register-dialog.component';
import { Router } from '@angular/router';
import { StudentMembershipService } from '../student-membership.service';
import {
    IStudentMembershipSelfRegister,
    StudentMembershipSelfRegister,
    IStudentMembershipPreRegister
} from 'app/shared/model/EducationalManagement/student-membership-custom.model';
import { PersonGenderEnum } from 'app/shared/model/EducationalManagement/person.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ShamsiDateService } from 'app/core';
import { Moment } from 'moment';
import * as moment from 'moment';
@Component({
    selector: 'jhi-student-membership-self-register-summary',
    templateUrl: './student-membership-self-register-summary.component.html',
    styleUrls: ['./student-membership-self-register-summary.scss']
})
export class StudentMembershipSelfRegisterSummaryComponent implements OnInit {
    selfRegister: IStudentMembershipSelfRegister;
    preRegister: IStudentMembershipPreRegister;

    filePreviewPath;

    constructor(
        private modalService: NgbModal,
        private studentMembershipService: StudentMembershipService,
        private sanitizer: DomSanitizer,
        private shamsiDateService: ShamsiDateService
    ) {}

    ngOnInit() {
        this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(this.studentMembershipService.getCachedFile()._file)
        );
        this.preRegister = this.studentMembershipService.getPreRegisterCache();
        this.selfRegister = this.studentMembershipService.getSelfRegisterCache();
        // this.preRegister = {
        //     nationalCode: '1023456780',
        //     educationalInstituteName: 'پردیس البرز',
        //     educationalInstituteId: 12,
        //     degree: 'BACHELOR',
        //     studentId: '1',
        //     marjaaCode: '121212',
        //     branchCode: null
        // };
        // this.selfRegister = {
        //     majorName: 'hnhh',
        //     degree: 'hgfh',
        //     branchCode: '5463',
        //     person: {
        //         fatherName: 'kugb',
        //         lastName: 'lfil',
        //         mobileNumber: '2515215',
        //         postalAddress: '5413512',
        //         phoneNumber: '646513',
        //         firstName: 'ihb',
        //         birthDate : moment('2018-12-29'),
        //         nationalCode: '54132185',
        //         birthCertificateCode: '6584521',
        //         birthCertificateSerial: '86454156'
        //     }
        // };

        // this.personContactInfoUpdate = new  PersonContactInfoUpdate();
        // this.personContactInfoUpdate.phoneNumber = '56-897-' ;
        // this.personContactInfoUpdate.mobileNumber = '56-897-' ;
        // this.personContactInfoUpdate.postalAddress = '56-897xcvdfgnh-' ;
    }

    open() {
        const modalRef = this.modalService.open(StudentMembershipSelfRegisterDialogComponent, {
            centered: true,
            windowClass: 'modal-holder'
        });
        modalRef.componentInstance.name = 'World';
    }

    degreeToPersian(degree: string): string {
        switch (degree) {
            case 'ASSOCIATE':
                return 'کاردانی';
            case 'BACHELOR':
                return 'کارشناسی';
            case 'MASTER':
                return 'ارشد';
            case 'DOCTORAL':
                return 'دکترا';
        }
    }

    genderToPersian(gender: PersonGenderEnum): string {
        switch (gender) {
            case PersonGenderEnum.MALE:
                return 'مذکر';
            case PersonGenderEnum.FEMALE:
                return 'مونث';
            case PersonGenderEnum.UNKNOWN:
                return 'نامشخص';
        }
    }

    toShamsi(date: Moment) {
        if (date !== undefined) {
            return this.shamsiDateService.convertMomentDateToShamsi(date);
        }
    }
}
