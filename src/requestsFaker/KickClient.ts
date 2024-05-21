import { Cookie, HttpsProtocol } from "./Protocol";

export default class Client{
    private cookies: Cookie[] = [];
    private connexions: HttpsProtocol[];

    constructor(requestsTemplates: any[], cookieCache : string[] = []){
        this.connexions = [];

        requestsTemplates.forEach((template : any )=> {
            this.connexions.push(new HttpsProtocol(template.url, template.options, template.tokens));
        })

        cookieCache.forEach((cookie : string) => {
            this.cookies.push(Cookie.CookieStringToCookie(cookie));
        });
    }

    public async Connect() : Promise<void> {
        for (const connexion of this.connexions) {
            connexion.Cookies = this.cookies;
            await connexion.httpsFetcher()
            this.cookies = connexion.Cookies;
        };
    }

    public async SendMessages(message: string, re : any, channelName : string, channelId : number) : Promise<void> {
        let request = JSON.parse(JSON.stringify(re));

        request.url += channelId.toString();
        request.options.headers.Referer += channelName;

        let messageBody = {
            "content": message,
            "type": "message"
        }
        request.options.body = JSON.stringify(messageBody);
        
        let messageRequest = new HttpsProtocol(request.url, request.options, request.tokens);
        this.suppr_fucking_aws_cookies()
        messageRequest.Cookies = this.cookies;
        await messageRequest.httpsFetcher();
        this.cookies = messageRequest.Cookies
    }

    get Cookies() : Cookie[] {
        return this.cookies;
    }

    public suppr_fucking_aws_cookies(){
        this.cookies.forEach((cookie,index) => {
            if (cookie.Name.includes("AWS")){
                delete this.cookies[index]
            }
        });
    }
}
