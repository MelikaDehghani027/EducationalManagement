import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeacherMembership } from 'app/shared/model/EducationalManagement/teacher-membership.model';

@Component({
    selector: 'jhi-teacher-membership-detail',
    templateUrl: './teacher-membership-detail.component.html'
})
export class TeacherMembershipDetailComponent implements OnInit {
    teacherMembership: ITeacherMembership;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ teacherMembership }) => {
            this.teacherMembership = teacherMembership;
        });
    }

    previousState() {
        window.history.back();
    }
}
