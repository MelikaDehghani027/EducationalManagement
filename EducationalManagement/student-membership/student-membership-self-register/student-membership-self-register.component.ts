import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { StudentMembershipService } from '../student-membership.service';
import {
    IStudentMembershipPreRegister,
    IStudentMembershipSelfRegister,
    StudentMembershipSelfRegister
} from 'app/shared/model/EducationalManagement/student-membership-custom.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IPersonUserPass } from 'app/shared/model/EducationalManagement/person-custom.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { validateValue } from '@angular/flex-layout';
import { FileUploader } from 'ng2-file-upload';
import { Person, IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerInputEvent } from '@angular/material';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ShamsiDateService } from 'app/core';
import { ImageCropperComponent, validateAllFormFields } from 'app/shared';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CssKeyframesDriver } from '@angular/animations/browser/src/render/css_keyframes/css_keyframes_driver';

@Component({
    selector: 'jhi-student-membership-self-register',
    templateUrl: './student-membership-self-register.component.html',
    styleUrls: ['student-membership-self-register.scss']
})
export class StudentMembershipSelfRegisterComponent implements OnInit {
    @Input()
    embeddedInProfile: boolean;

    @Output()
    onStudentMembershipSubmission = new EventEmitter<IStudentMembershipSelfRegister>();

    preRegister: IStudentMembershipPreRegister;
    selfRegister: IStudentMembershipSelfRegister;

    imageTag = true;
    messageConfig = {
        timeOut: 10000,
        progressBar: true,
        positionClass: 'toast-bottom-left'
    };

    firstName: string;
    lastName: string;

    uploader: FileUploader;
    personForm: FormGroup;
    studentMembershipForm: FormGroup;
    bankForm: FormGroup;
    contactForm: FormGroup;
    LoadForm: FormGroup;
    name: string;
    imageBase64: any;
    filename = '';

    @ViewChild('birthDatePicker')
    birthDatePicker: ElementRef;
    inputDate: Moment;

    showUniPage;
    showContactBankPage = false;

    closeResult: string;

    constructor(
        private studentMembershipService: StudentMembershipService,
        private router: Router,
        private shamsiDateService: ShamsiDateService,
        private toastrService: ToastrService,
        public dialog: MatDialog,
        private modalService: NgbModal
    ) {}

    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    goNextPage() {
        this.showUniPage = 2;
    }
    goNextPage2() {
        this.showUniPage = 3;
    }
    goBackPage() {
        this.showUniPage = 1;
    }

