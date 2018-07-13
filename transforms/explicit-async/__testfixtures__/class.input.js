export default {
    member() {
        p.aCall();
        p.a.aCall();
    },

    thisMember() {
        this.aCall();
        this.a.aCall();
    },

    inCallExpression() {
        eq(A.as());
    }
}
  