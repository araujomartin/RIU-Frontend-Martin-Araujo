import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'heroes',
        pathMatch: 'full'
    },
    {
        path: 'heroes',
        loadComponent: () => import('./heroes/components/hero-page/hero-page').then((m) => m.HeroPage)
    },{
        path: 'heroes/:id',
        loadComponent: () => import('./heroes/components/hero-page/hero-page').then((m) => m.HeroPage)
    }
];
