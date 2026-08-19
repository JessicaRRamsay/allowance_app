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

// Do all the HTML interaction
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
        this.setupWithdrawPopup()
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

    // Add children to the select (in the withdraw popup), adds event listners for all the withdraw functions
    setupWithdrawPopup() {
        const withdrawPopup = document.getElementById("withdraw-popup")
        const withdrawBtn = document.getElementById("withdraw-button")
        const withdrawClose = document.getElementById("withdraw-close")
        const selectChildren = document.getElementById("children-select")
        const withdrawSubmit = document.getElementById("withdraw-submit")

        // Show popup
        withdrawBtn.addEventListener("click", function () {
            withdrawPopup.showModal()
        })

        // Hide popup
        withdrawClose.addEventListener("click", function () {
            withdrawPopup.close()
        })

        // Adds the children to dropdown menu when withdrawling
        for (const child of this.#family.children()) {
            const childOption = document.createElement("option")
            childOption.value = child.key()
            childOption.text = child.name()

            selectChildren.append(childOption)
        }

        withdrawSubmit.addEventListener("click", this.tryToWithdraw)
    }

    tryToWithdraw() {


        // get select element and call .value or .selected
        // check if they have enough money to withdraw
        // make sure they have a child selected if they are withdrawling

    }

}







new App(document).start();

