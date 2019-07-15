import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Person } from 'app/shared/model/EducationalManagement/person.model';
import { PersonService } from './person.service';
import { PersonComponent } from './person.component';
import { PersonDetailComponent } from './person-detail.component';
import { PersonUpdateComponent } from './person-update.component';
import { PersonDeletePopupComponent } from './person-delete-dialog.component';
import { IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { ProfileViewComponent } from './profile-view/profile-view.component';

@Injectable({ providedIn: 'root' })
export class PersonResolve implements Resolve<IPerson> {
    constructor(private service: PersonService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Person> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Person>) => response.ok),
                map((person: HttpResponse<Person>) => person.body)
            );
        }
        return of(new Person());
    }
}

export const personRoute: Routes = [
    {
        path: '',
        redirectTo: 'person/profile-view',
        pathMatch: 'full'
    },
    {
        path: 'person/profile-view',
        component: ProfileViewComponent,
        canActivate: [UserRouteAccessService],
        data: {
            pageTitle: 'cardHolderGatewayApp.educationalManagementPerson.profileView.title'
        }
    },
    {
        path: 'person',
        component: PersonComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cardHolderGatewayApp.educationalManagementPerson.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'person/:id/view',
        component: PersonDetailComponent,
        resolve: {
            person: PersonResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementPerson.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'person/new',
        component: PersonUpdateComponent,
        resolve: {
            person: PersonResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementPerson.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'person/:id/edit',
        component: PersonUpdateComponent,
        resolve: {
            person: PersonResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementPerson.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const personPopupRoute: Routes = [
    {
        path: 'person/:id/delete',
        component: PersonDeletePopupComponent,
        resolve: {
            person: PersonResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cardHolderGatewayApp.educationalManagementPerson.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
