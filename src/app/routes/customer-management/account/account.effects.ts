import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { NzNotificationService } from 'ng-zorro-antd'

import * as fromAccount from './account.action'
import { AccountService } from '../services/account.service'
import { SMSService } from 'app/core/services/sms.service'
import { TenantService } from 'app/core/services/tenant.service'

@Injectable()
export class AccountEffects {
  @Effect()
  fetchAccounts$ = this.actions$
    .ofType(fromAccount.FETCH_ACCOUNTS)
    .map((action: fromAccount.FectchAccountsAction) => action.payload)
    .switchMap(({ pageIndex, pageSize }) => {
      return this.accountService
        .fetchAccounts(this.tenantService.tenantId, pageIndex, pageSize)
        .map(accounts => new fromAccount.FetchAccountsSuccessAction(accounts))
        .catch(e => Observable.of(new fromAccount.FetchAccountsFailureAction()))
    })

  @Effect()
  fetchAccountsCount$ = this.actions$
    .ofType(fromAccount.FETCH_ACCOUNTS_COUNT)
    .switchMap(() =>
      this.accountService
        .fetchAccountsCount(this.tenantService.tenantId)
        .map(count => new fromAccount.FetchAccountsCountSuccessAction(count))
        .catch(e => Observable.of(new fromAccount.FetchAccountsCountFailureAction()))
    )

  @Effect()
  sendSMS$ = this.actions$
    .ofType(fromAccount.SEND_SMS)
    .map((action: fromAccount.SendSMSAction) => action.phones)
    .switchMap(phones => {
      return this.smsService
        .sendSMS(this.tenantService.tenantId, phones)
        .map(res => new fromAccount.SendSMSSuccessAction())
        .catch(e => Observable.of(new fromAccount.SendSMSFailureAction()))
    })

  @Effect({ dispatch: false })
  sendSMSSuccess$ = this.actions$
    .ofType(fromAccount.SEND_SMS_SUCCESS)
    .do(() => {
      this._notification.create('success', '发送短信', '恭喜发送短信成功')
    })

  @Effect({ dispatch: false })
  sendSMSFailure$ = this.actions$
    .ofType(fromAccount.SEND_SMS_FAILURE)
    .do(() => {
      this._notification.create('error', '发送短信', '发送短信失败')
    })

  @Effect()
  ensureDeleteAccount$ = this.actions$
    .ofType(fromAccount.ENSURE_DELETE_ACCOUNT)
    .map((action: fromAccount.EnsureDeleteAccountAction) => action.payload)
    .switchMap(({ id, pageIndex, pageSize }) => {
      return this.accountService
        .delAccount(this.tenantService.tenantId, id)
        .concatMap(res => [
          new fromAccount.DeleteAccountSuccessAction(),
          new fromAccount.FectchAccountsAction({ pageIndex, pageSize })
        ])
        .catch(e => Observable.of(new fromAccount.DeleteAccountFailureAction()))
    })

  @Effect({ dispatch: false })
  delAccountSuccess$ = this.actions$
    .ofType(fromAccount.DELETE_ACCOUNT_SUCCESS)
    .do(() => {
      this._notification.create('success', '删除顾客', '恭喜删除顾客成功')
    })

  @Effect({ dispatch: false })
  delAccountFailure$ = this.actions$
    .ofType(fromAccount.DELETE_ACCOUNT_FAILURE)
    .do(() => {
      this._notification.create('error', '删除顾客', '删除顾客失败')
    })

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private smsService: SMSService,
    private _notification: NzNotificationService,
    private tenantService: TenantService
  ) {}
}
