import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

export abstract class BaseHttpService {
    baseUrl = environment.baseUrl;

    constructor(protected httpClient: HttpClient) {
    }

    throwErrorResp(err: HttpErrorResponse): Observable<never> {
        return throwError(() => err);
    }
}