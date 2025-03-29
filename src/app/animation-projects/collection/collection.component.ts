import { Component } from '@angular/core';

interface AnimationCollection {
    name: string;
    imgUrl: string;
    routerLink: string;
}

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss',
    standalone: false,
})
export class CollectionComponent {
    public projects: AnimationCollection[] = [
        {
            name: 'Flipper Ball',
            imgUrl: '#',
            routerLink: '/animation-projects/flipper-ball',
        },
    ];
}
