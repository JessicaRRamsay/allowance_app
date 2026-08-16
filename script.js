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
    constructor(name) {
        this.name = name;
    }
}

class App {
    #appName = "Jessica's app"
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
            let clone = childTemplate.content.cloneNode(true)
            clone.querySelector(".child-name").textContent = child.name
            childrenElement.append(clone)
        }
    }

}

new App(document).start();

