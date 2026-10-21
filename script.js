/* Family class:
Manages all family data and child objects in one central place.
This class keeps track of all the children together so that actions affecting everyone (like giving annual allowances, 
or saving and loading data) can be done easily for the whole family at once. */
class Family {
    // Private variables keep important budget and child data protected so other code outside class cannot accidentally change or delete it.    
    #startingBudget
    #children

    // Sets starting budget and creates child accounts
    constructor(startingBudget) {
        this.#startingBudget = startingBudget
        this.#children = [
            new Child("Aubrie Cooper", "aubrie"),
            new Child("Rangi Cooper", "rangi"),
            new Child("Manaia Cooper", "manaia")
        ]
    }

    // Returns array of all child objects
    children() {
        return this.#children
    }

    // Deposits starting allowance to every child
    depositAnnualAllowance() {
        for (const child of this.#children) {
            child.deposit(this.#startingBudget)
        }
    }

    // Loads saved balances from local storage for each child.
    // This makes sure money isn't lost when the webpage is refreshed.    
    loadBalances() {
        for (const child of this.#children) {
            let storageKey = `balance_${child.key()}`
            let savedBalanceString = localStorage.getItem(storageKey)
            let savedBalance = JSON.parse(savedBalanceString)
            console.log(`Received ${savedBalance}`)
            child.restoreBalance(savedBalance)
        }
    }

    // Saves every child's current balance into local storage.
    // Called whenever someone makes a withdrawal.
    saveBalances() {
        for (const child of this.#children) {
            let storageKey = `balance_${child.key()}`
            localStorage.setItem(storageKey, JSON.stringify(child.balance()))
            console.log(`Saved ${storageKey}`)
        }
    }

    // Saves chosen bonus activities into local storage.
    // This keeps bonus choices saved even if the page refreshes.
    saveBonuses() {
        for (const child of this.#children) {
            let storageKey = `bonus_${child.key()}`
            localStorage.setItem(storageKey, JSON.stringify(child.bonusActivity()))
            console.log(`Saved ${storageKey}: ${child.bonusActivity()}`)
        }
    }

    // Loads saved bonus activities from local storage
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

    // Finds and returns a specific child using their key name.
    // Returns null if no child is found, preventing errors.
    getChildByKey(key) {
        for (const child of this.#children) {
            if (child.key() === key) {
                return child
            }
        }
        return null
    }
}
/* Child class:
Stores info for a single child, including their balance and bonus.
Having a separate class for each child keeps their details safe and organized,
making sure deposits, withdrawals, and bonuses only affect that specific child. */
class Child {
    // I have made the balance private to avoid unwanted additions 
    #balance = 0
    #name
    #key
    #bonusActivity = "None" // Default activity

    // Sets child's name and key
    constructor(name, key) {
        this.#name = name
        this.#key = key
    }

    // Returns balance
    balance() {
        return this.#balance
    }

    // Returns bonus activity
    bonusActivity() {
        return this.#bonusActivity
    }

    // Sets a new bonus activity
    setBonusActivity(activity) {
        this.#bonusActivity = activity
    }

    // Restores saved bonus activity (if there is one)
    restoreBonusActivity(savedActivity) {
        if (savedActivity) {
            this.#bonusActivity = savedActivity
        }
    }

    // Adds money to balance
    deposit(amount) {
        this.#balance += amount
    }

    // Subtracts money from balance
    withdraw(amount) {
        this.#balance -= amount
    }

    // Returns child's name
    name() {
        return this.#name
    }

    // Returns child's key
    key() {
        return this.#key
    }

    // Restores balance loaded from local storage
    restoreBalance(localStorageBalance) {
        this.#balance = localStorageBalance
    }
}

/* App class:
Controls the whole web page and links it to the Family/Child data.
It handles user actions like clicking buttons, filling out popups, showing error messages, 
and updating what appears on the screen. */
class App {
    // Private variables
    #family

    #minBonusBalance = 40 // Needs more than $40 balance to qualify for a bonus
    #annualAllowance = 500 // $500 is the annual allowance


    // Popup dropdown choices and submit button
    #bonusChildrenSelect
    #withdrawChildrenSelect
    #withdrawSubmit

    // Creates the main app and sets up the family data.
    constructor() {
        this.#family = new Family(this.#annualAllowance)
    }

