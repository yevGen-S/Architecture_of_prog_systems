const LAMBDA = 10;

export class Device {
    id;
    isBusy;
    handlingTime;
    lambda;

    constructor(numberOfDevice, lambda) {
        this.id = numberOfDevice;
        this.isBusy = false;
        this.lambda = lambda;
        if (lambda === undefined || isNaN(lambda)) {
            this.lambda = LAMBDA;
        }
        this.handlingTime = this.#expDistribution(this.lambda);
    }

    #expDistribution(lambda) {
        return function generateDistribution() {
            // return 1 - Math.exp(-lambda * Math.random());
            return (-1 / lambda) * Math.log(Math.random());
        };
    }

    handleRequestTime() {
        return this.handlingTime();
    }

    setBusy() {
        this.isBusy = true;
    }

    setFree() {
        this.isBusy = false;
    }
}
