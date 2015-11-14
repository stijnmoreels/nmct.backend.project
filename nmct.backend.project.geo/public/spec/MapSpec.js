describe("Google Maps test", function () {
    var m;
    beforeEach(function () {
        m = map;
    });

    it('Map object should exist', function () {
        expect(typeof(m)).toEqual("object");
    });

    it('Should contain a function initialize', function () {
        expect(m).toHaveMethod("initialize");
    });

});