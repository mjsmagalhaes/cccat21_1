import { ConfigService } from "../../src/service/ConfigService";
import { ValidationService } from "../../src/service/ValidationService";

const testAccount = ConfigService.getTestAccount();

test.each([
    "John"
])("Não deve validar os nomes", async (invalidName) => {
    expect(ValidationService.isValidName(invalidName)).toBe(false);
});
test.each([
    "a.gmail.com",
    "a_gmail.com"
])("Não deve validar os emails", async (invalidEmail) => {
    expect(ValidationService.isValidEmail(invalidEmail)).toBe(false);
});

test.each([
    null,
    undefined,
    "111",
    "11111111111",
    "abc"
])("Não deve validar os cpfs", async (invalidDocument: any) => {
    expect(ValidationService.isValidDocument(invalidDocument)).toBe(false);
});

test.each([
    "97456321558",
    "71428793860",
    "87748248800",
    "877.482.488-00",
    "877.482.48800",
    "877.48248800"
])("Deve validar os cpfs", async (invalidDocument: string) => {
    expect(ValidationService.isValidDocument(invalidDocument)).toBe(true);
});

test.each([
    "111", "abc", "7897897897"
])("Não deve validar as senhas", async (invalidPassword: string) => {
    expect(ValidationService.isValidPassword(invalidPassword)).toBe(false);
});
