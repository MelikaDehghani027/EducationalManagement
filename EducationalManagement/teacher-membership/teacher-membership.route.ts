import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TeacherMembership } from 'app/shared/model/EducationalManagement/teacher-membership.model';
import { TeacherMembershipService } from './teacher-membership.service';
import { TeacherMembershipComponent } from './teacher-membership.component';
import { TeacherMembershipDetailComponent } from './teacher-membership-detail.component';
import { TeacherMembershipUpdateComponent } from './teacher-membership-update.component';
import { TeacherMembershipDeletePopupComponent } from './teacher-membership-delete-dialog.component';
import { ITeacherMembership } from 'app/shared/model/EducationalManagement/teacher-membership.model';

@Injectable({ providedIn: 'root' })
export class TeacherMembershipResolve implements Resolve<ITeacherMembership> {
    constructor(private service: TeacherMembershipService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TeacherMembership> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TeacherMembership>) => response.ok),
                map((teacherMembership: HttpResponse<TeacherMembership>) => teacherMembership.body)
            );
        }
        return of(new TeacherMembership());
    }
}

export const teacherMembershipRoute: Routes = [
    {
        path: 'teacher-membership',
        component: TeacherMembershipComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cardHolderGatewayApp.educationalManagementTeacherMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'teacher-membership/:id/view',
        component: TeacherMembershipDetailComponent,
        resolve: {
            teacherMembership: TeacherMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementTeacherMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'teacher-membership/new',
        component: TeacherMembershipUpdateComponent,
        resolve: {
            teacherMembership: TeacherMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementTeacherMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'teacher-membership/:id/edit',
        component: TeacherMembershipUpdateComponent,
        resolve: {
            teacherMembership: TeacherMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementTeacherMembership.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const teacherMembershipPopupRoute: Routes = [
    {
        path: 'teacher-membership/:id/delete',
        component: TeacherMembershipDeletePopupComponent,
        resolve: {
            teacherMembership: TeacherMembershipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementTeacherMembership.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
