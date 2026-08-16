class Family {
    #startingBudget

    constructor(startingBudget) {
        this.#startingBudget = startingBudget
        this.children = [
            new Child("Aubrie Cooper"),
            new Child("Rangi Cooper"),
            new Child("Manaia Cooper")
        ]
    }

    addNewYearBudget() {
        for (const child of this.children) {
            child.deposit(this.#startingBudget)
        }
    }
}

class Child {
    #balance = 0

    constructor(name) {
        this.name = name;
    }

    balance() {
        return this.#balance
    }

    deposit(amount) {
        this.#balance = this.#balance + amount
    }
}

class App {
    #appName = "Allowance app"
    #family

    constructor(document) {
        this.#family = new Family(500)
    }

    start() {
        if (this.isStartOfYear()) {
            this.#family.addNewYearBudget()
        }
        else {
            this.loadBalances()
        }

        this.render()
    }

    isStartOfYear() {
        return true
    }

    loadBalances() {

    }

    render() {
        let childTemplate = document.getElementById("child-template")
        let childrenElement = document.getElementById("children")

        for (const child of this.#family.children) {

            // Make a copy of the child template's content
            let clonedChildElememt = childTemplate.content.cloneNode(true)

            // Set child's name
            clonedChildElememt.querySelector(".child-name").textContent = child.name

            // Set child's balence
            clonedChildElememt.querySelector(".balance-value").textContent = child.balance()

            // Add the child html into the children element
            childrenElement.append(clonedChildElememt)
        }
    }

}







new App(document).start();

