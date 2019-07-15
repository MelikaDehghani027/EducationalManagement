import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudentMembership } from 'app/shared/model/EducationalManagement/student-membership.model';

@Component({
    selector: 'jhi-student-membership-detail',
    templateUrl: './student-membership-detail.component.html'
})
export class StudentMembershipDetailComponent implements OnInit {
    studentMembership: IStudentMembership;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ studentMembership }) => {
            this.studentMembership = studentMembership;
        });
    }

    previousState() {
        window.history.back();
    }
}
