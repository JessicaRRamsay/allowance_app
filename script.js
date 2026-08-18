class Family {
    // Private variables
    #startingBudget
    #children

    constructor(startingBudget) {
        this.#startingBudget = startingBudget
        this.#children = [
            new Child("Aubrie Cooper", "aubrie"),
            new Child("Rangi Cooper", "rangi"),
            new Child("Manaia Cooper", "manaia")
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

    loadBalances() {
        // TODO: load each child's balance from local storage
        for (const child of this.#children) {
            let storageKey = `balance_${child.key()}`
            let savedBalanceString = localStorage.getItem(storageKey)
            let savedBalance = JSON.parse(savedBalanceString)
            console.log(`Received ${savedBalance}`)
            child.restoreBalance(savedBalance)
        }
    }

    saveBalances() {
        for (const child of this.#children) {
            let storageKey = `balance_${child.key()}`
            localStorage.setItem(storageKey, JSON.stringify(child.balance()))
            console.log(`Saved ${storageKey}`)
        }
    }
}

class Child {
    // I have made the balance private to avoid unwanted additions 
    #balance = 0
    #name
    #key

    // Creates a new child object
    constructor(name, key) {
        this.#name = name
        this.#key = key
    }

    balance() {
        return this.#balance
    }

    deposit(amount) {
        this.#balance += amount
    }

    name() {
        return this.#name
    }

    key() {
        return this.#key
    }

    restoreBalance(localStorageBalance) {
        this.#balance = localStorageBalance
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
            this.#family.saveBalances()
        }
        else {
            this.#family.loadBalances()
        }

        this.renderChildPanels()
    }

    isStartOfYear() {
        let firstChild = this.#family.children()[0]
        let storageKey = `balance_${firstChild.key()}`
        let balance = localStorage.getItem(storageKey)

        if (balance === null) {
            console.log("Happy new year!")
            return true
        }
        else {
            return false
        }
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
            clonedChildElememt.querySelector(".child-name").textContent = child.name()

            // Set child's balance
            clonedChildElememt.querySelector(".balance-value").textContent = child.balance()

            // Add the cloned child element into the children element
            childrenElement.append(clonedChildElememt)
        }
    }
}







new App(document).start();

