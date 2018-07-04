export default {
    scope: '.selector',

    async act() {
        await this.focus().blur();
    }
}