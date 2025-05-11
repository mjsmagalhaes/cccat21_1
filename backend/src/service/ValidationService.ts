export class ValidationService {
    static readonly VALID_LENGTH = 11;

    static isValidName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/) !== null;
    }

    static isValidEmail(email: string) {
        return email.match(/^(.+)\@(.+)$/) !== null;
    }

    static isValidPassword(password: string) {
        if (password.length < 8) return false;
        if (!password.match(/\d+/)) return false;
        if (!password.match(/[a-z]+/)) return false;
        if (!password.match(/[A-Z]+/)) return false;
        return true;
    }

    static isValidDocument(cpf: string) {
        if (!cpf) return false;
        cpf = this.clean(cpf);
        if (cpf.length !== ValidationService.VALID_LENGTH) return false;
        if (this.allDigitsEqual(cpf)) return false;
        const dg1 = this.calculateDigit(cpf, 10);
        const dg2 = this.calculateDigit(cpf, 11);
        return this.extractDigit(cpf) == `${dg1}${dg2}`;
    }

    private static clean(cpf: string) {
        return cpf.replace(/\D/g, "");
    }

    private static allDigitsEqual(cpf: string) {
        const [firstDigit] = cpf;
        return [...cpf].every((digit) => digit === firstDigit);
    }

    private static calculateDigit(cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const rest = total % 11;
        return rest < 2 ? 0 : 11 - rest;
    }

    private static extractDigit(cpf: string) {
        return cpf.substring(cpf.length - 2, cpf.length);
    }
}
