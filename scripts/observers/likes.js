export class LikesObserver {
    constructor() {
        this.observers = [];
    }

    /**
     * Ajoute un objet a mettre a jour
     *
     * @param {Object} observer
     */
    add(observer) {
        this.observers.push(observer);
    }

    /**
     * Supprime un objet a surveiller
     *
     * @param {Object} observer
     */
    remove(observer) {
        this.observers = this.observers.filter((currentObserver) => currentObserver !== observer);
    }

    /**
     * Notifie l'observer de mettre a jour les differents objets
     *
     * - { Integer } value ( chiffre positif ou negatif 0)
     *
     * @param {Object} value
     */
    notify(value) {
        this.observers.forEach((observer) => observer.update(value));
    }
}
