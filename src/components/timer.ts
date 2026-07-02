import { animate, spring, stagger, splitText, cubicBezier } from "animejs";

if (typeof window !== "undefined") {
  class TimerElement extends HTMLElement {
    private startDate!: number;
    private endDate!: number;
    private daysEl!: HTMLElement;
    private hoursEl!: HTMLElement;
    private minutesEl!: HTMLElement;
    private secondsEl!: HTMLElement;
    private labelEl!: HTMLElement;
    private dateEl!: HTMLElement;
    private titleEl!: HTMLElement;
    private timerInterval!: number;

    private previousValues = { d: -1, h: -1, m: -1, s: -1 };

    constructor() {
      super();
    }

    connectedCallback() {
      const template = document.getElementById("Timer") as HTMLTemplateElement;
      const templateContent = template.content.cloneNode(
        true,
      ) as DocumentFragment;
      this.appendChild(templateContent);

      this.daysEl = this.querySelector("#Timer-days")!;
      this.hoursEl = this.querySelector("#Timer-hours")!;
      this.minutesEl = this.querySelector("#Timer-minutes")!;
      this.secondsEl = this.querySelector("#Timer-seconds")!;
      this.labelEl = this.querySelector("#Start-End")!;
      this.dateEl = this.querySelector("#Timer-Date")!;
      this.titleEl = this.querySelector("#Timer-title")!;

      // Get attribute as string
      const startStr =
        this.getAttribute("start-date") || "Nov 3, 2025 08:00:00";
      const endStr = this.getAttribute("end-date") || "Nov 4, 2025 00:00:00";

      this.startDate = new Date(startStr).getTime();
      this.endDate = new Date(endStr).getTime();

      this.startTimer();
    }

    disconnectedCallback() {
      clearInterval(this.timerInterval);
    }

    private startTimer() {
      this.updateTimer();
      this.timerInterval = window.setInterval(() => this.updateTimer(), 1000);
    }

    private updateTimer() {
      const title = this.getAttribute("title") || "Banner";
      this.titleEl.textContent = title;

      const now = new Date().getTime();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const abrv = new Date()
        .toLocaleTimeString("en-US", {
          timeZoneName: "short",
        })
        .split(" ")
        .pop();

      if (now < this.startDate) {
        const distance = this.startDate - now;
        this.labelEl.textContent = "Starts:";
        this.dateEl.textContent =
          new Date(this.startDate).toLocaleString("en-US", {
            hour12: false,
            timeZone: tz,
          }) + ` (${abrv})`;
        this.updateDisplay(distance);
      } else if (now >= this.startDate && now < this.endDate) {
        const distance = this.endDate - now;
        this.labelEl.textContent = "Ends:";
        this.dateEl.textContent =
          new Date(this.endDate).toLocaleString("en-US", {
            hour12: false,
            timeZone: tz,
          }) + ` (${abrv})`;
        this.updateDisplay(distance);
      } else {
        this.labelEl.textContent = "Ended:";
        this.dateEl.textContent =
          new Date(this.endDate).toLocaleString("en-US", {
            hour12: false,
            timeZone: tz,
          }) + ` (${abrv})`;
        this.setDisplay(0, 0, 0, 0);
        clearInterval(this.timerInterval);
      }
    }

    private updateDisplay(distance: number) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.setDisplay(days, hours, minutes, seconds);
    }

    private setDisplay(d: number, h: number, m: number, s: number) {
      if (d !== this.previousValues.d) {
        this.daysEl.textContent = d.toString().padStart(2, "0");
        const { chars: charsDays } = splitText(this.daysEl, { chars: true });

        animate(charsDays, {
          rotateX: 360,
          opacity: [
            {
              to: ["0%", "90%"],
              ease: cubicBezier(0.367, 0.446, 0.726, 1.058),
            },
          ],
          duration: 500,
          ease: spring({ bounce: 0.74, duration: 422 }),
          loop: false,
        });
      }

      if (h !== this.previousValues.h) {
        this.hoursEl.textContent = h.toString().padStart(2, "0");
        const { chars: charsHours } = splitText(this.hoursEl, { chars: true });

        animate(charsHours, {
          rotateX: 360,

          opacity: [
            {
              to: ["0%", "90%"],
              ease: cubicBezier(0.367, 0.446, 0.726, 1.058),
            },
          ],
          duration: 500,
          ease: spring({ bounce: 0.74, duration: 422 }),
          loop: false,
        });
      }

      if (m !== this.previousValues.m) {
        this.minutesEl.textContent = m.toString().padStart(2, "0");
        const { chars: charsMin } = splitText(this.minutesEl, { chars: true });

        animate(charsMin, {
          rotateX: 360,

          opacity: [
            {
              to: ["0%", "90%"],
              ease: cubicBezier(0.367, 0.446, 0.726, 1.058),
            },
          ],
          duration: 300,
          ease: spring({ bounce: 0.74, duration: 422 }),
          loop: false,
        });
      }

      if (s !== this.previousValues.s) {
        this.secondsEl.textContent = s.toString().padStart(2, "0");
        const { chars: charsSec } = splitText(this.secondsEl, { chars: true });

        animate(charsSec, {
          rotateX: 360,
          //  y: [
          //    { to: ["50%", "0%"] },
          //    { to: "-100%", delay: 750, ease: "inOutSine" },
          //  ],
          opacity: [
            {
              to: ["0%", "90%"],
              ease: cubicBezier(0.367, 0.446, 0.726, 1.058),
            },
          ],
          duration: 300,
          delay: stagger(35),
          ease: spring({ bounce: 0.74, duration: 422 }),
          loop: true,
        });
      }

      this.previousValues = { d: d, h: h, m: m, s: s };
    }
  }

  customElements.define("banner-timer", TimerElement);
}
