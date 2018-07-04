export default {
    scope: '.selector',

    async act() {
        await this.click();
    },

    subComponent: {
        scope: '.sub-selector',

        async act(value) {
            await this.focus();
            await this.fillIn(value);
        }
    }
};