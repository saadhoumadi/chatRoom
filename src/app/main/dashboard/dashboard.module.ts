import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';

import { CoreCommonModule } from '@core/common.module';


import { DashboardService } from 'app/main/dashboard/dashboard.service';

import { AnalyticsComponent } from 'app/main/dashboard/analytics/analytics.component';
import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import { EquipeInfoComponent } from './ecommerce/equipeInfo/equipe-info.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { InvoiceAddComponent } from './ecommerce/equipeInfo/invoice/invoice-add/invoice-add.component';
import { InvoiceModule } from '../apps/invoice/invoice.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreSidebarModule } from '@core/components';
import { InvoiceListComponent } from './ecommerce/equipeInfo/invoice/invoice-list/invoice-list.component';
import { AddCustomerSidebarComponent } from './ecommerce/equipeInfo/invoice/invoice-add/add-customer-sidebar/add-customer-sidebar.component';
import { InvoiceListService } from './ecommerce/equipeInfo/invoice/invoice-list/invoice-list.service';
import { InvoiceAddService } from './ecommerce/equipeInfo/invoice/invoice-add/invoice-add.service';
import { EditTeamComponent } from './ecommerce/equipeInfo/invoice/edit-team/edit-team.component';
import { EditTeamService } from './ecommerce/equipeInfo/invoice/edit-team/edit-team.service';
import { EquipeAddComponent } from './ecommerce/equipe-add/equipe-add.component';
import { EquipeAddService } from './ecommerce/equipe-add/equipe-add.service';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { AccueilService } from './analytics/accueil.service';
import { CardActionsModule } from '../ui/card/card-actions/card-actions.module';
import { CardStatisticsModule } from '../ui/card/card-statistics/card-statistics.module';
import { CardAnalyticsModule } from '../ui/card/card-analytics/card-analytics.module';
import { CardBasicModule } from '../ui/card/card-basic/card-basic.module';
import { CardAdvanceModule } from '../ui/card/card-advance/card-advance.module';



const routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
    data: {animation: 'danalytics' },
    resolve: {
      css: DashboardService,
    }
  },
  {
    path: 'ecommerce',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' },
  },
  {
    path: 'equipe',
    component: EquipeInfoComponent,
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  },
   {
    path: 'addMember',
    component: InvoiceAddComponent,
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  },
   {
    path: 'editMember',
    component: EditTeamComponent,
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  },
  {
    path: 'addTeam',
    component: EquipeAddComponent,
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  }
];

@NgModule({
  declarations: [AnalyticsComponent, EcommerceComponent, EquipeInfoComponent,InvoiceAddComponent,InvoiceListComponent
  ,AddCustomerSidebarComponent,EditTeamComponent,EquipeAddComponent
],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    NgSelectModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
     TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
  InvoiceModule,
CardSnippetModule,
   Ng2FlatpickrModule,
    NgxDatatableModule,
    FormsModule,
    CorePipesModule,
    NgbModule,
    NgSelectModule,
    CoreSidebarModule,
CardActionsModule,
 CardStatisticsModule,
  CardAnalyticsModule, 
  CardBasicModule, 
  CardAdvanceModule
    
  ],
  exports: [EcommerceComponent],
  providers:[DashboardService,InvoiceListService,InvoiceAddService,EditTeamService,EquipeAddService,AccueilService]
})
export class DashboardModule {}
