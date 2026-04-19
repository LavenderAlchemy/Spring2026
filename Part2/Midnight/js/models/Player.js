export default class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    setScore(score) {
        this.score = score;
    }
}