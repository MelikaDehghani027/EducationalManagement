import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';

import { IEmployeeMembership } from 'app/shared/model/EducationalManagement/employee-membership.model';
import { EmployeeMembershipService } from './employee-membership.service';
import { IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { PersonService } from 'app/entities/EducationalManagement/person';
import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';
import { EducationalInstituteService } from 'app/entities/EducationalManagement/educational-institute';

@Component({
    selector: 'jhi-employee-membership-update',
    templateUrl: './employee-membership-update.component.html'
})
export class EmployeeMembershipUpdateComponent implements OnInit {
    employeeMembership: IEmployeeMembership;
    isSaving: boolean;

    people: IPerson[];

    educationalinstitutes: IEducationalInstitute[];
    startDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private employeeMembershipService: EmployeeMembershipService,
        private personService: PersonService,
        private educationalInstituteService: EducationalInstituteService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ employeeMembership }) => {
            this.employeeMembership = employeeMembership;
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
        if (this.employeeMembership.id !== undefined) {
            this.subscribeToSaveResponse(this.employeeMembershipService.update(this.employeeMembership));
        } else {
            this.subscribeToSaveResponse(this.employeeMembershipService.create(this.employeeMembership));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeMembership>>) {
        result.subscribe((res: HttpResponse<IEmployeeMembership>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
