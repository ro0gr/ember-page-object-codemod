export default {
    scope: '.selector',

    act() {
        this.click();
    },

    subComponent: {
        scope: '.sub-selector',

        act(value) {
            this.focus();
            this.fillIn(value);
        }
    }
};