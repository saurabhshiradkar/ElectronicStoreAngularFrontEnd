import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginResponse } from 'src/app/models/loginresponse.model';
import { removeLoginData } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(    private store : Store<{auth : LoginResponse}>,
    private router : Router){}
  ngOnInit(): void {
    this.logout()
  }


    logout(){
      this.store.dispatch(removeLoginData());
      this.router.navigate(['/login'])
    }

}
