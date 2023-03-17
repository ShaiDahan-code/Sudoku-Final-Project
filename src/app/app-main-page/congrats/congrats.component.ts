import { Component } from '@angular/core';
import { TweenMax, Power1, Back } from 'gsap';
import * as _ from 'lodash';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent {
  numberOfStars = 200;

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.numberOfStars; i++) {
      const star = document.createElement('div');
      star.classList.add('blob', 'fa', 'fa-star', i.toString());
      const congratsElement = document.querySelector('.congrats');
      if (congratsElement) {
        congratsElement.appendChild(star);
      }
    }

    this.animateText();
    setInterval(() => {
      this.reset();
      this.animateBlobs();
      this.animateText();
    }, 3000);
  }

  reset() {
    const blobs = Array.from(document.querySelectorAll('.blob'));
    blobs.forEach((blob) => {
      TweenMax.set(blob, { x: 0, y: 0, opacity: 1 });
    });

    TweenMax.set(document.querySelector('h1'), { scale: 1, opacity: 1, rotation: 0 });
  }

  animateText() {
    TweenMax.from(document.querySelector('h1'), 0.8, {
      scale: 0.4,
      opacity: 0,
      rotation: 15,
      ease: Back.easeOut.config(4),
    });
  }

  animateBlobs() {
    const xSeed = _.random(350, 380);
    const ySeed = _.random(120, 170);
    const blobs = Array.from(document.querySelectorAll('.blob'));
    blobs.forEach((blob) => {
      const speed = _.random(1, 5);
      const rotation = _.random(5, 100);
      const scale = _.random(0.8, 1.5);
      const x = _.random(-xSeed, xSeed);
      const y = _.random(-ySeed, ySeed);

      TweenMax.to(blob, speed, {
        x: x,
        y: y,
        ease: Power1.easeOut,
        opacity: 0,
        rotation: rotation,
        scale: scale,
        onStartParams: [blob],
        onStart: function($element : any) {
          $element.style.display = 'block';
        },
        onCompleteParams: [blob],
        onComplete: function($element : any) {

        }
      });
    });
  }
}
