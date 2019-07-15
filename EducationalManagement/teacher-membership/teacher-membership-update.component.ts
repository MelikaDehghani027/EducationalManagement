import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';

import { ITeacherMembership } from 'app/shared/model/EducationalManagement/teacher-membership.model';
import { TeacherMembershipService } from './teacher-membership.service';
import { IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { PersonService } from 'app/entities/EducationalManagement/person';
import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';
import { EducationalInstituteService } from 'app/entities/EducationalManagement/educational-institute';

@Component({
    selector: 'jhi-teacher-membership-update',
    templateUrl: './teacher-membership-update.component.html'
})
export class TeacherMembershipUpdateComponent implements OnInit {
    teacherMembership: ITeacherMembership;
    isSaving: boolean;

    people: IPerson[];

    educationalinstitutes: IEducationalInstitute[];
    startDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private teacherMembershipService: TeacherMembershipService,
        private personService: PersonService,
        private educationalInstituteService: EducationalInstituteService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ teacherMembership }) => {
            this.teacherMembership = teacherMembership;
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
        if (this.teacherMembership.id !== undefined) {
            this.subscribeToSaveResponse(this.teacherMembershipService.update(this.teacherMembership));
        } else {
            this.subscribeToSaveResponse(this.teacherMembershipService.create(this.teacherMembership));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITeacherMembership>>) {
        result.subscribe((res: HttpResponse<ITeacherMembership>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
