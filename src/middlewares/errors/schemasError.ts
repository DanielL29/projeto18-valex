export default function schemasError(messages: object[]): Object {
    return { 
        code: 'BadRequest', 
        messages
    }
}