const fs = require("fs");

export class HttpsProtocol {
    private url: string;
    private options: any;
    private tokens: any;
    private response: Response;
    private success: boolean;
    private cookies: Cookie[];

    constructor(url: string, options: any, tokens: any, Cookies: Cookie[] = []) {
        this.url = url;
        this.options = options;
        this.tokens = tokens;
        this.response = new Response();
        this.success = false;
        this.cookies = Cookies;
    }
    
    async httpsFetcher() : Promise<Response>{
        if (this.tokens != undefined){
            for (const [field , _ ] of Object.entries(this.tokens)){
                this.options.headers[field] += this.getCookie(this.tokens[field]).Value;
            };
        }
        
        this.includeCookies();
        
        await fetch(this.url, this.options).then(res => this.response = res);
        
        // console.log(this.response.status);
        this.success = this.status(this.response);
        
        
        return this.response;
    }
    
    status(response: Response) : boolean {
        if (response.status >= 300) {
            //implement glitchTip
            console.log("Error: " + this.response.status + " : " + this.response.statusText);
            return false;
        }
        return true;
    }

    includeCookies() : void {
        this.cookies.forEach((cookie : Cookie) => {
            this.options.headers.cookie += cookie.Name + "=" + cookie.Value + "; ";
        });
    }

    updadateCookies(newCookie : Cookie) : boolean {
        let updated : boolean = false;

        this.cookies.forEach((cookie,index) => {
            if (cookie.Name === newCookie.Name || this.isJswt(cookie, newCookie)){

                this.cookies[index] = newCookie;

                updated = true;
            }
        });
        
        return updated;
    }

    isJswt(cookie : Cookie, newCookie : Cookie) : boolean {
        const isCookieJswt = cookie.Value.includes("eyJpdiI6I");        // detect if the cookie is a jswt
        const isNewCookieJswt = newCookie.Value.includes("eyJpdiI6I");  // eyJpdiI6I is the start of a jswt
        const isSameValueLength = newCookie.Value.length === cookie.Value.length; // compare value and name length
        const isSameNameLength = newCookie.Name.length === cookie.Name.length;    // only way to detect strange named cookies

        return isCookieJswt && isNewCookieJswt && isSameValueLength && isSameNameLength;
    }

    saveCookies() : void {
        let cookiesList : string[] = [];
        this.cookies.forEach(cookie => {
            cookiesList.push(cookie.StringValue);
        });

        fs.writeFile("./requestsFaker/coockieCache.json", JSON.stringify(cookiesList), (error : Error) => {
         // call Glitchtip
        if (error) {
            console.error(error);
        }});
    }

    getCookie(name: string) : Cookie {
        let cookie : Cookie = Cookie.emptyCookie();
        this.cookies.forEach(c => {
            if (c.Name === name) {
                cookie = c;
            }
        });
        
        return cookie;
    }
    
    get Cookies() : Cookie[] {
        let cookies = this.response.headers.getSetCookie();
        
        cookies.forEach(cookie => {
            
            let newCookie = Cookie.CookieStringToCookie(cookie);
            if (!this.updadateCookies(newCookie)) {
                this.cookies.push(newCookie);
            }
        });
        
        this.saveCookies();
        return this.cookies;
    }

    set Cookies(cookies: Cookie[]) {
        this.cookies = cookies;
    }

    get Url() : string {
        return this.url;
    }

    get Options() : object {
        return this.options;
    }

    get Response() : Response {
        return this.response;
    }

    get Success() : boolean {
        return this.success;
    }
}

export class Cookie {
    private stringValue: string;
    private name: string;
    private value: string;
    private domain: string;
    private path: string;
    private expires: Date;
    private maxAge: number;
    private size: number;
    private httpOnly: boolean;
    private secure: boolean;
    private sameSite: string;
    private priority: string;
    
    
    constructor(stringValue: string, name: string, value: string, domain: string, path: string = "/", expires: Date, maxAge: number, size: number, httpOnly: boolean = false, secure: boolean = false, sameSite: string = SameSite.Null, priority: string = Priority.Default) {
        this.stringValue = stringValue;
        this.name = name;
        this.value = value;
        this.domain = domain;
        this.path = path;
        this.expires = expires;
        this.maxAge = maxAge;
        this.size = size;
        this.httpOnly = httpOnly;
        this.secure = secure;
        this.sameSite = sameSite;
        this.priority = priority;
    }
    
    static CookieStringToCookie(cookieString: string) : Cookie {
        let name: string;
        let value: string;
        let domain: string;
        let path: string;
        let expires: Date;
        let maxAge: number;
        let size: number;
        let httpOnly: boolean;
        let secure: boolean;
        let sameSite: string;
        let priority: string;
        
        let cookieParams = cookieString.split(";");
        let cookieJson: { [key: string]: string } = {};
        
        cookieParams.forEach(param => {
            let keyvalue = param.split("=");
            cookieJson[keyvalue[0].trim()] = keyvalue[1];
        });
        
        name = cookieParams[0].split("=")[0];
        value = cookieJson[name].replace("%3D", "=");
        domain = cookieJson["domain"];
        path = cookieJson["path"];
        expires = new Date(Date.parse(cookieJson["expires"]));
        maxAge = Number(cookieJson["Max-Age"]);
        size = Number(cookieJson["size"]);
        httpOnly = cookieJson.hasOwnProperty("httponly");
        secure = cookieJson.hasOwnProperty("secure");
        sameSite = SameSite[cookieJson["sameSite"] as keyof typeof SameSite];
        priority = Priority[cookieJson["priority"] as keyof typeof Priority];
        
        
        return new Cookie(cookieString, name, value, domain, path, expires, maxAge, size, httpOnly, secure, sameSite, priority);
    }

    static emptyCookie() : Cookie {
        return new Cookie("", "", "", "", "", new Date(), 0, 0, false, false, SameSite.Null, Priority.Default);
    }

    get StringValue() : string {
        return this.stringValue;
    }

    set StringValue(stringValue: string) {
        this.stringValue = stringValue;
    }

    get Name() : string {
        return this.name;
    }

    set Name(name: string) {
        this.name = name;
    }
    
    get Value() : string {
        return this.value;
    }

    set Value(value: string) {
        this.value = value;
    }

    get Domain() : string {
        return this.domain;
    }

    get Path() : string {
        return this.path;
    }

    get Expires() : Date {
        return this.expires;
    }
    set Expires(expires: Date) {
        this.expires = expires;
    }

    get Size() : number {
        return this.size;
    }

    get HttpOnly() : boolean {
        return this.httpOnly;
    }

    get Secure() : boolean {
        return this.secure;
    }

    get SameSite() : string {
        return this.sameSite;
    }

    get Priority() : string {
        return this.priority;
    }
}

enum SameSite {
    Lax = "Lax",
    Strict = "Strict",
    None = "None",
    Null = "",
    Default = "None"
}

enum Priority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Default = "Medium"
}