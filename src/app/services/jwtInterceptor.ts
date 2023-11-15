import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, switchMap, take, tap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { LoginResponse } from "../models/loginresponse.model";
import { removeLoginData } from "../store/auth/auth.actions";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private toastr:ToastrService,
        private router:Router,
        private store : Store<{auth : LoginResponse}>,
        ) { }

    intercept
        (
            req: HttpRequest<any>,
            next: HttpHandler
        ): Observable<HttpEvent<any>> {

        // console.log('JWT INTERCEPTOR WORKS!');

        //write logic for adding jwt token in Header of each request
        return this.authService.getLoggedInData().pipe(
            take(1),
            switchMap(value => {
                // console.log(value.jwtToken + ' FROM SWITCH MAP');
                //add token in HEADER
                if (value.login) {
                    req = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${value.jwtToken}`,
                        }
                    })
                }
                return next.handle(req);
            })
        );
    }

}

