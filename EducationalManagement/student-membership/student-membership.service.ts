import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IStudentMembership } from 'app/shared/model/EducationalManagement/student-membership.model';
import {
    StudentMembershipPreRegister,
    IStudentMembershipPreRegister,
    StudentMembershipSelfRegister,
    IStudentMembershipSelfRegister,
    IStudentMembershipInfo
} from 'app/shared/model/EducationalManagement/student-membership-custom.model';
import { IPersonUserPass } from 'app/shared/model/EducationalManagement/person-custom.model';
import { FileUploader, FileItem } from 'ng2-file-upload';

type EntityResponseType = HttpResponse<IStudentMembership>;
type EntityArrayResponseType = HttpResponse<IStudentMembership[]>;

@Injectable({ providedIn: 'root' })
export class StudentMembershipService {
    private uploader = new FileUploader({
        url: '',
        maxFileSize: 1024 * 1024 * 5
    });

    private selfRegisterCache: IStudentMembershipSelfRegister;
    private preRegisterCache: IStudentMembershipPreRegister;
    private cachedFile: FileItem;

    public resourceUrl = SERVER_API_URL + 'api/em/student-memberships';
    public resourceSearchUrl = SERVER_API_URL + 'api/em/_search/student-memberships';

    constructor(private http: HttpClient) {}

    setCachedFile(file: FileItem) {
        this.cachedFile = file;
    }

    getCachedFile(): FileItem {
        return this.cachedFile;
    }

    getUploader(): FileUploader {
        return this.uploader;
    }

    setPreRegisterCache(preRegister: IStudentMembershipPreRegister) {
        this.preRegisterCache = preRegister;
    }

    getPreRegisterCache(): IStudentMembershipPreRegister {
        return this.preRegisterCache;
    }

    setSelfRegisterCache(selfRegister: IStudentMembershipSelfRegister) {
        this.selfRegisterCache = selfRegister;
    }

    getSelfRegisterCache(): IStudentMembershipSelfRegister {
        return this.selfRegisterCache;
    }

    preRegister(nationalCode: string): Observable<HttpResponse<IStudentMembershipPreRegister>> {
        return this.http.get<IStudentMembershipPreRegister>(`${this.resourceUrl}/pre-register/national-code/${nationalCode}`, {
            observe: 'response'
        });
    }

    selfRegister(studentMembershipSelfRegister: IStudentMembershipSelfRegister): Observable<HttpResponse<IPersonUserPass>> {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(studentMembershipSelfRegister)], { type: 'application/json' });
        formData.append('student', jsonBlob);
        formData.append('image', this.cachedFile._file);
        // return this.http.post(this.baseApi, formData).pipe(
        //     map(
        //         dto => {
        //             return this.mapDtoToModel(dto);
        //         },
        //         catchError((e: any) => {
        //             return observableOf([]);
        //         })
        //     )
        // );
        return this.http.post<IPersonUserPass>(`${this.resourceUrl}/self-register`, formData, { observe: 'response' });
    }

    updateSelfRegister(studentMembershipSelfRegister: IStudentMembershipSelfRegister): Observable<HttpResponse<any>> {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(studentMembershipSelfRegister)], { type: 'application/json' });
        formData.append('student', jsonBlob);
        formData.append('image', this.cachedFile._file);
        // return this.http.post(this.baseApi, formData).pipe(
        //     map(
        //         dto => {
        //             return this.mapDtoToModel(dto);
        //         },
        //         catchError((e: any) => {
        //             return observableOf([]);
        //         })
        //     )
        // );
        return this.http.post<any>(`${this.resourceUrl}/self-register/update/current-user/unconfirmed`, formData, { observe: 'response' });
    }

    getStudentMembershipForCurrentUser(): Observable<HttpResponse<IStudentMembershipInfo>> {
        return this.http.get<IStudentMembershipInfo>(`${this.resourceUrl}/current-user/info`, { observe: 'response' });
    }

    create(studentMembership: IStudentMembership): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(studentMembership);
        return this.http
            .post<IStudentMembership>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(studentMembership: IStudentMembership): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(studentMembership);
        return this.http
            .put<IStudentMembership>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IStudentMembership>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IStudentMembership[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IStudentMembership[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(studentMembership: IStudentMembership): IStudentMembership {
        const copy: IStudentMembership = Object.assign({}, studentMembership, {
            registerationDate:
                studentMembership.registerationDate != null && studentMembership.registerationDate.isValid()
                    ? studentMembership.registerationDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.registerationDate = res.body.registerationDate != null ? moment(res.body.registerationDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((studentMembership: IStudentMembership) => {
                studentMembership.registerationDate =
                    studentMembership.registerationDate != null ? moment(studentMembership.registerationDate) : null;
            });
        }
        return res;
    }
}
