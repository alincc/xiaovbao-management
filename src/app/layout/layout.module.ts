import { NgModule } from '@angular/core'

import { StoreModule } from '@ngrx/store'
import { reducers } from './reducers'

import { SharedModule } from '../shared/shared.module'
import { LayoutComponent } from './layout.component'
import { HeaderComponent } from './header/header.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { SidebarNavComponent } from './sidebar/nav/nav.component'

const COMPONENTS = [LayoutComponent, HeaderComponent, SidebarComponent]

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('layout', reducers)
  ],
  providers: [],
  declarations: [SidebarNavComponent, ...COMPONENTS],
  exports: COMPONENTS
})
export class LayoutModule {}
