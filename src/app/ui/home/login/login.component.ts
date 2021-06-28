import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Instructor} from '../../../core/models/instructor';
import {first} from 'rxjs/operators';
import {AccountService} from '../../../core/services/account.service';
import {Account, Role} from '../../../core/models/account';
import {ConfirmModalComponent} from '../../../shared/components/confirm-modal/confirm-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) { }
  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild(ConfirmModalComponent) confirmModalComponent: ConfirmModalComponent;
  account: Account;
  ngOnInit(): void {
  }
  login() {
    this.accountService.getAccountByUsernameAndPassword(this.username.nativeElement.value, this.password.nativeElement.value)
      .subscribe(async (accounts) => {
        console.log(accounts);
        if (accounts.length === 0) {
          console.log('Wrong username/password combination!');
          this.confirmModalComponent.open('Login', 'Wrong username/password combination', ['ok']);
        }
        else {
          this.account = accounts[0];
          this.confirmModalComponent.open('Login', 'Logged in successfully!', ['ok']);
          console.log(this.account.role);
        }
    });
  }

  goSignUpPage() {
    this.router.navigate(['signup']);
  }

  onCloseModal($event: string) {
    switch (this.account.role) {
      case Role.student:
        console.log('wowww');
        this.router.navigate(['assignment/view']);
        break;
      case Role.admin:
        this.router.navigate(['home/admin']);
        break;

      case Role.instructor:
        this.router.navigate(['home/instructor']);
        break;
      case Role.freelancer:
        this.router.navigate(['home/instructor']);
        break;
    }
  }
}
