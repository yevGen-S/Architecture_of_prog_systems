
export class Producer {
    id;
    produceRequestInterval;
    a;
    b;

    constructor(index, a , b) {
        this.id = index;
        this.produceRequestInterval = Math.abs(b - a) * Math.random() + a;
    }

    produceInterval() {
        return this.produceRequestInterval;
    }

    get getId() {
        return this.id;
    }

}
