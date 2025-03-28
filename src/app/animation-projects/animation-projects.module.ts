import { NgModule } from "@angular/core";
import { FlipperBallComponent } from "./flipper-ball/flipper-ball.component";
import { AnimationProjectsRoutingModule } from "./animation-projects-routing.module";

@NgModule({
    declarations: [
        FlipperBallComponent
    ],
    imports: [
        AnimationProjectsRoutingModule,
    ],
})
export class AnimationProjectsModule {


}
