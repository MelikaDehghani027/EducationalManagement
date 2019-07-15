import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmployeeMembership } from 'app/shared/model/EducationalManagement/employee-membership.model';
import { EmployeeMembershipService } from './employee-membership.service';
import { EmployeeMembershipComponent } from './employee-membership.component';
import { EmployeeMembershipDetailComponent } from './employee-membership-detail.component';
import { EmployeeMembershipUpdateComponent } from './employee-membership-update.component';
import { EmployeeMembershipDeletePopupComponent } from './employee-membership-delete-dialog.component';
import { IEmployeeMembership } from 'app/shared/model/EducationalManagement/employee-membership.model';

@Injectable({ providedIn: 'root' })
export class EmployeeMembershipResolve implements Resolve<IEmployeeMembership> {
    constructor(private service: EmployeeMembershipService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EmployeeMembership> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<EmployeeMembership>) => response.ok),
                map((employeeMembership: HttpResponse<EmployeeMembership>) => employeeMembership.body)
            );
        }
        return of(new EmployeeMembership());
    }
}

export const employeeMembershipRoute: Routes = [
    {
        path: 'employee-membership',
        component: EmployeeMembershipComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cardHolderGatewayApp.educationalManagementEmployeeMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'employee-membership/:id/view',
        component: EmployeeMembershipDetailComponent,
        resolve: {
            employeeMembership: EmployeeMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEmployeeMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'employee-membership/new',
        component: EmployeeMembershipUpdateComponent,
        resolve: {
            employeeMembership: EmployeeMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEmployeeMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'employee-membership/:id/edit',
        component: EmployeeMembershipUpdateComponent,
        resolve: {
            employeeMembership: EmployeeMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEmployeeMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const employeeMembershipPopupRoute: Routes = [
    {
        path: 'employee-membership/:id/delete',
        component: EmployeeMembershipDeletePopupComponent,
        resolve: {
            employeeMembership: EmployeeMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEmployeeMembership.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
