export default {
    async member() {
        await p.aCall();
        await p.a.aCall();
    },

    async thisMember() {
        await this.aCall();
        await this.a.aCall();
    },

    inCallExpression() {
        eq(A.as());
    }
}
  