    ngOnInit() {
        this.uploader = this.studentMembershipService.getUploader();
        this.uploader.onAfterAddingFile = file => {
            this.studentMembershipService.setCachedFile(file);
        };

        // this.preRegister = this.studentMembershipService.getPreRegisterCache();
        // tslint:disable-next-line:max-line-length
        this.preRegister = {
            nationalCode: '1023456780',
            educationalInstituteName: 'پردیس البرز',
            educationalInstituteId: 12,
            degree: 'BACHELOR',
            studentId: '1',
            marjaaCode: '121212',
            branchCode: null
        };

        this.selfRegister = new StudentMembershipSelfRegister();
        this.selfRegister.person = new Person();

        this.personForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(),

            pic: new FormControl(null, Validators.required),
            fatherName: new FormControl(null, Validators.required),
            gender: new FormControl(),
            birthDate: new FormControl(this.birtDateValidate.bind(this)),
            nationalCode: new FormControl({ value: this.preRegister.nationalCode, disabled: true }),
            birthCertificateCode: new FormControl(),
            birthCertificateSerial: new FormControl(),
            birthCertificateLetterSeries: new FormControl(),
            birthCertificateTwoDigitSeries: new FormControl()
        });
        this.studentMembershipForm = new FormGroup({
            educationalInstituteName: new FormControl(
                { value: this.preRegister.educationalInstituteName, disabled: true },
                Validators.required
            ),
            // educationalInstituteName: new FormControl(),
            degree: new FormControl({ value: this.preRegister.degree, disabled: true }, Validators.required),
            majorName: new FormControl()
            // typeStock: new FormControl()
        });
        this.bankForm = new FormGroup({
            branchCode: new FormControl({ value: this.preRegister.branchCode, disabled: true }, Validators.required)
        });
        this.contactForm = new FormGroup({
            phoneNumber: new FormControl(null, Validators.required),
            mobileNumber: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.required),
            postalAddress: new FormControl(null, Validators.required),
            caption: new FormControl(null, Validators.required)
        });
        this.LoadForm = new FormGroup({
            loadCerti: new FormControl(null, Validators.required),
            loadCart: new FormControl(null, Validators.required)
        });

        // this.uploader.onAfterAddingFile = file => {
        //     this.openDialog(file, 'identificationIamgePageOne');
        // };

        // this.personForm.patchValue({
        //     nationalCode: this.preRegister.nationalCode
        // });
        // this.personForm.value.nationalCode = this.preRegister.nationalCode;
    } // end ng onInit

    getFormControl(name: string) {
        // , this.studentMembershipForm.get(name)
        return this.personForm.get(name);
    }

    showValidationErrors(name: string) {
        return this.getFormControl(name).invalid && (this.getFormControl(name).dirty || this.getFormControl(name).touched);
    }

    getFormControlUniversity(name: string) {
        return this.studentMembershipForm.get(name);
    }

    showValidationErrorsUniversity(name: string) {
        return (
            this.getFormControlUniversity(name).invalid &&
            (this.getFormControlUniversity(name).dirty || this.getFormControlUniversity(name).touched)
        );
    }

    getFormControlContact(name: string) {
        return this.contactForm.get(name);
    }

    showValidationErrorsContact(name: string) {
        return (
            this.getFormControlContact(name).invalid && (this.getFormControlContact(name).dirty || this.getFormControlContact(name).touched)
        );
    }
    ///////////////////////
    // imageCropped(image, idFileUpload) {
    //     this.imageBase64 = image.base64;
    //     // this.cardHolderImage = image.file;
    //     document
    //         .getElementById(idFileUpload)
    //         .getElementsByClassName('custom-file-upload')[0]
    //         .classList.add('display-none');
    //     document
    //         .getElementById(idFileUpload)
    //         .getElementsByClassName('edit-file-upload')[0]
    //         .classList.add('display-inline');
    // }
    // openDialog(fileItem: any, idFileUpload): void {
    //     if (fileItem.file.type === 'image/jpeg' || fileItem.file.type === 'image/jpg' || fileItem.file.type === 'image/png') {
    //         const dialogRef = this.dialog.open(ImageCropperComponent, {
    //             // width: '9.625rem',
    //             //  height: '12.5rem',
    //             height: '450px',
    //             width: '500px',
    //             data: { image: event }
    //         });
    //         dialogRef.afterClosed().subscribe(result => {
    //             if (result) {
    //                 this.imageCropped(result, idFileUpload);
    //             } else {
    //                 if (!this.imageBase64) {
    //                     this.imageBase64 = this.imageBase64;
    //                     this.file1.nativeElement.value = 'imageBase64';
    //                 }
    //             }
    //         });
    //     } else {
    //         this.toastrService.error(
    //             'تصاویر ارسالی باید از نوع (jpeg, jpg, png) باشند.',
    //             'فرمت تصویر انتخاب شده صحیح نیست!',
    //             this.messageConfig
    //         );
    //     }
    // }
    // selectNew() {
    //     this.file1.nativeElement.value = '';
    // }

    // deleteFile(idFileUpload) {
    //     // this.imageBase64 = this.blankImage;
    //     this.imageBase64 = '';
    //     this.file1.nativeElement.value = '';
    //     document
    //         .getElementById(idFileUpload)
    //         .getElementsByClassName('custom-file-upload')[0]
    //         .classList.remove('display-none');
    //     document
    //         .getElementById(idFileUpload)
    //         .getElementsByClassName('edit-file-upload')[0]
    //         .classList.remove('display-inline');
    // }

    saveAndCreate() {
        validateAllFormFields(this.personForm);
        validateAllFormFields(this.studentMembershipForm);
        validateAllFormFields(this.contactForm);
        if (this.personForm.valid && this.studentMembershipForm.valid && this.contactForm.valid) {
            this.okInformation();
            // this.router.navigate(['student-membership/self-register-summary']);
        } else {
            // validateAllFormFields(this.cardHolderForm);   !this.personForm.valid && !this.studentMembershipForm.valid &&
            if (!this.personForm.valid && !this.studentMembershipForm.valid && !this.contactForm.valid) {
                this.toastrService.error('لطفا موارد ستاره دار را پر کنید', null, this.messageConfig);
            }
        }
    }
    //////////////
    validateAllFormFields = (formGroup: FormGroup) => {
        (<any>Object).values(formGroup.controls).forEach(control => {
            if (control.controls) {
                for (const key in control.controls) {
                    if (control.controls.hasOwnProperty(key)) {
                        const element = control.controls[key];
                        if (element.controls) {
                            this.validateAllFormFields(element);
                        } else {
                            element.markAsTouched();
                        }
                    }
                }
            } else {
                control.markAsTouched();
            }
        });
    };
    /////////////
    private birtDateValidate(control: AbstractControl) {
        if (!control.value) {
            return null;
        }
        if (this.shamsiDateService.isShamsiAfterNow(control.value)) {
            return { validBirthDate: true };
        }
        return null;
    }

    okInformation() {
        this.selfRegister.educationalInstituteId = this.preRegister.educationalInstituteId;
        this.selfRegister.person.firstName = this.personForm.value.firstName;
        this.selfRegister.person.lastName = this.personForm.value.lastName;
        this.selfRegister.person.fatherName = this.personForm.value.fatherName;
        this.selfRegister.person.birthDate = this.inputDate;
        this.selfRegister.person.nationalCode = this.preRegister.nationalCode;
        this.selfRegister.person.birthCertificateCode = this.personForm.value.birthCertificateCode;
        this.selfRegister.person.birthCertificateSerial = this.personForm.value.birthCertificateSerial;
        this.selfRegister.person.birthCertificateLetterSeries = this.personForm.value.birthCertificateLetterSeries;
        this.selfRegister.person.birthCertificateTwoDigitSeries = this.personForm.value.birthCertificateTwoDigitSeries;
        this.selfRegister.person.gender = this.personForm.value.gender;

        this.selfRegister.degree = this.preRegister.degree;
        this.selfRegister.majorName = this.studentMembershipForm.value.majorName;
        this.selfRegister.startSemester = this.preRegister.startSemester;

        this.selfRegister.person.phoneNumber = this.contactForm.value.phoneNumber;
        this.selfRegister.person.mobileNumber = this.contactForm.value.mobileNumber;
        this.selfRegister.person.email = this.contactForm.value.email;
        this.selfRegister.person.postalAddress = this.contactForm.value.postalAddress;

        if (this.embeddedInProfile) {
            this.onStudentMembershipSubmission.emit(this.selfRegister);
        } else {
            this.studentMembershipService.setSelfRegisterCache(this.selfRegister);
            this.router.navigate(['student-membership/self-register-summary']);
        }
    }

    onSelectFile(event) {
        this.imageTag = false;
        if (event.target.files && event.target.files[0]) {
            // tslint:disable-next-line:prefer-const
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            // tslint:disable-next-line:no-shadowed-variable
            reader.onload = event => {
                // called once readAsDataURL is completed
                this.imageBase64 = (<FileReader>event.target).result;
                // tslint:disable-next-line:no-unused-expression
                this.filename = File.name;
            };
        }
    }

    onChangeDate(event: MatDatepickerInputEvent<Date>) {
        this.inputDate = moment(event.value);
    }

    // // end oninit
    // nextStep() {
    //     this.studentMembershipService.selfRegister(this.preRegister).subscribe(
    //         (res: HttpResponse<IPersonUserPass>) => {
    //             // this.studentMembershipService.setPreRegisterData(res.body);
    //             // this.router.navigate;
    //         },
    //         (res: HttpErrorResponse) => {
    //             // this.onError(res.message)9
    //         }
    //     );
    // }
}
