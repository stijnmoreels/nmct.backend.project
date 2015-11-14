describe("Map type tests", function () {

    var mt;

    beforeEach(function () {
       mt = mapType;
    });

    it("MapType object should exist", function () {
        expect(typeof(mt)).toEqual("object");
    });

    it('Should have a method changeMapType', function () {
        expect(mt).toHaveMethod("changeMapType");
    })
});