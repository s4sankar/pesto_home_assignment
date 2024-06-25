import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth/auth.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { canActivateGuard } from './core/guards/auth/can-activate.guard';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [canActivateGuard]
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
];