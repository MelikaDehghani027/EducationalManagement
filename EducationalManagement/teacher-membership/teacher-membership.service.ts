import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITeacherMembership } from 'app/shared/model/EducationalManagement/teacher-membership.model';

type EntityResponseType = HttpResponse<ITeacherMembership>;
type EntityArrayResponseType = HttpResponse<ITeacherMembership[]>;

@Injectable({ providedIn: 'root' })
export class TeacherMembershipService {
    public resourceUrl = SERVER_API_URL + 'educationalmanagement/api/teacher-memberships';
    public resourceSearchUrl = SERVER_API_URL + 'educationalmanagement/api/_search/teacher-memberships';

    constructor(private http: HttpClient) {}

    create(teacherMembership: ITeacherMembership): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(teacherMembership);
        return this.http
            .post<ITeacherMembership>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(teacherMembership: ITeacherMembership): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(teacherMembership);
        return this.http
            .put<ITeacherMembership>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITeacherMembership>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITeacherMembership[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITeacherMembership[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(teacherMembership: ITeacherMembership): ITeacherMembership {
        const copy: ITeacherMembership = Object.assign({}, teacherMembership, {
            startDate:
                teacherMembership.startDate != null && teacherMembership.startDate.isValid()
                    ? teacherMembership.startDate.format(DATE_FORMAT)
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
            res.body.forEach((teacherMembership: ITeacherMembership) => {
                teacherMembership.startDate = teacherMembership.startDate != null ? moment(teacherMembership.startDate) : null;
            });
        }
        return res;
    }
}
