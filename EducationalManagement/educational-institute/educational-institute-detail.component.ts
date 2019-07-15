import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';

@Component({
    selector: 'jhi-educational-institute-detail',
    templateUrl: './educational-institute-detail.component.html'
})
export class EducationalInstituteDetailComponent implements OnInit {
    educationalInstitute: IEducationalInstitute;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ educationalInstitute }) => {
            this.educationalInstitute = educationalInstitute;
        });
    }

    previousState() {
        window.history.back();
    }
}
