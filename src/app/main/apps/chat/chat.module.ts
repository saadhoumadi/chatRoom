import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';

import { ChatContentComponent } from 'app/main/apps/chat/chat-content/chat-content.component';
import { ChatSidebarComponent } from 'app/main/apps/chat/chat-sidebars/chat-sidebar/chat-sidebar.component';
import { ChatUserSidebarComponent } from 'app/main/apps/chat/chat-sidebars/chat-user-sidebar/chat-user-sidebar.component';
import { ChatActiveSidebarComponent } from 'app/main/apps/chat/chat-sidebars/chat-active-sidebar/chat-active-sidebar.component';
import { ChatComponent } from 'app/main/apps/chat/chat.component';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectComponent } from 'app/main/forms/form-elements/select/select.component';

// routing
const routes: Routes = [
  {
    path: '**',
    component: ChatComponent,
    resolve: {
      chatData: ChatService
    },
    data: { animation: 'chat' }
  },
  {
    path: 'form-elements/select',
    component: SelectComponent,
    data: { animation: 'select' }
  }
];

@NgModule({
  declarations: [
    ChatComponent,
    ChatContentComponent,
    ChatSidebarComponent,
    ChatUserSidebarComponent,
    ChatActiveSidebarComponent
  ],
  imports: [
    CommonModule,
    CoreSidebarModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    PerfectScrollbarModule,
    NgbModule,
    NgSelectModule
  ],
  providers: [ChatService]
})
export class ChatModule {}