    // Starts up the program when the web page opens.
    // Connects buttons, loads saved data, and starts child panels on screen.
    start() {
        this.#bonusChildrenSelect = this.getElementById('bonus-children-select')
        this.#withdrawChildrenSelect = this.getElementById("withdraw-children-select")
        this.#withdrawSubmit = this.getElementById("withdraw-submit")

        // Deposit initial allowance when app is first opened, otherwise load saved data
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

    // Checks if app is opened for the first time by checking if balance exists in local storage
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

    // Displays panels for each child using an HTML template.
    // Formats money amounts and sets green/red colors for bonus status.
    renderChildPanels() {
        // Get the child panel template
        let childTemplate = document.getElementById("child-template")

        // Get the element that will hold the 3 children
        let childrenElement = document.getElementById("children")

        for (const child of this.#family.children()) {

            // Make a copy of the child template's content
            let clonedChildElement = childTemplate.content.cloneNode(true)

            // Set child's name
            clonedChildElement.querySelector(".child-name").textContent = child.name()

            // Set child's balance
            clonedChildElement.querySelector(".balance-value").textContent = child.balance().toFixed(2)

            let bonusValueElement = clonedChildElement.querySelector(".bonus-value")

            // Checks if child is able to get bonus
            let bonusStatus = child.balance() > this.#minBonusBalance ? "On target" : "No bonus";

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

    // Sets up withdrawal popup controls and fills child select dropdown
    setupWithdrawPopup() {
        const withdrawPopup = document.getElementById("withdraw-popup")
        const withdrawBtn = document.getElementById("withdraw-button")
        const withdrawClose = document.getElementById("withdraw-close")

        // Open withdrawal popup and reset inputs
        withdrawBtn.addEventListener("click", function (event) {
            event.preventDefault()
            document.getElementById("withdraw-form").reset()
            document.getElementById("withdraw-error").hidden = true
            withdrawPopup.showModal()
        })

        // Close popup
        withdrawClose.addEventListener("click", function (event) {
            event.preventDefault()
            withdrawPopup.close()
        })

        // Adds the children options to dropdown menu
        for (const child of this.#family.children()) {
            const childOption = document.createElement("option")
            childOption.value = child.key()
            childOption.text = child.name()

            this.#withdrawChildrenSelect.append(childOption)
        }

        this.#withdrawSubmit.addEventListener("click", this.tryToWithdraw.bind(this))
    }

    // Sets up bonus selection popup controls and fills child select dropdown
    setupBonusPopup() {
        const bonusPopup = document.getElementById("bonus-popup")
        const bonusBtn = document.getElementById("bonus-button")
        const bonusClose = document.getElementById("bonus-close")
        const bonusSubmit = document.getElementById("bonus-submit")

        // Open bonus popup and clear form/messages
        bonusBtn.addEventListener("click", function (event) {
            event.preventDefault()
            document.getElementById("bonus-form").reset()
            document.getElementById("bonus-error").hidden = true
            const statusMessage = document.getElementById("status-message")
            if (statusMessage) {
                statusMessage.hidden = true
            }
            bonusPopup.showModal()
        })

        // Close bonus popup
        bonusClose.addEventListener("click", function (event) {
            event.preventDefault()
            bonusPopup.close()
        })

        // Adds the children to dropdown menu
        for (const child of this.#family.children()) {
            const bonusChildOption = document.createElement("option")
            bonusChildOption.value = child.key()
            bonusChildOption.text = child.name()
            this.#bonusChildrenSelect.append(bonusChildOption)
        }

        bonusSubmit.addEventListener("click", this.tryToSelectBonus.bind(this))
    }

    // Checks inputs and chooses a bonus when the user submits the form, making it more robust.
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

        // Checks if the child balance qualifies for bonus
        if (childBalance <= this.#minBonusBalance) {
            this.showBonusError(`${child.name()} needs more than $${this.#minBonusBalance} balance to select a bonus`)
            return
        }

        // Update the child object with the chosen activity
        child.setBonusActivity(bonusActivity)

        // Saves bonuses to local storage
        this.#family.saveBonuses()

        // Sucsessful message
        let message = `You have selected "${bonusActivity}" for ${child.name()}!`
        this.showMessage(message)

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

    // Displays error message in bonus popup
    showBonusError(bonusErrorMessage) {
        const bonusErrorElement = document.getElementById("bonus-error")
        bonusErrorElement.textContent = bonusErrorMessage
        bonusErrorElement.hidden = false
    }

    // returns the selected child object from dropdown
    getSelectedChild(childrenSelect) {
        const childKey = childrenSelect.value

        // if they haven't selected a child return null
        if (childKey === "") {
            return null
        }

        const selectedChild = this.#family.getChildByKey(childKey)
        return selectedChild
    }

    // Displays error message in withdraw popup
    showWithdrawError(errorMessage) {
        const withdrawErrorElement = document.getElementById("withdraw-error")
        withdrawErrorElement.textContent = errorMessage
        withdrawErrorElement.hidden = false
    }

    // Displays success message on page
    showMessage(text) {
        const messageElement = document.getElementById("status-message")
        messageElement.textContent = text
        messageElement.hidden = false
    }

    // Validates inputs and runs withdrawal function
    tryToWithdraw(event) {
        // stop the form from submitting
        event.preventDefault()
        const child = this.getSelectedChild(this.#withdrawChildrenSelect)

        // Check if a child is selected
        if (child === null) {
            this.showWithdrawError("Please select a child")
            return
        }

        const withdrawAmountElement = document.getElementById("amount")
        const rawAmount = parseFloat(withdrawAmountElement.value)

        // Check if a valid number is entered
        if (isNaN(rawAmount)) {
            this.showWithdrawError("Please enter a number")
            return
        }

        // Check if the number is positive
        if (rawAmount <= 0) {
            this.showWithdrawError("Please enter a positive number")
            return
        }

        const withdrawAmount = Number(rawAmount.toFixed(2))
        const childBalance = child.balance()

        // Check if the child has enough balance
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

        // Set bonus to no bonus if balance falls below or equal to the minimum amount
        if (child.balance() <= this.#minBonusBalance) {
            child.setBonusActivity("None")
            this.#family.saveBonuses()
        }

        this.#family.saveBalances()

        // close popup
        const withdrawPopup = document.getElementById("withdraw-popup")
        withdrawPopup.close()

        // Refresh so the balance updates on the page
        document.getElementById("children").innerHTML = ""


        this.renderChildPanels()

        // Sucsessful/confrimation message
        let message = `You have withdrawn $${withdrawAmount.toFixed(2)} from ${child.name()}`
        this.showMessage(message)
    }

    // Returns element with the supplied id, or logs a console error if not found
    getElementById(id) {
        const element = document.getElementById(id)

        if (!element) {
            console.error("Can't find element", "id", id)
        }

        return element
    }

}

// Launches app
new App(document).start();

