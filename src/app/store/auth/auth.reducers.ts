import { createReducer, on } from "@ngrx/store";
import { LoginResponse } from "src/app/models/loginresponse.model";
import { removeLoginData, setLoginData } from "./auth.actions";
import { AuthService } from 'src/app/services/auth.service';

export const initialState : LoginResponse  =   
 AuthService.getLoginDataFromLocalStorage() 
 ?
 AuthService.getLoginDataFromLocalStorage()
 : 
 {
    jwtToken: '',
    user: undefined,
    login: false,
 };


export const authReducer = createReducer(
    initialState, 
    on(setLoginData, (oldState, payload) => {

    // console.log("Set Login Data Action With Reducer");
    // console.log(oldState);
    return {...payload,login : true};
}),
    on(removeLoginData,(state)=>{
        return {
        jwtToken :'',
        user : undefined,
        login : false
        };
    })

);