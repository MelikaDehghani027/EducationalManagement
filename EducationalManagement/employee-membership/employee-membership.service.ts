import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEmployeeMembership } from 'app/shared/model/EducationalManagement/employee-membership.model';

type EntityResponseType = HttpResponse<IEmployeeMembership>;
type EntityArrayResponseType = HttpResponse<IEmployeeMembership[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeMembershipService {
    public resourceUrl = SERVER_API_URL + 'educationalmanagement/api/employee-memberships';
    public resourceSearchUrl = SERVER_API_URL + 'educationalmanagement/api/_search/employee-memberships';

    constructor(private http: HttpClient) {}

    create(employeeMembership: IEmployeeMembership): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(employeeMembership);
        return this.http
            .post<IEmployeeMembership>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(employeeMembership: IEmployeeMembership): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(employeeMembership);
        return this.http
            .put<IEmployeeMembership>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IEmployeeMembership>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEmployeeMembership[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEmployeeMembership[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(employeeMembership: IEmployeeMembership): IEmployeeMembership {
        const copy: IEmployeeMembership = Object.assign({}, employeeMembership, {
            startDate:
                employeeMembership.startDate != null && employeeMembership.startDate.isValid()
                    ? employeeMembership.startDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.startDate = res.body.startDate != null ? moment(res.body.startDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((employeeMembership: IEmployeeMembership) => {
                employeeMembership.startDate = employeeMembership.startDate != null ? moment(employeeMembership.startDate) : null;
            });
        }
        return res;
    }
}
