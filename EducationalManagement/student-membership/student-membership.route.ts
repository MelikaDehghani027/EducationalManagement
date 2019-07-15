import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StudentMembership } from 'app/shared/model/EducationalManagement/student-membership.model';
import { StudentMembershipService } from './student-membership.service';
import { StudentMembershipComponent } from './student-membership.component';
import { StudentMembershipDetailComponent } from './student-membership-detail.component';
import { StudentMembershipUpdateComponent } from './student-membership-update.component';
import { StudentMembershipDeletePopupComponent } from './student-membership-delete-dialog.component';
import { IStudentMembership } from 'app/shared/model/EducationalManagement/student-membership.model';
import { StudentMembershipPreRegisterComponent } from './student-membership-pre-register/student-membership-pre-register.component';
import { StudentMembershipSelfRegisterComponent } from './student-membership-self-register/student-membership-self-register.component';
import { StudentMembershipSelfRegisterSummaryComponent } from './student-membership-self-register-summary/student-membership-self-register-summary.component';

@Injectable({ providedIn: 'root' })
export class StudentMembershipResolve implements Resolve<IStudentMembership> {
    constructor(private service: StudentMembershipService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StudentMembership> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<StudentMembership>) => response.ok),
                map((studentMembership: HttpResponse<StudentMembership>) => studentMembership.body)
            );
        }
        return of(new StudentMembership());
    }
}

export const studentMembershipRoute: Routes = [
    {
        path: 'student-membership',
        component: StudentMembershipComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'student-membership/:id/view',
        component: StudentMembershipDetailComponent,
        resolve: {
            studentMembership: StudentMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'student-membership/pre-register',
        component: StudentMembershipPreRegisterComponent,
        data: {
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.preRegister.title'
        }
    },
    {
        path: 'student-membership/self-register',
        component: StudentMembershipSelfRegisterComponent,
        data: {
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.selfRegister.title'
        }
    },
    {
        path: 'student-membership/self-register-summary',
        component: StudentMembershipSelfRegisterSummaryComponent,
        data: {
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.selfRegisterSummary.title'
        }
    },
    {
        path: 'student-membership/new',
        component: StudentMembershipUpdateComponent,
        resolve: {
            studentMembership: StudentMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'student-membership/:id/edit',
        component: StudentMembershipUpdateComponent,
        resolve: {
            studentMembership: StudentMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const studentMembershipPopupRoute: Routes = [
    {
        path: 'student-membership/:id/delete',
        component: StudentMembershipDeletePopupComponent,
        resolve: {
            studentMembership: StudentMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementStudentMembership.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
