import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';

import { IStudentMembership } from 'app/shared/model/EducationalManagement/student-membership.model';
import { StudentMembershipService } from './student-membership.service';
import { IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { PersonService } from 'app/entities/EducationalManagement/person';
import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';
import { EducationalInstituteService } from 'app/entities/EducationalManagement/educational-institute';

@Component({
    selector: 'jhi-student-membership-update',
    templateUrl: './student-membership-update.component.html'
})
export class StudentMembershipUpdateComponent implements OnInit {
    studentMembership: IStudentMembership;
    isSaving: boolean;

    people: IPerson[];

    educationalinstitutes: IEducationalInstitute[];
    registerationDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private studentMembershipService: StudentMembershipService,
        private personService: PersonService,
        private educationalInstituteService: EducationalInstituteService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ studentMembership }) => {
            this.studentMembership = studentMembership;
        });
        this.personService.query().subscribe(
            (res: HttpResponse<IPerson[]>) => {
                this.people = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.educationalInstituteService.query().subscribe(
            (res: HttpResponse<IEducationalInstitute[]>) => {
                this.educationalinstitutes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.studentMembership.id !== undefined) {
            this.subscribeToSaveResponse(this.studentMembershipService.update(this.studentMembership));
        } else {
            this.subscribeToSaveResponse(this.studentMembershipService.create(this.studentMembership));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IStudentMembership>>) {
        result.subscribe((res: HttpResponse<IStudentMembership>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackPersonById(index: number, item: IPerson) {
        return item.id;
    }

    trackEducationalInstituteById(index: number, item: IEducationalInstitute) {
        return item.id;
    }
}
