import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPerson } from 'app/shared/model/EducationalManagement/person.model';
import { IPersonPersonalInfo, IPersonContactInfo } from 'app/shared/model/EducationalManagement/person-custom.model';
import { ICardHolderBankInfo, IBankRegistrationStatus } from 'app/shared/model/BankManagement/card-holder-custom.model';
import { IPersonContactInfoUpdate } from 'app/shared/model/EducationalManagement/person-custom.model';

type EntityResponseType = HttpResponse<IPerson>;
type EntityArrayResponseType = HttpResponse<IPerson[]>;

@Injectable({ providedIn: 'root' })
export class PersonService {
    public resourceUrl = SERVER_API_URL + 'api/em/people';
    public resourceSearchUrl = SERVER_API_URL + 'api/em/_search/people';

    constructor(private http: HttpClient) {}

    getBankRegistrationStatus(nationalCode: string): Observable<HttpResponse<IBankRegistrationStatus>> {
        return this.http.get<IBankRegistrationStatus>(`${SERVER_API_URL}api/bm/card-holders/status/${nationalCode}`, {
            observe: 'response'
        });
    }

    getCurrentUserImageUrl(): string {
        return `${this.resourceUrl}/get/current-user/image`;
    }

    getPersonPersonalInfoForCurrentUser(): Observable<HttpResponse<IPersonPersonalInfo>> {
        return this.http.get<IPersonPersonalInfo>(`${this.resourceUrl}/current-user/personal`, { observe: 'response' });
    }

    getPersonContactInfoForCurrentUser(): Observable<HttpResponse<IPersonContactInfo>> {
        return this.http.get<IPersonContactInfo>(`${this.resourceUrl}/current-user/contact`, { observe: 'response' });
    }

    getCardHolderBankInfo(): Observable<HttpResponse<ICardHolderBankInfo>> {
        return this.http.get<ICardHolderBankInfo>(`${SERVER_API_URL}/api/bm/card-holders/current-user/bank-info`, { observe: 'response' });
    }

    updateContactInfo(personContactInfo: IPersonContactInfo): Observable<HttpResponse<IPersonContactInfo>> {
        return this.http.put<IPersonContactInfo>(`${this.resourceUrl}/contact/current-user/info`, personContactInfo, {
            observe: 'response'
        });
    }

    create(person: IPerson): Observable<HttpResponse<IPerson>> {
        const copy = this.convertDateFromClient(person);
        return this.http
            .post<IPerson>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(person: IPerson): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(person);
        return this.http
            .put<IPerson>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPerson>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPerson[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPerson[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(person: IPerson): IPerson {
        const copy: IPerson = Object.assign({}, person, {
            birthDate: person.birthDate != null && person.birthDate.isValid() ? person.birthDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.birthDate = res.body.birthDate != null ? moment(res.body.birthDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((person: IPerson) => {
                person.birthDate = person.birthDate != null ? moment(person.birthDate) : null;
            });
        }
        return res;
    }
}
