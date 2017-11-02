import { Injectable, Injector } from '@angular/core'
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http'
import { Router } from '@angular/router'

import { NzModalService } from 'ng-zorro-antd'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import { _throw } from 'rxjs/Observable/throw'

import { LocalStorageService } from 'app/core/services/localstorage.service'
import { LoginService } from 'app/routes/pages/services/login.service'

import { environment } from '../../../environments/environment'

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private url = `${environment.SERVER_URL}/api/test`
  private router: Router
  private modalService: NzModalService

  constructor(private local: LocalStorageService, private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next
      .handle(req)
      .do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body && new RegExp(environment.SERVER_URL, 'i').test(event.url)) {
            if (event.body.resCode !== 0) {
              console.error(`API Error; ${event.body.resMsg}`)
              throw new Error(event.body.resCode)
            }
          }
        }
      })
      .catch(res => {
        console.log(res)
        if (res instanceof HttpErrorResponse) {
          console.log('resp status: ' + res.status)
          if (res.status === 401) {
            this.router = this.injector.get(Router)
            this.router.navigate(['login'])
          }

          if (res.status === 500) {
            this.modalService = this.injector.get(NzModalService)
            this.modalService.error({
              title: '内部错误，请稍候重试',
              content: '小V宝 遇到了意外情况，无法完成您的请求。'
            })
          }
        }

        return Observable.throw(res)
      })
  }
}

export interface APIResponse {
  resCode: number
  resMsg: string
  result: any[]
}
