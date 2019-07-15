import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';

type EntityResponseType = HttpResponse<IEducationalInstitute>;
type EntityArrayResponseType = HttpResponse<IEducationalInstitute[]>;

@Injectable({ providedIn: 'root' })
export class EducationalInstituteService {
    public resourceUrl = SERVER_API_URL + 'educationalmanagement/api/educational-institutes';
    public resourceSearchUrl = SERVER_API_URL + 'educationalmanagement/api/_search/educational-institutes';

    constructor(private http: HttpClient) {}

    create(educationalInstitute: IEducationalInstitute): Observable<EntityResponseType> {
        return this.http.post<IEducationalInstitute>(this.resourceUrl, educationalInstitute, { observe: 'response' });
    }

    update(educationalInstitute: IEducationalInstitute): Observable<EntityResponseType> {
        return this.http.put<IEducationalInstitute>(this.resourceUrl, educationalInstitute, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IEducationalInstitute>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEducationalInstitute[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEducationalInstitute[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
