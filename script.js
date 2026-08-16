const startingBudget = 500

class Family {
    constructor(name) {
        this.name = name;
        this.children = [
            new Child("Aubrie"),
            new Child("Rangi"),
            new Child("Manaia")
        ]
    }
    
    
}

class Child {
    constructor(name) {
        this.name = name;
    }
}

class App {
    constructor(document) {
        this.document = document
        this.family = new Family("Cooper")
    }

    start() {
        
    }
}

new App(document).start();