const startingBudget = 500

class Family {
    constructor(name) {
        this.children = [
            new Child("Aubrie Cooper"),
            new Child("Rangi Cooper"),
            new Child("Manaia Cooper")
        ]
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
}

class App {
    #appName = "Allowance app"
    #family

    constructor(document) {
        this.#family = new Family()
    }

    start() {
        this.render()
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

