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

    saveBonuses() {
        for (const child of this.#children) {
            let storageKey = `bonus_${child.key()}`
            localStorage.setItem(storageKey, JSON.stringify(child.bonusActivity()))
            console.log(`Saved ${storageKey}: ${child.bonusActivity()}`)
        }
    }

    loadBonuses() {
        for (const child of this.#children) {
            let storageKey = `bonus_${child.key()}`
            let savedBonusString = localStorage.getItem(storageKey)
            if (savedBonusString) {
                let savedBonus = JSON.parse(savedBonusString)
                child.restoreBonusActivity(savedBonus)
            }
        }
    }

    // Get the first child that has the same key as the passed in, or null if not found

    getChildByKey(key) {
        for (const child of this.#children) {
            if (child.key() === key) {
                return child
            }
            else { }
        }
        return null
    }
}

class Child {
    // I have made the balance private to avoid unwanted additions 
    #balance = 0
    #name
    #key
    #bonusActivity = "None" // Default activity

    // Creates a new child object
    constructor(name, key) {
        this.#name = name
        this.#key = key
    }

    balance() {
        return this.#balance
    }

    bonusActivity() {
        return this.#bonusActivity
    }

    setBonusActivity(activity) {
        this.#bonusActivity = activity
    }

    restoreBonusActivity(savedActivity) {
        if (savedActivity) {
            this.#bonusActivity = savedActivity
        }
    }

    deposit(amount) {
        this.#balance += amount
    }

    withdraw(amount) {
        this.#balance -= amount
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

    // Common elements
    #bonusChildrenSelect
    #withdrawChildrenSelect
    #withdrawSubmit

    // Creates a new app object
    constructor() {
        this.#family = new Family(500) // $500 is the annual allowance
        this.#bonusChildrenSelect = this.getElementById('bonus-children-select')
        this.#withdrawChildrenSelect = this.getElementById("withdraw-children-select")
        this.#withdrawSubmit = this.getElementById("withdraw-submit")
    }

    // This is the apps start up function
    start() {
        if (this.isStartOfYear()) {
            this.#family.depositAnnualAllowance()
            this.#family.saveBalances()
            this.#family.saveBonuses()
        }
        else {
            this.#family.loadBalances()
            this.#family.loadBonuses()
        }

        this.renderChildPanels()
        this.setupWithdrawPopup()
        this.setupBonusPopup()
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
            let clonedChildElement = childTemplate.content.cloneNode(true) // error here with the content

            // Set child's name
            clonedChildElement.querySelector(".child-name").textContent = child.name()

            // Set child's balance
            clonedChildElement.querySelector(".balance-value").textContent = child.balance()

            let bonusValueElement = clonedChildElement.querySelector(".bonus-value")

            // Checks if child is able to get bonus
            let bonusStatus = child.balance() > 40 ? "On target" : "No bonus";

            // Making the bonus red/green on child panels
            if (bonusStatus === "On target") {
                bonusValueElement.classList.add("bonus-on-target")
            } else {
                bonusValueElement.classList.add("no-bonus")
            }

            // Puts the bonus status message on the child cards
            clonedChildElement.querySelector(".bonus-value").textContent = bonusStatus;


            // Add the cloned child element into the children element
            childrenElement.append(clonedChildElement)
        }
    }

    // Add children to the select (in the withdraw popup), adds event listners for all the withdraw functions
    setupWithdrawPopup() {
        const withdrawPopup = document.getElementById("withdraw-popup")
        const withdrawBtn = document.getElementById("withdraw-button")
        const withdrawClose = document.getElementById("withdraw-close")

        // Show popup
        withdrawBtn.addEventListener("click", function (event) {
            event.preventDefault()
            withdrawPopup.showModal()
        })

        // Hide popup
        withdrawClose.addEventListener("click", function (event) {
            event.preventDefault()
            withdrawPopup.close()
        })

        // Adds the children to dropdown menu when withdrawling
        for (const child of this.#family.children()) {
            const childOption = document.createElement("option")
            childOption.value = child.key()
            childOption.text = child.name()

            this.#withdrawChildrenSelect.append(childOption)
        }

        this.#withdrawSubmit.addEventListener("click", this.tryToWithdraw.bind(this))
    }

    setupBonusPopup() {
        const bonusPopup = document.getElementById("bonus-popup")
        const bonusBtn = document.getElementById("bonus-button")
        const bonusClose = document.getElementById("bonus-close")
        const bonusSubmit = document.getElementById("bonus-submit")

        // Show popup
        bonusBtn.addEventListener("click", function (event) {
            event.preventDefault()
            document.getElementById("bonus-error").hidden = true
            document.getElementById("bonus-message").hidden = true
            bonusPopup.showModal()
        })

        // Hide popup
        bonusClose.addEventListener("click", function (event) {
            event.preventDefault()
            bonusPopup.close()
        })

        // Adds the children to dropdown menu when withdrawing
        for (const child of this.#family.children()) {
            const bonusChildOption = document.createElement("option")
            bonusChildOption.value = child.key()
            bonusChildOption.text = child.name()
            this.#bonusChildrenSelect.append(bonusChildOption)
        }

        bonusSubmit.addEventListener("click", this.tryToSelectBonus.bind(this))
    }

