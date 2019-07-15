import { Component, OnInit, Inject, Injectable, DoCheck, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from 'app/core';
import {
    IPersonPersonalInfo,
    IPersonContactInfo,
    IPersonContactInfoUpdate,
    IPersonUserPass
} from 'app/shared/model/EducationalManagement/person-custom.model';
import {
    IStudentMembershipInfo,
    IStudentMembershipSelfRegister
} from 'app/shared/model/EducationalManagement/student-membership-custom.model';
import { ICardHolderBankInfo, IBankRegistrationStatus, CardStatus } from 'app/shared/model/BankManagement/card-holder-custom.model';
import { IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { StudentMembershipService } from '../../student-membership';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PersonService } from 'app/entities/EducationalManagement/person/person.service';
import { ShamsiDateService } from 'app/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss']
})
@Injectable()
export class ProfileViewComponent implements OnInit {
    selfRegister: IStudentMembershipSelfRegister;

    public iscall = true;
    public isbank = true;
    public isuni = true;
    public isindiv = false;
    public profileEdit = false;
    personForm: FormGroup;
    studentMembershipForm: FormGroup;
    bankForm: FormGroup;
    contactForm: FormGroup;

    personPersonalInfo: IPersonPersonalInfo;
    personContactInfo: IPersonContactInfo;
    studentMembershipInfo: IStudentMembershipInfo;
    cardHolderBankInfo: ICardHolderBankInfo;

    registrationStatusFetched: boolean;
    showEvaluatingMessage: boolean;
    showRetrySelfRegister: boolean;
    showProfile: boolean;

    constructor(
        private personService: PersonService,
        private studentMembershipService: StudentMembershipService,
        private shamsiDateService: ShamsiDateService
    ) {}

    currentUserImageSrc(): string {
        return this.personService.getCurrentUserImageUrl();
    }

    ngOnInit() {
        //  this.selfRegister = {
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
        //         //   birthDate : '65132',
        //         nationalCode: '54132185',
        //         birthCertificateCode: '6584521',
        //         birthCertificateSerial: '86454156'
        //     }
        // };

        // this.personPersonalInfo = {
        //     firstName: "yek",
        //     lastName: "do",
        //     birthCertificateCode: "oeu",
        //     gender: 'MALE'
        // }
        this.registrationStatusFetched = false;
        this.showEvaluatingMessage = false;
        this.showRetrySelfRegister = false;
        this.showProfile = false;

        // this.personService.getPersonPersonalInfoForCurrentUser().subscribe(
        //     (res: HttpResponse<IPersonPersonalInfo>) => {
        //         this.personPersonalInfo = res.body;
        //         this.personService.getBankRegistrationStatus(this.personPersonalInfo.nationalCode).subscribe(
        //             (res: HttpResponse<IBankRegistrationStatus>) => {
        //                 this.registrationStatusFetched = true;
        //                 if (!res.body.cardStatus) {
        //                     this.showEvaluatingMessage = true;
        //                 } else {
        //                     switch (res.body.cardStatus) {
        //                         case CardStatus.INFORMATION_CONFLICT:
        //                         case CardStatus.REQUEST_REGISTERED_AND_FAILED_REGISTRATION_OFFICE_INQUIRY:
        //                             this.showRetrySelfRegister = true;
        //                             this.showEvaluatingMessage = false;
        //                             this.showProfile = false;
        //                             break;
        //                         default:
        //                             this.showEvaluatingMessage = false;
        //                             this.showRetrySelfRegister = false;
        //                             this.showProfile = true;
        //                     }
        //                 }
        //             },
        //             (res: HttpErrorResponse) => {}
        //         );
        //     },
        //     (res: HttpErrorResponse) => {
        //         console.log(res);
        //     }
        // );

        this.personService.getPersonContactInfoForCurrentUser().subscribe(
            (res: HttpResponse<IPersonContactInfo>) => {
                this.personContactInfo = res.body;
            },
            (res: HttpErrorResponse) => {
                console.log(res);
            }
        );

        this.studentMembershipService.getStudentMembershipForCurrentUser().subscribe(
            (res: HttpResponse<IStudentMembershipInfo>) => {
                this.studentMembershipInfo = res.body;
            },
            (res: HttpErrorResponse) => {
                console.log(res);
            }
        );

        this.personService.getCardHolderBankInfo().subscribe(
            (res: HttpResponse<ICardHolderBankInfo>) => {
                this.cardHolderBankInfo = res.body;
            },
            (res: HttpErrorResponse) => {
                console.log(res);
            }
        );

        this.contactForm = new FormGroup({
            phoneNumber: new FormControl(null, Validators.required),
            mobileNumber: new FormControl(null, Validators.required),
            postalAddress: new FormControl()
        });
    } // end ngOnInit

    onSelfRegisterRetry(selfRegister: IStudentMembershipSelfRegister) {
        this.studentMembershipService.updateSelfRegister(this.studentMembershipService.getSelfRegisterCache()).subscribe(
            (res: HttpResponse<any>) => {
                this.showEvaluatingMessage = true;
                this.showProfile = false;
                this.showRetrySelfRegister = false;
            },
            (res: HttpErrorResponse) => {
                console.log(res);
            }
        );
    }

    okEdit() {
        this.personContactInfo.phoneNumber = this.contactForm.value.phoneNumber;
        this.personContactInfo.mobileNumber = this.contactForm.value.mobileNumber;
        this.personContactInfo.postalAddress = this.contactForm.value.postalAddress;

        this.personService.updateContactInfo(this.personContactInfo).subscribe(
            (res: HttpResponse<IPersonContactInfo>) => {
                this.personContactInfo = res.body;
                this.profileEdit = false;
            },
            (res: HttpErrorResponse) => {}
        );
    }

    cancel() {
        this.profileEdit = false;
    }
    indivInfo() {
        this.iscall = true;
        this.isbank = true;
        this.isuni = true;
        this.isindiv = false;
    }
    uniInfo() {
        this.iscall = true;
        this.isbank = true;
        this.isuni = false;
        this.isindiv = true;
    }
    bankInfo() {
        this.iscall = true;
        this.isbank = false;
        this.isuni = true;
        this.isindiv = true;
    }
    callInfo() {
        this.iscall = false;
        this.isbank = true;
        this.isuni = true;
        this.isindiv = true;
    }
    showEdit() {
        this.profileEdit = true;
    }
    toShamsi(date: any) {
        if (date !== undefined) {
            return this.shamsiDateService.convertDateToShamsi(date.toString());
        }
    }
}
