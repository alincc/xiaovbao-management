import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch'

import { Qrcode } from './models/qrcode.model'
import { APIResponse } from 'app/core/interceptors/api-error-interceptor'

@Injectable()
export class QrcodeService {
  private fetchQrcodesUrl = '/admin/QRCodeTemplate'
  private fetchQrcodessCountUrl = '/admin/QRCodeTemplateCount'
  private delQrcodeUrl = '/admin/QRCodeTemplate'

  constructor(private http: HttpClient) {}

  fetchQrcodes(
    tenantId: string,
    pageIndex: number,
    pageSize: number
  ): Observable<Qrcode[]> {
    const query = `?tenantId=${tenantId}&pageNumber=${pageIndex}&pageSize=${pageSize}`
    return this.http
      .get(this.fetchQrcodesUrl + query)
      .map(resp => (resp as APIResponse).result)
      .map(result =>
        result.map(e => ({
          id: e.id,
          bizType: e.bizType,
          consigneeId: e.consigneeId,
          consigneeName: e.consigneeName,
          couponRate: e.couponRate,
          couponType: e.couponType,
          couponValue: e.couponValue,
          description: e.descriptor,
          tableName: e.tableName,
          tenantId: e.tenantId,
          tenantName: e.tenantName
        }))
      )
      .catch(this.handleError)
  }

  fetchQrcodesCount(tenantId: string): Observable<number> {
    return this.http
      .get(this.fetchQrcodessCountUrl + `/?tenantId=${tenantId}`)
      .map(resp => (resp as APIResponse).result)
      .catch(this.handleError)
  }

  delQrcode(tenantId: string, id: string): Observable<any> {
    return this.http
      .delete(this.delQrcodeUrl + `?QRCodeTemplate=${id}&tenantId=${tenantId}`)
      .map(resp => (resp as APIResponse).result)
      .catch(this.handleError)
  }

  private handleError(error: any) {
    const errMsg = error.message
      ? error.message
      : error.status ? `${error.status} - ${error.statusText}` : 'Server error'
    console.error(errMsg) // log to console instead
    return Observable.throw(errMsg)
  }
}
