export class EventCalendar {
    eventCalendar = [];
    #historyPointer = 0;

    get getCurrentTime() {
        return this.eventCalendar[this.#historyPointer].time;
    }
    get getLastEvent() {
        return this.eventCalendar[this.eventCalendar.length - 1];
    }

    get getCalendarHistory() {
        return this.eventCalendar;
    }

    isEmpty() {
        return this.eventCalendar.length === 0;
    }

    addSpecialEvent(event) {

        this.eventCalendar.push(event);

        this.eventCalendar.sort((a, b) => {
            return a.time - b.time;
        });
    }

    getEvent() {
        if (
            this.eventCalendar.length > 0 &&
            this.#historyPointer < this.eventCalendar.length
        ) {
            const currentPointer = this.#historyPointer;
            this.#historyPointer++;
            return this.eventCalendar[currentPointer];
        } else {
            return new Error("Error: Can't get event -- calendar is empty");
        }
    }
}
