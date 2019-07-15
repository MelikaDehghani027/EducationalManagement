import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';
import { EducationalInstituteService } from './educational-institute.service';
import { EducationalInstituteComponent } from './educational-institute.component';
import { EducationalInstituteDetailComponent } from './educational-institute-detail.component';
import { EducationalInstituteUpdateComponent } from './educational-institute-update.component';
import { EducationalInstituteDeletePopupComponent } from './educational-institute-delete-dialog.component';
import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';

@Injectable({ providedIn: 'root' })
export class EducationalInstituteResolve implements Resolve<IEducationalInstitute> {
    constructor(private service: EducationalInstituteService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EducationalInstitute> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<EducationalInstitute>) => response.ok),
                map((educationalInstitute: HttpResponse<EducationalInstitute>) => educationalInstitute.body)
            );
        }
        return of(new EducationalInstitute());
    }
}

export const educationalInstituteRoute: Routes = [
    {
        path: 'educational-institute',
        component: EducationalInstituteComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cardHolderGatewayApp.educationalManagementEducationalInstitute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'educational-institute/:id/view',
        component: EducationalInstituteDetailComponent,
        resolve: {
            educationalInstitute: EducationalInstituteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEducationalInstitute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'educational-institute/new',
        component: EducationalInstituteUpdateComponent,
        resolve: {
            educationalInstitute: EducationalInstituteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEducationalInstitute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'educational-institute/:id/edit',
        component: EducationalInstituteUpdateComponent,
        resolve: {
            educationalInstitute: EducationalInstituteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEducationalInstitute.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const educationalInstitutePopupRoute: Routes = [
    {
        path: 'educational-institute/:id/delete',
        component: EducationalInstituteDeletePopupComponent,
        resolve: {
            educationalInstitute: EducationalInstituteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementEducationalInstitute.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
