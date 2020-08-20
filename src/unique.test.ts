import { uniqueServiceFactory } from "./unique";

test("unique should return new number each call", () => {
    const uniqueService = uniqueServiceFactory();
    const value1 = uniqueService.next();
    const value2 = uniqueService.next();

    expect(value1).not.toBe(value2);
});
