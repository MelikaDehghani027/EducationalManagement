import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeMembership } from 'app/shared/model/EducationalManagement/employee-membership.model';

@Component({
    selector: 'jhi-employee-membership-detail',
    templateUrl: './employee-membership-detail.component.html'
})
export class EmployeeMembershipDetailComponent implements OnInit {
    employeeMembership: IEmployeeMembership;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ employeeMembership }) => {
            this.employeeMembership = employeeMembership;
        });
    }

    previousState() {
        window.history.back();
    }
}
