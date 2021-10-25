export class APIResponse {

    responseType: string;
    errorMessages: string[];
    data: any;

    constructor(responseType: string, errorMessages: string[], data: any) {
        this.responseType = responseType;
        this.errorMessages = errorMessages;
        this.data = data;
    }

}