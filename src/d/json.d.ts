declare module '*.json' {
    type JSON = { [key: string]: JSON | string | number | boolean | null | undefined };
    const JSONObject: JSON;
    export default JSONObject;
}
