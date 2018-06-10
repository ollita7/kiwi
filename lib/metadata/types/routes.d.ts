export interface HttpMethod {

}

export interface Routes {
    path: string | RegExp;
    //methods: ;
    target: Function;
}