    // Checks if child has enough balance to receive bonus
    tryToSelectBonus(event) {
        event.preventDefault() // Stops the form from submitting

        // Check if a child is selected
        const child = this.getSelectedChild(this.#bonusChildrenSelect)
        if (!child) {
            this.showBonusError("Please select a child")
            return
        }

        // Check if a bonus activity is selected
        const bonusSelect = document.getElementById("bonus-select")
        const bonusActivity = bonusSelect.value
        if (!bonusActivity) {
            this.showBonusError("Please select a bonus activity")
            return
        }

        // Check if child has enough balance to qualify for bonus
        const childBalance = child.balance() // Gets childs balance
        // Checks if the child has more than $40 balance
        if (childBalance < 40) {
            this.showBonusError(`${child.name()} needs at least $40 balance to select a bonus`)
            return
        }

        // Update the child object with the chosen activity
        child.setBonusActivity(bonusActivity)

        // Saves bonuses to local storage
        this.#family.saveBonuses()

        // Sucsessful message
        let message = `You have selected "${bonusActivity}" for ${child.name()}!`
        this.showBonusMessage(message)

        // Hides previous errors that may have been showing
        const bonusErrorElement = document.getElementById("bonus-error")
        if (bonusErrorElement) bonusErrorElement.hidden = true

        // closes popup
        const bonusPopup = document.getElementById("bonus-popup")
        bonusPopup.close()

        // refreshes bonus popup
        document.getElementById("bonus-form").reset()

        // Refresh panels
        document.getElementById("children").innerHTML = ""
        this.renderChildPanels()
    }

    showBonusError(bonusErrorMessage) {
        const bonusErrorElement = document.getElementById("bonus-error")
        bonusErrorElement.textContent = bonusErrorMessage
        bonusErrorElement.hidden = false
    }

    showBonusMessage(bonusMessage) {
        const bonusMessageElement = document.getElementById("bonus-message")
        bonusMessageElement.textContent = bonusMessage
        bonusMessageElement.hidden = false
    }

    // returns the selected child object, or null if no child is selected
    getSelectedChild(childrenSelect) {
        const childKey = childrenSelect.value

        // if they haven't selected a child
        if (childKey === "") {
            return null
        }

        const selectedChild = this.#family.getChildByKey(childKey)
        return selectedChild
    }

    showWithdrawError(errorMessage) {
        const withdrawErrorElement = document.getElementById("withdraw-error")
        withdrawErrorElement.textContent = errorMessage
        withdrawErrorElement.hidden = false
    }

    showWithdrawMessage(withdrawMessage) {
        const withdrawMessageElement = document.getElementById("withdraw-message")
        withdrawMessageElement.textContent = withdrawMessage
        withdrawMessageElement.hidden = false
    }

    tryToWithdraw(event) {
        // stop the form from submitting
        event.preventDefault()
        const child = this.getSelectedChild(this.#withdrawChildrenSelect)

        // if no child is selected, show an error message
        if (child === null) {
            this.showWithdrawError("Please select a child")
            return
        }

        const withdrawAmountElement = document.getElementById("amount")
        const withdrawAmountString = withdrawAmountElement.value
        const childBalance = child.balance()
        const withdrawAmount = Number(withdrawAmountString)

        if (isNaN(withdrawAmount)) {
            this.showWithdrawError("Please enter a number")
            return
        }

        if (childBalance < withdrawAmount) {
            this.showWithdrawError("Please make sure you have enough balance to withdraw")
            return
        }

        if (withdrawAmount <= 0) {
            this.showWithdrawError("Please enter a positive number")
            return
        }

        // run the withdraw function
        child.withdraw(withdrawAmount)

        this.#family.saveBalances()

        // close popup
        const withdrawPopup = document.getElementById("withdraw-popup")
        withdrawPopup.close()

        // Refresh so the balance updates on the page
        document.getElementById("children").innerHTML = ""


        // maybe try to refresh balance-value
        this.renderChildPanels()

        let message = `You have withdrawed $${withdrawAmount} from ${child.name()}`
        this.showWithdrawMessage(message)

        // In V2 or V3, clear the popup because once youve opened it once, and do it again the same info is displayed


    }

    // Returns element with the supplied id, or prints a console error if not found
    getElementById(id) {
        const element = document.getElementById(id)

        if (!element) {
            console.error("Can't find element", "id", id)
        }

        return element
    }

}







new App(document).start();

