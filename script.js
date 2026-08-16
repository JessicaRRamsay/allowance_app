class Family {
    // Private variables
    #startingBudget
    #children

    constructor(startingBudget) {
        this.#startingBudget = startingBudget
        this.#children = [
            new Child("Aubrie Cooper"),
            new Child("Rangi Cooper"),
            new Child("Manaia Cooper")
        ]
    }

    children() {
        return this.#children
    }

    // Deposits the children's annual allowance
    depositAnnualAllowance() {
        for (const child of this.#children) {
            child.deposit(this.#startingBudget)
        }
    }
}

class Child {
    // I have made the balance private to avoid unwanted additions 
    #balance = 0

    // Creates a new child object
    constructor(name) {
        this.name = name;
    }

    balance() {
        return this.#balance
    }

    deposit(amount) {
        this.#balance += amount
    }
}

class App {
    // Private variables
    #family

    // Creates a new app object
    constructor() {
        this.#family = new Family(500) // $500 is the annual allowance
    }

    // This is the apps start up function
    start() {
        if (this.isStartOfYear()) {
            this.#family.depositAnnualAllowance()
            this.saveBalances()
        }
        else {
            this.loadBalances()
        }

        this.renderChildPanels()
    }

    isStartOfYear() {
        return true // TODO: understand how to detect the start of the year
    }


    loadBalances() {
        // TODO: load each child's balance from local storage
    }

    saveBalances() {
        // TODO: Save balances to local storage
    }

    renderChildPanels() {
        // Get the child panel template
        let childTemplate = document.getElementById("child-template")

        // Get the element that will hold the 3 children
        let childrenElement = document.getElementById("children")

        for (const child of this.#family.children()) {

            // Make a copy of the child template's content
            let clonedChildElememt = childTemplate.content.cloneNode(true)

            // Set child's name
            clonedChildElememt.querySelector(".child-name").textContent = child.name

            // Set child's balance
            clonedChildElememt.querySelector(".balance-value").textContent = child.balance()

            // Add the cloned child element into the children element
            childrenElement.append(clonedChildElememt)
        }
    }
}







new App(document).start();

