import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';
import { EducationalInstituteService } from './educational-institute.service';

@Component({
    selector: 'jhi-educational-institute-update',
    templateUrl: './educational-institute-update.component.html'
})
export class EducationalInstituteUpdateComponent implements OnInit {
    educationalInstitute: IEducationalInstitute;
    isSaving: boolean;

    constructor(private educationalInstituteService: EducationalInstituteService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ educationalInstitute }) => {
            this.educationalInstitute = educationalInstitute;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.educationalInstitute.id !== undefined) {
            this.subscribeToSaveResponse(this.educationalInstituteService.update(this.educationalInstitute));
        } else {
            this.subscribeToSaveResponse(this.educationalInstituteService.create(this.educationalInstitute));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IEducationalInstitute>>) {
        result.subscribe(
            (res: HttpResponse<IEducationalInstitute>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
